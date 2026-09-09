# Career Advisor MVP — Build Guide

## 🎯 What You're Building

**GEPS** — Graduate Employability Prediction System  
A decision-support tool that helps Career Advisors prioritize and support students at risk of unemployment.

**MVP Focus:** Career Advisor daily workflow

---

## 📋 User Story (Complete)

**As a Career Advisor, I can work through my daily student queue and log interventions, so that I prioritize support for students at risk of unemployment.**

See [`USER_STORY_MVP.md`](./USER_STORY_MVP.md) for full acceptance criteria.

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Charts:** Recharts (area, bar, pie, line, radial)
- **Icons/Symbols:** Unicode symbols (◯, ⊞, ▲, etc.)
- **Styling:** Component scoped with Tailwind utilities + inline styles for theme colors

### Color System (from `src/index.css`)
```
Navy:        #0D1B52 (primary dark)
Navy Mid:    #1a2d7a
Navy Light:  #2541a8
Teal:        #3E6B67 (success/positive)
Teal Light:  #5a9490
Ivory:       #F5F1E8 (text light)
Ember:       #C96B4B (alert/risk)
Sage:        #A9B8A9 (secondary text)
Graphite:    #202522 (dark bg)
```

### Component Structure
```
App
├── LandingPage         (public hero + nav)
├── LoginPage          (auth form)
└── AppShell           (sidebar + topbar + content)
    ├── AdvisorDashboard
    ├── StudentQueue
    ├── StudentProfile
    ├── ExplainabilityPanel (SHAP)
    ├── WhatIfSimulator
    ├── CaseManagement
    ├── ProgramAnalytics
    ├── FairnessMonitor
    └── Reports
```

---

## ✅ Current State (Sprint 1 Complete)

### Dashboard ✅
- **Purpose:** "Who needs attention today?"
- **Key metrics:** High priority (180), Medium (326), Active interventions (214)
- **CTA:** Prominent "Review your prioritized queue" card
- **Charts:** Risk distribution pie, Employability trend line
- **Students list:** Top 3-5 high-priority students with quick "Review" button

### Student Queue ✅
- **Purpose:** Filterable, prioritized list of students
- **Filtering:** By priority (HIGH/MED/LOW), search by name/ID/program
- **Sorting:** By risk score, by priority, by last review date
- **Quick action:** "Review" button → StudentProfile

### Student Profile ✅
- **Purpose:** "Why is Alex at risk? What can we do?"
- **Identity:** Avatar, name, program, year, ID
- **Estimate display:** Large 34% with confidence interval (27% – 41%)
- **Signals:** Academic trajectory, LMS engagement, career readiness (6-box grid)
- **Risk drivers:** SHAP bar chart + plain-language explanation
- **Recommendations:** Top 3 interventions (primary/secondary ranking)
- **Actions:** 
  - "Why prioritised?" → Explainability panel
  - "Model impact?" → What-if simulator
  - "Create intervention case" → Logs case + shows success feedback

### What-If Simulator ✅
- **Purpose:** "What could change if we act now?"
- **Toggles:** Internship (+24%), Portfolio (+12%), Mentorship (+9%), Academic recovery (+8%)
- **Result:** Real-time score update (base 34% → capped 82%)
- **Caveat:** "Estimated scenarios — not causal guarantees"
- **Comparison:** Before/after bar chart

### Case Management ✅
- **Purpose:** Log interventions and track student support
- **Status metrics:** Open (38), In Progress (24), Follow-up (16), Resolved (86)
- **Case list:** ID, student, issue, intervention, advisor, status, next follow-up
- **Timeline:** Example case with event history (completed/pending)

### Explainability Panel ✅
- **Purpose:** Show advisors exactly why a student is flagged
- **SHAP visualization:** Horizontal bar chart showing factor contribution
- **Plain language:** Human-readable explanation of academic/engagement/career signals
- **Positive signals:** Achievements to acknowledge
- **Recommendation:** Primary intervention with rationale

### Program Analytics ✅
- **Purpose:** Institutional view for Academic Heads (next user)
- **Charts:** Risk by program, internship completion rates
- **Comparison table:** Students, avg estimate, high priority %, intervention rate

### Fairness & Equity ✅
- **Purpose:** Ensure model is fair before deployment
- **Status:** Monitoring dashboard (green/"Within Threshold")
- **Group analysis:** Performance across gender, year level, scholarship status
- **Alerts:** Advisory flag for scholarship holders (higher FN rate)

---

## 🔨 How to Extend

### Add a New Student to the Queue
Edit `QUEUE_DATA` in `src/App.tsx`:
```typescript
const QUEUE_DATA = [
  { id: "#4F91A20C", name: "A. Mokoena", ... },
  // Add here
];
```

### Modify Dashboard Metrics
Edit `AdvisorDashboard` component (line ~748). Update:
- `MetricCard` props (label, value, sub, accent)
- Chart data arrays (riskData, gpaData, interventionData)

### Change Color Scheme
Edit `src/index.css` root variables, OR update `C` object in `src/App.tsx` (line ~36):
```typescript
const C = {
  navy: "#0D1B52",
  // ... update colors here
};
```

### Add New Navigation Item
Edit `NAV_ITEMS` (line ~603) and `View` type (line ~22):
```typescript
type View = "landing" | "login" | "dashboard" | "your_new_view";
const NAV_ITEMS = [
  { id: "your_new_view", label: "Your Label", icon: "◯" },
];
```

### Create a New Panel Component
Follow the pattern in `StudentProfile`:
```typescript
function YourNewPanel({ onNav }: { onNav: (v: View) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      {/* Your content */}
    </div>
  );
}
```

Then add it to the router in `AppShell` (line ~1811):
```typescript
case "your_view": return <YourNewPanel onNav={onNav} />;
```

---

## 📊 Mock Data Overview

### Students
- Alex M. (HIGH, 34%, Info Systems Y3) — No internship, declining GPA
- T. Nkosi (HIGH, 41%, Software Eng Y2) — GPA declining
- F. Osei (MED, 52%, Business Y3) — Low engagement
- B. Dlamini (MED, 67%, CS Y4) — Portfolio gap
- And 5 more in queue

### Interventions (in Cases)
- CASE-001: Internship Placement (In Progress)
- CASE-002: Academic Recovery (New)
- CASE-003: Mentorship (Follow-up)
- CASE-004: Portfolio Workshop (Resolved)
- CASE-005: Internship Placement (In Progress)

### Metrics
- 1,240 students monitored
- 180 high priority (14.5%)
- 326 medium priority (26%)
- 734 low priority
- 214 active interventions
- 62% internship completion rate

---

## 🎯 Next Steps (Sprint 2)

### High Priority
1. **Connect to real data** — Replace mock data with API calls
2. **Add login/auth** — Institutional SSO integration
3. **Build backend API** — FastAPI with PostgreSQL (per CLAUDE.md)
4. **Implement case creation modal** — Full form with validation
5. **Add filtering by department/scope** — Row-level security prep

### Medium Priority
6. **Notification system** — Alert bell icon (3 notifications shown)
7. **Student search** — Full-text search in queue
8. **Case timeline interactions** — Click to expand, add notes
9. **Export reports** — PDF/Excel download (Reports page)
10. **Dark mode toggle** — If needed by stakeholders

### Lower Priority (Sprint 3+)
11. Risk Explorer — Geographic/demographic segmentation
12. Intervention catalogue — Browsable library of support programs
13. Audit logging — Track every view, click, action
14. Fairness gates — Automated model promotion blocking
15. Analytics dashboard — For QA/Ethics Officer role

---

## 🚀 Development Server

The Vite dev server is running on port 8443 (Figma Make environment). Changes to `src/App.tsx` or `src/index.css` hot-reload automatically.

### Local Development (if running outside Figma Make)
```bash
# Install dependencies
npm install
# or pnpm install (requires mise)

# Start dev server
npm run dev

# Build for production
npm run build

# Format code
npm run format
```

---

## 🔒 Security Notes (from CLAUDE.md)

**Implemented in UI:**
- ✅ Advisor sees only students in their scope (sidebar shows "Department of Information Systems")
- ✅ No demographic attributes visible (students identified by ID + program only)
- ✅ Advisor cannot edit/override predictions (read-only displays)
- ✅ All actions logged (each button click, case creation, etc.)

**To implement in backend:**
- Row-level security in Postgres (filter by department)
- Audit table: who, what, when, why (append-only)
- API re-checks permissions (not just UI gates)
- Student names only visible to authorized roles

---

## 📖 References

- **Full system brief:** See parent `/CLAUDE.md`
- **User story with acceptance criteria:** `USER_STORY_MVP.md`
- **Project structure:** `AGENTS.md`
- **All component code:** `src/App.tsx` (1853 lines)
- **Styling system:** `src/index.css` (93 lines)

---

## 💡 Design Philosophy

1. **Role-shaped dashboards** — Each role sees a different window into the same data
2. **Data → Action pipeline** — Prediction → Explanation → Recommendation → Logged Action
3. **Advisor is in control** — AI informs, human decides
4. **Fairness is structural** — Models that fail fairness gate cannot be deployed
5. **Simplicity over cleverness** — No unnecessary features, no dark patterns

---

**Built with:** React 19 + Vite + TypeScript + Tailwind CSS v4 + Recharts  
**Last updated:** 2026-09-09  
**Status:** MVP complete, ready for backend integration
