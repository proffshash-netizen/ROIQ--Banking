# Next Development Cycle Checklist

## Goal
Prepare the backend for AI system integration with LangGraph and Groq.

## Immediate objectives
- Keep external API keys out of source control and use `.env` values instead.
- Finalize the external data ingestion and normalization pipeline.
- Add AI-facing endpoints for LangGraph/Groq.
- Prepare the backend for handoff with clear documentation.

## Required tasks

### 1. Configuration and environment
- [ ] Use `backend/.env.example` as the source of truth for environment variables.
- [ ] Do not hard code any external API keys in code or committed files.
- [ ] Create a real `backend/.env` locally with private API keys shared separately.
- [ ] Ensure `backend/.env` is ignored by Git.

### 2. External provider integration
- [ ] Replace `backend/app/services/external_provider_service.py` placeholders with real provider clients.
- [ ] Add provider-specific HTTP clients for:
  - FRED
  - Financial Modeling Prep (FMP)
  - Finnhub
  - Alpha Vantage
  - SEC EDGAR / EDGAR API
  - OpenFIGI / other security identifier systems
- [ ] Implement provider key configuration from environment variables.
- [ ] Add retry, timeout, and rate-limit handling for each provider.
- [ ] Add provider health checks to `backend/app/services/health_service.py`.

### 3. Normalization and payload quality
- [ ] Enhance `DataNormalizationService` to map actual provider responses into the normalized schema.
- [ ] Add validation for required AI contract fields.
- [ ] Add support for additional normalized payload sections as needed by AI modules.
- [ ] Keep the backend contract stable and aligned with `AI_MODULE_API_INTEGRATION_REPORT.md`.

### 4. AI integration layer
- [ ] Create AI module endpoints under `/api/ai/*`.
- [ ] Ensure AI modules consume only normalized payloads, not raw external responses.
- [ ] Build LangGraph orchestration logic to route module payloads.
- [ ] Add a Groq client adapter or gateway for deterministic model execution.
- [ ] Document each AI endpoint contract clearly in `API_ENDPOINTS.md`.

### 5. Security and deployment readiness
- [ ] Confirm JWT-based auth works for all protected routes.
- [ ] Secure any AI-facing endpoints behind auth if needed.
- [ ] Ensure `backend/setup_backend.ps1` installs dependencies cleanly.
- [ ] Keep the repository stateless for now; Redis/DB remain optional.
- [ ] Document the deployment and developer startup path.

## Documentation tasks
- [ ] Sync `API_ENDPOINTS.md` with actual backend endpoints.
- [ ] Add a `backend/.env.example` file with placeholder keys.
- [ ] Update `backend/README.md` with setup and placeholder key guidance.
- [ ] Mention in top-level README that backend API keys are not stored in Git.
- [ ] Add a developer handoff section for the next AI integration engineer.

## Notes for the next developer
- External API keys must be shared privately and copied into `backend/.env`.
- The normalization pipeline is implemented and testable at `/api/v1/external-data/normalize`.
- The AI integration layer is still pending and should be built on top of the normalized payload contract.
- Use `backend/setup_backend.ps1` to create the Python environment and install dependencies.

---

## Recommended next sprint priorities
1. Real external provider plumbing and secrets config.
2. AI contract endpoint implementation and LangGraph orchestration.
3. Provider health and error handling.
4. API documentation and handoff clarity.
