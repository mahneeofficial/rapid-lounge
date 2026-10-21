# Rapid Lounge Voi — Enterprise Hospitality & Nightlife SaaS Platform

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-orange.svg)](https://github.com)
[![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_TypeScript_%7C_Tailwind_%7C_Node.js_%7C_Supabase-blue)](https://github.com)

**Rapid Lounge Voi** is a production-grade, full-stack digital management and hospitality SaaS platform built specifically for high-end lounges, clubs, and entertainment hubs in Kenya. It features automated M-Pesa Till reconciliation, digital waiter POS dispatch, QR entrance verification, and real-time inventory management.

---

## 🌟 Key Features

- **Live M-Pesa Daraja API Integration**: Automated STK Push dispatches and payment verification via Buy Goods Till (`1815773`).
- **Digital Waiter POS & KDS**: Real-time order dispatch feed for floor waiters, bartenders, and grill masters with offline queue buffering.
- **VIP Table & Room Booking**: Interactive floor map with real-time seat tracking, admin-managed room gallery photo uploads, and dynamic pricing.
- **Entrance Security & QR Scanning**: Instant pass validation via bouncer mobile scanner interface.
- **Audit Engine & Shift Reconciliation**: Shift closing financial audits, M-Pesa transaction tracking, and non-refundable static 24h lockdown rules.
- **Enterprise UI/UX**: Glassmorphism dark theme, cookie compliance banner, and responsive design optimized for mobile tablets and desktops.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide / SVG icons.
- **Backend**: Node.js, Express, Axios (Daraja API integration).
- **Database & Storage**: Supabase (PostgreSQL relational tables for reservations, menu items, and inventory units).

---

## 📂 Project Structure

```text
rapid-lounge/
├── server.js                  # Node.js Express backend & M-Pesa Daraja API
├── src/
│   ├── App.tsx                # Main router, session handlers & hash guards
│   ├── main.tsx               # React DOM entry point
│   ├── supabaseClient.ts      # Supabase database & storage client
│   ├── index.css              # Tailwind CSS directives & global styling
│   ├── components/
│   │   ├── Navbar.tsx         # Enterprise glassmorphism navigation
│   │   ├── Hero.tsx           # Cinematic landing page header
│   │   ├── MenuSection.tsx    # Digital waiter menu & 7-filter sort engine
│   │   ├── VipBooking.tsx     # VIP table, booth & overnight room booking
│   │   ├── EventsSection.tsx  # Weekly vibe & event line-up manager
│   │   ├── ManagerModal.tsx   # Master admin command center container
│   │   ├── admin/             # Admin tabs (Scanner, KDS, Inventory, Audit)
│   │   ├── booking/           # Interactive floor map, QR pass & M-Pesa modal
│   │   ├── waiter/            # Waiter tablet POS & floor order feed
│   │   └── ui/                # Custom modals & cookie compliance banner
├── package.json
└── README.md

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/mahneeofficial/rapid-lounge.git
cd rapid-lounge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000

SAF_CONSUMER_KEY=your_daraja_consumer_key
SAF_CONSUMER_SECRET=your_daraja_consumer_secret
SAF_PASSKEY=your_daraja_passkey
SAF_SHORTCODE=1815773
PORT=5000
```

### 4. Run the Application

Start the backend server:
```bash
node server.js
```

Start the Vite frontend development server in a separate terminal:
```bash
npm run dev
```

---

## 📦 Deployment Guide

- **Frontend**: Deploy on **Vercel** or **Netlify** (Connect your GitHub repository and build using `npm run build`).
- **Backend API**: Deploy on **Render** or **Railway** as a Node.js web service running `node server.js`.
- **Database**: Hosted securely on **Supabase**.

---

## ✒️ Author & Contributors

- **Brian Kimani Khalid** — Lead Systems Architect & Full Stack Engineer

---

© 2026 Rapid Lounge Voi. All Rights Reserved.
