# fi-pilot-frontend

Next.js 14 frontend for **fi-pilot** — an AI-powered accounting and financial insights SaaS for small businesses, freelancers, agencies, and CAs/bookkeepers.

---

## What it does

The frontend is the user-facing application of fi-pilot. It provides:

- Authentication via Supabase (login, register, session management)
- Organization onboarding and settings
- Home dashboard with KPI cards, revenue/expense chart, AI summary, and action items
- Invoice and bill management with form-based creation
- Bank transaction viewer with category filters and confidence indicators
- Document upload center with drag-and-drop and processing status tracking
- Financial reports — P&L, Balance Sheet, Cash Flow, Trial Balance
- Dedicated AI Insights screen with cash flow warnings, expense anomalies, and GST estimates
- AI Finance Chat — conversational interface connected to live financial data
- Reconciliation status viewer
- Review queue for low-confidence AI categorizations
- CA/accountant workspace (via role-based views)

---

## Tech stack

See [`docs/technologies.md`](docs/technologies.md) for a full breakdown.

---

## Project structure

```
fi-pilot-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Login and register pages (no sidebar)
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (dashboard)/             # Protected pages (with sidebar + header)
│   │       ├── dashboard/           # Home — KPIs, chart, AI summary
│   │       ├── invoices/            # Invoice list + create
│   │       ├── bills/               # Bills list
│   │       ├── bank-transactions/   # Transaction table with filters
│   │       ├── documents/           # Upload center
│   │       ├── reports/             # P&L, Balance Sheet, Cash Flow, etc.
│   │       ├── ai-insights/         # AI insights dedicated screen
│   │       ├── ai-chat/             # Finance chat interface
│   │       ├── reconciliation/      # Reconciliation status
│   │       ├── review-queue/        # Low-confidence categorization review
│   │       └── settings/            # Organization settings
│   ├── components/
│   │   ├── ui/                      # Shadcn UI base components
│   │   ├── layout/                  # Sidebar, Header, PageHeader
│   │   ├── shared/                  # KpiCard, DataTable, StatusBadge, etc.
│   │   ├── dashboard/               # RevenueChart, AiSummaryCard, ActionItems
│   │   ├── invoices/                # InvoiceTable, InvoiceForm
│   │   ├── transactions/            # TransactionTable
│   │   ├── documents/               # UploadDropzone
│   │   ├── ai-chat/                 # ChatMessage, ChatInput
│   │   └── review-queue/            # ReviewQueueTable
│   ├── constants/
│   │   └── envConstant.ts           # All env vars imported from here
│   ├── hooks/                       # useAuth, useOrganization
│   ├── lib/
│   │   ├── api/                     # Axios API modules per domain
│   │   ├── supabase/                # Browser, server, and middleware clients
│   │   └── utils.ts                 # cn(), formatCurrency(), formatDate()
│   ├── providers/                   # React Query + global providers
│   ├── store/                       # Zustand auth store
│   └── types/                       # TypeScript interfaces matching backend models
├── middleware.ts                    # Supabase session refresh + route protection
└── public/
```

---

## Prerequisites

- Node.js 20+
- A running [fi-pilot-backend](../fi-pilot-backend) instance
- A [Supabase](https://supabase.com) project (same one used by the backend)

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials and API URL

# 3. Start dev server
npm run dev
```

App runs at `http://localhost:3000`.  
Expects the backend API at `http://localhost:3001/api/v1` (set via `NEXT_PUBLIC_API_URL`).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL (e.g. `http://localhost:3001/api/v1`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |

---

## Auth flow

1. User logs in via Supabase on the `/login` page
2. Supabase issues a JWT stored in an HTTP-only cookie (via `@supabase/ssr`)
3. `middleware.ts` refreshes the session on every request and protects `/dashboard/*` routes
4. The Axios API client reads the active session token and attaches it as `Authorization: Bearer <token>` on every request
5. The backend's `SupabaseAuthGuard` verifies the token using the Supabase service role key

---

## Key architecture rules

1. **All env vars go through `envConstant.ts`.** Never use `process.env` directly in components or hooks.
2. **Every API request includes `x-organization-id`** from the Zustand store — the backend uses it for multi-tenant data isolation.
3. **Supabase SSR pattern** — browser client for client components, server client for server components, `updateSession` in middleware.
4. **Data fetching via React Query** — all server state is cached and managed through TanStack Query. No raw `useEffect` fetches.

---

## Useful commands

```bash
npm run dev      # Dev server with hot reload
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
