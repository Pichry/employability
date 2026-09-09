# Graduate Employability Prediction System
**Technical Specification & Development Mandate**

---

## Vision
A decision-support system that reads what a university already knows about a student and answers one question early enough to matter: **who is likely to leave here without work, and what can we do about it this semester?**

**The core promise:** Prediction → Explanation → Recommendation → Logged Action → Observed Outcome → Retrained Model

---

## Non-Negotiable Constraints

### Data & Privacy
- Read-only from source systems. SIS, LMS, placement office own their data. We ingest, never write back.
- Pseudonymisation happens at Layer 2. Names and IDs → salted hash before any ML code runs.
- Analytics zone works pseudonymously. Analysts cannot see student names. Ever.
- Re-identification only at presentation. The final UI shows names, only to roles authorized for that scope.
- Every individual record access is logged. Who, what, when, why. Audit trail is append-only.

### Machine Learning
- No leakage. Features must be computable using only data available before the prediction as-of date.
- Point-in-time correctness. Features frozen as-of snapshots, never updated in place.
- Fairness is a deployment blocker. A model with TPR gap > 0.10 across protected groups cannot go to active status.
- Calibration matters. When we say 0.30, ~30% of those students should actually become unemployed. Brier score checked.
- Training/serving skew prevention. One shared feature-engineering library used by both training and inference.

### Access Control
- Separation of duties. Analysts build the model but never see student names. Advisors see names but cannot modify predictions.
- Row-level security. Enforced in Postgres, not just the API. Even SQL injection cannot cross a departmental boundary.
- Three-layer enforcement. UI gate (React routes) → API re-check (FastAPI permissions) → DB row-level security (Postgres policies).
- QA/Ethics veto. No model reaches production without fairness sign-off from a role separate from the analyst.

---

## Build Order (Phases 0-10)
**Do not deviate from this without explicit approval.**

- Phase 0: Problem definition & data access (2 weeks)
- Phase 1: Data acquisition & profiling (3 weeks)
- Phase 2: Schema & ingestion (2 weeks)
- Phase 3: Feature engineering (2 weeks)
- Phase 4: Modelling (3 weeks)
- Phase 5: Fairness (1.5 weeks)
- Phase 6: API + auth (3 weeks)
- Phase 7: Core UI (4 weeks)
- Phase 8-10: Analytics, hardening, docs (7 weeks)

Total: 27 weeks sequentially; 18-20 with two people after Phase 3.

---

## Stack (non-negotiable)
- Frontend: React + Vite + TypeScript + Recharts
- API: FastAPI (Python)
- Database: PostgreSQL 15+ with row-level security native
- ML: scikit-learn, XGBoost, SHAP, Fairlearn (no deep learning)
- Orchestration: Celery + Redis, or plain cron
- Deployment: Docker Compose on institutional VM

---

## Principles

1. One source of truth per fact.
2. Immutability is the default.
3. Audit trail is non-optional.
4. Fairness is structural, not procedural.
5. Simplicity beats cleverness.
6. Assume the worst, build for the best.

---

## Collaboration Notes
- Commit every feature to a branch using conventional messages.
- Every commit includes tests.
- Code review is mandatory.
- When blocked on data, use fallback plan and label it.
- When uncertain, err toward more logging and audit trail.
