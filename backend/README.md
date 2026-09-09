# Backend: FastAPI Employability Service

**Status:** Phase 6 (To be built)  
**Framework:** FastAPI (Python)  
**Database:** PostgreSQL 15+  

## Structure

```
backend/
├── app/
│   ├── main.py              ← FastAPI app entry
│   ├── config.py            ← Settings & environment
│   └── db.py                ← Database connection
├── api/
│   ├── auth.py              ← Authentication endpoints
│   ├── queue.py             ← Advisor queue endpoints
│   ├── students.py          ← Student detail endpoints
│   └── cases.py             ← Case management endpoints
├── models/
│   ├── schemas.py           ← Pydantic schemas
│   └── database.py          ← SQLAlchemy models
├── services/
│   ├── predictions.py       ← ML predictions
│   ├── interventions.py     ← Recommendation logic
│   └── fairness.py          ← Fairness audit
├── uploads/                 ← Temporary file storage
├── generated_reports/       ← Report exports
├── requirements.txt
└── .env.example
```

## Setup (Phase 6)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

