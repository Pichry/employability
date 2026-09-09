# Getting Started: Graduate Employability Prediction System

**You are here:** End of Phase 0-2 planning and foundational architecture.  
**Status:** Ready for Phase 1 (Data Acquisition).

---

## What Was Just Built

### ✅ **Project Foundation**
- **CLAUDE.md** — Non-negotiable constraints and development principles
- **README.md** — Quick start guide, project structure, troubleshooting
- **Build order** — 27 weeks sequential; 18-20 weeks with two people (Phases 0-10)

### ✅ **Database Schema** (5 zones, production-ready)
- **Zone E (Operational):** Identity, authentication, audit logs, data sources
- **Zone A (Analytics):** Pseudonymous student records, grades, internships, engagement
- **Zone B (Outcomes):** Graduate employment status (labels), tracer survey responses
- **Zone C (ML):** Feature snapshots (point-in-time), model versions, fairness audits
- **Zone D (Interventions):** Cases, actions, recommendations

**Key properties:**
- Immutable predictions and features (database-level enforcement)
- Row-level security (department/program scoping)
- Audit trail on all access
- Quarantine for rejected rows (never silently dropped)

### ✅ **Data Ingestion Framework** (Phases 1-2)
Three production-ready modules:

1. **Pseudonymizer:** One-way hashing of student IDs
   - Uses salt + SHA-256 (cryptographically irreversible)
   - Environment-variable based (never in code)
   - Analystscannot see real identities

2. **Validation:** Quality checks before ingestion
   - Type validation, null checks, range validation
   - Outlier detection (e.g., GPA > 4.0)
   - Duplicate detection
   - Detailed error reporting

3. **Ingester:** Orchestrates the full pipeline
   - Reads from source, validates, pseudonymizes, stores
   - Separates real identity (operational) from pseudonymous data (analytics)
   - Logs every ingestion run with success/failure counts

### ✅ **Test Suite** (Unit tests for data quality)
- Pseudonymizer tests: verify one-way hashing, determinism, salt isolation
- Validation tests: verify schema enforcement, outlier detection
- All tests passing: `pytest tests/ -v`

---

## Phase Checklist: What's Required Next

### Phase 0 (CURRENT) — Problem Definition & Data Access
**Timeline:** 2 weeks  
**Status:** Partial (foundation built, agreements needed)

**To complete Phase 0, you need:**

- [ ] **Data Access Agreements (signed)**
  - SIS (Student Information System)
  - LMS (Learning Management System)
  - Career Services / Placement Office
  - Alumni database / Tracer survey data

- [ ] **Target Variable Defined (in writing)**
  - Example: "employed_12m = in paid work ≥20 hrs/week OR self-employed OR full-time study within 12 months of graduation"
  - Label source identified
  - Response rate known (if tracer survey)

- [ ] **Stakeholder Interviews (3 conducted)**
  - Career Advisor: workload, capacity, trust in AI
  - Academic Head: curriculum feedback, accreditation use
  - QA / Compliance Officer: data governance, fairness concerns

- [ ] **Pseudonymization Salt Generated & Secured**
  ```bash
  python -c 'import secrets; print(secrets.token_hex(32))'
  # Save this to: AWS Secrets Manager, HashiCorp Vault, or encrypted local file
  ```

- [ ] **Database Deployed (test environment)**
  ```bash
  psql -U postgres -d employability_db -f db/schema/01_initial_schema.sql
  ```

---

## Phase 1 — Data Acquisition & Profiling (Week 3-5)
**When to start:** After Phase 0 complete

**Deliverables:**
1. Export real data: SIS (students, grades), LMS (logins), career services (internships), tracer surveys
2. Profile report: % missing per field, outliers, response bias, sample sizes
3. Document data quality issues and remediation plan

**Use the ingestion framework to:**
```python
from data.ingest.ingester import StudentDataIngester

ingester = StudentDataIngester(connection_string="postgresql://...")
run = ingester.ingest_rows(student_records, source_id=1)
print(f"Succeeded: {run.rows_succeeded}/{run.rows_attempted}")
print(f"Rejected: {run.rows_rejected} (see operational.ingestion_quarantine)")
```

---

## Phase 2 — Schema & Live Ingestion (Week 6-7)
**When to start:** After Phase 1 real data confirmed

**Deliverables:**
1. Automated nightly sync from all sources
2. Live feature snapshot table (point-in-time correctness)
3. Leakage audit passed

---

## How to Verify Everything Works

### 1. Database is running
```bash
psql -U postgres -c "SELECT 1;"
```

### 2. Schema deployed
```bash
psql -U postgres -d employability_db -c \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('analytics', 'operational');"
# Expected: > 40 tables
```

### 3. Python environment ready
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Tests pass
```bash
export PSEUDONYMIZATION_SALT=$(python -c 'import secrets; print(secrets.token_hex(32))')
pytest tests/ -v
```

---

## Critical Decisions Made (§09 of brief)

### Separation of Duties
| Role | Sees Names? | Can Modify Predictions? | Notes |
|------|-------------|------------------------|-------|
| Analyst | ❌ NO (pseudonymous) | ❌ NO | Builds models, works on hashed data |
| Advisor | ✅ YES (scoped) | ❌ NO | Works through cases, logs actions |
| Academic Head | ✅ YES (scoped) | ❌ NO | Sees program-level analytics only |
| QA/Ethics | ❌ NO (aggregates) | ✅ YES (approve/reject) | Approves models, audits fairness |
| Admin | ❌ NO | ❌ NO | Manages users, infrastructure, cannot see student data |
| Student | ✅ YES (self only) | ❌ NO | Sees opportunities, not risk score |

### Access Enforcement (Three Layers)
1. **UI:** React routes gate access by role
2. **API:** FastAPI re-checks permissions on every request
3. **Database:** Postgres row-level security (RLS) policies

Even if UI or API is compromised, database RLS prevents unauthorized access.

### Immutability (By Design)
- `feature_snapshot` is immutable (database trigger blocks UPDATE)
- `prediction` is immutable (every prediction is a historical fact)
- `audit_log` cannot be deleted (append-only)

This ensures every decision can be audited back to the exact features and model used.

---

## Non-Negotiable Principles (§01 of CLAUDE.md)

1. **Read-only from source systems.** Never write back to SIS, LMS, career services.
2. **Pseudonymization at Layer 2.** Immediate, irreversible, salt-based.
3. **Fairness is a deployment blocker.** No model reaches production with TPR gap > 0.10.
4. **Training/serving skew prevented.** One shared feature-engineering library.
5. **Audit trail is mandatory.** Who accessed what, when, why.

---

## Stack (Non-Negotiable)

| Layer | Technology | Why |
|-------|-----------|-----|
| **Database** | PostgreSQL 15+ | Native row-level security, strong constraints, immutable triggers |
| **API** | FastAPI (Python) | Keeps ML and API in one language, one dependency tree |
| **ML** | scikit-learn, XGBoost, SHAP | Tabular data + tree ensembles dominate; full explanations required |
| **Fairness** | Fairlearn | Group-wise metrics, disparity detection |
| **Frontend** | React + Vite + TypeScript | Standard, fast build, type safety |
| **Deployment** | Docker Compose on VM | Not cloud (data residency), not Airflow (too heavy for 6 jobs) |

---

## Questions to Answer Before You Start Phase 1

1. **Do we have tracer survey data?**
   - How many cohorts? (2021, 2022, 2023 = 3 cohorts)
   - What is the response rate? (35%, 50%?)

2. **Do we have real SIS/LMS access?**
   - Direct database connection, API, or CSV export?
   - How often can we refresh? (nightly, weekly?)

3. **Who is the target advisor?**
   - One department first (pilot), or all programs?

4. **What defines "employed"?**
   - Exact definition in one sentence
   - Signed off by career services lead

5. **Who signs off on fairness?**
   - Must be separate from analyst
   - Must have veto power on model deployment

---

## Next Actions (This Week)

- [ ] **Read** CLAUDE.md (development mandate)
- [ ] **Read** employability-system-brief.html (full design rationale)
- [ ] **Setup** Python environment: `pip install -r requirements.txt`
- [ ] **Deploy** database schema: `psql -f db/schema/01_initial_schema.sql`
- [ ] **Run** tests: `pytest tests/ -v`
- [ ] **Contact** SIS owner, LMS admin, career services lead for data access
- [ ] **Schedule** three stakeholder interviews (advisor, head, QA)
- [ ] **Generate** PSEUDONYMIZATION_SALT: `python -c 'import secrets; print(secrets.token_hex(32))'`
- [ ] **Store** salt securely (never commit to Git)

---

## Git Workflow

All work is in the main `Innovation Project/` directory with git tracking.

```bash
cd "/home/clesence/Documents/Innovation Project"
git log --oneline                          # View commits
git status                                  # View current state
git add <files>                             # Stage changes
git commit -m "feat: descriptive message"   # Commit with conventional format
```

**Conventional commit format:**
```
feat:    new feature (predict, ingest, validate)
fix:     bug fix
refactor: improve structure without changing behavior
test:    add or update tests
docs:    documentation only
```

---

## Documentation Tree

```
CLAUDE.md
  ├─ Principles (6 non-negotiables)
  ├─ Build order (Phases 0-10, 27 weeks)
  ├─ Stack (FastAPI, PostgreSQL, scikit-learn)
  └─ Collaboration notes

README.md
  ├─ Quick start (3 steps)
  ├─ Project structure
  ├─ Design decisions (pseudonymization, separation of duties)
  └─ Troubleshooting

Technical Brief (employability-system-brief.html)
  ├─ §01 Problem (timing, not information)
  ├─ §02 Scope (what we build, what we don't)
  ├─ §03 Architecture (6 layers, read-only)
  ├─ §04 Competitors (uniqueness claim)
  ├─ §05 Data (label definition, feature dictionary)
  ├─ §06 AI pipeline (training vs inference)
  ├─ §07 Core logic (one term cycle)
  ├─ §08 Schema (5 zones, design decisions)
  ├─ §09 Access (roles, permissions, what each role sees)
  ├─ §10 Pages (34 screens, 6 that matter)
  ├─ §11 Build order (27 weeks sequential)
  └─ §12 Risks (honest limitations)

User Stories (USER_STORIES.md)
  ├─ Career Advisor (8 stories)
  ├─ Academic Head (6 stories)
  ├─ Placement Officer (3 stories)
  ├─ Data Analyst (9 stories)
  ├─ QA/Ethics Officer (5 stories)
  ├─ System Admin (4 stories)
  └─ Student (4 stories)
```

---

## Questions?

- **How does pseudonymization work?** → Read `data/ingest/pseudonymizer.py` (20 lines)
- **What happens if data is invalid?** → Read `data/ingest/validation.py` (50 lines)
- **Why these database zones?** → See CLAUDE.md §08 and Technical Brief §08
- **What's the full system?** → See Technical Brief (all 12 sections)
- **How do I run tests?** → See README.md "Testing"

---

## Success Criteria for Phase 1

Phase 1 is complete when:
- ✅ 3+ cohorts of graduate data in hand (students, grades, employment)
- ✅ Data profiling report generated (missingness, outliers, response bias)
- ✅ Response bias analysis documented (respondents vs non-respondents)
- ✅ Data ingestion runs successfully on real data
- ✅ Leakage audit passed (no future data in features)
- ✅ Stakeholder interviews completed (advisor, head, QA)

Then: Move to Phase 2 (live ingestion pipeline).

---

Good luck! You have a solid foundation. Every line of code you see has a purpose.
