# GEPS Development Plan: Phases 1-5

**Graduate Employability Prediction System**  
**Career Advisor MVP → Production Deployment**

---

## 📊 Overview

```
Phase 1: Prototype Polish (2 weeks)
  ↓
Phase 2: Backend Foundation (3 weeks)
  ↓
Phase 3: Integration & Testing (2 weeks)
  ↓
Phase 4: Hardening (2 weeks)
  ↓
Phase 5: Production Launch (1 week)
──────────────────────────────────
Total: ~10 weeks to production
```

---

## ⭐ Phase 1: Prototype Polish (2 weeks)

**Goal:** Make the prototype feel production-ready for user testing  
**Owner:** Frontend  
**Deliverables:** Case modal, 50+ mock students, search/filter enhancements

### Week 1.1: Case Creation & Management

#### 1.1.1 Case Creation Modal
- [ ] Build modal component
  - Student selector (auto-populated if coming from profile)
  - Intervention type dropdown (Internship, Portfolio, Mentorship, Academic Recovery, Other)
  - Notes textarea (max 500 chars)
  - Priority selector (High/Medium/Low)
  - Save button → creates CASE-007, shows success
- [ ] Validation
  - All fields required
  - Notes minimum 10 chars (show error)
  - Prevent duplicate cases for same student+intervention
- [ ] Success flow
  - Confirmation modal with case ID
  - Link to view case
  - Option to create another case or return to queue
- [ ] Integration
  - Can open from Student Profile ("Create intervention case" button)
  - Can open from Queue (add action menu to each row)
  - Can open from Cases page (+ New case button)

**Files to modify:**
- `src/App.tsx` — Add `CaseCreationModal` component
- Add case validation logic
- Update Cases view to show recent cases first

**Tests:**
- Modal opens/closes
- Form validation works
- Case is created with all fields
- Success message shows
- Case appears in Cases list

---

#### 1.1.2 Case Notes & Timeline
- [ ] Enhance Cases view
  - Show full case timeline (created → action taken → follow-up → resolved)
  - Each event shows: date, what happened, by whom
  - "Add note" button on each case
  - Inline note editing (inline textarea)
- [ ] Case status transitions
  - Button to change status: New → In Progress → Follow-up → Resolved
  - Each transition is logged in timeline
  - Show expected follow-up date

**Files to modify:**
- `src/App.tsx` — Enhance `CaseManagement` component
- Add note creation logic
- Add status transition buttons

**Tests:**
- Add note to case
- Notes appear in timeline
- Change case status
- Timeline updates with new events

---

### Week 1.2: Enhanced Queue & Search

#### 1.2.1 Advanced Queue Filtering
- [ ] Add more filters
  - By program (dropdown, multi-select)
  - By year (Y1/Y2/Y3/Y4 checkboxes)
  - By intervention status (New/Active/Follow-up/Resolved)
  - By date range (last reviewed)
  - Clear all filters button
- [ ] Sorting options
  - By risk score (default)
  - By last review date
  - By intervention urgency
  - Reverse sort (ascending/descending toggle)
- [ ] Save filter preferences
  - Remember last 3 filter states
  - "Save as view" button (e.g., "My High Priority CS Students")

**Files to modify:**
- `src/App.tsx` — Enhance `StudentQueue` component
- Add filter state management
- Add localStorage for saved views

**Tests:**
- Each filter works independently
- Multiple filters combine correctly
- Sort options work
- Filters persist on page reload

---

#### 1.2.2 Student Search Modal
- [ ] Global search (Cmd+K or Ctrl+K)
  - Search by name, ID, email, program
  - Show recent searches
  - Shows top 5 results
  - Click to jump to student profile
- [ ] Quick stats on search results
  - Risk score, priority, last review date
  - Show if already has active case
- [ ] Keyboard navigation
  - Arrow keys to navigate results
  - Enter to select
  - Esc to close

**Files to modify:**
- `src/App.tsx` — Add `SearchModal` component
- Add keyboard event listeners to root
- Add search indexing for performance

**Tests:**
- Search finds students by name
- Search finds students by ID
- Results show correct data
- Keyboard navigation works
- Modal opens/closes with Cmd+K

---

### Week 1.3: Mock Data & Visual Polish

#### 1.3.1 Expand Mock Data
- [ ] Add 50+ students (currently 7)
  - Variety of programs (IS, Software Eng, Business, CS, Data Science, HR, Marketing)
  - Spread of risk scores (20%-90%)
  - Mix of priority levels
  - Realistic names (South African universities context)
  - Varied signals (some declining GPA, some low internship, some engagement issues)
- [ ] Add 20+ cases
  - Mix of statuses (New, In Progress, Follow-up, Resolved)
  - Different intervention types
  - Timeline events for each case
  - Show case resolution outcomes (some successful, some ongoing)
- [ ] Realistic intervention history
  - Some students have 2-3 active cases
  - Some have resolved cases
  - Show outcomes (e.g., "Internship completed", "GPA improved")

**Files to modify:**
- `src/App.tsx` — Expand mock data constants
- Add helper to generate realistic names
- Add helper to generate varied signals

**Tests:**
- Queue displays all 50+ students
- Performance is still smooth (no lag)
- Data looks realistic and varied
- Cases show realistic timelines

---

#### 1.3.2 Visual Refinements
- [ ] Color/contrast checks
  - Ensure all text meets WCAG AA (4.5:1 contrast)
  - Verify color palette on different monitors
  - Test dark mode readability
- [ ] Spacing & typography
  - Consistent spacing (8px grid)
  - Readable line heights (1.5-1.8)
  - Font sizes scale on mobile
- [ ] Hover/active states
  - All clickable elements show hover
  - Buttons show active state
  - Links underline on hover
- [ ] Loading states
  - Add skeleton loaders for charts
  - Show loading spinner while data loads
  - Disable buttons during submit

**Files to modify:**
- `src/index.css` — Add loading animations
- `src/App.tsx` — Add loading states to components

**Tests:**
- All text readable
- Hover states visible
- Loading states show
- Mobile layout doesn't break

---

### Week 1.4: User Testing Prep

#### 1.4.1 Testing Documentation
- [ ] Create test scenarios (5-7)
  - Scenario 1: "Find a high-priority student and review"
  - Scenario 2: "Model impact of interventions"
  - Scenario 3: "Create intervention case"
  - Scenario 4: "View case timeline"
  - Scenario 5: "Filter queue by program"
- [ ] Create testing guide
  - What to look for
  - Questions to ask testers
  - What to measure (time per task, satisfaction)
- [ ] Create feedback form
  - Is the queue prioritization clear?
  - Is the what-if simulator useful?
  - Would you create cases this way?
  - What's missing?

**Deliverables:**
- `TESTING_GUIDE.md` — Test scenarios + questions
- `FEEDBACK_FORM.md` — Post-test questionnaire
- `TEST_DATA.json` — Realistic mock students for testing

**Tests:**
- Testers can complete all scenarios
- Testers understand the what-if simulator
- Testers can create cases
- Feedback collected in structured format

---

### Week 1.5: Fix & Polish

- [ ] Bug fixes from testing
- [ ] Performance optimization
  - Optimize chart rendering
  - Lazy load heavy components
  - Reduce bundle size
- [ ] Accessibility pass
  - Add ARIA labels
  - Test with screen reader
  - Keyboard-only navigation
- [ ] Documentation updates
  - Update README with new features
  - Update user flow docs
  - Create feature list for stakeholders

---

## 📦 Phase 2: Backend Foundation (3 weeks)

**Goal:** Build API layer to replace mock data  
**Owner:** Backend (Python/FastAPI)  
**Depends on:** Phase 1 complete (stable UI)

### Week 2.1: Project Setup & Schema

#### 2.1.1 FastAPI Project Structure
```
backend/
├── main.py              # FastAPI app
├── requirements.txt     # Dependencies
├── .env.example         # Config template
├── config.py            # Settings
├── models/              # SQLAlchemy models
│   ├── student.py
│   ├── case.py
│   ├── audit_log.py
│   └── user.py
├── schemas/             # Pydantic schemas (request/response)
│   ├── student.py
│   ├── case.py
│   └── user.py
├── api/                 # API routes
│   ├── students.py      # /api/students/*
│   ├── cases.py         # /api/cases/*
│   ├── auth.py          # /api/auth/*
│   └── health.py        # /api/health
├── db/                  # Database
│   ├── database.py      # Connection + session
│   ├── base.py          # Base model
│   └── migrations/      # Alembic migrations
├── services/            # Business logic
│   ├── student_service.py
│   ├── case_service.py
│   └── auth_service.py
├── middleware/          # Auth, logging, CORS
├── tests/               # pytest suite
└── docker/              # Docker setup
```

**Files to create:**
- `backend/main.py` — FastAPI app setup
- `backend/config.py` — Environment config
- `backend/models/student.py` — Student model
- `backend/models/case.py` — Case model
- `backend/models/audit_log.py` — Audit log model
- `backend/models/user.py` — User/advisor model
- `backend/requirements.txt` — Dependencies (FastAPI, SQLAlchemy, Alembic, psycopg2, etc.)

**Tests:**
- FastAPI app starts
- Models are defined
- Database connection works

---

#### 2.1.2 PostgreSQL Schema

**Tables:**

1. **users** (advisors, heads, admins)
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     name VARCHAR(255) NOT NULL,
     role ENUM('advisor', 'head', 'analyst', 'ethics', 'admin') NOT NULL,
     department VARCHAR(255),  -- scoping
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **students**
   ```sql
   CREATE TABLE students (
     id UUID PRIMARY KEY,
     student_id VARCHAR(20) UNIQUE NOT NULL,  -- #4F91A20C
     name VARCHAR(255) NOT NULL,
     program VARCHAR(255) NOT NULL,           -- IS, SE, Business, etc.
     year INT NOT NULL,                       -- 1-4
     cohort INT NOT NULL,                     -- 2026
     department VARCHAR(255) NOT NULL,        -- for row-level security
     
     -- Employment prediction
     employability_estimate DECIMAL(5,2),     -- 34.0
     confidence_interval_low DECIMAL(5,2),    -- 27.0
     confidence_interval_high DECIMAL(5,2),   -- 41.0
     prediction_as_of TIMESTAMP NOT NULL,     -- when was this predicted
     model_version VARCHAR(50),                -- v1.3
     
     -- Academic signals (snapshot)
     gpa_current DECIMAL(3,2),                 -- 2.6
     gpa_trend VARCHAR(50),                    -- 'declining', 'stable', 'improving'
     credit_completion_pct DECIMAL(5,2),       -- 78.0
     
     -- Career signals
     internship_status VARCHAR(50),            -- 'not_started', 'in_progress', 'completed'
     projects_completed INT,                   -- 2
     portfolio_status VARCHAR(50),             -- 'needs_improvement', 'adequate', 'strong'
     skills_verified INT,                      -- 6
     
     -- LMS engagement
     lms_engagement_pct INT,                   -- 18 (percentile)
     lms_sessions_last_week INT,               -- 1.2
     
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **cases** (interventions)
   ```sql
   CREATE TABLE cases (
     id UUID PRIMARY KEY,
     case_number VARCHAR(20) UNIQUE NOT NULL, -- CASE-001
     student_id UUID NOT NULL REFERENCES students(id),
     advisor_id UUID NOT NULL REFERENCES users(id),
     intervention_type VARCHAR(100) NOT NULL, -- 'internship', 'portfolio', 'mentorship', 'academic_recovery'
     priority VARCHAR(50) NOT NULL,           -- 'high', 'medium', 'low'
     status VARCHAR(50) NOT NULL,             -- 'new', 'in_progress', 'follow_up', 'resolved'
     description TEXT,                        -- User notes
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     resolved_at TIMESTAMP,
     next_followup_date DATE
   );
   ```

4. **case_events** (timeline)
   ```sql
   CREATE TABLE case_events (
     id UUID PRIMARY KEY,
     case_id UUID NOT NULL REFERENCES cases(id),
     event_type VARCHAR(100) NOT NULL,        -- 'created', 'status_changed', 'note_added', 'completed'
     description TEXT,
     advisor_id UUID NOT NULL REFERENCES users(id),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **audit_log** (compliance)
   ```sql
   CREATE TABLE audit_log (
     id UUID PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES users(id),
     action VARCHAR(255) NOT NULL,            -- 'viewed_student', 'created_case', 'logged_out'
     resource_type VARCHAR(100),              -- 'student', 'case'
     resource_id UUID,
     resource_name VARCHAR(255),
     ip_address VARCHAR(45),
     created_at TIMESTAMP DEFAULT NOW(),
     CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

6. **row_level_security_policies** (department scoping)
   - After Postgres row policies are in place
   - Advisors can only see students in their department
   - Not enforced in Phase 2 (will be in Phase 4)

**Tests:**
- Schema creates without errors
- Foreign keys work
- Indexes exist on frequently-queried columns

---

### Week 2.2: API Endpoints (Students & Cases)

#### 2.2.1 Student Endpoints

```python
# GET /api/students
# Query params: ?skip=0&limit=50&program=IS&priority=HIGH
# Returns: List of students with pagination
# Response:
{
  "data": [
    {
      "id": "uuid",
      "student_id": "#4F91A20C",
      "name": "Alex M.",
      "program": "Information Systems",
      "year": 3,
      "employability_estimate": 34.0,
      "priority": "HIGH",
      "last_reviewed": "2026-09-05",
      "has_active_case": true
    }
  ],
  "total": 180,
  "skip": 0,
  "limit": 50
}

# GET /api/students/{student_id}
# Returns: Full student profile with all signals
{
  "id": "uuid",
  "student_id": "#4F91A20C",
  "name": "Alex M.",
  "program": "Information Systems",
  "year": 3,
  "cohort": 2026,
  "employability_estimate": 34.0,
  "confidence_interval": {"low": 27.0, "high": 41.0},
  "prediction_as_of": "2026-09-04T10:30:00Z",
  "model_version": "v1.3",
  "academic": {
    "gpa_current": 2.6,
    "gpa_history": [3.4, 3.2, 3.1, 2.8, 2.6],
    "gpa_trend": "declining",
    "credit_completion_pct": 78.0
  },
  "career": {
    "internship_status": "not_completed",
    "projects_completed": 2,
    "portfolio_status": "needs_improvement",
    "skills_verified": 6
  },
  "engagement": {
    "lms_engagement_pct": 18,
    "lms_sessions_last_week": 1.2
  },
  "risk_drivers": [
    {"factor": "No internship", "impact": -0.19, "category": "high"},
    {"factor": "Falling GPA", "impact": -0.11, "category": "high"},
    ...
  ],
  "recommendations": [
    {"action": "Internship Placement Support", "priority": "PRIMARY", ...},
    ...
  ]
}

# GET /api/students/queue
# Special endpoint for the queue view
# Returns: Optimized for queue display (less data)
{
  "data": [
    {
      "id": "uuid",
      "student_id": "#4F91A20C",
      "name": "Alex M.",
      "program": "Information Systems",
      "year": 3,
      "score": 34,
      "priority": "HIGH",
      "main_signal": "No internship",
      "last_reviewed": "2026-09-05T14:30:00Z"
    }
  ],
  "total": 180
}
```

**Files to create:**
- `backend/api/students.py` — Student routes
- `backend/services/student_service.py` — Query logic
- `backend/schemas/student.py` — Request/response models

**Tests:**
- GET /api/students returns list
- GET /api/students/{id} returns full profile
- Pagination works
- Filters work (program, priority, etc.)

---

#### 2.2.2 Case Endpoints

```python
# GET /api/cases
# Query params: ?student_id=uuid&status=in_progress&skip=0&limit=50
# Returns: List of cases
{
  "data": [
    {
      "id": "uuid",
      "case_number": "CASE-001",
      "student_id": "uuid",
      "student_name": "Alex M.",
      "intervention_type": "internship",
      "priority": "high",
      "status": "in_progress",
      "advisor_name": "Sarah M.",
      "created_at": "2026-09-04T10:30:00Z",
      "next_followup_date": "2026-09-15"
    }
  ],
  "total": 214
}

# GET /api/cases/{case_id}
# Returns: Full case with timeline
{
  "id": "uuid",
  "case_number": "CASE-001",
  "student_id": "uuid",
  "student_name": "Alex M.",
  "advisor_id": "uuid",
  "advisor_name": "Sarah M.",
  "intervention_type": "internship",
  "priority": "high",
  "status": "in_progress",
  "description": "Connect to employer network...",
  "created_at": "2026-09-04T10:30:00Z",
  "updated_at": "2026-09-10T15:45:00Z",
  "events": [
    {
      "id": "uuid",
      "event_type": "created",
      "description": "Case opened by advisor",
      "advisor_name": "Sarah M.",
      "created_at": "2026-09-04T10:30:00Z"
    },
    {
      "id": "uuid",
      "event_type": "status_changed",
      "description": "Status changed from new to in_progress",
      "created_at": "2026-09-05T14:00:00Z"
    }
  ]
}

# POST /api/cases
# Create new case
# Body:
{
  "student_id": "uuid",
  "intervention_type": "internship",
  "priority": "high",
  "description": "Connect to employer network..."
}
# Returns: Created case (201 Created)

# PATCH /api/cases/{case_id}
# Update case (status, notes, etc.)
# Body:
{
  "status": "follow_up",
  "description": "Updated notes..."
}
# Returns: Updated case

# POST /api/cases/{case_id}/events
# Add event to case timeline
# Body:
{
  "event_type": "note_added",
  "description": "Follow-up meeting scheduled for Sept 15"
}
# Returns: Created event
```

**Files to create:**
- `backend/api/cases.py` — Case routes
- `backend/services/case_service.py` — Case logic
- `backend/schemas/case.py` — Request/response models

**Tests:**
- GET /api/cases returns list
- GET /api/cases/{id} returns full case with timeline
- POST /api/cases creates case
- PATCH /api/cases/{id} updates case
- POST /api/cases/{id}/events adds event

---

### Week 2.3: Authentication & Audit Logging

#### 2.3.1 Authentication

```python
# POST /api/auth/login
# Body:
{
  "email": "advisor@university.ac.za",
  "password": "password"
}
# Returns (200 OK):
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "advisor@university.ac.za",
    "name": "Sarah M.",
    "role": "advisor",
    "department": "Information Systems"
  }
}

# POST /api/auth/logout
# Returns (200 OK):
{
  "message": "Logged out successfully"
}

# GET /api/auth/me
# Returns current user
{
  "id": "uuid",
  "email": "advisor@university.ac.za",
  "name": "Sarah M.",
  "role": "advisor",
  "department": "Information Systems"
}
```

**Implementation:**
- JWT tokens (access + refresh)
- Password hashing (bcrypt)
- Token validation middleware
- Logout clears token

**Files to create:**
- `backend/api/auth.py` — Auth routes
- `backend/services/auth_service.py` — JWT logic
- `backend/middleware/auth.py` — Token validation
- `backend/config.py` — JWT settings (secret, expiry)

**Tests:**
- Login with valid credentials
- Login with invalid credentials
- Access protected endpoint with token
- Access protected endpoint without token (401)
- Token refresh works

---

#### 2.3.2 Audit Logging Middleware

```python
# Every request logs:
{
  "user_id": "uuid",
  "action": "viewed_student",      # or "created_case", "updated_case", etc.
  "resource_type": "student",      # or "case"
  "resource_id": "uuid",
  "resource_name": "#4F91A20C",    # student ID or case number
  "ip_address": "192.168.1.100",
  "timestamp": "2026-09-05T14:30:00Z"
}
```

**Implementation:**
- Middleware to log all requests
- Extract user, action, resource info
- Store in audit_log table
- Exclude sensitive data (passwords, tokens)

**Files to create:**
- `backend/middleware/audit.py` — Audit logging middleware
- Add to main.py

**Tests:**
- Student view logged
- Case creation logged
- Login/logout logged
- Audit log queryable

---

### Week 2.4: Testing & Documentation

#### 2.4.1 Unit Tests
- [ ] Student service tests (fetch, filter, search)
- [ ] Case service tests (create, update, event add)
- [ ] Auth service tests (login, token validation)
- [ ] Audit logging tests (events logged correctly)

**Files to create:**
- `backend/tests/test_students.py`
- `backend/tests/test_cases.py`
- `backend/tests/test_auth.py`
- `backend/tests/test_audit.py`

**Command:**
```bash
pytest backend/tests/
```

---

#### 2.4.2 API Documentation
- [ ] OpenAPI/Swagger docs at `/docs`
- [ ] API reference in README
- [ ] Example curl commands for each endpoint
- [ ] Error response codes documented

**Files to create:**
- `backend/README.md` — Backend setup & API docs
- `BACKEND_API.md` — Full API reference

---

### Week 2.5: Docker & Deployment Prep

#### 2.5.1 Docker Setup
```dockerfile
# Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Files to create:**
- `backend/Dockerfile`
- `backend/.dockerignore`
- `docker-compose.yml` — Postgres + FastAPI

**Commands:**
```bash
docker-compose up -d
# Check: http://localhost:8000/docs
```

---

## 🔗 Phase 3: Integration & Testing (2 weeks)

**Goal:** Connect frontend to backend API  
**Owner:** Full-stack  
**Depends on:** Phase 1 & 2 complete

### Week 3.1: Frontend API Integration

#### 3.1.1 API Client Setup
```typescript
// src/api/client.ts
const API_BASE = "http://localhost:8000/api";

export const api = {
  students: {
    getAll: (filters) => fetch(`${API_BASE}/students?...`),
    getOne: (id) => fetch(`${API_BASE}/students/${id}`),
    getQueue: (filters) => fetch(`${API_BASE}/students/queue?...`),
  },
  cases: {
    getAll: (filters) => fetch(`${API_BASE}/cases?...`),
    getOne: (id) => fetch(`${API_BASE}/cases/${id}`),
    create: (data) => fetch(`${API_BASE}/cases`, { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => fetch(`${API_BASE}/cases/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },
  auth: {
    login: (email, password) => fetch(`${API_BASE}/auth/login`, ...),
    logout: () => fetch(`${API_BASE}/auth/logout`, ...),
    me: () => fetch(`${API_BASE}/auth/me`, ...),
  }
};
```

**Files to create:**
- `src/api/client.ts` — API client
- `src/api/types.ts` — TypeScript types for API responses
- `src/hooks/useStudents.ts` — React hook for students
- `src/hooks/useCases.ts` — React hook for cases
- `src/hooks/useAuth.ts` — React hook for auth

**Implementation:**
- Replace mock data fetch with API calls
- Add loading states
- Add error handling
- Add retry logic

---

#### 3.1.2 Replace Mock Data
- [ ] Dashboard → uses real students from API
- [ ] Queue → uses real students API
- [ ] Profile → loads from API on route
- [ ] Cases → uses real cases API
- [ ] Search → API-based search

**Files to modify:**
- `src/App.tsx` — Replace QUEUE_DATA, CASES, etc. with API calls
- Add loading spinner while data loads
- Add error boundary for API failures

---

#### 3.1.3 Authentication Flow
- [ ] Login form → calls `/api/auth/login`
- [ ] Store JWT token in localStorage
- [ ] Send token with every request (Authorization header)
- [ ] Logout button → calls `/api/auth/logout`
- [ ] Redirect to login if 401

**Files to modify:**
- `src/App.tsx` — Update login flow
- Add AuthContext for token management
- Add request interceptor to add token to headers

---

### Week 3.2: End-to-End Testing

#### 3.2.1 User Workflow Testing
- [ ] Test complete user journey
  1. Login → Dashboard
  2. Search for student
  3. View profile
  4. Create case
  5. View case in Cases page
  6. Add note to case
  7. Change case status
  8. Logout

**Test environment:**
- Backend running locally (docker-compose up)
- Frontend running locally (npm run dev)
- Database populated with test data

**Checklist:**
- [ ] All API calls succeed (200/201)
- [ ] Data displays correctly
- [ ] No console errors
- [ ] Performance acceptable (< 2s per page)
- [ ] Error messages clear if API fails

---

#### 3.2.2 Performance Testing
- [ ] Queue loads with 50+ students (< 1s)
- [ ] Search returns results (< 500ms)
- [ ] Student profile loads (< 1s)
- [ ] Create case response (< 500ms)

**Tools:**
- Browser DevTools Network tab
- Chrome Lighthouse
- Artillery (load testing)

---

### Week 3.3: Bug Fixes & Polish

- [ ] Fix any integration bugs
- [ ] Improve error messages
- [ ] Add loading skeletons
- [ ] Optimize API queries (pagination, filtering)
- [ ] Test on real institutional network (if available)

---

## 🔐 Phase 4: Hardening (2 weeks)

**Goal:** Make system production-ready  
**Owner:** Backend + Security  
**Depends on:** Phase 3 complete

### Week 4.1: Security & Row-Level Security

#### 4.1.1 Postgres Row-Level Security
```sql
-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Advisors can see students in their department
CREATE POLICY advisor_dept_policy ON students
  FOR SELECT
  USING (department = current_setting('app.current_department'));

-- Advisors can only see cases for their students
CREATE POLICY advisor_cases_policy ON cases
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students 
      WHERE department = current_setting('app.current_department')
    )
  );
```

**Implementation:**
- Set `app.current_department` on session start
- Test that advisors can't see other departments
- Audit that row policies work

---

#### 4.1.2 API Authorization Checks
```python
# Middleware to enforce role-based access
@app.middleware("http")
async def check_permissions(request, call_next):
    # Extract user role from JWT
    user = get_current_user(request)
    
    # Check if user has access to resource
    if request.url.path.startswith("/api/students"):
        if user.role != "advisor" and user.role != "analyst":
            return JSONResponse(status_code=403, content={"detail": "Forbidden"})
    
    return await call_next(request)
```

**Permissions table:**
- Advisor: view queue, create cases, view cases
- Head: view analytics, program reports
- Analyst: view all students (pseudonymous), train models
- Ethics Officer: view fairness dashboard, approve models
- Admin: user management only (no student data)

---

### Week 4.2: Monitoring & Logging

#### 4.2.1 Structured Logging
```python
import logging
import json

# Log all API requests
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    log_data = {
        "method": request.method,
        "path": request.url.path,
        "user_id": get_current_user_id(request),
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    response = await call_next(request)
    log_data["status_code"] = response.status_code
    
    logger.info(json.dumps(log_data))
    return response
```

**Logging setup:**
- Application logs → file (backend/logs/app.log)
- Error logs → separate file (backend/logs/errors.log)
- Structured JSON format (for parsing)
- Rotate logs daily

---

#### 4.2.2 Health Checks
```python
# GET /api/health
# Returns:
{
  "status": "healthy",
  "database": "connected",
  "checks": {
    "database": "ok",
    "cache": "ok"
  }
}
```

**Monitoring:**
- Health check endpoint
- Database connection check
- Response time monitoring
- Error rate monitoring

---

### Week 4.3: Data Validation & Error Handling

#### 4.3.1 Input Validation
```python
# Use Pydantic for all inputs
class CreateCaseRequest(BaseModel):
    student_id: UUID
    intervention_type: str  # must be in ['internship', 'portfolio', 'mentorship', 'academic_recovery']
    priority: str  # must be in ['high', 'medium', 'low']
    description: str  # min 10 chars, max 500 chars
    
    @validator('description')
    def description_valid(cls, v):
        if len(v) < 10:
            raise ValueError('Description must be at least 10 characters')
        return v
```

**Validation:**
- Type checking (Pydantic)
- Business logic validation (services)
- Database constraint checking
- Return clear error messages (400 Bad Request)

---

#### 4.3.2 Error Handling
```python
# All errors return structured JSON
{
  "error": "ValidationError",
  "message": "Description must be at least 10 characters",
  "status": 400,
  "timestamp": "2026-09-10T14:30:00Z"
}
```

**Error codes:**
- 400 Bad Request — validation error
- 401 Unauthorized — missing/invalid token
- 403 Forbidden — insufficient permissions
- 404 Not Found — resource doesn't exist
- 500 Internal Server Error — server error

---

### Week 4.4: Database Backup & Recovery

#### 4.4.1 Backup Strategy
```bash
# Daily backup at 2am
0 2 * * * pg_dump geps_db | gzip > /backups/geps_$(date +\%Y\%m\%d).sql.gz

# Keep 30 days of backups
find /backups -name "geps_*.sql.gz" -mtime +30 -delete
```

**Backup testing:**
- Weekly restore test to verify backups work
- Document recovery procedure
- Store backups off-site (AWS S3, etc.)

---

### Week 4.5: Load Testing & Optimization

#### 4.5.1 Load Testing
```python
# Use Artillery to simulate load
# Load 100 concurrent users, 50 requests/sec
artillery quick -c 100 -d 60 -r 50 http://localhost:8000/api/students
```

**Targets:**
- Queue endpoint handles 100 concurrent users
- Dashboard metrics load in < 2s under load
- No database connection pool exhaustion
- No memory leaks

---

#### 4.5.2 Database Optimization
- [ ] Add indexes on frequently-queried columns
  - `students.department`
  - `students.year`
  - `students.program`
  - `cases.student_id`
  - `cases.status`
- [ ] Query optimization
  - Avoid N+1 queries
  - Use EXPLAIN ANALYZE
  - Add query caching where appropriate

---

## 🚀 Phase 5: Production Launch (1 week)

**Goal:** Deploy to production  
**Owner:** DevOps + Backend  
**Depends on:** Phase 4 complete

### Week 5.1: Deployment Preparation

#### 5.1.1 Production Environment Setup
- [ ] Cloud infrastructure (AWS/Azure/GCP)
  - EC2/VM for backend
  - RDS/Cloud SQL for database
  - S3 for backups
  - CloudWatch for monitoring
- [ ] SSL/TLS certificates (Let's Encrypt)
- [ ] DNS setup
- [ ] Environment variables (.env.production)

---

#### 5.1.2 Deployment Pipeline
```yaml
# GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm run test
      - name: Build frontend
        run: npm run build
      - name: Deploy to production
        run: ./deploy.sh
```

**Deployment steps:**
1. Run tests
2. Build frontend
3. Build Docker image
4. Push to registry
5. Deploy to production
6. Run health checks
7. Rollback on failure

---

#### 5.1.3 Data Migration
- [ ] Migrate mock data to production database
- [ ] Verify data integrity
- [ ] Test all API endpoints

---

### Week 5.2: Launch & Monitoring

#### 5.2.1 Go-Live Checklist
- [ ] Frontend deployed at production URL
- [ ] Backend API responding
- [ ] Database backups configured
- [ ] Monitoring/logging configured
- [ ] Support team trained
- [ ] Rollback plan documented

#### 5.2.2 Post-Launch Monitoring
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor response times (target: < 1s)
- [ ] Monitor database connections
- [ ] Monitor disk space
- [ ] Daily review of audit logs

---

## 📊 Timeline Summary

```
Phase 1: Prototype Polish      (2 weeks)  Sept 16 - Sept 29
Phase 2: Backend Foundation    (3 weeks)  Sept 30 - Oct 20
Phase 3: Integration & Testing (2 weeks)  Oct 21 - Nov 3
Phase 4: Hardening             (2 weeks)  Nov 4 - Nov 17
Phase 5: Production Launch     (1 week)   Nov 18 - Nov 24
────────────────────────────────────────────────────────
Total:                         (10 weeks) Sept 16 - Nov 24
```

**User testing happens at end of Phase 1 (late Sept)**  
**Production ready: Late November**

---

## 🎯 Key Dependencies & Risks

### Dependencies
- Phase 1 → Phase 2 (need stable UI)
- Phase 2 → Phase 3 (need working API)
- Phase 3 → Phase 4 (need integration tests)
- Phase 4 → Phase 5 (need security sign-off)

### Risks & Mitigation
| Risk | Mitigation |
|------|-----------|
| API delays | Start backend in parallel with Phase 1 |
| Security issues found late | Security review in Phase 2, not Phase 4 |
| Performance issues at scale | Load testing in Phase 4, not Phase 5 |
| Data migration problems | Practice migration in Phase 5 before go-live |
| Advisor adoption low | User testing in Phase 1, iterate based on feedback |

---

## 🏁 Success Criteria

**Phase 1 complete when:**
- [ ] Case modal works end-to-end
- [ ] 50+ mock students in queue
- [ ] 5+ advisors test successfully
- [ ] All feedback documented

**Phase 2 complete when:**
- [ ] All API endpoints tested
- [ ] Authentication works
- [ ] Audit logging works
- [ ] Docker image builds

**Phase 3 complete when:**
- [ ] Frontend uses real API
- [ ] All user workflows tested
- [ ] Performance acceptable
- [ ] No data loss on error

**Phase 4 complete when:**
- [ ] Row-level security enforced
- [ ] All tests passing
- [ ] Load tests pass (100 users)
- [ ] Security review passed

**Phase 5 complete when:**
- [ ] Deployed to production
- [ ] Users can log in
- [ ] All endpoints responding
- [ ] Backups automated

---

**Ready to start Phase 1 on this plan?** 🚀

Which part would you like to tackle first?

