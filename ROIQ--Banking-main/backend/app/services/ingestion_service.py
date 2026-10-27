"""ROIQ Banking Platform - Production Financial Ingestion Service.

Implements safe validation, size checks, path safety, and parsing for CSV & XLSX financial uploads.
Normalizes all monetary amounts into the documented internal standard: INR ₹ LAKH.
"""

import io
import os
import re
import uuid
from typing import Any, Dict, List, Optional, Tuple
import pandas as pd

from ..config.settings import settings
from ..core.synthetic_dataset import calculate_financial_ratios

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
ALLOWED_MIME_TYPES = {
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/octet-stream",  # often sent by browsers for csv/xlsx
}

# Standard column mapping to normalized metric keys in ₹ Lakh
COLUMN_MAPPINGS = {
    # Revenue
    "revenue": "annual_revenue",
    "annual_revenue": "annual_revenue",
    "turnover": "annual_revenue",
    "sales": "annual_revenue",
    "total_revenue": "annual_revenue",
    # EBITDA
    "ebitda": "ebitda",
    "operating_profit": "ebitda",
    # Net Profit
    "net_profit": "net_profit",
    "net_income": "net_profit",
    "pat": "net_profit",
    "profit_after_tax": "net_profit",
    # Assets & Liabilities
    "cash": "cash_and_equivalents",
    "cash_and_equivalents": "cash_and_equivalents",
    "current_assets": "current_assets",
    "current_liabilities": "current_liabilities",
    "total_assets": "total_assets",
    "total_debt": "total_debt",
    "borrowings": "total_debt",
    "equity": "shareholders_equity",
    "shareholders_equity": "shareholders_equity",
    "net_worth": "shareholders_equity",
    # Flow
    "interest_expense": "annual_interest_expense",
    "annual_interest_expense": "annual_interest_expense",
    "interest": "annual_interest_expense",
    "interest_costs": "annual_interest_expense",
    "finance_costs": "annual_interest_expense",
    "operating_cash_flow": "annual_operating_cash_flow",
    "annual_operating_cash_flow": "annual_operating_cash_flow",
    "cash_flow": "annual_operating_cash_flow",
    "cfo": "annual_operating_cash_flow",
    "requested_loan": "requested_loan",
    "loan_amount": "requested_loan",
}


def sanitize_filename(filename: str) -> str:
    """Strip dangerous path traversal characters and sanitize filename."""
    base = os.path.basename(filename)
    clean = re.sub(r"[^a-zA-Z0-9_.-]", "_", base)
    return clean[:100] if clean else "financial_data.csv"


def normalize_amount_to_lakh(value: float, unit_hint: str = "lakh") -> float:
    """Normalizes an amount to ₹ Lakh based on unit hint.
    
    1 Lakh = 100,000 INR
    1 Crore = 100 Lakh
    1 INR (Rupees) = 0.00001 Lakh
    1 Million INR = 10 Lakh
    1 Billion INR = 10,000 Lakh
    """
    clean_unit = str(unit_hint).lower().strip()
    if clean_unit in ("cr", "crore", "crores"):
        return round(value * 100.0, 4)
    elif clean_unit in ("inr", "rupees", "rs", "inr_raw"):
        return round(value / 100_000.0, 4)
    elif clean_unit in ("million", "m"):
        return round(value * 10.0, 4)
    elif clean_unit in ("billion", "b"):
        return round(value * 10_000.0, 4)
    # Default is already in ₹ Lakh
    return round(value, 4)


class IngestionService:
    """Production ingestion service for financial statements and datasets."""

    def __init__(self, upload_dir: str = "uploads") -> None:
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def validate_file(self, filename: str, content: bytes, content_type: Optional[str]) -> Tuple[str, str]:
        """Validates extension, size, and format."""
        if len(content) == 0:
            raise ValueError("Uploaded file is empty (0 bytes).")

        if len(content) > settings.max_upload_size_bytes:
            raise ValueError(
                f"File size exceeds maximum allowed limit of {settings.max_upload_size_bytes // (1024 * 1024)} MB."
            )

        clean_name = sanitize_filename(filename)
        ext = os.path.splitext(clean_name)[1].lower()

        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file format '{ext}'. Only CSV (.csv) and Excel (.xlsx, .xls) files are supported."
            )

        return clean_name, ext

    def parse_financial_data(self, content: bytes, ext: str) -> Tuple[Dict[str, float], List[Dict[str, Any]]]:
        """Parses CSV or Excel bytes into normalized records in ₹ Lakh."""
        try:
            if ext == ".csv":
                df = pd.read_csv(io.BytesIO(content))
            else:
                df = pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise ValueError(f"Failed to parse tabular data: {str(e)}")

        if df.empty:
            raise ValueError("File contains no records or rows.")

        # Standardize column headers
        df.columns = [str(c).strip().lower().replace(" ", "_").replace("-", "_") for c in df.columns]

        # Extract unit hint if column or metadata provided
        unit_hint = "lakh"
        for col in df.columns:
            if "unit" in col or "denomination" in col:
                first_val = str(df[col].iloc[0]).lower()
                if "cr" in first_val:
                    unit_hint = "crore"
                elif "rupee" in first_val or "inr" in first_val:
                    unit_hint = "inr"
                elif "million" in first_val:
                    unit_hint = "million"

        extracted_metrics: Dict[str, float] = {}

        # Strategy 1: Metric / Value row format (e.g. column 'metric' and column 'value')
        metric_col = next((c for c in df.columns if c in ("metric", "financial_metric", "line_item", "account", "item")), None)
        value_col = next((c for c in df.columns if c in ("value", "amount", "balance", "total", "inr_lakh")), None)

        if metric_col and value_col:
            for _, row in df.iterrows():
                raw_metric = str(row[metric_col]).strip().lower().replace(" ", "_").replace("-", "_")
                val_raw = row[value_col]
                try:
                    num_val = float(str(val_raw).replace(",", "").replace("₹", "").replace("$", "").strip())
                    mapped_key = COLUMN_MAPPINGS.get(raw_metric)
                    if mapped_key:
                        extracted_metrics[mapped_key] = normalize_amount_to_lakh(num_val, unit_hint)
                except (ValueError, TypeError):
                    continue
        else:
            # Strategy 2: Wide format (columns are metrics, e.g. annual_revenue, ebitda, etc.)
            for col in df.columns:
                mapped_key = COLUMN_MAPPINGS.get(col)
                if mapped_key and mapped_key not in extracted_metrics:
                    series = pd.to_numeric(
                        df[col].astype(str).str.replace(",", "").str.replace("₹", "").str.replace("$", "").str.strip(),
                        errors="coerce",
                    ).dropna()
                    if not series.empty:
                        extracted_metrics[mapped_key] = normalize_amount_to_lakh(float(series.iloc[-1]), unit_hint)

        if not extracted_metrics:
            raise ValueError(
                "No recognizable financial metrics identified. Expected columns or items such as: "
                "annual_revenue, ebitda, net_profit, current_assets, total_debt, shareholders_equity."
            )

        # Build records preview
        preview_records = df.head(10).to_dict(orient="records")
        return extracted_metrics, preview_records

    def process_upload(
        self,
        filename: str,
        content: bytes,
        content_type: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """End-to-end ingestion, validation, and ratio derivation."""
        clean_name, ext = self.validate_file(filename, content, content_type)
        dataset_id = f"ds_{uuid.uuid4().hex[:12]}"
        safe_path = os.path.join(self.upload_dir, f"{dataset_id}_{clean_name}")

        with open(safe_path, "wb") as f:
            f.write(content)

        extracted_metrics, preview_records = self.parse_financial_data(content, ext)

        # Derive calculated financial ratios
        calculated_ratios = calculate_financial_ratios(extracted_metrics)

        return {
            "status": "ingested_and_validated",
            "dataset_id": dataset_id,
            "filename": clean_name,
            "size_bytes": len(content),
            "currency": "INR",
            "unit": "lakh",
            "extracted_metrics": extracted_metrics,
            "calculated_ratios": calculated_ratios,
            "records_count": len(preview_records),
            "preview": preview_records,
            "disclaimer": "Validated financial data normalized to INR ₹ Lakh.",
        }
