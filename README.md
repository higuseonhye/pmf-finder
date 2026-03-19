# PMF Finder

**Find product-market fit without Silicon Valley.**

AI agent conducts interviews. Share a link with customers. Paste transcripts for auto-extraction. See your PMF score.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/higuseonhye/pmf-finder)

---

## Features

### Core
- **ICP Definition** – Target customer profile (industry, company size, role)
- **Leads** – Add leads with name, company, role, country
- **Outreach Status** – Track: contacted → replied → interviewed
- **Interview Results** – Log problem_exists, severity, willing_to_pay, Sean Ellis PMF, notes

### Agent & Automation
- **Agent Interview** – Live (you select answers) or Simulated (practice with personas)
- **Shareable Link** – Customer opens link, completes form, sends result back
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

---

## Deploy

### Vercel (recommended)
1. Push to GitHub
2. [Import on Vercel](https://vercel.com/new)
3. Deploy (no config needed)

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
