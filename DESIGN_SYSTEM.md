# UniVisit Enterprise Design System

This document serves as the absolute source of truth for all UI/UX design components, patterns, and principles across the UniVisit platform. As a professional, enterprise-grade application, consistency is paramount. Any future updates, components, or features MUST adhere strictly to the rules defined below.

## 1. Universal Design Principles
* **Professional & Premium:** Avoid simple or generic implementations. UI components must feel responsive, dynamic, and polished exactly like top-tier SAAS products.
* **Component Reusability:** Repeated UI elements (such as tags, avatars, links) must share a single, universal design language. Ad-hoc styling is not accepted.
* **Contextual Scale Adaptivity Clause:** While core design styles (colors, border-radii, opacity, font-weights) are entirely locked, **component size and scale** (like width, height, text-size bumps) are permitted to deviate *only* if the specific spatial context demands it. For example, replacing a right-sided action button with a status indicator warrants stretching the status tag to `w-full h-12` to maintain the layout box, provided it utilizes the exact universal color and shape themes. Size changes must always serve to increase professionalism and structural harmony.
* **Micro-interactions:** Interactive elements must give immediate feedback. Utilize subtle hover states, transition animations, and visual shifts. Nothing should feel static.

---

## 2. Global Typography
* **Font Family:** We use a modern, sans-serif stack (e.g., Inter, Outfit) designed for maximum legibility in data-heavy dashboards.
* **Text Hierarchy:**
  * Application/Dashboard Headers: `text-3xl font-black text-slate-900 tracking-tight`
  * Section Headers: `text-[15px] to text-lg font-bold text-slate-900`
  * Body Text: `text-sm font-medium text-slate-500 or text-slate-600`
  * Micro-copy / Labels: `text-[10px] font-bold text-slate-400 uppercase tracking-wider`

---

## 3. Enterprise Logo Presentation
* **Clean & Minimalist Branding:** Company logos must be presented as the absolute focal point of company/visit cards.
* **Layout:** Use a `slate-50` background container (`bg-slate-50 border border-slate-100/50 p-6 flex items-center justify-center`) without distracting stock photos or building backgrounds.
* **Format & Feel:** Scale logos beautifully with `object-contain` and apply micro-interactions (`group-hover:scale-105`) to match the SAAS-grade enterprise feel.
* **Fallback:** If a logo is ever missing, an elegant initial is centered dynamically (`.charAt(0)`).

---

## 3. The Universal Status Tag System

Status tags indicate the state of a visit or application. They must be uniform across both the Student and Faculty dashboards.

**Core Tag Structure:** 
`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border flex items-center gap-1 shadow-sm w-fit`

**Color Specifications:**
* **Pending / In Progress:**
  * Background: `bg-amber-50`
  * Border: `border-amber-200`
  * Text: `text-amber-600`
  * Icon: `Clock` (amber-500)
* **Accepted / Validated / Approved:**
  * Background: `bg-emerald-50`
  * Border: `border-emerald-200`
  * Text: `text-emerald-600`
  * Icon: Strictly `Check` (emerald-500)
* **Rejected / Cancelled:**
  * Background: `bg-red-50`
  * Border: `border-red-200`
  * Text: `text-red-600`
  * Icon: `X` or `XCircle` (red-500)
* **Live / Broadcasting / Active:**
  * Background: `bg-violet-50`
  * Border: `border-violet-200`
  * Text: `text-violet-600`
  * Icon: Strictly `Radio` (violet-500)
* **Alternate:**
  * Background: `bg-indigo-50`
  * Border: `border-indigo-200`
  * Text: `text-indigo-600`
  * Icon: `RotateCcw` or context-specific (indigo-500)

*Rule:* Never use arbitrary pill sizes (e.g., `rounded-full` vs `rounded-md`). Status tags are **always** solid, medium-rounded `rounded-md` blocks with `px-2 py-1`.

---

## 4. The Universal Discipline Tag System

Academic Discipline tags must stand out from standard status tags but remain globally consistent. They define the stream a student or visit belongs to.

**Core Discipline Structure:**
`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-md items-center gap-1.5 border w-fit`

**Color Specifications:**
* **Standard Discipline (e.g. Computer Science):**
  * Background: `bg-sky-50`
  * Border: `border-sky-100/50`
  * Text: `text-sky-700`
  * Icon Element: Uses `getDisciplineIcon()` rendered consistently at `w-3 h-3 shrink-0`

*Rule:* When rendering a discipline, it must utilize this exact sky-themed, medium-rounded pill. Never replace it with a full-width standard input box or abstract icon color. Even inside detail views or profile cards, the discipline must be immediately identifiable via this tag format.

---

## 5. Input Fields & Data Display Forms

For displaying static data (e.g., Student Identity tables, Academic info):

**Container Structure:**
* Default Wrapper: `w-full p-3.5 rounded-xl border border-slate-100 text-sm font-medium flex items-center h-[46px]`
* Non-editable States: `bg-slate-50/50 text-slate-900`
* Labels: Always use `text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1`

*Exceptions:* If placing a universal tag (like the Discipline tag) inside a data display area, it should float within a neutral container (e.g. `bg-transparent border-none px-0` or a light container) rather than stretching to fill the block, to preserve its visual identity as a badge.

---

## 6. Layout & Cards

* **Card Bases:** Standard cards use `bg-white border text-slate-900 rounded-[24px] shadow-sm overflow-hidden`.
* **Subtle Interactions:** Interactive cards include `hover:shadow-md hover:border-indigo-300 transition-all duration-300`.
* **Dark Headers:** For high-importance sections (like profile headers), use `bg-indigo-900 text-white border-indigo-800` to establish strong visual hierarchy.

## 7. Interactive Elements & Buttons

Consistent interaction paths are mandatory for enterprise systems. Standardize all buttons with the following structures:

* **Primary Action Buttons:**
  * Base: `px-6 py-3 rounded-xl font-bold text-white transition-all duration-300`
  * Active Interactions: `hover:-translate-y-[1px] shadow-sm hover:shadow-md active:scale-95`
  * Theme Colors: `bg-indigo-600 hover:bg-indigo-700` (Faculty/Dashboard) or `bg-sky-600 hover:bg-sky-700` (Student)
* **Secondary / Outline Buttons:**
  * Base: `px-6 py-2.5 rounded-xl font-bold transition-all border block text-center`
  * Theme Colors: `text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-100/50 shadow-indigo-100/50`

*Rule:* Buttons must always feature the `transition-all` class and include a micro-bump (`hover:-translate-y-something`) or a shadow lift to feel premium.

---

## 8. Enterprise Core Animations

Sudden DOM shifts ruin the UX. Everything must enter gracefully using `framer-motion`.

* **Page and List Load-Ins:**
  * `initial={{ opacity: 0, y: 10 }}` or `y: 20`
  * `animate={{ opacity: 1, y: 0 }}`
  * Provide slight delays for staggered list elements (`delay: idx * 0.1`)
* **Error / Blocker Shakes:**
  * When a user does something invalid (like trying to apply without a valid profile), the blocked UI must visibly react (`framer-motion` shake sequence `x: [-5, 5, -5, 5, 0]`). Silent failures are strictly prohibited.
* **Loading States:**
  * Avoid raw text loading. Use Lucide's `Loader2` centered with `animate-spin` and the brand's primary color (`text-indigo-500` or `text-sky-500`), scaling appropriately to the container.

---

## 9. Hero Metrics & Banners

When displaying crucial data points (like Current CGPA or Attendance) inside profile dossiers or top-level headers:
* **Never use basic floating text metrics.** Wrap them in a structured asset.
* **Never use disassociated separate pills.** It creates visual clutter.
* **Core Structure:** Unified metrics block separated by subtle vertical dividers.
* **Enterprise Dossier Theme:**
  * Container Background: `bg-slate-50/50` or `bg-slate-50` with a subtle `border border-slate-200/60` and soft rounding `rounded-[20px]`.
  * Separation: A single vertical divider line `w-[1px] bg-slate-200/80` between distinct data points.
  * Metric Layout: Soft label `text-[11px] font-bold text-slate-500 uppercase tracking-widest` alongside an icon `w-4 h-4 text-slate-400`.
  * Metric Value: Bold dark value `text-2xl font-black tracking-tight`. 
* **Dynamic Threshold Colors:** For instantaneous heuristic reading, numeric values must inject strict threshold colors on the value text itself:
  * For positive/passing thresholds: `text-emerald-600` or `text-sky-600`.
  * For warning/failing thresholds: `text-amber-600` or `text-red-600`.

## 10. State Alerts & Banners

When an entity hits a terminal or critical lifecycle state (e.g., A Visit is Cancelled, Approved, or Successfully Published), the UI must not rely on simple text or empty whitespace. It must render an enterprise state block.
* **Component Architecture:** Full width container, aggressively rounded `rounded-[24px]`.
* **Visual Anchoring:** A thick but soft border matching the mood `border-red-200` or `border-emerald-200` with an underlying `shadow-sm`.
* **Layout:** Generous padding `p-8 md:p-10`. Inside, center or flex-row align the core message.
* **The Icon Badge:** Crucial for immediate visual scanning. Use a dedicated circular icon wrapper: `w-10 h-10` or `w-12 h-12 rounded-full`. Use a very light tinted background (`bg-[color]-50` or `100`), a tinted border, and an inner shadow `shadow-inner` with the deeply saturated icon color matching the state inside (`text-[color]-500`).
* **Micro-interactions:** Any call to action buttons inside these alerts (e.g. "Draft New Proposal") must retain the premium lift interactions (`shadow-lg hover:-translate-y-0.5`). 

## 11. Email Communications
When drafting HTML emails, the color palette and template must match the target persona's primary dashboard theme to ensure brand continuity.
* **Faculty & Administrative Emails:** Use the Indigo Palette (`#4f46e5`).
* **HR / Partner Portal Emails:** Use the Enterprise Green Palette (`#059669` or `#16a34a`).
* **Student Pipeline Emails:** Use the Sky Blue Palette (`#0284c7`).

### 11.1 Email Workflow & Subject Conventions
To prevent administrative inbox flooding and to ensure clean filter-ability, all automated dispatched emails MUST adhere to the following workflow paradigms and strict subject prefix rules:

**A. External Partner Operations (Two-Way Pipelines):**
Target: HR Representatives / Companies
* **Nature:** High-priority, two-way human negotiation. Auto-replies from HR must be visible to Faculty.
* **Inbox Rule:** These communications must NEVER skip the core inbox. 
* **Required Subject Prefixes:**
  * Initial Outbound: `[Visit Request]`
  * Negotiation/Update: `[Visit Negotiation]`
  * Final Receipt: `[Visit Confirmed]`

**B. Internal Academic Operations (Broadcast Pipelines):**
Target: Students
* **Nature:** High-volume, one-way system blasts. Bounce-backs and auto-replies introduce pure noise.
* **Inbox Rule:** The system assumes the administrator will filter these into dedicated archive labels (e.g., `Skip Inbox`). The platform handles student replies via native application flows, not email.
* **Required Subject Prefixes:**
  * System Blast: `[New Visit Published]`
  * Success Transaction: `[Application Accepted]`
  * Failure/Update Transaction: `[Application Update]`

## Conclusion

By enforcing these strict standards, the platform retains an enterprise-grade visual identity. When extending the product, these patterns must be copied exactly. When a new conceptual element is introduced, it must be normalized across the platform and appended to this document.
