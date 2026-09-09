# SkillIntel — AI-Based National Skills Demand Intelligence System

A full-stack platform that ingests labour-market data, extracts skills with NLP,
forecasts demand, and predicts graduate employability — with six role-based portals.

## Stack
- **Frontend:** React + Vite + Tailwind, TanStack Query, Recharts
- **Backend:** FastAPI + PostgreSQL (SQLAlchemy), JWT auth, RBAC
- **ML:** scikit-learn (demand forecast + employability classifier) + taxonomy NLP skill extraction
- **Reports:** real PDF / Excel / Word generation

## Roles (demo accounts)
| Role | Email | Password |
|------|-------|----------|
| System Administrator | admin@skillintel.gov.rw | Admin@2026 |
| Policy Maker | policy@skillintel.gov.rw | Policy@2026 |
| University Administrator | university@skillintel.gov.rw | Uni@2026 |
| Career Advisor | advisor@skillintel.gov.rw | Advisor@2026 |
| Data Analyst | analyst@skillintel.gov.rw | Analyst@2026 |
| Workforce Planner | planner@skillintel.gov.rw | Planner@2026 |

## Run locally

### 1. Backend (FastAPI + Postgres)
```bash
cd backend
docker compose up -d db                 # start PostgreSQL (port 5433)
python3 -m venv --without-pip .venv     # Kali: bootstrap pip via get-pip.py
curl -sS https://bootstrap.pypa.io/get-pip.py | .venv/bin/python
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m app.seed            # seed demo users + sample data
.venv/bin/python -m app.ml.build        # generate data + train the ML models
.venv/bin/uvicorn app.main:app --reload # API at http://localhost:8000 (docs: /docs)
```

### 2. Frontend
```bash
npm install
npm run dev                             # app at http://localhost:5173
```
Set `VITE_API_URL` in `.env` (defaults to `http://localhost:8000`).

### Full stack via Docker
```bash
cd backend && docker compose up --build    # db + api (api seeds & trains on boot)
```

## ML pipeline
`app/ml/build.py` generates a labour-market dataset (job posts over 36 months,
1,500 graduates), runs skill extraction, aggregates demand, then trains and
evaluates two models, persisting artifacts to `app/ml/artifacts/` and metrics to
the `ml_models` table.

> The graduate-employability training data is synthetic-but-realistic (documented),
> ready to be swapped for real institutional data.

## Project layout
```
backend/app
  models/      SQLAlchemy models
  routers/     auth, users, institutions, data, analytics, ml, insights, reports
  ml/          taxonomy, extractor, build (train), registry (inference)
src/           React app (pages by role, components, api client + hooks)
```
