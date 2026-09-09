# Career Advisor Complete Experience Audit

**Goal:** Map every page, every interaction, every missing piece for the Career Advisor user flow.

---

## 📊 Dashboard (Overview)

### What We HAVE ✅
- Metrics cards (Students monitored, High priority, Medium priority, Active interventions)
- Risk distribution pie chart
- Employability trend line chart
- Top 3-5 students list with quick review button
- Intervention progress chart (stacked bar by month)
- Recent activity log (3 items)
- Clean dark theme with proper icons

### What We DON'T HAVE ❌
- **Weekly summary** - "This week: 3 new high-risk, 5 completed interventions"
- **Queue status** - "18 students in my queue, 5 need action this week"
- **Next steps prompt** - "3 students need follow-up today"
- **Cohort health snapshot** - "Your cohort: 68% employed track (vs. 72% target)"
- **Quick actions** - Buttons to jump to: "Review queue", "View cases", "Start intervention"
- **Performance badge** - "You're ahead of target interventions this month"
- **Notification panel** - Real alerts/reminders

### What Needs IMPROVEMENT ⚠️
- No advisor-specific context (shows "Sarah M." but generic data)
- Metrics are static (not tied to real advisor's queue)
- No "My Queue" count highlighted
- "View all →" link on students list but no context

### Integration Gaps 🔗
- Dashboard → Queue not obvious
- Dashboard → Cases not visible
- No call-to-action to start work

---

## 📋 Student Queue

### What We HAVE ✅
- 7 mock students with realistic data
- Filter by priority (HIGH/MED/LOW)
- Search by name, ID, program
- Sortable columns (ID, name, program, year, score, priority, signal, review date)
- "Review" button launches profile
- Risk score color coding (red/amber/green)
- Last review date shown
- Clean table design

### What We DON'T HAVE ❌
- **Sorting controls** - Click column header to sort
- **Filter persistence** - Remember last used filters
- **Saved views** - "My favorites", "High priority only", etc.
- **Bulk actions** - Select multiple, assign to follow-up
- **Export** - Download queue as CSV
- **Tags/labels** - "Follow-up needed", "Internship matched", etc.
- **Advisor assignments** - "Assigned to: Sarah M."
- **Status indicators** - Visual badge showing "Has active case", "Completed intervention"
- **Infinite scroll or pagination** - Currently shows all 7
- **Keyboard shortcuts** - Arrow keys to navigate, Enter to review

### What Needs IMPROVEMENT ⚠️
- Only 7 mock students (need 50+)
- No empty state message
- Hover effects are subtle (could be more obvious)
- No loading state
- No "no results" state for filters

### Integration Gaps 🔗
- Queue → Profile works
- Queue → Cases doesn't exist (should show if student has active case)
- No way to jump to student's case from queue

---

## 👤 Student Profile

### What We HAVE ✅
- Student header (avatar, name, program, year, ID)
- Employability estimate (34% large number)
- Confidence interval shown (27% – 41%)
- Current GPA and internship status
- Academic trajectory chart (5 semesters)
- LMS engagement chart (6 weeks)
- Career readiness grid (6 signals: internship, projects, portfolio, skills, co-curricular, credits)
- Major risk drivers (5 factors with impact %)
- Recommended interventions (3 with primary/secondary labels)
- "Create intervention case" button with success feedback
- "Why prioritised?" link to explainability
- "Model impact?" link to what-if simulator
- Professional icons throughout

### What We DON'T HAVE ❌
- **Student history** - "Previous interventions: 2 completed, 1 ongoing"
- **Contact history** - "Last contacted: 3 days ago (email)"
- **Case timeline** - Link to existing case if one exists
- **Notes section** - Private advisor notes
- **Recommended next action** - "Schedule meeting this week"
- **Risk trend** - Is this student getting better or worse?
- **Peer comparison** - "Similar to 12 other students in your queue"
- **Intervention success rate** - "Internship placement: 68% success rate for similar profile"
- **Student action** - Has student responded to intervention offers?
- **Family/context** - (optional) Any notes from registration
- **Alert banner** - If student has other at-risk signals

### What Needs IMPROVEMENT ⚠️
- No back button to queue
- Case creation doesn't actually add to Cases list
- No indication if case already exists for this student
- No way to edit case after creation
- Limited to one student (hardcoded Alex M.)

### Integration Gaps 🔗
- Profile → create case → doesn't appear in Cases view
- Profile → explainability works
- Profile → what-if works
- No link from profile back to queue

---

## 🔍 Explainability Panel

### What We HAVE ✅
- SHAP bar chart showing factor contributions (6 factors)
- Split between negative (red) and positive (green) impacts
- Plain language explanation (paragraph format)
- Positive signals section (2 achievements)
- Recommended next step highlighted
- Professional design with icons

### What We DON'T HAVE ❌
- **Comparisons** - "How does Alex compare to peers?"
- **Threshold explanation** - Why 34% matters (e.g., "Below 45% means high risk")
- **Model uncertainty** - "Model confidence: 78%"
- **Feature interactions** - Do factors work together?
- **Alternative scenarios** - "If GPA was 3.0 instead of 2.6..."
- **Feature importance ranking** - Which matter most?
- **Data quality note** - "Last updated: Sept 4"

### What Needs IMPROVEMENT ⚠️
- No context on what each factor means
- SHAP values not explained for non-technical users
- No link back to profile

### Integration Gaps 🔗
- Explainability ← Profile works (back to profile button exists)
- Explainability → What-if doesn't exist (should link)

---

## 🎲 What-If Simulator

### What We HAVE ✅
- Current estimate (34%) prominent
- 4 toggleable interventions with impact %
- Real-time score calculation (up to 82%)
- Before/after bar chart comparison
- Progress bar showing improvement
- Student context shown (name, program)
- Caveat text ("estimated scenarios, not guaranteed")

### What We DON'T HAVE ❌
- **Combination analysis** - "Best combo: internship + portfolio = +32%"
- **Time to impact** - "Effect appears in 2-3 months"
- **Success probability** - "Internship program: 68% lead to employment"
- **Cost/effort** - "Time required: 4 hours/week for 8 weeks"
- **Competing interventions** - "Can't do both mentorship and portfolio simultaneously"
- **Student readiness** - "This student is ready for internship (meets prerequisites)"
- **Benchmarks** - "68% of similar students who did internship succeeded"

### What Needs IMPROVEMENT ⚠️
- No confirmation or "create case" button from simulator
- Scenarios don't persist
- No way to save a scenario
- Limited to 4 interventions

### Integration Gaps 🔗
- Simulator ← Profile works
- Simulator → Create Case doesn't exist (should have "Create case for this scenario" button)
- Simulator → Cases doesn't work

---

## 📁 Case Management

### What We HAVE ✅
- Status overview cards (Open, In Progress, Follow-up, Resolved)
- Case list table with: ID, student ID, issue, intervention, advisor, status, next followup
- Case timeline for one example (CASE-001)
- Timeline shows: date, event, completion status with icons
- 5 mock cases with realistic data

### What We DON'T HAVE ❌
- **Case creation from profile** - Doesn't actually add to this list
- **Edit case** - Modify notes, status, follow-up date
- **Close case** - Mark as resolved with outcome
- **Add notes** - Ongoing log of what happened
- **Assign follow-up** - Schedule next review
- **Link multiple students** - If two students in same cohort
- **Outcome tracking** - "Did internship work? Yes/No"
- **Filter by status** - Show only active cases
- **Filter by date** - Cases from this week, this month
- **Search by student** - Find case by student name/ID
- **Bulk export** - Get all cases for report

### What Needs IMPROVEMENT ⚠️
- Only 1 full timeline shown (others just table rows)
- No way to open a case and edit it
- Status badges exist but no way to change
- Cases don't reflect cases created in Profile flow

### Integration Gaps 🔗
- Cases ← Profile (create case) doesn't work
- Cases → Profile doesn't exist (should be able to jump to student)
- Cases → Queue doesn't exist

---

## 🚀 MISSING PAGES (Not Built Yet)

### 1. Intervention Catalogue ❌❌❌
**Purpose:** Browse and understand available interventions

**Would have:**
- List/grid of 15+ interventions
- Filter by type (academic, career, personal)
- Details: time required, success rate, prerequisites
- "Assign to student" button
- Cost/effort indicators
- Testimonials or success stories

**Why needed:** Advisor should know what's available before creating a case

---

### 2. Risk Explorer (Optional, can defer) ⚠️
**Purpose:** Understand patterns across cohort

**Would have:**
- Geographic heat map (by region/school)
- Demographic breakdown (gender, year, program)
- Risk distribution by program
- Trends over time
- Outlier detection

**Why needed:** Institutional insights, not critical for MVP

---

### 3. Contact Log / Case Notes ⚠️
**Purpose:** Record interactions with students

**Would have:**
- Date, type (call/email/meeting), duration
- Notes on what was discussed
- Outcome (student agreed/declined/pending)
- Linked to case
- Searchable

**Why needed:** For audit trail and continuity (might be in Cases)

---

## 🔗 INTEGRATION ISSUES

| Flow | Status | Gap |
|------|--------|-----|
| Dashboard → Queue | ✅ Works | Minor: Not obvious as CTA |
| Queue → Profile | ✅ Works | Good |
| Profile → Explainability | ✅ Works | Good |
| Profile → What-If | ✅ Works | Good |
| Profile → Create Case | ⚠️ Half-works | Case not added to Cases list |
| Case → Profile | ❌ Broken | No link back |
| Case → Edit | ❌ Broken | Can't open case to edit |
| Queue → Case | ❌ Broken | No indication if case exists |
| What-If → Create Case | ❌ Broken | No "Create case" button |
| Dashboard → Cases | ❌ Broken | No CTA visible |

---

## 🎯 MOCK DATA ISSUES

| Component | Count | Quality | Status |
|-----------|-------|---------|--------|
| Students | 7 | Good variety | ⚠️ Need 50+ for realistic testing |
| Cases | 5 | Realistic | ✅ Good |
| Interventions | 5 shown | Good | ❌ Need full catalogue (15+) |
| Programs | 5 | Realistic | ✅ Good |
| Cohort data | Aggregated | Static | ⚠️ Needs more realism |

---

## 📋 BUILD PRIORITY

### MUST HAVE (MVP)
1. Dashboard customization for Advisor
2. Fix case creation (Profile → Cases integration)
3. Edit/close case capability
4. Intervention Catalogue (browse + assign)
5. Expand mock students to 50+

### SHOULD HAVE (Week 2)
6. Contact log / notes in cases
7. Filter and search improvements
8. Saved views / favorites
9. Export queue to CSV
10. Bulk actions

### NICE TO HAVE (Week 3+)
11. Risk Explorer
12. Advanced analytics
13. Student outcome tracking
14. Performance badges
15. Notifications system

---

## ✅ COMPLETION CHECKLIST

### Core Flows
- [ ] Login → Dashboard (Advisor view)
- [ ] Dashboard → Queue → Profile → Create Case → Cases
- [ ] Profile → Why prioritised (Explainability)
- [ ] Profile → Model impact (What-If)
- [ ] Case → View details → Edit/Close
- [ ] Browse Intervention Catalogue

### Mock Data
- [ ] 50+ realistic students
- [ ] 20+ realistic cases
- [ ] 15+ interventions in catalogue

### Advisor Features
- [ ] Queue filters & search
- [ ] Risk scoring explanation
- [ ] Intervention impact modeling
- [ ] Case tracking
- [ ] Activity log

### Polish
- [ ] No broken integrations
- [ ] All CTAs visible and obvious
- [ ] All flows tested
- [ ] Mobile responsive
- [ ] Keyboard shortcuts

---

## 📊 SUMMARY

**BUILT & WORKING:** 6 pages (Dashboard, Queue, Profile, Explainability, What-If, Cases)  
**BUILT BUT BROKEN:** 2 integrations (case creation, editing)  
**MISSING:** 1 major page (Intervention Catalogue) + 1 optional (Risk Explorer)  
**MOCK DATA:** Need 7x more students, full intervention list

**Ready to build?** Start with:
1. Fix case creation integration
2. Customize Advisor Dashboard
3. Build Intervention Catalogue
4. Expand mock data
