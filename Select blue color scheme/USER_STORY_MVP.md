# MVP User Story: Career Advisor Daily Workflow

## Story Title
**As a Career Advisor, I can work through my daily student queue and log interventions, so that I prioritize support for students at risk of unemployment.**

---

## User Persona
**Sarah M.** — Career Advisor, Department of Information Systems  
Works with ~1,240 students across multiple cohorts. Meets with students in scheduled 15-30 min blocks. Logs all actions in a case management system for audit and follow-up. Needs to know who to call/meet next and why.

---

## Acceptance Criteria

### 1. Dashboard ("Who needs attention today?")
✅ **View my queue at a glance**
- Metric: High-priority student count (180)
- Metric: Active interventions in progress (214)
- List: Top 3-5 students requiring immediate attention, sorted by risk score
- Action: "View all → student queue"

✅ **See intervention progress**
- Track active vs. completed interventions this month
- Trend line showing intervention uptake over time

✅ **Understand cohort health**
- Average employability trend line (last 5 semesters)
- Risk distribution pie (high/medium/low)

---

### 2. Student Queue ("My prioritized list")
✅ **See all students needing attention**
- Filterable table: name, program, year, estimate %, priority level, main signal
- Sort: By priority → by risk score → by last review date
- Quick filters: Show HIGH only / MED only / ALL
- Search: By name, ID, or program

✅ **Quick action from queue**
- One-click "Review" button → launches Student Profile
- Color-coded row: HIGH (ember bg), MED (amber), LOW (teal)

---

### 3. Student Profile ("Why is Alex at risk?")
✅ **See the big picture at a glance**
- Large: Employability estimate %, confidence interval, priority level
- 4-box: Current GPA, internship status, last review, portfolio status

✅ **Understand what's driving the risk**
- Academic trajectory (GPA over time)
- LMS engagement (sessions/week trend)
- 6-signal career readiness grid (internship, projects, portfolio, skills, co-curricular, credits)
- Major risk drivers (SHAP explainability bar chart)

✅ **See actionable recommendations**
- Top 3 interventions ranked by impact
- Primary vs. secondary actions
- Reason for each recommendation

✅ **Launch what-if scenario**
- Quick button: "Model the impact of interventions"
- See how estimate changes if student completes internship/portfolio/mentorship

✅ **Take action: Create an intervention case**
- Button: "Create intervention case"
- Logs: what advisor decided, which intervention, next steps
- Captures: timestamp, advisor name, student ID, action taken

---

### 4. What-If Simulator ("What could change?")
✅ **Model intervention impact**
- Show current estimate (34%)
- Toggle interventions (internship, portfolio, mentorship, academic recovery)
- See estimated probability shift for each
- Caveat: "Estimated scenarios — not causal guarantees"

---

### 5. Case Board ("What did we do?")
✅ **View active intervention cases**
- List: Student, intervention, date opened, status (Active/Follow-up/Closed)
- Quick actions: Edit case notes, Mark as follow-up, Close case

✅ **Log contact/action**
- Form: Date, student, type of contact (meeting, call, email), notes
- Auto-capture: Advisor name, timestamp
- On save: Logs to case audit trail

---

## Non-Functional Requirements

**Role-based:** Career Advisor views only students in their department/program scope  
**Speed:** Dashboard loads in < 2s; student profile in < 1.5s  
**Audit:** Every action (view, click, case created) is logged with timestamp + advisor ID  
**Fairness gate:** Advisor cannot change or override a prediction; they can only acknowledge and act  
**Privacy:** No demographic attributes visible; students identified by ID + program only  

---

## Success Metrics

1. **Adoption:** > 80% of advisors use queue feature daily within first month
2. **Throughput:** Average time per student profile < 3 min (quick scan → decide → act or defer)
3. **Logging:** 100% of intervention cases have logged action within 24 hrs
4. **Trust:** Advisor feedback: "I understand why this student is flagged" (> 90% agreement)

---

## Build Order (MVP)

1. **Dashboard** — Core metrics + student list (THIS SPRINT)
2. **Student Queue** — Filterable table + quick review (THIS SPRINT)
3. **Student Profile** — Signals + drivers + recommendations (THIS SPRINT)
4. **What-If Simulator** — Basic scenario modeling (NEXT SPRINT)
5. **Case Board** — Simple case logging (NEXT SPRINT)
6. **Fairness monitoring** — Audit log + model performance (HARDENING)
