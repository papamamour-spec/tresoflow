# CLAUDE.md — Tresoflow

## Project Overview

Tresoflow is a cash transfer point management platform for a network of money transfer agencies in Senegal. It aims to manage cashier operations, partner API integrations (Western Union, Ria, MoneyGram, Wave, KPay, Orange Money, insurance companies, DHL, etc.), and daily reporting.

**Status:** Early stage — the project was scaffolded from the React + Vite template and does not yet have a `src/` directory or application code.

## Tech Stack

- **Frontend:** React 19 with JSX (no TypeScript yet)
- **Build tool:** Vite 8 (beta) with `@vitejs/plugin-react`
- **Backend:** Node.js + NestJS (planned)
- **Database:** PostgreSQL (planned)
- **Linter:** ESLint 9 (flat config) with `react-hooks` and `react-refresh` plugins
- **Deployment:** Railway (Nixpacks builder, serves static `dist/` via `npx serve`)

## Project Structure

```
tresoflow/
├── index.html          # Vite entry point (loads /src/main.jsx)
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint flat config
├── railway.json        # Railway deployment config
├── .gitignore          # Ignores node_modules/ and dist/
└── src/                # Application source (to be created)
    └── main.jsx        # React entry point (referenced in index.html)
```

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all `.js` / `.jsx` files |

## Development Guidelines

### Code Style
- JavaScript with JSX (`.jsx` extension for components)
- ES modules (`"type": "module"` in package.json)
- ESLint enforces: no unused variables (except those starting with uppercase or `_`-prefixed pattern `^[A-Z_]`)
- Follow React Hooks rules (enforced by `eslint-plugin-react-hooks`)

### File Conventions
- Components go in `src/components/`
- Pages go in `src/pages/`
- Keep the entry point at `src/main.jsx`
- Use `.jsx` extension for files containing JSX

### Build & Deploy
- Production build: `npm run build` outputs to `dist/`
- Deployed on Railway using Nixpacks
- Static files served with `npx serve -s dist`

### Git Workflow
- Main branch: `master`
- Always run `npm run lint` before committing
- Keep commits focused and descriptive

## Key Architectural Decisions

- **Backend:** NestJS with PostgreSQL — chosen for structured modules and robust relational data handling suited to financial transactions
- **Development priorities:** Cashier management and partner API integrations in parallel
- **Partner integrations:** Western Union, Ria, MoneyGram, Wave, KPay, Orange Money, insurance companies, DHL
- **Routing:** Will use `react-router-dom` when multi-page navigation is added
- **State management:** Evaluate as the app grows (Context API may suffice initially)
- **Testing:** No framework configured yet

## Planned Backend Structure (NestJS)

```
backend/
├── src/
│   ├── app.module.ts           # Root module
│   ├── main.ts                 # NestJS entry point
│   ├── cashiers/               # Cashier management module
│   │   ├── cashiers.controller.ts
│   │   ├── cashiers.service.ts
│   │   ├── cashiers.module.ts
│   │   └── entities/
│   ├── partners/               # Partner API integrations module
│   │   ├── partners.controller.ts
│   │   ├── partners.service.ts
│   │   ├── partners.module.ts
│   │   └── integrations/       # Per-partner adapters (WU, Ria, Wave, etc.)
│   ├── reports/                # Daily reporting module
│   ├── auth/                   # Authentication module
│   └── common/                 # Shared DTOs, guards, interceptors
├── package.json
├── tsconfig.json
└── nest-cli.json
```
