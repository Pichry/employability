# Career Advisor MVP — User Flow

## Primary User Journey: "Work my queue"

```
LOGIN
  ↓
DASHBOARD ("Good morning, Sarah")
  • See queue size: 18 students
  • See key metrics: 180 high priority, 214 active interventions
  • Risk distribution pie chart
  • Employability trend
  • Top 3-5 urgent students
  • CTA: "Review your prioritized queue"
  ↓
STUDENT QUEUE
  • Filter: By priority (HIGH/MED/LOW)
  • Search: By name, ID, program
  • Sort: By risk score (default)
  • See: All 7+ students needing attention
  • Action: Click "Review" on any student
  ↓
STUDENT PROFILE (e.g., "Alex M.")
  • Identity: Name, program, year, ID
  • BIG NUMBER: 34% employability estimate
  • SMALL METRICS: GPA (2.6), Internship (None)
  • Charts: Academic trajectory, LMS engagement
  • Signals grid: Internship, Projects, Portfolio, Skills, Co-curricular, Credits
  ↓ [OPTIONAL: Deep dives]
  ├─→ "Why prioritised?" → EXPLAINABILITY PANEL
  │    • SHAP bar chart (factors that drive risk)
  │    • Plain language explanation
  │    • Positive signals acknowledged
  │    • ← Back to profile
  │
  └─→ "Model impact?" → WHAT-IF SIMULATOR
      • Toggle: Internship (+24%), Portfolio (+12%), Mentorship (+9%), Academic recovery (+8%)
      • Watch estimate change in real-time
      • See before/after bar chart
      • ← Back to profile
  ↓
TAKE ACTION: "Create intervention case"
  • Button shows in profile
  • On click: Case #CASE-006 created
  • Success message shown with link to Cases
  ↓
INTERVENTION CASES (optional)
  • See all active cases for your students
  • Status overview: Open (38), In Progress (24), Follow-up (16), Resolved (86)
  • Case timeline: What was done, what's next
  • Follow-up dates
```

---

## Secondary Flows

### "I want to see program-wide insights"
```
DASHBOARD → "Program Analytics" (sidebar)
  • Risk by program (stacked bar)
  • Internship completion rates
  • Comparison table (students, avg estimate, high %, intervention %)
```

### "I need to understand why the model flagged someone"
```
STUDENT PROFILE → "Why prioritised?" button
  → EXPLAINABILITY PANEL
     • SHAP contribution chart (which factors drive risk)
     • Plain-language summary
     • Positive signals section
     • Recommended next step
```

### "What if we can help this student?"
```
STUDENT PROFILE → "Model impact?" button
  → WHAT-IF SIMULATOR
     • Toggle interventions one-by-one
     • See estimated score improvement
     • Compare before/after
     • Understand impact hierarchy
```

---

## Data Model (Mock)

### Student Record
```javascript
{
  id: "#4F91A20C",
  name: "Alex M.",
  program: "Information Systems",
  year: 3,
  employabilityEstimate: 34,
  confidenceInterval: [27, 41],
  priority: "HIGH",
  gpaThisSem: 2.6,
  gpaHistory: [3.4, 3.2, 3.1, 2.8, 2.6],
  internshipStatus: "Not completed",
  lmsEngagement: "Low (18th percentile)",
  projectsCompleted: 2,
  portfolioStatus: "Needs improvement",
  skillsVerified: 6,
  coCurricular: "None recorded",
  creditCompletion: "78% (84/108)",
  mainSignals: ["GPA declining", "No internship", "Low engagement"],
  riskDrivers: [
    { factor: "No internship", impact: -0.19, category: "high" },
    { factor: "Falling GPA", impact: -0.11, category: "high" },
    { factor: "Low engagement", impact: -0.06, category: "medium" },
    // ... more
  ],
  recommendations: [
    { action: "Internship Placement Support", priority: "PRIMARY", desc: "..." },
    { action: "Portfolio Development", priority: "SECONDARY", desc: "..." },
    { action: "Academic Recovery Plan", priority: "SECONDARY", desc: "..." },
  ],
  whatIfScenarios: {
    currentScore: 34,
    withInternship: 58,
    withPortfolio: 46,
    withMentorship: 43,
    withAcademicRecovery: 42,
    allTogether: 82,
  }
}
```

### Intervention Case Record
```javascript
{
  id: "CASE-001",
  studentId: "#4F91A20C",
  issue: "No internship",
  intervention: "Internship placement",
  advisor: "Sarah M.",
  status: "In Progress", // or "New", "Follow-up", "Resolved"
  dateOpened: "2026-09-04",
  nextFollowUp: "2026-09-15",
  timeline: [
    { date: "2026-09-04", event: "Student identified by model as high priority", done: true },
    { date: "2026-09-05", event: "Advisor notified and case opened", done: true },
    { date: "2026-09-06", event: "Internship placement recommendation created", done: true },
    { date: "2026-09-10", event: "Follow-up meeting scheduled", done: false },
    { date: "2026-09-15", event: "Internship confirmation expected", done: false },
  ]
}
```

---

## Key User Moments

### Moment 1: Dashboard Load
**What the advisor needs:** "What's changed since yesterday? Who needs my attention?"
- **Show:** Queue size, high-priority count, active intervention count
- **Don't show:** Every student (too much)
- **Action:** Prominent "Review queue" button

### Moment 2: Queue Review
**What the advisor needs:** "Give me the students in order of urgency"
- **Show:** Risk score, program, year, main signal, last review
- **Don't show:** Full explanation (that's in the profile)
- **Action:** "Review" button to see full profile

### Moment 3: Student Profile
**What the advisor needs:** "Why is this student flagged? What can I do?"
- **Show:** Estimate, confidence interval, academic/engagement trends, specific risks
- **Don't show:** Raw model weights (that's in Explainability)
- **Action:** Quick links to "Why?" and "What if?" plus big "Create case" button

### Moment 4: Explanation
**What the advisor needs:** "Make the model transparent so I trust it"
- **Show:** Which factors are driving the risk (SHAP), in plain language
- **Don't show:** The algorithm internals (too technical)
- **Action:** Understand enough to explain to student

### Moment 5: What-If
**What the advisor needs:** "How much would interventions help?"
- **Show:** Score improvement for each intervention
- **Don't show:** Promises (caveat: "estimated, not guaranteed")
- **Action:** Decide which intervention to prioritize

### Moment 6: Take Action
**What the advisor needs:** "I've decided what to do. Log it."
- **Show:** Success message after case creation
- **Don't show:** Complex forms (MVP keeps it simple)
- **Action:** Link to case board, or back to queue

---

## Navigation Map

```
LANDING SITE
├── Hero + features
├── Login button
└── "How it works" sections

LOGIN
└── Institutional email + password

AUTHENTICATED APP (AppShell)
├── SIDEBAR (Nav)
│   ├── MAIN
│   │   ├── Overview (Dashboard)
│   │   ├── Student Queue
│   │   ├── Cases
│   │   ├── Program Analytics
│   │   └── Reports
│   ├── ADMIN
│   │   ├── Fairness & Equity
│   │   └── Simulator
│   └── USER (Sarah M. · Career Advisor)
│
├── TOPBAR
│   ├── Current page title
│   ├── Search students
│   ├── Notifications (3)
│   └── Back to site
│
└── MAIN CONTENT
    ├── Dashboard
    ├── Student Queue
    ├── Student Profile
    ├── Explainability (from Profile)
    ├── What-If Simulator (from Profile)
    ├── Cases
    ├── Program Analytics
    ├── Fairness & Equity
    └── Reports
```

---

## Quick Reference: What Each View Does

| View | Purpose | Key Interaction |
|------|---------|-----------------|
| **Dashboard** | "Who needs attention?" | Click "Review queue" |
| **Queue** | "Prioritized list" | Click "Review" on student |
| **Profile** | "Why this student?" | See signals + "Create case" |
| **Explainability** | "Make it transparent" | Read SHAP chart + explanation |
| **What-If** | "What would help?" | Toggle interventions |
| **Cases** | "Track support" | View timeline, mark follow-ups |
| **Analytics** | "Program health" | Compare programs, spot patterns |
| **Fairness** | "Is it fair?" | Monitor group performance |
| **Reports** | "Institutional view" | Generate PDF/Excel |

---

## Time Budget (Per Student)

- **Queue scan:** 10-15 sec per row (check score + signal)
- **Profile review:** 1-2 min (scan signals, check explanation)
- **What-if:** 30-45 sec (toggle 1-2 interventions)
- **Case creation:** 30 sec (button click + confirmation)
- **Total per student:** 2-3 min ✅ (MVP target)

---

## Success Metrics (From USER_STORY_MVP.md)

1. **Adoption:** > 80% of advisors use queue daily within 1 month
2. **Throughput:** < 3 min average time per student profile
3. **Logging:** 100% of intervention cases logged within 24 hrs
4. **Trust:** > 90% advisor agreement: "I understand why this student is flagged"

---

## Mobile Responsiveness

Currently built for **desktop + large tablet** (Figma Make environment).

**Responsive breakpoints in Tailwind:**
- `grid-cols-2 lg:grid-cols-4` — 2 cols mobile, 4 cols desktop
- `lg:grid-cols-2` — 1 col mobile, 2 cols desktop
- `hidden lg:block` — Hidden on mobile
- `flex flex-col lg:flex-row` — Stack on mobile, side-by-side on desktop

If mobile support is needed later, add: `md:` breakpoints and mobile nav drawer.

---

**Last updated:** 2026-09-09  
**MVP Status:** Ready for testing with real advisors
