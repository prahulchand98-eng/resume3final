# ResumeTailor AI

AI-powered resume tailoring SaaS built with Next.js, Claude API, Prisma, and Stripe.

## Features

- **AI Resume Tailoring** – Paste any job description + your resume → Claude AI tailors it in ~30s
- **3 Free Credits** – Every new user gets 3 free tailored resumes, no credit card needed
- **Resume Builder** – Structured form to build your master resume
- **Saved Resumes** – Save, name, and set a default resume template
- **7-Day History** – Every tailored resume auto-saved for 7 days with preview & re-download
- **Word & PDF Download** – Professional `.docx` export or browser PDF print
- **Inline Editing** – Click any section in the preview to edit before downloading
- **Subscription Plans** – Basic ($9.99), Pro ($24.99), Premium ($35.99) via Stripe

## Quick Start

### 1. Clone & install

```bash
cd resume-tailor
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | `file:./dev.db` for SQLite (default) |
| `JWT_SECRET` | Random 32+ char secret — `openssl rand -base64 32` |
| `ANTHROPIC_API_KEY` | Your Claude API key from [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |
| `STRIPE_SECRET_KEY` | *(optional)* Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | *(optional)* Stripe webhook secret |
| `STRIPE_PRICE_BASIC` | *(optional)* Stripe price ID for Basic plan |
| `STRIPE_PRICE_PRO` | *(optional)* Stripe price ID for Pro plan |
| `STRIPE_PRICE_PREMIUM` | *(optional)* Stripe price ID for Premium plan |

> Stripe is optional — the app works fully without it (subscriptions show as "coming soon").

### 3. Set up the database

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stripe Setup (optional)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create 3 subscription products in Stripe Dashboard:
   - **Basic** — $9.99/month
   - **Pro** — $24.99/month
   - **Premium** — $35.99/month
3. Copy each price ID into `.env.local`
4. Set up a webhook pointing to `/api/stripe/webhook` with these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
5. Copy the webhook secret into `.env.local`

For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (auth)/signup/         # Signup page
│   ├── dashboard/             # User dashboard
│   ├── create/                # Resume tailoring page
│   ├── history/               # 7-day history
│   ├── pricing/               # Pricing & subscription
│   ├── api/
│   │   ├── auth/              # Login, signup, logout, me
│   │   ├── resumes/           # CRUD for saved resumes
│   │   ├── tailor/            # AI tailoring endpoint
│   │   ├── upload/            # PDF/DOCX file parsing
│   │   ├── history/           # Resume history
│   │   ├── download/          # DOCX generation
│   │   └── stripe/            # Checkout, webhook, portal
│   └── page.tsx               # Landing page
├── components/
│   ├── Navbar.tsx
│   ├── ResumeBuilder.tsx      # Form-based resume builder
│   ├── ResumePreview.tsx      # Editable resume preview
│   ├── LoadingModal.tsx       # Animated loading modal
│   └── ResumeSelector.tsx     # Source selector (saved/upload/paste/build)
└── lib/
    ├── auth.ts                # JWT utilities
    ├── claude.ts              # Claude API integration
    ├── docx-generator.ts      # Word file generation
    ├── prisma.ts              # Prisma client singleton
    ├── stripe.ts              # Stripe utilities
    └── types.ts               # Shared TypeScript types
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma (swap to PostgreSQL for production) |
| Auth | JWT in httpOnly cookies (`jose`) |
| AI | Anthropic Claude API (`claude-opus-4-5`) |
| Payments | Stripe Subscriptions |
| Word Export | `docx` library |
| File Parsing | `pdf-parse` + `mammoth` |

## Production Deployment

1. Switch `DATABASE_URL` to a PostgreSQL connection string
2. Run `npx prisma migrate deploy` (not `db:push`)
3. Set all production environment variables
4. Deploy to Vercel, Railway, or any Node.js host
5. Point Stripe webhook to your production URL

## Credit System

| Plan | Credits/month | Price |
|---|---|---|
| Free | 3 (one-time) | $0 |
| Basic | 50 | $9.99/mo |
| Pro | 150 | $24.99/mo |
| Premium | 800 | $35.99/mo |

- 1 tailored resume = 1 credit
- Credits reset every month on subscription renewal (via Stripe webhook)
- History auto-deletes after 7 days
- Saved resume templates never expire
