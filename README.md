# ROIQ Banking Platform — Corporate Credit Risk Intelligence Platform

**ROIQ-DT / COE_Banking-Sys_End** is an enterprise corporate banking and credit-risk intelligence platform combining deterministic financial underwriting models, multi-agent **LangGraph** workflows, **PostgreSQL** persistence, **Groq LLaMA 3.3** inference, live external financial providers, and human-in-the-loop (HITL) credit review mechanisms.

---

## 1. Architecture Overview

```text
                         ┌────────────────────────────────────────┐
                         │   React 19 + TypeScript + Tailwind     │
                         │   ECharts Financial Banking Dashboard  │
                         └──────────────────┬─────────────────────┘
                                            │ REST (Bearer JWT)
                                            ▼
                         ┌────────────────────────────────────────┐
                         │          FastAPI Backend Engine        │
                         │   RBAC + Structured Pydantic V2 Schemas│
                         └──────────────────┬─────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
      Company Services              Credit Risk Engine         External Providers
   (PostgreSQL / SQLAlchemy)                │                 (FRED, FMP, Finnhub,
   (Balance Sheet / Cash Flow)              │                 AlphaVantage, EDGAR)
                                            ▼
                                ┌───────────────────────┐
                                │  LangGraph Workflow   │
                                │ Postgres / SqliteSaver│
                                └───────────┬───────────┘
                                            │
                       ┌────────────────────┴────────────────────┐
                       │                                         │
        [Low Risk: Score >= 75]                 [Medium / High / Critical Risk]
                       │                                         │
                       ▼                                         ▼
                 Recommend Node                           Human Review Node
                       │                         (Interrupt / Checkpoint Resume)
                       │                                         │
                       │                       ┌─────────────────┴─────────────────┐
                       │                       ▼                                   ▼
                       │               Officer Approves                    Officer Declines
                       │                       │                                   │
                       └───────────────────────┼───────────────────────────────────┘
                                               ▼
                                  Final Loan Recommendation
                                               ▼
                                   Executive Credit Report
                                               ▼
                                 Immutable Audit Trail Log
```

---

## 2. Production Hardening Features

1. **Persistent Relational Database (SQLAlchemy 2.0 + Alembic)**:
   - Replaced in-memory data with persistent relational storage.
   - Models: `CompanyModel`, `FinancialDataModel`, `CreditEvaluationModel`, `LoanRecommendationModel`, `HumanReviewDecisionModel`, `AuditLogModel`.
   - Automatic migrations via Alembic (`alembic upgrade head`).
   - Supports production PostgreSQL as well as zero-config local development SQLite (`roiq_banking.db`).
   - Development PostgreSQL provided via `docker-compose.yml`.

2. **Durable LangGraph Checkpointing (`PostgresSaver` / `SqliteSaver`)**:
   - Replaced ephemeral `MemorySaver` with durable SQL-backed checkpointer.
   - **Paused Human Review threads survive backend server restarts**: the exact same `thread_id` can be retrieved and resumed after restarting FastAPI.

3. **Real External Financial Data Providers**:
   - `HttpExternalProviderService` integrates directly with:
     - **FRED** (Federal Reserve Economic Data) for SOFR/benchmark interest rates.
     - **Financial Modeling Prep (FMP)** for live balance sheets, ratios, and profiles.
     - **Finnhub** for corporate profiles and industry classifications.
     - **Alpha Vantage** for equity and FX data.
   - Features: timeout protection (10s), exponential backoff retries, rate-limit (429) backoff, and graceful fallback to internal audited baselines.
   - Provider health probe: `GET /api/v1/external-data/providers`.

4. **Data Provenance & Lineage**:
   - All financial evaluations and responses clearly declare source lineage:
     `source: "INTERNAL" | "FRED" | "FMP" | "FINNHUB" | "FALLBACK"` along with ISO `source_timestamp`.

5. **Immutable Audit Trail**:
   - Every human officer action, category adjustment, credit decision, and system analysis event is recorded with:
     `company_id`, `thread_id`, `officer`, `action`, `previous_state`, `new_state`, `notes`, and `created_at`.
   - Immutable from frontend; inspected via `GET /api/v1/credit-risk/{company_id}/audit-trail`.

6. **Strict RBAC Enforcement in FastAPI**:
   - `Viewer`: Read-only access to portfolio and reports. Forbidden from running analyses or reviews.
   - `Analyst`: Analytical access (can run credit risk analysis). Forbidden from signing reviews.
   - `Corporate Credit Officer`: Full authorization to approve/reject loan facilities and submit audit notes.
   - `Admin`: Full platform administration and configuration permissions.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Apache ECharts, Zustand, Axios, html2pdf.js
- **Backend**: Python 3.12, FastAPI, Pydantic V2, Starlette, Uvicorn, PyJWT
- **Database & Migrations**: PostgreSQL 16, SQLAlchemy 2.0, Alembic, psycopg3, asyncpg
- **AI & Workflow**: LangGraph (`StateGraph`, `PostgresSaver`, `SqliteSaver`), Groq API (`llama-3.3-70b-versatile`) with deterministic fallback underwriting engine

---

## 4. Environment Configuration

Copy `.env.example` to `.env`:

```bash
# Core Backend
APP_NAME="ROIQ AI Backend"
PORT=8000
DEBUG=false

# Security
JWT_SECRET_KEY="replace-with-secure-32-byte-secret-key-for-production"
JWT_ALGORITHM="HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES="480"
CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,http://localhost:8000"

# Database Configuration (PostgreSQL in production, SQLite fallback in local development)
DATABASE_URL="postgresql+psycopg://roiq_user:roiq_secure_password@localhost:5432/roiq_banking_db"
# Local development fallback: DATABASE_URL="sqlite:///./roiq_banking.db"

# AI Inference (Optional - Uses deterministic fallback if omitted)
GROQ_API_KEY=""
GROQ_MODEL="llama-3.3-70b-versatile"

# External Financial Data Providers (Optional - Graceful degradation)
FRED_API_KEY=""
FMP_API_KEY=""
FINNHUB_API_KEY=""
ALPHA_VANTAGE_API_KEY=""

# Frontend
VITE_API_BASE_URL="http://127.0.0.1:8000/api/v1"
```

---

## 5. Development & Run Instructions

### A. Quick Start with PostgreSQL (Docker Compose)

1. Launch PostgreSQL in Docker:
   ```bash
   docker compose up -d
   ```

2. Run Alembic migrations:
   ```bash
   alembic upgrade head
   ```

3. Start the FastAPI backend server:
   ```bash
   uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

4. Start the React frontend server:
   ```bash
   npm run dev
   ```
   Open dashboard: [http://localhost:5173](http://localhost:5173)

### B. Zero-Config Start (SQLite Fallback)
If Docker/Postgres is not running, the platform automatically initializes `roiq_banking.db` and durable `roiq_checkpoints.db` locally without any configuration needed!

---

## 6. Testing & Build Verification

### Backend Tests (24/24 Passing)
```bash
python -m pytest tests/
```
Output:
```text
tests\test_backend_platform.py .....                                     [ 20%]
tests\test_banking_api_contract.py .......                               [ 50%]
tests\test_langgraph_workflow.py .....                                   [ 70%]
tests\test_production_hardening.py .......                               [100%]
============================= 24 passed in 7.12s ==============================
```

### Frontend Tests & Build (100% Passing)
```bash
npx vitest run
npm run build
```

---

## 7. Role-Based Access Credentials

| Role | Username | Password | Permissions |
|---|---|---|---|
| **Corporate Credit Officer** | `officer` or `cco@roiq.ai` | `password` / `password123` | Full credit decision approval & sign-off |
| **Administrator** | `admin` | `password` | Administrative operations & portfolio management |
| **Credit Analyst** | `analyst` | `password` | Financial modeling & analysis execution |
| **Executive Viewer** | `viewer` | `password` | Read-only dashboard & executive report access |