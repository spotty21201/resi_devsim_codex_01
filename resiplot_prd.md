**Product Requirements Document (PRD)**\
**Product Name:** Residential Master Planning Simulator\
**Tagline:** Think like a designer. Plan like a developer.\
**One-liner:** The fastest way to design efficient, high-yield layouts for single-family housing developments.\
**Developed by:** Kolabs.Design × HDA × AIM\
**Inspired by:** Development Simulator by Doddy Samiaji

---

## 🌟 Vision

A lightweight, AI-assisted planning tool built specifically for **single-family, landed residential master plans**. It enables developers, designers, and landowners to quickly simulate lot layouts, road efficiency, and yield optimization without opening CAD or GIS software.

---

## 🧭 User Experience Flow

### 1. **Starting the Simulation**

The user begins by launching the tool in a browser (desktop-optimized), ready to model land use for a new or conceptualized housing site.

### 2. **Inputting Site Parameters**

- **Lot Size:** User enters total gross site area in hectares (e.g., 3.0 or 3.7 ha).
- **Right-of-Way (ROW):** User sets a standard road width to be applied across the layout (e.g., 6 m, 8 m).

### 3. **Adding Product Types**

- User adds multiple product types (e.g., "Azalea", "Bougainville").
- Each product includes:
  - **Name**
  - **Width (m)**
  - **Depth (m)**
  - Auto-calculated lot area (m²)

### 4. **Defining Product Mix**

- User assigns % mix per product type (e.g., 25%, 25%, 50%).
- Percentages must sum to 100%.
- Mix applies to number of units, not area.

### 5. **Non-Sellable Area Inputs**

- User adds optional inputs for:
  - Amenity space
  - Green buffers
  - Easements
  - Drainage areas
- ROW-based road area is auto-estimated based on unit count and average frontage.

### 6. **Run Simulation**

- User clicks **"Analyze Land Use Efficiency"**.
- System calculates:
  - Total unit count per product type
  - Total sellable area
  - Road area and other non-sellable zones
  - Net vs. gross efficiency
  - Visual breakdown (charts/tables)

### 7. **Iterative Adjustment**

- Users tweak product mix, ROW width, or open space values.
- Results refresh quickly with each change for fast iteration.

### 8. **Export & Report**

- Summary output includes:
  - Unit breakdown by type
  - Efficiency metrics
  - Key ratios (e.g., road % vs lot %)
- Export options:
  - **PDF**: Presentation-style output like the Purwakarta sample (multi-scheme)
  - **Excel (.xlsx)**: Structured tabular comparison of scenarios
  - **Google Sheets**: Link or template push to GDrive
  - **Markdown or Slide Deck**: Compact export for meetings or WhatsApp/email

---

## 💡 Core Features

### 1. **Land & Typology Input Panel**

- Input total site area (Ha)
- Define multiple unit types: name, % mix, lot width x depth
- Real-time % validation
- Visualization of unit mix proportions

### 2. **Non-Sellable Areas Module**

- Input areas for: roads (based on ROW width), green buffers, amenities, easements
- Auto-calculate sellable vs non-sellable distribution
- Road area estimator based on unit frontage and ROW

### 3. **Yield Simulator**

- Total unit count
- Sellable lot area (m² & %)
- Road area (m² & %)
- Amenity, buffer, and easement summaries
- Net vs Gross efficiency calculations

### 4. **Scenario Management**

- Save & name multiple scenarios
- Compare up to 3 scenarios side-by-side
- Chart-based comparison: unit count, efficiency, lot sizes
- Export directly to PDF, XLS, and GSheet comparison like the Purwakarta sample

### 5. **AI-Powered Strategic Recommendations** *(Phase 1.5)*

- GPT-4o or Claude 3.5 API integration via LangChain
- Context-aware design suggestions:
  - Reclaim underutilized edge lots
  - Split median boulevards to unlock buildable rows
  - Propose multiple access gates for circulation
  - Highlight inefficiencies in green zones or buffer placement
- Outputs suggestions as editable markdown blocks for reports or slides

#### Sample AI Suggestion Prompt:

> "Given a site area of 5.7 Ha, with 3 product types (6x15, 7x15, 8x15), and a road ROW of 8m, suggest strategies to increase net efficiency from 65% to 70% while maintaining green open space."

#### Sample AI Output:

> “Your current layout yields a net efficiency of 65.2%. Consider splitting the green median along the secondary boulevard to reclaim \~500 m² of buildable area. Introducing a secondary gate on the east side can reduce road overlap. Several corner lots can be labeled as ‘non-buildable extension zones’ yet sold as premium units.”

---

## ⚙️ Technology Stack

### ▶ Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v5
- **Design System**: Custom minimal UI with **designer-first typography** (Suisse Intl or Inter Tight)
- **Font Loading**: Optimized via Vercel Fonts
- **Rendering**: Server-side + React Server Components for perf
- **Charting**: Recharts or lightweight SVG components
- **Responsiveness**: Desktop-first; future tablet/mobile optimization optional
- **Accessibility**: WCAG-compliant color contrast and keyboard navigation for all form inputs

### ▶ Backend

- **Edge Functions**: Vercel Edge Functions for fast, stateless calculations
- **Logic Engine**: Custom calculation module in TypeScript
- **Storage**: Supabase for saving scenarios (optional at MVP)
- **AI Suggestions (Phase 1.5+)**: OpenAI GPT-4o or Claude 3.5 API via LangChain
  - `.env.local` key: `OPENAI_API_KEY` or `CLAUDE_API_KEY`
  - Async requests to generate design intelligence based on user input context

---

## 🌐 Frontend Design Notes

- **Aesthetic**: Minimalist, monochrome wireframe-like look
  - Abstract architectural line-art and spatial grid motifs
  - No icons, no UI clutter
  - Use black/white/gray only, with tight whitespace discipline
- **Typography**: Unique designer font (e.g., Suisse Int'l, Inter Tight, or Founders Grotesk)
- **Layout**: Grid-based, responsive
- **No Placeholder Text**: Every screen must be fully wired with real logic/output states
- **Transitions**: Soft transitions with Framer Motion (no overshoot)

---

## 🧩 Component Architecture (Developer Handoff)

- `<MainLayout />`
- `<InputPanel />`
- `<ProductTypeList />`
- `<NonSellableForm />`
- `<SimulationResults />`
- `<EfficiencyCharts />`
- `<ScenarioSaver />`
- `<ScenarioExporter />` *(PDF/XLS/GSheet)*
- `<AIInsightBlock />` *(Phase 1.5)*

All components will be built in TypeScript with clear props and stateless logic where possible.

---

## 🚀 Deployment

- **Platform**: Vercel (Production + Preview branches)
- **CI/CD**: GitHub + Vercel Auto Deploy
- **Env Setup**: `.env.local` for API keys + config vars
- **Monitoring**: Vercel Analytics, optional LogRocket for session replay

---

## ⏰ Roadmap (MVP Only)

1. Land area + product mix input
2. Non-sellable area logic with road estimator
3. Yield simulator engine with visual output
4. Scenario saving & comparison
5. Export summary in markdown, PDF, Excel, and GSheet
6. **Strategic suggestion engine via AI (Phase 1.5)**
7. **Component system for modular growth**

---

## ✅ Success Metrics

- Time to first result < 30 seconds from page load
- 90% of first-time users able to run full scenario without guidance
-
  > 70% of scenarios result in real design insight (measured via session replays or feedback prompts)

---

## 👤 Target Users

- Small-to-mid-scale residential developers
- Landowners evaluating feasibility
- Master planners in early design stages
- Real estate consultants preparing yield studies

---

