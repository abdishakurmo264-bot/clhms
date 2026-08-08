# College Lab Management System (CLHMS) - Full 5 Sub-Agents Architecture

CLHMS is a state-of-the-art Web platform engineered to streamline college laboratory operations, equipment inventory, daily teacher audits, and transparent publishing workflows.

---

## 🗂️ Completed Phases & Modules Overview

### ✅ Phase 1: Foundation (Weeks 1 - 2)
* **Database-Auth-Agent**: Live Supabase PostgreSQL connection (`kwognmwltcvyjtdsydnx`), 5 Tables (`profiles`, `hardware`, `daily_audits`, `lab_sessions`, `announcements`), 5 ENUMs, Check constraints, and 12 Strict RLS policies.
* **UIX-Master-Agent**: Responsive modern shell, Dark Theme, collapsible sidebar, Mobile drawer, Shift status bar (Morning 07:00 AM – 12:00 PM EAT vs Afternoon 04:00 PM – 09:00 PM EAT), ON-DUTY real-time status pulses, and glassmorphic login card with RBAC role switcher (`ROLE_ADMIN`, `ROLE_LAB_HEAD`, `ROLE_LAB_TEACHER`, `ROLE_LECTURER`).
* **Module 1: Daily Hardware Audit Modal (`components/DailyAuditModal.tsx`)**: COMPLETE / INCOMPLETE toggles with mandatory incomplete reason constraint.

### ✅ Phase 2: Core Workflows (Weeks 3 - 4)
* **Module 3: Course Request & Assignment Wizard (`components/course-publishing/LabCoursePublishingWizard.tsx`)**: Step-by-step wizard for lecturers to request lab courses.
* **Core-Logic-Agent**: Server actions (`actions/course-publishing.ts` & `actions/lab-sessions.ts`) enforcing atomic workload increments (`+1`) on assignment and atomic workload decrements (`-1`) on session completion.

### ✅ Phase 3: Realtime & AI Engine (Weeks 5 - 6)
* **Module 4: Supabase Realtime Noticeboard (`components/announcements/RealtimeNoticeboard.tsx`)**: Live feed listening to Supabase channel `clhms-announcements-feed` with instant ping animations without manual page refresh.
* **Module 5: Pinecone-Powered AI Semantic Engine**:
  * **AI Instructor Matchmaking (`app/api/search-instructors/route.ts` & `components/ai/AISemanticSearchModal.tsx`)**: Vector similarity search matching course requirements with instructor skill profiles (e.g. *"Cisco BGP afternoon instructor"*).
  * **Intelligent Hardware Troubleshooting Assistant (`app/api/ai-troubleshoot/route.ts` & `components/ai/AITroubleshooter.tsx`)**: Natural language diagnostics for lab hardware (Cisco routers boot loops, Catalyst switch STP amber lights, Dell PC RAM issues, RJ45 patch cables).
* **DevOps-Telemetry-Agent**: Sentry exception logging (`lib/telemetry/sentry.ts`) and PostHog product analytics tracking (`lib/telemetry/posthog.ts`).

---

## 🎛️ Sub-Agent Tag Protocol (Zero Context Overload)
Prefix any message to communicate with a specific sub-agent directly:
* `[UIX]` ➔ UIX-Master-Agent (Frontend, Tailwind, Modals, TSX)
* `[DB]` ➔ Database-Auth-Agent (PostgreSQL, Supabase, RLS, Auth)
* `[CORE]` ➔ Core-Logic-Agent (Server Actions, Zod, Business Rules)
* `[AI]` ➔ AI-Semantic-Agent (Pinecone Vector, OpenAI Embeddings, NLP)
* `[DEVOPS]` ➔ DevOps-Telemetry-Agent (GitHub Actions, Backups, Sentry)
