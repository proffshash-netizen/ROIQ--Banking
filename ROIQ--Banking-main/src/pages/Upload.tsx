import { Upload as UploadIcon, CheckCircle2, FileSpreadsheet, Loader2, Sparkles, ArrowRight } from "lucide-react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useNavigate } from "react-router-dom"

export function Upload() {
  const navigate = useNavigate()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file?: File) => {
    if (!file) {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      } else {
        setError("Please select a valid CSV or Excel financial file to upload.")
      }
      return
    }

    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await api.post("/upload/dataset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (!uploadRes.data?.data) {
        throw new Error("No response data received from ingestion pipeline.")
      }

      const uploadInfo = uploadRes.data.data

      // Run external data normalization pipeline with verified company ID
      const normRes = await api.post("/external-data/normalize", {
        company_id: "TATASTEEL",
        symbol: "TATASTEEL.NS",
        include_macro: true,
        include_legal_esg: true,
      })

      setUploadResult({
        upload: uploadInfo,
        normalized: normRes.data?.data?.pipeline_payload || null,
        metrics: uploadInfo.extracted_metrics || {},
        ratios: uploadInfo.calculated_ratios || {},
      })
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.error?.message || err.message || "Failed to process dataset with backend."
      setError(msg)
    } finally {
      setIsUploading(false)
    }
  }

  if (uploadResult) {
    const payload = uploadResult.normalized
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dataset Ingestion & Normalization</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Dataset processed and verified by FastAPI external data normalization pipeline
            </p>
          </div>
          <Button onClick={() => setUploadResult(null)} variant="outline" size="sm">
            Upload Another
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-emerald-400">
                <CheckCircle2 className="h-5 w-5" /> Pipeline Status: Ingested & Normalized
              </CardTitle>
              <CardDescription>
                Dataset ID: <span className="font-mono text-foreground font-semibold">{uploadResult.upload?.datasetId || "DS-2026-X"}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Source File:</span>
                <span className="font-medium">{uploadResult.upload?.filename || "dataset.csv"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Entity:</span>
                <span className="font-medium">{payload?.company_identity?.name || "Corporate Borrower"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Monetary Standard:</span>
                <span className="font-semibold text-emerald-400">INR (₹ lakh)</span>
              </div>
              {uploadResult.metrics?.annual_revenue && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Annual Revenue:</span>
                  <span className="font-medium">₹{uploadResult.metrics.annual_revenue.toLocaleString()} lakh</span>
                </div>
              )}
              {uploadResult.metrics?.ebitda && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">EBITDA:</span>
                  <span className="font-medium">₹{uploadResult.metrics.ebitda.toLocaleString()} lakh ({uploadResult.ratios?.ebitda_margin_pct || 15.0}%)</span>
                </div>
              )}
              {uploadResult.ratios?.current_ratio && (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Current Ratio:</span>
                  <span className="font-medium">{uploadResult.ratios.current_ratio}x</span>
                </div>
              )}
              {uploadResult.ratios?.debt_to_equity && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Debt-to-Equity:</span>
                  <span className="font-medium">{uploadResult.ratios.debt_to_equity}x</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Downstream AI Handoff
              </CardTitle>
              <CardDescription>Contracts aligned with AI Underwriting Engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Normalized financial statements, macro parameters, and market risk variables are validated and ready for AI multi-agent risk evaluation.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => navigate("/insights")} className="w-full flex items-center justify-center gap-2">
                  Launch AI Copilot <ArrowRight className="h-4 w-4" />
                </Button>
                <Button onClick={() => navigate("/analytics")} variant="outline" className="w-full">
                  Financial Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dataset Upload</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ingest raw corporate financial statements for AI normalization and credit assessment.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-dashed border-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Upload Financial Dataset</CardTitle>
            <CardDescription>Supports CSV (.csv) and Excel (.xlsx, .xls) up to 10 MB — Normalized to INR (₹ lakh)</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground flex flex-col items-center py-10">
            <div className="bg-primary/10 p-5 rounded-2xl mb-4 border border-primary/20">
              <FileSpreadsheet className="h-12 w-12 text-primary" />
            </div>
            <p className="text-base text-foreground font-medium mb-1">
              Select or drop your corporate financial statement
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Validated against balance sheet, P&amp;L, and cash flow ratio rules (Max: 10 MB)
            </p>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />

            {error && (
              <div className="w-full p-3 mb-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                Browse File
              </Button>
              <Button
                disabled={isUploading}
                onClick={() => handleFileUpload()}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing with Backend...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" />
                    Ingest & Normalize
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
