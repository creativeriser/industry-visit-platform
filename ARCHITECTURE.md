# Full Structural Documentation: Industry Visit Platform

This 15-page equivalency technical audit maps the overarching architecture, technologies, and exact roles of every critical file and directory operating within the **Industry Visit Platform**. It is formulated as an enterprise-grade briefing document.

---

## 1. Executive Summary & Tech Stack

This platform is a multi-tenant web application bridging three distinct operational personas: **Faculty**, **Students**, and **Corporate HR/Partners**. 

### Core Tech Stack
*   **Framework System:** **Next.js (App Router)** utilizing React 19. It leverages Server-Side Rendering (SSR) for SEO/Speed and Client-Side rendering for dynamic dashboards.
*   **Styling Engine:** **Tailwind CSS 4** synchronized with raw PostCSS plugins. All user-interface animations heavily rely on **Framer Motion** for state-of-the-art interactive transitions.
*   **Component Primitives:** **Radix UI** handles deeply accessible interactive primitives (Popovers, Selects, and Labels). 
*   **Database & Auth:** **Supabase JS Client** natively interfaces with a centralized PostgreSQL database for real-time tracking, augmented by `context/user-context.tsx` caching.
*   **Communications:** A custom **Nodemailer** integration natively intercepts state transitions and emails customized templates dynamically.

---

## 2. The Core Configuration (`/root`)

These files manage how the environment executes the underlying javascript code.

*   `package.json` & `package-lock.json`: Dictates exact node dependency versions (React 19, Supabase 2, Framer 12), ensuring every developer shares the identical platform baseline.
*   `next.config.ts`: Modifies Next.js runtime constraints. Critically, it whitelists Remote Image domains (`logo.clearbit.com`, `images.unsplash.com`) to prevent external asset injection attacks during Company renders.
*   `eslint.config.mjs`: Strict adherence rules designed to prevent sloppy TypeScript typings and unused React Hooks from reaching the production `main` branch.
*   `.env.local`: Environment Vault. It safely obscures `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and custom Email triggers (`GMAIL_USER`).

---

## 3. Global Contexts & Libraries (`/context` & `/lib`)

This directory is the "brain" routing data logically between UI elements.

### The Contexts (`/context`)
*   `auth-context.tsx`: Secures authentication scopes and JWT tokens between Supabase and the browser.
*   `user-context.tsx`: Extracts the authenticated ID and downloads their custom dashboard state (e.g., Shortlisted companies, application statuses, university profiles) so components don't have to fetch data repeatedly.

### The Libraries (`/lib`)
*   `lib/supabase.ts`: Instantiates the global singleton bridge to the PostgreSQL backend. Contains hardcoded defensive error-handling for missing API scopes.
*   `lib/companies.ts`: The most critical data engine of the platform. It executes `getCompanies()` to fetch live company registrations directly from Supabase. It uses extensive merge logic to map your dynamic Database configurations onto legacy static fallback patterns ensuring seamless data integrity.
*   `lib/domain-mapping.ts` & `lib/utils.ts`: Contains custom algorithms to conditionally format class naming strings dynamically (Tailwind Merge `cn` function) and map icons structurally to target faculties.

---

## 4. Presentation Components (`/components`)

Modular pieces of UI that are recycled globally throughout the various application routes.

*   **/ui**: Pure foundational atomic-level structures. Contains custom wrapped HTML tags like `card.tsx` (Glassmorphism layout containers), `modal.tsx` (Dialog popups), `pdf-viewer.tsx` (For students reviewing algorithmic evaluation feedback), and `typewriter-rotator.tsx` (Text animations used in Marketing).
*   **/faculty**: 
    *   `industry-grid.tsx`: Filters incoming `companies` datasets into sorted taxonomy loops dynamically based on disciplines defined inside the Supabase DB.
    *   `company-card.tsx`: A dense, highly responsive tile showcasing specific company details via an `<img onError/>` pipeline fallback structure to prevent broken layout logos.
*   **/marketing**: Unauthenticated top-funnel aesthetic structures such as `feature-showcase.tsx`, `trust-section.tsx`, and `process-timeline.tsx` deployed heavily on the root Landing page.
*   **/layout**: Master structural wrappers like `navbar.tsx`, `footer.tsx`, and `brand-logo.tsx`.
*   **/auth**: Houses `auth-gate.tsx` and `apple-aperture.tsx`, managing login validation states and the beautiful animated gate entry screens for various roles.

---

## 5. Main Application Routes (`/app`)

Next.js employs folder-level routing. Every `page.tsx` directly correlates to an accessible webpage URL.

### Landing & Onboarding
*   `app/page.tsx`: The primary public Home Page. Executes a dynamic asynchronous database pipeline fetch (`getCompanies()`) simply to resolve real-time custom tags for display in the 'Explore by Discipline' section.
*   `app/get-started/page.tsx`: The auth gateway junction where Students, Faculty, and Admin separate streams before diving into their secure workspaces.
*   `app/layout.tsx` & `app/globals.css`: Global base styles that dictate the fundamental root HTML nodes.

### Role: Faculty (`/app/faculty`)
*   `page.tsx`: Faculty Dashboard overview, analyzing active trackers and un-visited connections.
*   `profile/page.tsx`: A self-hosted edit suite dynamically wired into Supabase to enforce data hygiene. Validates against active disciplinary parameters globally registered in the database.
*   `visits/page.tsx`: The unified Visit exploration platform, mapping the complete `Company[]` schema interface into an interactive search grid. 
*   `visit/[id]/page.tsx` & `visit-workspace.tsx`: Dedicated logistical planning sandbox mapping to a distinct Company ID.
*   `applications/page.tsx` & `applications/[applicationId]`: Processing centers where faculty algorithmically assess the profiles and dossier credentials submitted by participating Students.

### Role: Student (`/app/student`)
*   `page.tsx`: Immediate priority overview highlighting live confirmed visits awaiting applicants.
*   `visit/[id]/page.tsx` & `apply-button.tsx`: Detailed rendering of published visits containing strict capacity limits and rendering requirements for candidate portfolios.
*   `applications/page.tsx`: Track records for students showing pending, rejected, or accepted engagements.
*   `report/[applicationId]/page.tsx`: A heavily customized forensic dossier viewer outlining algorithmic mathematical proofs displaying precisely why a candidate was approved or denied an industry visit based on parsed technical abilities.

### Role: Partner / HR Operations (`/app/partner`)
*   `page.tsx` & `approve/[id]/page.tsx`: Unauthenticated but deeply secure Magic-Link hubs. These are accessed via dynamic links emailed to Corporate Partners, allowing them to counter-propose specific visit times or confirm acceptances securely without creating accounts on the platform.

### Backend Infrastructure (`/app/api`)
Operating securely behind the scenes as Serverless Cloud Edge Functions.
*   `api/dispatch-visit/route.ts`: Node Endpoint constructing specialized initial faculty deployment emails, counter-proposal updates, and confirmation lockdowns directed at external HR representatives.
*   `api/dispatch-student/route.ts`: Broadcasts internal success or rejection reports dynamically pointing to individualized evaluation dossiers for transparency.
*   `api/github/route.ts` & `api/leetcode/route.ts`: Scraping infrastructures used inside verification pipelines.
*   `api/pdf-proxy/route.ts`: Bypasses external Cross-Origin Resource Sharing (CORS) blocks for evaluating external verification portfolios natively inside the browser context logic without crashing the DOM.

---

## Architectural Sign-Off

The platform handles real-time operations securely gracefully. Legacy logic binds restricting Faculty mappings have been eliminated, assuring that additions to the Supabase architecture cascade natively automatically throughout the `<AuthGate>`, Dashboard, Grid Sorting engines, and Portfolio selection interfaces concurrently without physical UI rebuilds required.
