# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**HIPAA Security Rule Checklist Tool** — a React single-page application that walks IT teams through all HHS HIPAA Security Rule implementation specifications (45 CFR Part 164, Subpart C), tracks per-control compliance status, and exports a structured PDF summary report.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # TypeScript check + Vite production build → dist/
npm run preview  # preview the production build locally
```

## Architecture

Vite + React 18 + TypeScript. No routing library — view state drives which component renders.

```
src/
  data/hipaa.ts          HIPAA controls data + TypeScript types
  store/useHipaaStore.ts Zustand store (persists orgInfo + responses to localStorage)
  utils/stats.ts         Pure functions: getCategoryStats, getOverallStats, scoreToFillClass
  utils/pdf.ts           exportPDF — builds jsPDF document with cover, summary, issues, and per-category tables
  styles/globals.css     All CSS (CSS variables, component classes, print rules)
  components/
    Header.tsx           Sticky header with view navigation
    Dashboard.tsx        Home view: org form, donut chart, category cards
    Assessment.tsx       Assessment layout: sidebar + current category content
    AssessmentSidebar.tsx Left nav with per-category progress dots
    StandardBlock.tsx    One HIPAA standard with its specs
    SpecItem.tsx         One implementation spec: status chips + notes textarea
    Report.tsx           Report view: stats, chart, category table, issues list
    DonutChart.tsx       Canvas-based donut chart (useEffect + useRef)
```

### Key data shapes

**Store state** (`useHipaaStore`):
- `orgInfo` — `{ name, assessor, assessorTitle, date }`
- `responses` — `{ [specId]: { status: '' | 'compliant' | 'partial' | 'noncompliant' | 'na', notes: string } }`
- `currentView` — `'dashboard' | 'assessment' | 'report'`
- `currentCategoryIndex` — index into `HIPAA_DATA.categories`

State persists to `localStorage` key `hipaa_checklist_v1` via Zustand `persist` middleware. Only `orgInfo` and `responses` are persisted (not view/navigation).

**HIPAA data** (`HIPAA_DATA`):
- `categories[]` → `standards[]` → `specs[]`
- `allSpecs` — flat array of all specs with `categoryId` and `standardId` added
- `totalSpecs` — total count (42)
- Spec `type` is `'R'` (Required) or `'A'` (Addressable)

### Spec IDs are stable keys — never rename them without a localStorage migration.

### PDF export

Uses **jsPDF** + **jsPDF-autoTable** from npm. `exportPDF(orgInfo, responses)` in `utils/pdf.ts` builds the doc programmatically: cover page → executive summary → category breakdown → issues list → per-category detail tables → page footers. The `(doc as unknown as ...).lastAutoTable.finalY` cast is required because the autoTable type augmentation is incomplete.
