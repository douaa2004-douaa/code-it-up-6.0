# 🦦 Sandy's Lab Management System

## Setup (run these in order)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Folder structure

src/
├── screens/    → 7 pages (Dashboard, Projects, Inventory, Experiments, AIChat, Admin, NotFound)
├── widgets/    → Reusable components (Sidebar, StatCard, Badge, etc.)
├── services/   → api.js (axios), useLabStore.jsx (global state)
├── models/     → index.js (data factories + enums)
└── assets/     → Drop PNG assets here

## If npm run dev fails

Make sure you're INSIDE the sandy-lab folder:
  cd sandy-lab
  npm install   ← must run first, installs Vite + React + Tailwind
  npm run dev

## Connect real backend

Edit src/services/api.js — set VITE_API_URL in a .env file:
  VITE_API_URL=http://localhost:8000/api
  VITE_AI_URL=http://localhost:5000/ai
