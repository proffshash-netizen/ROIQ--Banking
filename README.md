# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

## Backend handoff notes
This repository includes a backend FastAPI project in `backend/` that now supports an external data normalization pipeline. The AI integration layer is pending, and the next developer should use `backend/.env.example` to configure provider secrets privately.

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

---

## ROIQ AI – Settings Module Documentation

### Overview
The ROIQ AI Settings Module provides a comprehensive enterprise settings page, designed to configure localized formatting, UI appearance themes, real-time notification alerts, simulation of credentials, report compilation layouts, and live system status of the underlying microservices.

### Architecture
The module follows a decoupled store-driven architecture:
`Settings UI (Settings.tsx) → Settings Store (settingsStore.ts) → Persistence Layer (localStorage) → Future FastAPI Sync`

- **Settings Store (`src/stores/settingsStore.ts`)**: Managed using Zustand, with localStorage persistence.
- **Settings Service (`src/services/settings.service.ts`)**: Encapsulates simulated security workflows (changing credentials, session revoking, fetching login logs) and microservices status polling.
- **UI Integration**: Reactive styles dynamically adjust root scaling (`font-size`), density settings (`comfortable` vs `compact`), and theme options (`light`, `dark`, and `system` configurations).

### Persistence Strategy
Zustand's `persist` middleware is used to serialize and restore state values automatically to/from `localStorage` with the key `roiq-settings-store`. This guarantees setting preservation upon refreshes.

### Future Backend Sync
All data models and actions in `settingsStore.ts` and `settings.service.ts` are ready for FastAPI endpoint synchronization (HTTP PUT/GET requests). Swapping mock functions in `settings.service.ts` with Axios-based requests will complete backend integration without altering UI components.

### Feature List
- **General Settings**: Language, Time Zone, Date Format, Currency Format, Auto-Save toggle, and Landing Page.
- **Appearance Settings**: Theme (Light/Dark/System), Sidebar Mode (Expanded/Collapsed), Font Size (Small/Medium/Large), and Layout Density (Compact/Comfortable).
- **Notifications**: Consolidations for email, in-app alerts, risk model changes, AI forecasting, and weekly reports.
- **Security & Privacy**: Password update, 2FA, session timeout limits, active session revoking list, and security login logs.
- **Report Preferences**: Default file formats (PDF/CSV/Excel), watermark, download quality, and target local path.
- **Help Center**: Interactive modal panels explaining FAQ, platform documentation, support desk, feedback forms, and bug intake.
- **System Status**: Live status monitors for Backend API, database connections, gateways, AI underwriting engine, and memory cache.

### Validation Checklist
- [x] Zustand settings store with local storage persistence implemented.
- [x] Dynamic theme switching class management configured (`dark` / `light` / `system`).
- [x] Application-wide font-size and density adjustment classes styled.
- [x] Live microservice statuses card polling setup.
- [x] Smoke tests for Settings, Executive Report, and Loan Recommendation passing cleanly.
- [x] Zero build errors or new linter blocks.

