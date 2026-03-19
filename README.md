# PMF Finder

A simple SaaS web app to track product-market fit discovery through customer interviews.

## Features

- **ICP Definition** – Define your target customer profile (industry, company size, role)
- **Leads** – Add and manage leads (name, company, role, country)
- **Outreach Status** – Track status: contacted → replied → interviewed
- **Interview Results** – Log for each interview:
  - Problem exists (yes/no)
  - Problem severity (high/medium/low)
  - Willing to pay (yes/no)
  - Notes
- **PMF Metrics** – Automatic calculation of:
  - Problem rate
  - Willingness to pay rate
  - PMF score (weak/medium/strong)
- **Dashboard** – Total leads, response rate, interview count, PMF score

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Data is stored in browser localStorage (no backend for MVP).
