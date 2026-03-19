# PMF Finder

**Find product-market fit without Silicon Valley.**

AI agent conducts interviews. Share a link with customers. Paste transcripts for auto-extraction. See your PMF score.

**[Live](https://pmf-finder-higuseonhye.vercel.app)** · [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/higuseonhye/pmf-finder)

---

## Features

### Core
- **ICP Definition** – Target customer profile (industry, company size, role)
- **Leads** – Add leads with name, company, role, country
- **Outreach Status** – Track: contacted → replied → interviewed
- **Interview Results** – Log problem_exists, severity, willing_to_pay, Sean Ellis PMF, notes

### Agent & Automation
- **Agent Interview** – Live (you select answers) or Simulated (practice with personas)
- **AI Interview** – Customer chats with AI; AI asks PMF questions and extracts answers (requires OpenAI API key)
- **Shareable Link** – Form or AI mode; customer completes, sends result back
- **Transcript Import** – Paste transcript → auto-extract → one-click save
- **Bulk Import** – Separate with `---` for multiple interviews

### Insights
- **PMF Score** – weak / medium / strong
- **Benchmarks** – Industry comparison (SaaS, B2B, Consumer, etc.)
- **Keywords** – Extracted from interview notes
- **Report** – Download HTML report

### UX
- **Landing** – EN/KO language toggle
- **Demo** – Try with sample data
- **No signup** – Data in localStorage

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

**AI Interview** (needs API): Use `npm run dev:full` with `OPENAI_API_KEY` in `.env`, or deploy to Vercel.

---

## Deploy

### Vercel (recommended)
1. [Import on Vercel](https://vercel.com/new) → connect GitHub repo
2. Add env var in Project Settings: `OPENAI_API_KEY` (for AI Interview)
3. Deploy — auto-deploys on every push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add `public/_redirects` for SPA routing

---

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS
- localStorage (no backend)

---

## License

MIT
