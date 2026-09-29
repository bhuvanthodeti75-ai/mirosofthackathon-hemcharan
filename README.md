# Incident Memory Guard

> **Prevent Before Respond** — Incident intelligence and memory guard powered by Hindsight Vector Bank and LLM AI (Groq / Gemini).

## 🚀 Overview

Incident Memory Guard is an intelligent incident management platform that shifts incident operations from reactive mitigation to proactive prevention. By indexing organizational incident history, postmortems, and runbooks into a semantic memory bank, the system:
- **Prevents** repeating historical outages by evaluating incoming deployments, PRs, and config changes against past failure patterns.
- **Accelerates Response** by matching active alerts with past similar incidents, triage runbooks, and recommended root-cause remediations.
- **Replays** past incidents with interactive step-by-step simulations.
- **Visualizes** incident timelines and organizational reliability metrics over time.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Express.js (Node.js)
- **AI & Vector Memory**:
  - Hindsight Vector Bank
  - Groq AI (`openai/gpt-oss-120b`) / Gemini AI (`gemma-4-26b-a4b-it`)

---

## 📋 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your API credentials:
```bash
cp .env.example .env
```

Set the following variables in `.env`:
```env
PORT=3001
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=incident-memory
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemma-4-26b-a4b-it
```

### 4. Running the Application

**Run the backend server:**
```bash
npm run server
```

**Run the frontend dev server:**
```bash
npm run dev
```

Or build for production:
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── server/
│   ├── dataset.js       # Seed incident memory bank
│   └── index.js         # Express backend with AI & Vector API integration
└── src/
    ├── App.tsx          # Main command center layout & tab switching
    ├── index.css        # Tailwind styling
    ├── main.tsx         # React root
    ├── types.ts         # TypeScript interfaces & types
    └── components/
        ├── Navbar.tsx       # Status bar, mode toggles, and navigation
        ├── PreventPage.tsx  # Pre-deployment risk analysis & policy checks
        ├── RespondPage.tsx  # Real-time incident triage & triage copilot
        ├── ReplayPage.tsx   # Interactive post-incident simulations
        ├── TimelinePage.tsx # Chronological incident trajectory
        └── StatsPage.tsx    # Reliability and MTTR analytics
```

---

## 📄 License
ISC
