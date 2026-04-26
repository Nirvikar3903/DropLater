You are an expert React engineer. Build a production-grade frontend application 
for "DropLater" — a distributed scheduled webhook delivery system.

All code must be created inside the folder: `droplater/admin/`
All commands must be run from inside `droplater/admin/`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM CONTEXT (read carefully)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DropLater is a Node.js distributed system that:
- Accepts POST /api/notes with { title, body, releaseAt, webhookUrl }
- Stores notes in MongoDB with status: pending → delivered | failed | dead
- Queues delivery jobs in Redis via BullMQ with a time-based delay
- A Worker service picks up jobs at releaseAt time and POSTs to the webhookUrl
- If delivery fails, it retries with exponential backoff (1s → 5s → 25s)
- After MAX_DELIVERY_ATTEMPTS failures, status becomes "dead"
- POST /api/notes/:id/replay re-queues a dead/failed note
- GET /api/notes returns notes with attempts[] array:
  [{ at, statusCode, ok, durationMs }]
- The Sink service uses Redis SET NX idempotency to prevent double processing

The API runs at http://localhost:3000
The Sink runs at http://localhost:4000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — SCAFFOLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inside droplater/admin/ run:

  npm create vite@latest . -- --template react
  npm install

Then install all dependencies:

  npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
  npm install @reduxjs/toolkit react-redux
  npm install framer-motion
  npm install react-router-dom
  npm install react-hook-form
  npm install notistack
  npm install dayjs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create exactly this structure inside droplater/admin/src/:

  src/
  ├── app/
  │   ├── store.js               ← Redux store
  │   └── theme.js               ← MUI dark theme config
  │
  ├── mui/                       ← MUI wrappers (ONLY place MUI is imported)
  │   ├── MuiBox.jsx
  │   ├── MuiGrid.jsx
  │   ├── MuiTypography.jsx
  │   ├── MuiButton.jsx
  │   ├── MuiChip.jsx
  │   ├── MuiTextField.jsx
  │   ├── MuiCard.jsx
  │   ├── MuiTable.jsx
  │   ├── MuiSkeleton.jsx
  │   ├── MuiTooltip.jsx
  │   └── MuiDivider.jsx
  │
  ├── common/                    ← Reusable UI components (use mui/ wrappers inside)
  │   ├── StatusBadge.jsx        ← pending/delivered/failed/dead chip
  │   ├── PageHeader.jsx         ← title + subtitle + optional action button
  │   ├── SectionCard.jsx        ← titled card wrapper
  │   ├── MetricCard.jsx         ← stat number + label + trend
  │   ├── EmptyState.jsx         ← empty table/list placeholder
  │   ├── LoadingRow.jsx         ← skeleton table row
  │   ├── AttemptPills.jsx       ← row of colored attempt result pills
  │   └── CountdownChip.jsx      ← live countdown to releaseAt time
  │
  ├── features/
  │   └── notes/
  │       ├── notesApi.js        ← RTK Query API slice
  │       │
  │       ├── components/        ← Pure UI, props-only, zero logic
  │       │   ├── NoteRow.jsx
  │       │   ├── NoteExpandedPanel.jsx
  │       │   ├── NoteFormFields.jsx
  │       │   ├── AttemptTimeline.jsx
  │       │   ├── FlowDiagram.jsx
  │       │   └── LiveActivityFeed.jsx
  │       │
  │       └── containers/        ← Logic, API calls, state
  │           ├── NotesTableContainer.jsx
  │           ├── CreateNoteContainer.jsx
  │           ├── ReplayButtonContainer.jsx
  │           ├── LivePollContainer.jsx
  │           └── DebugPanelContainer.jsx
  │
  ├── pages/
  │   ├── DashboardPage.jsx
  │   ├── CreateNotePage.jsx
  │   ├── LiveMonitorPage.jsx
  │   ├── DebugPage.jsx
  │   └── SystemFlowPage.jsx
  │
  ├── layout/
  │   ├── AppShell.jsx           ← sidebar + topbar wrapper
  │   ├── Sidebar.jsx
  │   └── Topbar.jsx
  │
  └── main.jsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — THEME (app/theme.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a custom MUI dark theme with:
- mode: 'dark'
- background.default: '#0a0c10'
- background.paper: '#111318'
- primary: '#7c6ff7' (soft purple)
- secondary: '#1D9E75' (teal green)
- error: '#E24B4A'
- warning: '#EF9F27'
- success: '#639922'
- Custom font: Inter (load from Google Fonts in index.html)
- borderRadius: 10
- Dense table rows
- Outlined inputs with rounded corners
- Card elevation 0 with subtle border: '1px solid rgba(255,255,255,0.07)'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — RTK QUERY (features/notes/notesApi.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create an RTK Query API slice with baseUrl: 'http://localhost:3000'

Endpoints:

  getNotes(params?: { status?: string, page?: number, limit?: number })
    → GET /api/notes
    → providesTags: [{ type: 'Notes', id: 'LIST' }]
    → transformResponse: normalize data, compute derived fields:
        - attemptCount: attempts.length
        - lastAttempt: attempts[attempts.length - 1] || null
        - isOverdue: status === 'pending' && releaseAt < now
        - nextRetryAt: compute from last attempt + backoff

  createNote(body: { title, body, releaseAt, webhookUrl })
    → POST /api/notes
    → invalidatesTags: [{ type: 'Notes', id: 'LIST' }]

  replayNote(id: string)
    → POST /api/notes/:id/replay
    → invalidatesTags: [{ type: 'Notes', id: 'LIST' }]

  getNoteById(id: string)
    → GET /api/notes/:id
    → providesTags: [{ type: 'Notes', id }]

Export the api slice and all hooks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — PAGES (implement all 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGES ARE DUMB — they only compose containers. No logic, no API calls.

── DashboardPage ──────────────────
Layout:
  Top row: 4 MetricCards
    [Total Notes] [Pending in Queue] [Delivered (24h)] [Dead / Failed]
  
  Below: NotesTableContainer (full width)

NotesTableContainer:
  - Calls useGetNotesQuery({ status, page, limit })
  - Filter bar: All | Pending | Delivered | Failed | Dead (toggle buttons)
  - Pagination controls
  - Table columns:
      ID (truncated, monospace, copy on click)
      Title + body preview
      Status (StatusBadge)
      Release At + CountdownChip if pending
      Attempts (AttemptPills — up to 5 pills, green=ok, red=fail)
      Last attempt: status code + duration
      Actions: [View Debug] [Replay if dead/failed]
  - Each row is clickable → expands NoteExpandedPanel inline
  - Framer Motion: rows animate in with staggered fade+slide on load
  - Framer Motion: status badge pulses green when status transitions to delivered
  - Show LoadingRow skeletons (5 rows) while fetching
  - Show EmptyState if no results

── CreateNotePage ──────────────────
Layout: Centered form card, max-width 600px

CreateNoteContainer:
  - Uses react-hook-form
  - Fields:
      title (required, max 100 chars, char counter)
      body (multiline, required)
      releaseAt (datetime-local input, must be future)
      webhookUrl (required, must be valid URL)
  - Submit calls useCreateNoteMutation
  - States:
      idle → button says "Schedule Note"
      loading → button disabled, shows CircularProgress
      success → show green success message + "Create Another" button
      error → show inline error from API response
  - Show a preview card on the right side (desktop) or below (mobile)
    that live-updates as the user types — shows how the note will look
    in the system with the current status "pending"

── LiveMonitorPage ──────────────────
THIS IS THE MOST IMPORTANT PAGE — make it visually rich.

LivePollContainer:
  - Calls useGetNotesQuery({}, { pollingInterval: 5000 })
  - Tracks previous data in a ref → detects changed rows between polls
  - Highlights changed rows with a brief amber flash animation (Framer Motion)
  - Shows a "Last updated: Xs ago" ticker that counts up
  - Shows "Polling active" indicator with animated pulse dot

Layout (3 sections):

  1. QUEUE STATUS BAR (top full-width)
     Visual pipeline: [API] → [Redis Queue] → [Worker] → [Sink]
     Each stage shows count of notes currently in that stage
     Animated connector lines between stages
     The active stage glows

  2. LIVE ACTIVITY FEED (left 40%)
     Scrolling list of recent system events (derived from notes data):
     - Note queued at HH:MM:SS
     - Delivery attempted — 200 OK (143ms)
     - Retry scheduled — backoff 25s
     - Note delivered successfully
     - Note marked dead after 3 failures
     Each event has an icon and color matching its type
     New events animate in from the top with slide+fade

  3. NOTES TABLE (right 60%)  
     Same as dashboard but with changed rows highlighted
     Show "LIVE" badge next to changed rows for 3 seconds after change
     Show countdown timers for pending notes

── DebugPage ──────────────────────
DebugPanelContainer:
  - Accepts a note ID from query params or selection
  - Calls useGetNoteByIdQuery(id)
  - Shows full note details at top

  Below: AttemptTimeline component
    - Vertical timeline of every attempt
    - Each attempt card shows:
        Attempt #N — [timestamp]
        HTTP POST → [webhookUrl]
        Response: [statusCode] [ok/fail badge]
        Duration: [durationMs]ms
        If failed: "Next retry in Xs (exponential backoff)"
        If last and dead: "No more retries — use Replay to requeue"
    - Animate each card in with staggered delay
    - Color-code: green border for ok, red border for fail

  Below timeline: show raw JSON of the note (collapsible code block)

  ReplayButtonContainer:
    - Only shows if status is failed or dead
    - Calls useReplayNoteMutation
    - Shows confirmation dialog before firing
    - On success: shows toast + invalidates query → list refreshes

── SystemFlowPage ──────────────────
FlowDiagram component — an animated conceptual flow diagram.

Show these 5 stages as cards connected by arrows:

  [Client / User]
       ↓ POST /api/notes
  [API Service]
       ↓ Save to MongoDB + BullMQ job (delay = releaseAt - now)
  [Redis Queue]
       ↓ Job fires at releaseAt
  [Worker Service]
       ↓ HTTP POST with idempotency key
  [Sink / Webhook Target]

For each stage card show:
  - Stage name + icon
  - What it does (1 sentence)
  - Tech used (Express, BullMQ, MongoDB, etc.)
  - Current count of notes in this stage (from API data)

Below the flow diagram, show 3 feature explanation cards:

  [Idempotency Guard]
  "The Sink checks Redis using SET NX. If the key already exists,
   the request is a duplicate — acknowledged but not processed again."
  Show a mini before/after: first delivery → key stored, second delivery → rejected

  [Exponential Backoff]
  "On failure, the Worker waits 1s, then 5s, then 25s before retrying."
  Show a visual timeline: Attempt 1 ✕ → wait 1s → Attempt 2 ✕ → wait 5s → Attempt 3

  [Dead Letter + Replay]
  "After MAX_DELIVERY_ATTEMPTS, the note becomes dead.
   Engineers can replay it from the admin UI."
  Show: dead badge → replay button → pending badge (animated loop)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — LAYOUT (layout/)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AppShell: persistent sidebar + topbar + main content area

Sidebar (240px wide, collapsible to 64px):
  Logo: "Drop" in white + "Later" in purple + "admin" in muted
  Nav items with icons:
    Dashboard        (DashboardIcon)
    Create Note      (AddCircleIcon)
    Live Monitor     (FiberManualRecordIcon — pulsing green)
    Debug Panel      (BugReportIcon)
    System Flow      (AccountTreeIcon)
  
  Bottom of sidebar:
    API status indicator: GET /health → green dot "API online" or red "offline"
    Sink status indicator: GET http://localhost:4000/health → same

Topbar:
  Left: current page title
  Right: 
    - "Poll interval: 5s" dropdown (5s / 10s / 30s / off) → controls all pollingIntervals
    - Total pending notes badge (from API)
    - Dark mode already forced

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — COMMON COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

StatusBadge({ status }):
  pending  → amber chip with clock icon
  delivered → green chip with check icon
  failed   → red chip with warning icon
  dead     → gray chip with skull/block icon
  Use MuiChip wrapper. Framer Motion: layoutId for smooth transitions.

AttemptPills({ attempts }):
  Row of small circles (16px):
  ok=true → filled green circle
  ok=false → filled red circle
  Show max 5, if more add "+N" text
  Tooltip on hover: "Attempt N: [statusCode] [durationMs]ms"

CountdownChip({ releaseAt }):
  If releaseAt is future: "fires in 2h 14m" (amber)
  If releaseAt is past and still pending: "overdue 5m" (red, pulsing)
  Updates every second using setInterval

MetricCard({ label, value, trend, color }):
  Dark surface card
  Large bold number in color
  Muted label below
  Optional trend: ↑ 12% today (green) or ↓ 3% (red)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8 — ANIMATIONS (Framer Motion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use these animation patterns consistently:

Page transitions:
  variants: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }
  transition: { duration: 0.25, ease: 'easeOut' }
  Wrap each page in <motion.div> with these variants

Table rows on load:
  staggerChildren: 0.04
  Each row: initial { opacity: 0, x: -8 } → animate { opacity: 1, x: 0 }

Status change flash:
  When status updates to 'delivered':
  Briefly flash the row background: backgroundColor ['transparent', '#1D9E7520', 'transparent']
  transition: { duration: 1.2, times: [0, 0.3, 1] }

Live poll highlight:
  Changed rows get a left border flash: borderLeft ['3px solid transparent', '3px solid #EF9F27', '3px solid transparent']

Activity feed items:
  New items slide in: initial { opacity: 0, height: 0, y: -10 } → animate { opacity: 1, height: 'auto', y: 0 }

Replay button:
  On success: scale [1, 1.15, 1] + color flash

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9 — TOAST NOTIFICATIONS (notistack)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wrap app in <SnackbarProvider maxSnack={3}>
Use enqueueSnackbar from notistack:

  createNote success  → variant: 'success', "Note scheduled for [releaseAt]"
  createNote error    → variant: 'error', show API error message
  replay success      → variant: 'success', "Note requeued successfully"
  replay error        → variant: 'error', message from API
  API offline         → variant: 'warning', "Cannot reach API — retrying"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 10 — MOCK DATA FALLBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Since the real API may not be running during development, implement this:

In notesApi.js: if API returns a network error (FETCH_ERROR), fall back to
returning mock data from src/features/notes/mockNotes.js

mockNotes.js must contain at least 8 notes covering ALL statuses:
- 2 pending (one overdue, one future)
- 2 delivered (with successful attempts)
- 2 failed (with mixed attempt history showing retries)
- 1 dead (with 3 failed attempts)
- 1 pending with 1 failed attempt (currently retrying)

Each mock note must have a complete attempts[] array so the debug panel
and attempt pills render realistically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 11 — ROUTING (main.jsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /              → DashboardPage
  /create        → CreateNotePage
  /live          → LiveMonitorPage
  /debug         → DebugPage
  /debug/:id     → DebugPage (with note preloaded)
  /system        → SystemFlowPage

All routes wrapped in <AppShell> (sidebar + topbar stay fixed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 12 — CODE RULES (enforce strictly)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. MUI components are ONLY imported inside src/mui/ wrappers.
   All other files import from src/mui/ — never from @mui directly.

2. API calls ONLY happen in containers and notesApi.js hooks.
   Components receive data as props only.

3. No business logic inside components.
   No useSelector, useDispatch, or RTK hooks inside components.

4. Containers own: API hooks, local UI state (expanded rows, filters),
   and pass everything down as props.

5. Pages own: layout composition only. No logic. No hooks except
   useParams/useNavigate from react-router.

6. Every component must have a clear PropTypes definition or JSDoc comment.

7. Framer Motion must be applied to: page wrapper, table rows, status badges,
   activity feed items, replay button, and status flash.

8. The app must work with mock data when the API is unreachable.
   Never show a blank screen — always show skeleton → empty state or mock data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build every file listed in the folder structure.
Do not skip any file.
After all files are created, run:

  npm run dev

The app must start with no errors on http://localhost:5173
Show the dashboard with mock data visible immediately.
All 5 pages must be navigable via the sidebar.
The live monitor page must show the poll ticker counting up.
The system flow page must show the animated pipeline diagram.

Output a final summary of:
- Every file created (path)
- Any deviations from the spec and why
- How to connect to the real API (env variable or config)