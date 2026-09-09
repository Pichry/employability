# Frontend: Employability System Advisor Portal

**Language:** React + TypeScript + Vite + Recharts  
**Status:** Phase 7 UI (Advisor queue and student detail)  
**Deployment:** Node.js 18+

---

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts           # API client for backend
│   ├── components/
│   │   ├── RiskGauge.tsx       # Probability visualization
│   │   ├── RiskDrivers.tsx     # SHAP values chart
│   │   ├── WhatIfSimulator.tsx # Counterfactual scoring
│   │   └── AdvisorQueue.tsx    # Daily work queue list
│   ├── pages/
│   │   └── StudentDetail.tsx   # Main advisor screen (§10 P08)
│   ├── types.ts                # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # React entry point
│   └── App.css                 # Tailwind utility styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── .env.example
```

---

## Components

### RiskGauge
Displays employability probability with confidence interval and risk tier.

```tsx
<RiskGauge
  probability={0.34}
  ci_low={0.27}
  ci_high={0.41}
  risk_segment="HIGH"
/>
```

Shows: 34% probability, CI 27-41%, HIGH RISK (red alert icon)

### RiskDrivers
Bar chart of SHAP values showing which features pushed risk up/down.

Features are marked as MODIFIABLE (green) or STRUCTURAL (gray).

### WhatIfSimulator
Counterfactual scoring: "If you complete an internship, probability rises from 0.34 to 0.58"

Checkbox-based UI for modifiable features only.

### AdvisorQueue
Daily work surface: list of at-risk students filtered by risk tier.

Shows summary cards: HIGH RISK count, MEDIUM RISK count, etc.

### StudentDetail
The heart of the product (§10 P08 of technical brief).

Displays:
- Student header (name, program, year, credits)
- Risk gauge
- SHAP drivers
- What-if simulator
- Recommended interventions
- Case log (contact history)

---

## Stack Rationale

| Tool | Why |
|------|-----|
| **React** | Component-based, declarative UI |
| **TypeScript** | Type safety, catch errors at compile time |
| **Vite** | Ultra-fast development, production builds |
| **Recharts** | 12 standard charts fast (not D3 complexity) |
| **Tailwind** | Utility-first CSS, responsive by default |

**Why NOT:**
- D3: Overkill for standard charts
- Vue/Angular: React dominates advisor tools
- Redux: Overkill for this data model
- GraphQL: Simple REST API sufficient

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env
```bash
cp .env.example .env
# Edit: set VITE_API_URL to your backend
```

### 3. Start dev server
```bash
npm run dev
# Runs on http://localhost:5173
```

### 4. Build for production
```bash
npm run build
# Output: dist/
```

### 5. Type check
```bash
npm run type-check
```

---

## API Integration

The frontend connects to backend at `http://localhost:8000/api`.

API client (`src/api/client.ts`) exposes these methods:

```typescript
apiClient.getMyQueue()                           // Advisor's queue
apiClient.getStudentDetail(studentHash)          // Student profile + prediction
apiClient.runWhatIf(studentHash, modifications)  // Counterfactual scoring
apiClient.logCaseAction(caseId, type, notes)     // Log action
apiClient.closeCaseNote(caseId, body, visibility) // Add case note
```

See `src/types.ts` for full interface definitions.

---

## Key Screens

### Queue Screen (Advisor Dashboard)
**Path:** `/?view=queue`

Displays:
- Risk tier summary cards (HIGH, MEDIUM, LOW, TOTAL)
- Filterable student list
- Click to open student detail

### Student Detail Screen
**Path:** `/?view=detail&student={hash}`

Displays:
- Student header
- Risk gauge (probability + CI + segment)
- SHAP drivers (bar chart)
- What-if simulator
- Recommended interventions (ranked)
- Case log (contact history)

---

## Styling

No separate CSS framework—using Tailwind utility classes in HTML.

Key colors:
- **RED (#dc2626):** HIGH RISK
- **AMBER (#d97706):** MEDIUM RISK
- **GREEN (#16a34a):** LOW RISK / GOOD
- **BLUE (#2563eb):** INTERACTIVE

All colors are semantic (tied to risk, not arbitrary).

---

## Development Workflow

1. Create a new component in `src/components/`
2. Define types in `src/types.ts`
3. Add API client method in `src/api/client.ts`
4. Integrate into page component
5. Test with `npm run type-check`
6. Commit with conventional message

---

## Testing

Currently: no unit tests (Phase 8).

For now, test manually:
- `npm run dev`
- Open http://localhost:5173
- Try queue filtering
- Try student detail
- Try what-if simulator (will fail until backend is built)

---

## Performance

- **Code splitting:** Automatic with Vite
- **Lazy loading:** Not needed yet (small bundle)
- **Charts:** Recharts handles thousands of data points
- **API calls:** Debounced, cached where possible

---

## Security

- **No credentials in code:** Use .env and fetch with Authorization header
- **CORS:** Backend must allow `http://localhost:5173` (dev) and production domain
- **XSS:** React sanitizes by default
- **CSRF:** Add CSRF token to POST requests (backend enforces)

---

## Accessibility

- Semantic HTML (headings, buttons, labels)
- ARIA labels on charts
- Keyboard navigation (Tab, Enter, Escape)
- Color is not the only signal (icons + text)

---

## Build Order

This is **Phase 7** of the overall build:

- Phase 0-6 ✅ Completed: data, schema, models, API
- Phase 7 🔄 **Current:** Advisor UI (queue, student detail, what-if)
- Phase 8: Analytics dashboards (program analytics, course contribution)
- Phase 9-10: Hardening, UAT, docs

---

## Known Limitations

- What-if simulator requires backend inference endpoint
- No dark mode (can add later)
- No mobile optimization yet
- No offline support

---

## Next Steps

1. Build FastAPI backend with endpoints (Phase 6)
2. Integrate with real predictions
3. Add hardening (auth, rate limiting, monitoring)
4. Add analytics dashboards (Phase 8)

