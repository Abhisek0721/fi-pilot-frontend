# fi-pilot — Technology Stack

A full breakdown of every technology used in fi-pilot, what it does, and why it was chosen.

---

## Backend (`fi-pilot-backend`)

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | ^10 | Main backend framework. Provides a structured, modular architecture with built-in support for dependency injection, guards, interceptors, and decorators. Chosen over Express for its TypeScript-first design and scalability for a multi-module SaaS. |
| **Node.js** | 20 | Runtime. LTS version used for stability and performance. |
| **TypeScript** | ^5 | Strongly typed language. Catches bugs at compile time, makes large codebases maintainable. |

### Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 16 | Primary relational database. Chosen for its reliability with financial/accounting data, ACID compliance, support for complex joins and aggregations, and `Decimal` precision for monetary values. |
| **Prisma** | ^7.8 | ORM and migration tool. Provides a type-safe database client auto-generated from the schema. Prisma 7 introduces `prisma.config.ts` for datasource configuration, removing the URL from `schema.prisma`. |
| **prisma.config.ts** | — | Prisma 7 config file. Defines the datasource URL via `defineConfig` rather than embedding it in the schema, enabling cleaner environment-based configuration. |

### Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | ^2 | Auth provider. Handles user sign-up, login, JWT issuance, and session management. Chosen to avoid building auth from scratch — handles email verification, OAuth, and token refresh out of the box. |
| **SupabaseAuthGuard** | — | Custom NestJS guard. Verifies every incoming JWT by calling `supabase.auth.getUser(token)` with the service role key, then attaches the user to the request. |

### API & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **@nestjs/swagger** | ^7 | Auto-generates interactive Swagger UI from controller decorators at `/api/docs`. Makes the API self-documenting. |
| **class-validator** | ^0.14 | DTO validation. Decorators like `@IsString()`, `@IsEmail()`, `@IsDecimal()` validate request bodies before they reach services. |
| **class-transformer** | ^0.5 | Transforms plain JSON into typed DTO class instances. Works together with `class-validator`. |
| **@nestjs/throttler** | ^5 | Rate limiting. Protects the API from abuse — 100 requests per 60 seconds by default. |

### AI & LLM

| Technology | Version | Purpose |
|------------|---------|---------|
| **Anthropic Claude API** | — | Powers the AI finance assistant and insight generation. Used with **function-calling (tool use)** — the LLM calls predefined tools (`getRevenue`, `getExpenses`, `getProfitAndLoss`, etc.) that run real SQL queries, then the LLM explains the results in plain language. The AI never invents numbers. |

### Background Jobs & Queuing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Redis** | 7 | In-memory data store used as the queue backend for BullMQ and as a cache layer. |
| **BullMQ** | — | Job queue for background tasks: document parsing, transaction categorization, reconciliation, insight generation, and payment reminders. Decouples slow async work from the HTTP request cycle. |

### File Storage

| Technology | Version | Purpose |
|------------|---------|---------|
| **AWS S3** (or Cloudflare R2) | — | Object storage for uploaded documents — bank statement CSVs, invoice PDFs, receipt images. Only file references (URLs) are stored in PostgreSQL. Files are encrypted at rest. |
| **Multer** | ^1.4 | NestJS multipart file upload middleware. Handles `multipart/form-data` requests for the document upload endpoint. |

### Infrastructure & Deployment

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | — | Containerizes the application for consistent environments across dev, staging, and production. Multi-stage build (builder → production) keeps the final image lean. |
| **Docker Compose** | — | Orchestrates all services locally and in production: `postgres`, `redis`, `backend`, `worker`, `nginx`. |
| **Nginx** | alpine | Reverse proxy sitting in front of the NestJS app. The only publicly exposed port is Nginx on `${PORT:-3001}:80`. All internal services (postgres, redis, app) communicate over the private `fi_pilot_net` Docker network with no exposed ports. Also handles gzip compression, upload size limits (50MB), and extended timeouts for AI/OCR jobs (120s). |
| **dumb-init** | — | Minimal init process inside the container. Ensures signals (SIGTERM, SIGINT) are properly forwarded to the Node.js process for graceful shutdown. |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **Helmet** | ^7 | Sets security HTTP headers (X-Frame-Options, CSP, HSTS, etc.) to protect against common web vulnerabilities. |
| **compression** | ^1.7 | Gzip middleware for response compression, reducing payload sizes. |
| **uuid** | ^9 | Generates UUID v4 strings. Used for IDs across the system. |
| **ESLint + Prettier** | — | Code linting and formatting. Enforces consistent code style across the team. |

---

## Frontend (`fi-pilot-frontend`)

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14 | React framework with App Router. Provides server-side rendering, server components, file-based routing, and built-in middleware support. App Router is used for layout nesting (auth layout vs dashboard layout). |
| **React** | ^18 | UI library. Concurrent features (Suspense, transitions) used for loading states. |
| **TypeScript** | ^5 | Strongly typed. Interfaces mirror the backend Prisma models for end-to-end type safety. |

### Styling & UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | ^3.4 | Utility-first CSS framework. Enables rapid UI development without writing custom CSS. All styling is done via Tailwind classes. |
| **Shadcn UI** | — | Unstyled, accessible component library built on Radix UI primitives. Components (Button, Card, Dialog, Table, etc.) are copied into `src/components/ui/` and fully customizable. Not a dependency — source is owned. |
| **Radix UI** | ^1–2 | Headless UI primitives used by Shadcn. Provides accessible, unstyled components for Dialog, Select, DropdownMenu, Tabs, Toast, etc. |
| **class-variance-authority (CVA)** | ^0.7 | Manages component style variants (e.g. button `size` and `variant` props) cleanly. |
| **clsx + tailwind-merge** | ^2 | Utility for conditionally joining class names while resolving Tailwind conflicts. Used in the `cn()` helper in `lib/utils.ts`. |
| **tailwindcss-animate** | ^1 | Adds smooth animation utilities (used by Shadcn for dialog/dropdown transitions). |
| **lucide-react** | ^0.400 | Icon library. Clean, consistent SVG icons throughout the UI. |

### Data Fetching & State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Query (React Query)** | ^5 | Server state management. Handles caching, background refetching, loading/error states for all API calls. Replaces `useEffect`-based fetching with declarative hooks. |
| **Axios** | ^1.6 | HTTP client for API calls. Configured with a base URL, a request interceptor that injects the Supabase JWT as `Authorization: Bearer <token>`, and the `x-organization-id` header from the Zustand store. |
| **Zustand** | ^4.4 | Lightweight global state management. Stores the authenticated user and current organization. Persisted to `localStorage` so the session survives page refreshes. |

### Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | ^7.48 | Performant form library. Used for invoice creation, org onboarding, and settings forms. Minimizes re-renders compared to controlled inputs. |
| **Zod** | ^3.22 | Schema validation library. Defines form schemas that are used both for TypeScript types and runtime validation. |
| **@hookform/resolvers** | ^3.3 | Connects Zod schemas to React Hook Form's `resolver` option. |

### Charts & Tables

| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | ^2.10 | Chart library built on D3. Used for the revenue vs expenses AreaChart on the dashboard, and any future trend visualizations. Chosen for its React-native API and ease of customization with Tailwind. |
| **TanStack Table** | ^8 | Headless table library. Powers all data tables (invoices, transactions, review queue). Provides sorting, filtering, and pagination logic with full control over rendering. |

### Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **@supabase/supabase-js** | ^2 | Supabase client. Used for login, register, sign-out, and reading the active session/token. |
| **@supabase/ssr** | ^0.4 | Supabase SSR utilities. Provides `createBrowserClient` (for client components), `createServerClient` (for server components and Route Handlers), and `updateSession` (for the Next.js middleware). Handles cookie-based session persistence correctly in the App Router. |
| **middleware.ts** | — | Next.js middleware. Calls `updateSession` on every request to refresh the Supabase token, and redirects unauthenticated users away from dashboard routes. |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **date-fns** | ^3 | Date formatting and manipulation. Used throughout for displaying invoice dates, transaction dates, and period labels. |
| **ESLint (eslint-config-next)** | ^8 | Next.js-specific linting rules. Catches common React and Next.js mistakes. |

---

## Infrastructure (shared)

| Technology | Purpose |
|------------|---------|
| **Docker network (`fi_pilot_net`)** | All backend containers communicate over this private bridge network. No inter-service traffic goes over the public network. |
| **PostgreSQL volumes** | `fi_pilot_postgres_data` — persists database across container restarts. |
| **Redis volumes** | `fi_pilot_redis_data` — persists BullMQ job queues and Redis data across restarts. |

---

## Architecture decisions

### Why Supabase for auth?
Building auth from scratch (password hashing, JWT issuance, token refresh, email verification) takes significant time and introduces security risks. Supabase handles all of this reliably. The backend only needs to verify the JWT — a single `supabase.auth.getUser(token)` call in the guard.

### Why Prisma 7 with `prisma.config.ts`?
Prisma 7 separates the datasource URL from the schema into a dedicated config file. This means the schema is purely a data definition — no environment-specific config embedded in it. The URL is injected at runtime via `process.env.DATABASE_URL`, which docker-compose sets per environment.

### Why PostgreSQL over MongoDB?
Accounting data is relational by nature. Double-entry bookkeeping requires strict referential integrity (journal entries reference chart of accounts, invoices reference customers, etc.), transactional consistency, and precise decimal arithmetic — all things PostgreSQL handles natively and MongoDB does not.

### Why BullMQ with Redis over inline processing?
OCR, AI categorization, and insight generation are slow operations (1–30 seconds). Doing them inline in the HTTP request would cause timeouts and poor UX. BullMQ queues these as background jobs, and the UI polls for status — giving instant acknowledgement with async processing.

### Why keep AI separate from calculations?
The LLM (Claude) is excellent at explaining and summarizing data in plain language, but it can hallucinate numbers if asked to calculate. All financial figures (revenue, profit, GST, receivables) are calculated by deterministic SQL queries from `journal_entry_lines`. The LLM only receives pre-calculated numbers and explains what they mean.
