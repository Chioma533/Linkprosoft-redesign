# Employer Dashboard — Backend API Integration Overview

> **Audit date:** 2026-08-19  
> **Scope:** All 8 files in `src/pages/employer/`  
> **Purpose:** Identify every piece of mock data, hardcoded value, and missing backend integration so that each can be replaced with live API calls.

---

## Table of Contents

1. [File-by-File Audit](#file-by-file-audit)
   - [EmployerOverviewSubpage.jsx](#1-employeroverviewsubpagejsx)
   - [EmployerManageJobsSubpage.jsx](#2-employermanagejobssubpagejsx)
   - [EmployerBrowseProfessionalsSubpage.jsx](#3-employerbrowseprofessionalssubpagejsx)
   - [EmployerJobDetailsSubpage.jsx](#4-employerjobdetailssubpagejsx)
   - [EmployerOpenDisputeSubpage.jsx](#5-employeropendisputesubpagejsx)
   - [PostJobWizard.jsx](#6-postjobwizardjsx)
   - [EmployerDashboardPage.jsx](#7-employerdashboardpagejsx)
   - [EmployerMessagesSubpage.jsx](#8-employermessagessubpagejsx)
2. [API Service Layer Audit](#api-service-layer-audit)
3. [Missing Backend Endpoints Summary](#missing-backend-endpoints-summary)
4. [Priority Matrix](#priority-matrix)

---

## File-by-File Audit

---

### 1. EmployerOverviewSubpage.jsx

**File:** [`EmployerOverviewSubpage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerOverviewSubpage.jsx)

This is the employer's main dashboard landing page. It is **almost entirely hardcoded** — no API calls are made anywhere in the component.

#### 🔴 Hardcoded Mock Data (Lines 44–51) — Desktop Active Jobs Table

```js
const allActiveJobs = [
  { id: "ORD-87W7", title: "Wardrobe installation", professional: "David Jonathan", status: "Awaiting Escrow", actionText: "Fund Escrow", category: "Carpentry", budget: 45000 },
  { id: "ORD-87W8", title: "Kitchen Cabinet Setup", professional: "Sarah Okon", ... },
  // ... 6 total hardcoded jobs
];
```

**Needs:** `GET /api/jobs/me` (or `GET /api/jobs/my-jobs`) filtered for active/in-progress/awaiting-escrow statuses. The `jobService.getMyEmployerJobs()` method already exists but is **not called** from this component.

---

#### 🔴 Hardcoded Mock Data (Lines 54–59) — Mobile Active Jobs

```js
const allMobileActiveJobs = [
  { id: 1, title: "Wardrobe installation", client: "David Jonathan", category: "Carpentry", datePosted: "July 10", budget: 45000, status: "Active" },
  // ... 4 total hardcoded jobs
];
```

**Needs:** Same API as above — these should be the same dataset, just rendered differently for mobile.

---

#### 🔴 Hardcoded Metric Stats (Lines 139–142)

```jsx
<StatsCard title="Earnings" value={formatCurrency(500000)} ... />
<StatsCard title="Upcoming jobs" value="172" ... />
<StatsCard title="Completed jobs" value="1292" ... />
<StatsCard title="Performance" value="80%" ... />
```

All four values are hardcoded strings/numbers. **No API call is made.**

**Needs:** A dedicated **employer dashboard metrics endpoint**, e.g.:
- `GET /api/employers/dashboard/metrics` (does NOT currently exist in `apiPaths.js`)
- Or reuse `GET /api/professionals/dashboard/metrics` if it supports employer roles

**Expected response shape:**
```json
{
  "earningsTotal": 500000,
  "upcomingJobsCount": 172,
  "completedJobsCount": 1292,
  "performancePercentage": 80
}
```

---

#### 🔴 Hardcoded Escrow Overview (Lines 422–443)

```jsx
<h1>₦540,000</h1>          // hardcoded escrow balance
<p>4 active escrows</p>     // hardcoded count
```

**Needs:** An **escrow summary endpoint**, e.g.:
- `GET /api/payments/escrow/summary` (does NOT exist in `apiPaths.js`)

**Expected response shape:**
```json
{
  "totalHeld": 540000,
  "activeEscrowCount": 4,
  "details": [...]
}
```

---

#### 🔴 Hardcoded Performance Metrics (Lines 446–467)

```jsx
<div>75%</div>  // Response rate — hardcoded
<div>75%</div>  // Success rate — hardcoded
```

**Needs:** Same employer metrics endpoint or `GET /api/professionals/performance` (exists, but used for professionals, not called here for employers).

---

#### 🔴 Hardcoded Schedule Data (Lines 110–115)

```js
const schedule = [
  { id: "ORD-87W7", title: "Wardrobe installation", time: "11:00 AM", professional: "Johnatan david" },
  // ... 4 identical entries
];
```

**Needs:** A **schedule/appointments endpoint**, e.g.:
- `GET /api/schedules` or `GET /api/assignments?upcoming=true` (a `/api/schedules` endpoint is referenced in `notificationService.getSchedules()` but is a non-existent endpoint that silently falls back to `[]`)

---

#### 🔴 Hardcoded Pagination (Lines 209–214)

```jsx
<span>Page 1 of 1</span>
<button>1</button>
```

**Needs:** Server-side pagination metadata from the jobs API (`total`, `page`, `totalPages`, `limit`).

---

#### 🟡 Fallback User Name (Line 26)

```js
const userName = user?.fullName || user?.full_name || "Elvis Chimamanda";
```

The hardcoded fallback `"Elvis Chimamanda"` should be removed once auth is reliable.

---

#### Summary for EmployerOverviewSubpage

| Data Point | Current Source | Required API | Exists? |
|---|---|---|---|
| Active jobs table (desktop) | Inline array L44–51 | `GET /api/jobs/me` | ✅ Service exists, **not called** |
| Active jobs cards (mobile) | Inline array L54–59 | `GET /api/jobs/me` | ✅ Service exists, **not called** |
| Earnings stat | Hardcoded `500000` | Employer metrics endpoint | ❌ Missing endpoint |
| Upcoming jobs stat | Hardcoded `"172"` | Employer metrics endpoint | ❌ Missing endpoint |
| Completed jobs stat | Hardcoded `"1292"` | Employer metrics endpoint | ❌ Missing endpoint |
| Performance stat | Hardcoded `"80%"` | Employer metrics endpoint | ❌ Missing endpoint |
| Escrow balance | Hardcoded `540000` | Escrow summary endpoint | ❌ Missing endpoint |
| Active escrows count | Hardcoded `4` | Escrow summary endpoint | ❌ Missing endpoint |
| Response rate | Hardcoded `75%` | Performance endpoint | ⚠️ Professional only |
| Success rate | Hardcoded `75%` | Performance endpoint | ⚠️ Professional only |
| Schedule table | Inline array L110–115 | Schedules endpoint | ⚠️ Endpoint not live |
| Notifications | From `dashboardStore` | `GET /api/notifications` | ✅ Already integrated |
| Pagination | Hardcoded static | Server pagination | ❌ Not wired |

---

### 2. EmployerManageJobsSubpage.jsx

**File:** [`EmployerManageJobsSubpage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerManageJobsSubpage.jsx)

This page **does call** `jobService.getMyEmployerJobs()` — making it the most integrated employer page. However, several issues remain.

#### ✅ Live API Integration (Lines 34–67)

```js
const response = await jobService.getMyEmployerJobs();
```

This calls `GET /api/jobs/my-jobs`. **However**, the `jobService.getMyEmployerJobs()` method has a **catch-all fallback** that returns fake data if the API fails (see `jobService.js` L76–141). This masks backend failures.

---

#### 🔴 Hardcoded Mobile Stats (Lines 165–168)

```jsx
<StatsCard title="Active jobs" value={formatCurrency(500000)} ... />
<StatsCard title="Upcoming jobs" value={upcomingJobsCount || "172"} ... />
<StatsCard title="Completed jobs" value={completedJobsCount || "1292"} ... />
<StatsCard title="Total earnings" value="80%" ... />
```

The `||` fallbacks mean if the API returns `0` (falsy), the hardcoded values `"172"` and `"1292"` will display instead. The `"Active jobs"` card always shows hardcoded `₦500,000`, and `"Total earnings"` always shows hardcoded `"80%"`.

**Needs:** Replace with proper employer metrics API. Use nullish coalescing (`??`) instead of `||`.

---

#### 🔴 Hardcoded `datePosted` (Line 278)

```jsx
datePosted: "July 10",
```

When rendering mobile job cards, the `datePosted` field is hardcoded to `"July 10"` instead of using the job's actual `createdAt` timestamp.

**Needs:** Map `job.createdAt` from the API response to a formatted date string.

---

#### 🔴 Hardcoded Pagination (Lines 291–300)

```jsx
<span>Page 1 of 5</span>
<button>1</button><button>2</button><button>3</button>...<button>5</button>
```

Fully static, non-functional pagination. The API response from `getMyEmployerJobs()` does return `total`, `page`, `limit`, `totalPages` — but they are **not used**.

**Needs:** Wire pagination state to the API call parameters and render dynamically.

---

#### 🔴 Hardcoded Filter Categories (Lines 193–197, 350–354)

```jsx
<option value="Carpentry">Carpentry</option>
<option value="Plumbing">Plumbing</option>
<option value="Electrical">Electrical</option>
<option value="General">General</option>
```

Category/location filters are hardcoded `<option>` elements.

**Needs:** `GET /api/search/filters` to dynamically populate categories and locations. The `searchService.getFilters()` method exists but is **not called**.

---

#### 🔴 Sorting is non-functional (Lines 357–362)

```jsx
<select>
  <option>Sort by: Newest</option>
  <option>Sort by: Oldest</option>
</select>
```

The sort dropdown is present but has **no `onChange` handler** and does **not** pass sort params to the API.

**Needs:** Wire sort value to the `fetchEmployerJobs` query params.

---

#### Summary for EmployerManageJobsSubpage

| Data Point | Current Source | Required API | Exists? |
|---|---|---|---|
| Jobs list | ✅ `jobService.getMyEmployerJobs()` | `GET /api/jobs/my-jobs` | ✅ Called (has fallback mock) |
| Active jobs stat | Hardcoded `₦500,000` | Employer metrics | ❌ Missing |
| Upcoming jobs stat | Fallback `"172"` | Employer metrics | ❌ Missing |
| Completed jobs stat | Fallback `"1292"` | Employer metrics | ❌ Missing |
| Total earnings stat | Hardcoded `"80%"` | Employer metrics | ❌ Missing |
| `datePosted` on cards | Hardcoded `"July 10"` | Use `createdAt` from API | ✅ Available, not mapped |
| Pagination | Static HTML | API pagination params | ✅ Available, not wired |
| Category filters | Static `<option>` | `GET /api/search/filters` | ✅ Service exists, not called |
| Sort functionality | No handler | Sort query param | ✅ Available, not wired |

---

### 3. EmployerBrowseProfessionalsSubpage.jsx

**File:** [`EmployerBrowseProfessionalsSubpage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerBrowseProfessionalsSubpage.jsx)

This is the **best-integrated** employer page — it calls `searchService.searchProfessionalsByProfession()` and `searchService.getSkillSuggestions()`.

#### ✅ Live API Integrations

- Professional search: `searchService.searchProfessionalsByProfession()` → `GET /api/search/professionals` ✅
- Skill autocomplete: `searchService.getSkillSuggestions()` → `GET /api/search/skills` ✅
- Pagination: Dynamically uses `page`, `totalPages`, `total` from API ✅

#### 🔴 Hardcoded Mobile Stats (Lines 221–224)

```jsx
<StatsCard title="Active jobs" value={formatCurrency(500000)} ... />
<StatsCard title="Upcoming jobs" value="172" ... />
<StatsCard title="Completed jobs" value="1292" ... />
<StatsCard title="Performance" value="80%" ... />
```

All four stat cards are 100% hardcoded — identical to the Overview page.

**Needs:** Same employer metrics endpoint.

---

#### 🔴 Hardcoded Location Filter Options (Lines 249–253, 466–469)

```jsx
<option>All Locations</option>
<option>Lekki</option>
<option>Ikeja</option>
```

Only two locations hardcoded.

**Needs:** `GET /api/search/filters` → `{ locations: [...] }`. The service method exists but is **not called**.

---

#### 🔴 "Invite" Button — No Backend Action (Lines 366–369, 579–583)

```jsx
<button onClick={() => toast.success(`Invitation request sent to ${pro.name}!`)}>
  Invite
</button>
```

The "Invite to Project" button only shows a toast — no actual API call.

**Needs:** An **invitation endpoint**, e.g.:
- `POST /api/jobs/:jobId/invite` or `POST /api/applications/invite`
- Does NOT exist in `apiPaths.js`

---

#### 🔴 "Message" Button — No Backend Action (Lines 572–577)

```jsx
<button>
  <FiMail /> Message
</button>
```

The "Message" button has **no `onClick` handler** at all.

**Needs:** Should create/navigate to a chat thread via `messagingService.createThread(professionalUserId)` → `POST /api/chat/threads`. The service exists but is **not called**.

---

#### 🔴 "Bookmark" Button — No Backend Action (Lines 347–349)

```jsx
<button><FiBookmark /></button>
```

No `onClick`, no state, purely decorative.

**Needs:** A **bookmark/save professional endpoint**, e.g.:
- `POST /api/bookmarks` or `POST /api/employers/saved-professionals`
- Does NOT exist in `apiPaths.js`

---

#### Summary for EmployerBrowseProfessionalsSubpage

| Data Point | Current Source | Required API | Exists? |
|---|---|---|---|
| Professional search results | ✅ `searchService` | `GET /api/search/professionals` | ✅ Integrated |
| Skill autocomplete | ✅ `searchService` | `GET /api/search/skills` | ✅ Integrated |
| Pagination | ✅ Dynamic | API pagination | ✅ Integrated |
| Stats cards (mobile) | Hardcoded | Employer metrics | ❌ Missing |
| Location filter options | Hardcoded 2 locations | `GET /api/search/filters` | ✅ Not called |
| "Invite" button | Toast only | Invitation endpoint | ❌ Missing endpoint |
| "Message" button | No handler | `POST /api/chat/threads` | ✅ Not called |
| "Bookmark" button | No handler | Bookmark endpoint | ❌ Missing endpoint |

---

### 4. EmployerJobDetailsSubpage.jsx

**File:** [`EmployerJobDetailsSubpage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerJobDetailsSubpage.jsx)

This page is **100% hardcoded** — zero API calls. It receives a `jobId` prop but never fetches any data with it.

#### 🔴 All Job Details Hardcoded (Lines 41–67)

```jsx
<h2>Wardrobe Installation</h2>               // hardcoded title
<span>In Progress</span>                      // hardcoded status
<p>ID: {jobId || "ORD657783"} • Carpentry</p> // hardcoded category
<p>📍 Lekki Lagos • ₦500,000</p>              // hardcoded location & budget
<span>Johnathan David</span>                   // hardcoded professional name
```

**Needs:** `GET /api/jobs/:id` via `jobService.getJobById(jobId)` — this service method **already exists** but is **not called**.

---

#### 🔴 All Escrow/Payment Data Hardcoded (Lines 89–127)

```jsx
<h2>₦540,000</h2>              // Total project budget
<span>₦500,000</span>           // Total funded
<span>₦150,000</span>           // Released
<span>₦350,000</span>           // Remaining balance
<span>100% Funded</span>        // Progress percentage
```

**Needs:** Job-specific payment/escrow details, e.g.:
- `GET /api/payments?jobId=:id` or `GET /api/assignments/:id` with escrow breakdown
- The `PAYMENTS.GET_PAYMENTS` path exists but is **not called**

---

#### 🔴 Chat Messages Hardcoded (Lines 6–8)

```js
const [messages, setMessages] = useState([
  { id: 1, sender: "Marvelous Samuel", text: "Going well!...", time: "11:24 AM", isMe: false }
]);
```

Only one hardcoded message. Sending messages (line 11–24) just appends to local state — no API call.

**Needs:**
- `GET /api/chat/threads/:threadId/messages` via `messagingService.getMessages()` — exists, not called
- `POST /api/chat/threads/:threadId/messages` via `messagingService.sendMessage()` — exists, not called

---

#### 🔴 "Mark as Completed" — No Backend Action (Lines 26–28)

```js
const handleMarkAsCompleted = () => {
  toast.success("Project marked as completed!...");
};
```

Toast only, no API call.

**Needs:** `PUT /api/assignments/:id` with `{ status: "completed" }` or `POST /api/assignments/:id/approve-satisfaction`. The `ASSIGNMENTS.UPDATE_ASSIGNMENT` and `ASSIGNMENTS.APPROVE_SATISFACTION` paths exist but are **not wired**.

---

#### 🔴 Progress Gallery — Placeholder Only (Lines 131–148)

```jsx
<div className="aspect-square bg-slate-100 ...">
  <span>Framing Structure</span>
</div>
```

Four placeholder divs with text labels — no actual images.

**Needs:** Job progress uploads endpoint, e.g.:
- `GET /api/jobs/:id/gallery` or `GET /api/assignments/:id/uploads`
- Does NOT exist in `apiPaths.js`

---

#### 🔴 Professional Info Hardcoded (Lines 154–161)

```jsx
<div>MS</div>                           // hardcoded initials
<h3>Marvelous Samuel</h3>               // hardcoded name
<span>Online</span>                      // hardcoded online status
```

**Needs:** Should come from the job/assignment response (`assignedProfessional`) or `GET /api/chat/users/:userId`.

---

#### Summary for EmployerJobDetailsSubpage

| Data Point | Current Source | Required API | Exists? |
|---|---|---|---|
| Job title, status, category, budget, location | All hardcoded | `GET /api/jobs/:id` | ✅ Service exists, **not called** |
| Professional name & initials | Hardcoded "Johnathan David" | From job response | ✅ Available |
| Escrow total/funded/released/remaining | All hardcoded | Payment/escrow endpoint | ⚠️ Path exists, not called |
| Progress percentage bar | Hardcoded 100% | Escrow endpoint | ⚠️ Path exists, not called |
| Chat messages | 1 hardcoded message | `GET /api/chat/threads/:id/messages` | ✅ Service exists, **not called** |
| Send message | Local state only | `POST /api/chat/threads/:id/messages` | ✅ Service exists, **not called** |
| "Mark as completed" | Toast only | `PUT /api/assignments/:id` | ⚠️ Path exists, not called |
| Progress gallery images | Placeholder text | Gallery/uploads endpoint | ❌ Missing endpoint |
| Professional online status | Hardcoded "Online" | WebSocket/presence | ❌ Missing |

---

### 5. EmployerOpenDisputeSubpage.jsx

**File:** [`EmployerOpenDisputeSubpage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerOpenDisputeSubpage.jsx)

**Zero API calls.** The entire form submission is simulated with `setTimeout`.

#### 🔴 Dispute Submission — Simulated (Lines 22–27)

```js
setIsSubmitting(true);
setTimeout(() => {
  setIsSubmitting(false);
  toast.success("Dispute raised successfully!...");
  onBack();
}, 1500);
```

**Needs:** `POST /api/assignments/:id/dispute-satisfaction` → `ASSIGNMENTS.DISPUTE_SATISFACTION(id)`. The API path **exists** in `apiPaths.js` but is **not called**.

**Required payload:**
```json
{
  "reason": "delays",
  "explanation": "...",
  "requestedRefundAmount": 350000
}
```

---

#### 🔴 Project/Professional Info Hardcoded (Lines 59–67)

```jsx
<span>Wardrobe Installation (ID: {jobId || "ORD657783"})</span>
<span>Johnathan David</span>
```

**Needs:** Fetch job details via `jobService.getJobById(jobId)` to populate project name and professional name dynamically.

---

#### 🔴 Max Refund Amount Hardcoded (Line 110)

```jsx
<span>Note: You can request up to the maximum remaining escrow balance (₦350,000).</span>
```

**Needs:** The actual remaining escrow balance from the payment/escrow endpoint.

---

#### Summary for EmployerOpenDisputeSubpage

| Data Point | Current Source | Required API | Exists? |
|---|---|---|---|
| Dispute form submission | `setTimeout` mock | `POST /api/assignments/:id/dispute-satisfaction` | ✅ Path exists, **not called** |
| Job title & ID | Partial (uses `jobId` prop) | `GET /api/jobs/:id` | ✅ Service exists, not called |
| Professional name | Hardcoded "Johnathan David" | From job response | ✅ Available |
| Max refund amount | Hardcoded "₦350,000" | Escrow balance endpoint | ❌/⚠️ Not available |

---

### 6. PostJobWizard.jsx

**File:** [`PostJobWizard.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/PostJobWizard.jsx)

This is **well-integrated**. It calls `jobService.createJob()` which hits `POST /api/jobs`.

#### ✅ Live API Integration (Lines 35–68)

```js
const response = await jobService.createJob(payload);
```

However, `jobService.createJob()` has a **catch-all fallback** that returns a simulated success response if the API fails (see `jobService.js` L26–44). This silently masks failures.

#### 🟡 Missing `category` / `skillId` in Payload (Lines 44–52)

```js
const payload = {
  title: data.title,
  description: data.description,
  budget: ...,
  currency: "NGN",
  durationDays,
  location: data.location || undefined,
  visibility: "public",
};
```

The wizard collects `data.category` (from Step1) but **does not include** `category` or `skillId` in the API payload. The backend `createJob` endpoint expects `skillId` per the `jobService` JSDoc.

**Needs:** Map `data.category` to a `skillId` before submitting. May need `GET /api/skills` to resolve skill name → ID.

---

#### Summary for PostJobWizard

| Data Point | Current Source | Required API | Exists? |
|---|---|---|---|
| Job creation | ✅ `jobService.createJob()` | `POST /api/jobs` | ✅ (has fallback mock) |
| Category → skillId mapping | Missing | `GET /api/skills` | ✅ Path exists, not called here |

---

### 7. EmployerDashboardPage.jsx

**File:** [`EmployerDashboardPage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerDashboardPage.jsx)

This is a **routing shell** only — it renders the correct subpage based on `activeTab`. No API calls needed at this level.

#### 🟡 Hardcoded Default `selectedJobId` (Line 14)

```js
const [selectedJobId, setSelectedJobId] = useState("ORD657783");
```

The default job ID should be `null` and only set when a user clicks "View Project".

---

### 8. EmployerMessagesSubpage.jsx

**File:** [`EmployerMessagesSubpage.jsx`](file:///c:/Users/HP/Linkprosoft-redesign/src/pages/employer/EmployerMessagesSubpage.jsx)

This file is a **simple re-export** of `MessagesPage`:

```js
import MessagesPage from "../MessagesPage";
export default MessagesPage;
```

No employer-specific mock data here — integration status depends on `MessagesPage.jsx`. The `messagingService` methods exist and should be used by `MessagesPage`.

---

## API Service Layer Audit

### jobService.js — Fallback Mock Data

**File:** [`jobService.js`](file:///c:/Users/HP/Linkprosoft-redesign/src/api/services/jobService.js)

| Method | API | Fallback Mock? | Issue |
|---|---|---|---|
| `createJob()` | `POST /api/jobs` | ✅ **Yes** (L26–44) | Returns fake success on API failure, hiding real errors |
| `getJobs()` | `GET /api/jobs` | ❌ Throws | Clean |
| `getMyEmployerJobs()` | `GET /api/jobs/my-jobs` | ✅ **Yes** (L76–141) | Returns 5 hardcoded jobs on API failure |
| `getJobById()` | `GET /api/jobs/:id` | ❌ Throws | Clean |
| `updateJob()` | `PUT /api/jobs/:id` | ❌ Throws | Clean |
| `deleteJob()` | `DELETE /api/jobs/:id` | ❌ Throws | Clean |
| `getJobMatches()` | `GET /api/jobs/:id/matches` | ❌ Throws | Clean |

> [!WARNING]
> `createJob()` and `getMyEmployerJobs()` silently return mock data on API failure. This is dangerous for production — you'll never know the backend is down.

### notificationService.js — Mock Exports

**File:** [`notificationService.js`](file:///c:/Users/HP/Linkprosoft-redesign/src/api/services/notificationService.js)

Contains exported mock constants (`mockMessages`, `mockNotifications`, `mockPerformance`, `mockSchedules`) at the top of the file (L5–35). These are not actively used by employer pages but should be cleaned up.

The `getSchedules()` method calls `GET /api/schedules` which does not exist in `apiPaths.js` — it falls back silently to `[]`.

### projectService.js — Large Mock Arrays

**File:** [`projectService.js`](file:///c:/Users/HP/Linkprosoft-redesign/src/api/services/projectService.js)

Contains 10 hardcoded `mockJobs` (L5–158) and 4 `mockApplications` (L160–205) at the top of the file. These are **not actively used** (the service methods make real API calls) but represent dead code that should be removed.

---

## Missing Backend Endpoints Summary

These are endpoints that the employer UI **needs** but that do **NOT** currently exist in `apiPaths.js`:

| # | Endpoint | Purpose | Used By |
|---|---|---|---|
| 1 | `GET /api/employers/dashboard/metrics` | Earnings, upcoming/completed job counts, performance % | Overview, ManageJobs, BrowseProfessionals (stats cards) |
| 2 | `GET /api/payments/escrow/summary` | Total escrow held, active escrow count | Overview (escrow card) |
| 3 | `GET /api/payments/escrow/:jobId` | Per-job escrow breakdown (funded/released/remaining) | JobDetails (escrow status) |
| 4 | `GET /api/jobs/:id/gallery` | Progress images/uploads for a job | JobDetails (gallery section) |
| 5 | `POST /api/jobs/:jobId/invite` | Invite a professional to a job | BrowseProfessionals (invite button) |
| 6 | `POST /api/employers/saved-professionals` | Bookmark/save a professional | BrowseProfessionals (bookmark button) |
| 7 | `GET /api/schedules` | Employer upcoming schedule/appointments | Overview (schedule table) |
| 8 | WebSocket presence API | Online/offline status of professionals | JobDetails (chat header) |

---

## Priority Matrix

### 🔴 P0 — Critical (Core Functionality Broken Without These)

| Task | File(s) | Effort |
|---|---|---|
| Wire `jobService.getMyEmployerJobs()` into EmployerOverviewSubpage | `EmployerOverviewSubpage.jsx` | Small |
| Wire `jobService.getJobById(jobId)` into EmployerJobDetailsSubpage | `EmployerJobDetailsSubpage.jsx` | Small |
| Wire `messagingService` into JobDetails chat (load + send messages) | `EmployerJobDetailsSubpage.jsx` | Medium |
| Wire `ASSIGNMENTS.DISPUTE_SATISFACTION` into dispute form submission | `EmployerOpenDisputeSubpage.jsx` | Small |
| Wire `ASSIGNMENTS.APPROVE_SATISFACTION` or `UPDATE_ASSIGNMENT` for "Mark as Completed" | `EmployerJobDetailsSubpage.jsx` | Small |
| Remove fallback mock data from `jobService.createJob()` | `jobService.js` | Small |
| Remove fallback mock data from `jobService.getMyEmployerJobs()` | `jobService.js` | Small |

### 🟠 P1 — High Priority (UI Shows Wrong Data)

| Task | File(s) | Effort |
|---|---|---|
| Build & integrate employer dashboard metrics endpoint | Backend + Overview, ManageJobs, BrowseProfessionals | Medium (backend) |
| Build & integrate escrow summary endpoint | Backend + Overview | Medium (backend) |
| Build & integrate per-job escrow breakdown endpoint | Backend + JobDetails | Medium (backend) |
| Wire `searchService.getFilters()` for dynamic category/location dropdowns | ManageJobs, BrowseProfessionals | Small |
| Fix `||` fallbacks to `??` in ManageJobs stats | `EmployerManageJobsSubpage.jsx` | Trivial |
| Map `createdAt` to `datePosted` in ManageJobs mobile cards | `EmployerManageJobsSubpage.jsx` | Trivial |
| Wire pagination in ManageJobs to API params | `EmployerManageJobsSubpage.jsx` | Small |
| Wire sort dropdown in ManageJobs to API params | `EmployerManageJobsSubpage.jsx` | Small |

### 🟡 P2 — Medium Priority (Feature Gaps)

| Task | File(s) | Effort |
|---|---|---|
| Build & integrate invite-professional endpoint | Backend + BrowseProfessionals | Medium (backend) |
| Wire "Message" button to `messagingService.createThread()` | BrowseProfessionals | Small |
| Build & integrate bookmark/save-professional endpoint | Backend + BrowseProfessionals | Medium (backend) |
| Build & integrate schedule/appointments endpoint | Backend + Overview | Medium (backend) |
| Include `skillId` in PostJobWizard payload | `PostJobWizard.jsx` | Small |
| Add `category` field in PostJobWizard API payload | `PostJobWizard.jsx` | Trivial |

### ⚪ P3 — Cleanup

| Task | File(s) | Effort |
|---|---|---|
| Remove `mockJobs` and `mockApplications` arrays from `projectService.js` | `projectService.js` | Trivial |
| Remove `mockMessages`, `mockNotifications`, `mockPerformance`, `mockSchedules` from `notificationService.js` | `notificationService.js` | Trivial |
| Remove hardcoded fallback name `"Elvis Chimamanda"` | Multiple files | Trivial |
| Change default `selectedJobId` from `"ORD657783"` to `null` | `EmployerDashboardPage.jsx` | Trivial |
| Build progress gallery/uploads endpoint | Backend + JobDetails | Medium (backend) |
| Add WebSocket presence for professional online status | Backend + JobDetails | Large (backend) |
