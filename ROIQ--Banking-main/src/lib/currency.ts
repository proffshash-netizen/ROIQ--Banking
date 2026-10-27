/**
 * ROIQ Banking Platform - Shared Currency & Financial Normalization Utilities.
 * Standardizes monetary formatting across all components on INR and ₹ lakh.
 *
 * 1 Lakh = ₹100,000 INR
 * 1 Crore = 100 Lakh = ₹10,000,000 INR
 */

export const DEMO_DATA_DISCLAIMER = "DEMO DATA — Synthetic financial figures for demonstration only."

/**
 * Formats a monetary value consistently as INR in ₹ lakh.
 * Does NOT append lakh to percentages, counts, or dates.
 *
 * @param value Number in ₹ Lakh (or if raw rupees provided with isRawRupees=true)
 * @param options Formatting options
 */
export function formatLakh(
  value: number | undefined | null,
  options?: {
    decimals?: number
    showUnit?: boolean
    isRawRupees?: boolean
  }
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "₹0.00 lakh"
  }

  const { decimals = 2, showUnit = true, isRawRupees = false } = options || {}

  // If input was raw rupees, convert to lakh
  const lakhValue = isRawRupees ? value / 100_000 : value

  const formatted = lakhValue.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return showUnit ? `₹${formatted} lakh` : `₹${formatted}`
}

/**
 * Universal formatCurrency utility for backwards-compatibility across widgets.
 * Automatically normalizes large raw values or formats values already in ₹ lakh.
 */
export function formatCurrency(
  value: number | undefined | null,
  _currency = "INR"
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "₹0.00 lakh"
  }

  // If value is greater than 100,000, it's raw INR rupees that needs normalization to lakh
  if (Math.abs(value) >= 100_000) {
    return formatLakh(value, { isRawRupees: true, decimals: 2 })
  }

  return formatLakh(value, { isRawRupees: false, decimals: 2 })
}

/**
 * Formats ratios without monetary units. (e.g. 2.00x)
 */
export function formatRatio(value: number | undefined | null, decimals = 2): string {
  if (value === undefined || value === null || isNaN(value)) return "0.00x"
  return `${value.toFixed(decimals)}x`
}

/**
 * Formats percentages without monetary units. (e.g. 15.0%)
 */
export function formatPercent(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) return "0.0%"
  return `${value.toFixed(decimals)}%`
}
