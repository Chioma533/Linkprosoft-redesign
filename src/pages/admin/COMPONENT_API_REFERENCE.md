# Component API Reference - Verification Screens

Comprehensive props documentation for all verification components.

---

## 1. VerificationSuccessModal

**File:** `src/pages/admin/components/VerificationSuccessModal.jsx`

### Purpose

Display a celebration modal confirming successful verification approval.

### Props

```typescript
interface VerificationSuccessModalProps {
  userName: string; // User's full name for personalized message
  onClose: () => void; // Callback when closing modal
  onViewDetails?: () => void; // Callback for "View Details" button
}
```

### Examples

```jsx
// Basic usage
<VerificationSuccessModal
  userName="David Kim"
  onClose={() => setShowModal(false)}
/>

// With navigation handler
<VerificationSuccessModal
  userName="Sarah Connor"
  onClose={() => setShowModal(false)}
  onViewDetails={() => navigate(`/admin/users/${userId}`)}
/>

// In state management
const [showSuccessModal, setShowSuccessModal] = useState(false);

const handleApproveSuccess = (userName) => {
  setShowSuccessModal(true);
  // Auto-dismiss after 5 seconds (optional)
  setTimeout(() => setShowSuccessModal(false), 5000);
};

return (
  <>
    {showSuccessModal && (
      <VerificationSuccessModal
        userName={userName}
        onClose={() => setShowSuccessModal(false)}
        onViewDetails={() => console.log('View details')}
      />
    )}
  </>
);
```

### Styling Notes

- Responsive: Bottom drawer on mobile, centered modal on desktop
- Backdrop: Semi-transparent black with blur effect
- Colors: Green checkmark, white background, blue action buttons
- Animation: Smooth transitions on modal entry/exit

### Accessibility

- ✅ Close button always accessible (top-right)
- ✅ Backdrop click dismisses modal
- ✅ Two clear action paths
- ✅ Readable text contrast
- ✅ Focus trap implementation ready

---

## 2. VerificationReviewModal

**File:** `src/pages/admin/components/VerificationReviewModal.jsx`

### Purpose

Modal for reviewing verification documents and making approval/rejection decisions.

### Props

```typescript
interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  role: "Professional" | "Employer";
  docType: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  details: {
    address: string;
    nationality: string;
    dob: string;
    phone: string;
  };
  rejectionReason?: string;
}

interface VerificationReviewModalProps {
  request: VerificationRequest; // The request to review
  onClose: () => void; // Close modal callback
  onApprove: (requestId: string) => void; // Approval callback
  onReject: (requestId: string, reason: string) => void; // Rejection callback
}
```

### Examples

```jsx
// Basic setup in parent component
const [selectedRequest, setSelectedRequest] = useState(null);

const handleApprove = (reqId) => {
  // Call API or update state
  console.log("Approved:", reqId);
  // Update request status
  updateRequestStatus(reqId, "approved");
  // Close modal
  setSelectedRequest(null);
};

const handleReject = (reqId, reason) => {
  // Call API or update state
  console.log("Rejected:", reqId, reason);
  // Update request with rejection reason
  updateRequestStatus(reqId, "rejected", reason);
  // Close modal
  setSelectedRequest(null);
};

// Render modal conditionally
return (
  <>
    {selectedRequest && (
      <VerificationReviewModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    )}
  </>
);

// Trigger from list item
<button onClick={() => setSelectedRequest(request)}>Review Document</button>;
```

### Request Status Handling

```jsx
// Different modal states based on request.status
const request = {
  id: 'REQ-201',
  status: 'pending'  // Shows action buttons
};

// After approval:
{
  id: 'REQ-201',
  status: 'approved'  // Shows success message, no action buttons
}

// After rejection:
{
  id: 'REQ-201',
  status: 'rejected',
  rejectionReason: 'Blurry photo: The uploaded image is not clear...'
  // Shows rejection feedback, no action buttons
}
```

### Form Data Handling

The modal includes a textarea for rejection feedback. To capture additional metadata:

```jsx
const [rejectionMetadata, setRejectionMetadata] = useState({
  category: "Image Quality",
  details: "",
  flaggedFor: "resubmission", // or 'manual_review', 'appeal'
});

const handleReject = (reqId, reason) => {
  onReject(reqId, {
    reason,
    category: rejectionMetadata.category,
    timestamp: new Date().toISOString(),
    reviewedBy: currentAdmin.id,
  });
};
```

### Styling Notes

- Mobile: Bottom drawer with `rounded-t-3xl`, 95vh height
- Desktop: Centered modal with max-w-2xl, 85vh height
- Document previews: 160px on mobile, 176px on tablet, 224px on desktop
- Buttons: Full-width stacked on mobile, horizontal row on desktop

### Loading States

```jsx
const [isProcessing, setIsProcessing] = useState(false);

const handleApproveWithLoading = async (reqId) => {
  setIsProcessing(true);
  try {
    await approveVerification(reqId);
    onApprove(reqId);
  } finally {
    setIsProcessing(false);
  }
};

// Button shows loading state
<button disabled={isProcessing}>
  {isProcessing ? "Processing..." : "Approve"}
</button>;
```

---

## 3. VerificationRequestDetailPage

**File:** `src/pages/admin/components/VerificationRequestDetailPage.jsx`

### Purpose

Full-page verification review with detailed layout and sticky components.

### Props

```typescript
interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  role: "Professional" | "Employer";
  docType: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  details: {
    address: string;
    nationality: string;
    dob: string;
    phone: string;
  };
  rejectionReason?: string;
}

interface VerificationRequestDetailPageProps {
  request: VerificationRequest; // The request to review
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
}
```

### Examples

```jsx
// Route-based implementation
import { useParams, useNavigate } from "react-router-dom";

export default function VerificationDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch request from API
    fetchRequest(requestId)
      .then(setRequest)
      .finally(() => setLoading(false));
  }, [requestId]);

  const handleApprove = (reqId) => {
    approveVerification(reqId)
      .then(() => {
        toast.success("Approved!");
        setRequest((prev) => ({ ...prev, status: "approved" }));
      })
      .catch((err) => toast.error("Failed to approve"));
  };

  const handleReject = (reqId, reason) => {
    rejectVerification(reqId, reason)
      .then(() => {
        toast.success("Rejected");
        navigate("/admin/verification");
      })
      .catch((err) => toast.error("Failed to reject"));
  };

  if (loading) return <LoadingSpinner />;
  if (!request) return <NotFoundPage />;

  return (
    <VerificationRequestDetailPage
      request={request}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}

// Add route to router config
<Route
  path="/admin/verification/:requestId"
  element={<VerificationDetailPage />}
/>;
```

### Navigation Integration

```jsx
// Back button uses navigate(-1)
import { useNavigate } from "react-router-dom";

// Component includes:
<button onClick={() => navigate(-1)}>
  <ArrowLeft /> Back
</button>;

// Integrates with modal chain
// List → Click Review → Modal
// List → Click Details Link → Full Page
// Both lead to same component or different implementations
```

### Rejection Flow with Categories

```jsx
// The component includes rejection category selector
const rejectionReasons = [
  "Blurry or unclear image",
  "Document partially cut off",
  "Mismatched names",
  "Expired ID document",
  "Document not legible",
  "Face does not match document",
  "Other reason",
];

// User must select category AND provide details
// Form validation ensures both fields are filled

// Store rejection details
const rejectionData = {
  category: "Blurry or unclear image",
  details:
    "The uploaded ID is not clear enough to verify. Please upload a high-resolution scan.",
  timestamp: "2026-09-01T10:30:00Z",
  reviewerNotes: "Critical details obscured",
};
```

### Success Modal Integration

```jsx
// Automatically shows success modal on approval
const [showSuccessModal, setShowSuccessModal] = useState(false);

const handleApprove = (reqId) => {
  onApprove(reqId);
  setShowSuccessModal(true);
  // Modal closes automatically or user clicks action
};

return (
  <>
    <VerificationRequestDetailPage {...props} />

    {showSuccessModal && (
      <VerificationSuccessModal
        userName={request.name}
        onClose={() => setShowSuccessModal(false)}
        onViewDetails={() => navigate(`/admin/users/${request.id}`)}
      />
    )}
  </>
);
```

### Layout Sections

```jsx
// Component structure:
// 1. Sticky header with back button and status
<div className="sticky top-0 z-40">
  <ArrowLeft /> Verification Request #REQ-201
  <span>pending</span>
</div>

// 2. Main content area (two-column on desktop)
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

  // 2a. Left column (2/3 width on desktop)
  <div className="lg:col-span-2">

    // Applicant info card
    <div>User name, email, role details...</div>

    // Documents section
    <div>
      <div>Document preview (160-224px tall)</div>
      <div>Selfie preview (160-224px tall)</div>
    </div>

  </div>

  // 2b. Right column (1/3 width on desktop, full width on mobile)
  <div className="lg:col-span-1">

    // Review decision panel (sticky on desktop, flows on mobile)
    <div className="sticky top-24">
      Rejection category selector
      Additional details textarea
      Action buttons (Reject/Approve)
    </div>

  </div>
</div>
```

### Styling Notes

- Header: Max-width 6xl container, sticky at top
- Content grid: 3-column layout (768px breakpoint switches to single column)
- Info grid: 2-column on all sizes (responsive within 2 cols)
- Document cards: 1 column on mobile, 2 on desktop
- Sidebar panel: Sticky on desktop (top-24 offset), flows on mobile
- Buttons: Full-width stack on mobile, row on desktop

---

## 4. AdminVerificationSubpage

**File:** `src/pages/admin/AdminVerificationSubpage.jsx`

### Purpose

List view of all verification requests with filtering, search, and quick actions.

### No Props Required

This is a standalone subpage that manages its own state.

```jsx
import AdminVerificationSubpage from "./AdminVerificationSubpage";

// Use directly in dashboard
<AdminVerificationSubpage />;
```

### Internal State

```jsx
// Manages internally:
const [selectedRequest, setSelectedRequest] = useState(null); // For modal
const [searchQuery, setSearchQuery] = useState(""); // Search input
const [activeTab, setActiveTab] = useState("pending"); // Tab state
const [docFilter, setDocFilter] = useState("all"); // Document filter
const [requests, setRequests] = useState([...initialRequests]); // Request list
```

### Features

#### Tab Navigation

- **Pending** - Requests awaiting review (shows count badge)
- **Approved** - Accepted verification requests
- **Rejected** - Denied verification requests
- **All Requests** - View all requests regardless of status

#### Search & Filters

- **Search:** By name or email (case-insensitive)
- **Document Filter:** ID, Licenses, Diplomas, or All types
- **Results:** Updated in real-time as filters change

#### List Display

- **Mobile (< 768px):** Stacked card layout

  ```
  [Avatar] Name           [Status]
          Role • DocType
  ────────────────────────────────
  Submitted Date    [Review Button]
  ```

- **Desktop (≥ 768px):** Table format
  ```
  | Name    | Doc Type | Date     | Status | [Review] |
  | ─────── | ──────── | ──────── | ────── | ──────── |
  | Rows... |          |          |        |          |
  ```

#### Actions

- **Review Button:** Opens `VerificationReviewModal`
- **Link Behavior:** Can be adapted to route to full-page detail view

### Seeded Data

Component includes 5 pre-loaded verification requests:

```javascript
[
  {
    id: "REQ-201",
    name: "David Kim",
    email: "david.k@professional.com",
    role: "Professional",
    docType: "Engineering Diploma",
    date: "2026-08-29",
    status: "pending",
    details: {
      /* ... */
    },
  },
  // ... 4 more requests with various statuses
];
```

### Responsive Styling

```jsx
// Tab container
<div className="flex bg-gray-50 p-1 rounded-xl w-fit overflow-x-auto">
  {/* Tabs scroll horizontally on mobile */}
  <button className="px-3 sm:px-4 ... whitespace-nowrap">
    Pending <span className="bg-amber-500 ...">24</span>
  </button>
</div>

// Filter section
<div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
  {/* Stack vertically on mobile, row on desktop */}
  <input className="w-full sm:w-56" />
  <select className="w-full sm:w-auto" />
</div>

// Table vs Card view
<div className="hidden md:block">
  {/* Table: Only shown on desktop */}
</div>

<div className="md:hidden divide-y">
  {/* Cards: Only shown on mobile */}
</div>
```

---

## Data Structure Reference

### VerificationRequest Object

```typescript
interface VerificationRequest {
  // Identifiers
  id: string; // e.g., "REQ-201"

  // User Info
  name: string; // e.g., "David Kim"
  email: string; // e.g., "david.k@professional.com"
  role: string; // "Professional" or "Employer"

  // Verification Details
  docType: string; // e.g., "Engineering Diploma", "ID Document", "Business License"
  date: string; // Submission date, e.g., "2026-08-29"
  status: string; // "pending", "approved", or "rejected"

  // Additional Details
  details: {
    address: string; // Physical address
    nationality: string; // Country
    dob: string; // Date of birth, e.g., "1994-06-15"
    phone: string; // Phone number
    docUrl?: string; // URL to uploaded document
    selfieUrl?: string; // URL to verification selfie
  };

  // Rejection Info (if status === 'rejected')
  rejectionReason?: string; // Reason for rejection
}
```

### Sample Request Object

```json
{
  "id": "REQ-201",
  "name": "David Kim",
  "email": "david.k@professional.com",
  "role": "Professional",
  "docType": "Engineering Diploma",
  "date": "2026-08-29",
  "status": "pending",
  "details": {
    "address": "128 Seoul Innovation Valley, Mapo-gu",
    "nationality": "South Korean",
    "dob": "1994-06-15",
    "phone": "+82 10-1234-5678",
    "docUrl": "https://example.com/docs/diploma.jpg",
    "selfieUrl": "https://example.com/selfies/david.jpg"
  }
}
```

---

## Common Integration Patterns

### Pattern 1: List → Modal Review

```jsx
// User clicks "Review" in list
<AdminVerificationSubpage />
// Opens VerificationReviewModal
// On approve: Shows VerificationSuccessModal
```

### Pattern 2: List → Full Page Detail

```jsx
// User clicks request row (custom link)
// Navigate to: /admin/verification/:requestId
<VerificationRequestDetailPage />
// On approve: Shows VerificationSuccessModal
// On reject: Navigates back to list
```

### Pattern 3: Direct Modal (Standalone)

```jsx
// Trigger modal from anywhere
const [request, setRequest] = useState(selectedRequest);

{
  request && (
    <VerificationReviewModal
      request={request}
      onClose={() => setRequest(null)}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
```

---

## Error Handling

### Common Errors & Handling

```jsx
// Network error
const handleApprove = async (reqId) => {
  try {
    await api.approveVerification(reqId);
  } catch (error) {
    if (error.status === 404) {
      toast.error("Request not found");
    } else if (error.status === 409) {
      toast.error("Request already reviewed");
    } else {
      toast.error("Failed to approve. Please try again.");
    }
  }
};

// Validation error
const handleReject = (reqId, reason) => {
  if (!reason?.trim()) {
    toast.error("Rejection reason is required");
    return;
  }
  // Proceed with rejection
};

// Optimistic update
const handleApproveOptimistic = (reqId) => {
  // Update UI immediately
  updateRequestInList(reqId, { status: "approved" });

  // Then sync with server
  api.approveVerification(reqId).catch((error) => {
    // Revert on error
    revertRequestInList(reqId);
    toast.error("Failed to approve");
  });
};
```

---

## TypeScript Support

All components are compatible with TypeScript. Here are the types:

```typescript
// @types/verification.ts

export type VerificationStatus = "pending" | "approved" | "rejected";
export type UserRole = "Professional" | "Employer";

export interface VerificationDetails {
  address: string;
  nationality: string;
  dob: string;
  phone: string;
  docUrl?: string;
  selfieUrl?: string;
}

export interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  docType: string;
  date: string;
  status: VerificationStatus;
  details: VerificationDetails;
  rejectionReason?: string;
}

export interface ReviewModalProps {
  request: VerificationRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export interface SuccessModalProps {
  userName: string;
  onClose: () => void;
  onViewDetails?: () => void;
}
```

---

## Performance Considerations

- ✅ Components use React.memo for list items (when adding pagination)
- ✅ Modal only renders when needed (conditional rendering)
- ✅ Images use lazy loading (add loading="lazy" to img tags)
- ✅ Tailwind classes are pre-compiled
- ✅ No unnecessary re-renders with proper state management
- ✅ Pagination ready (in plan-implementation.md)

---

## Accessibility Checklist

- ✅ Semantic HTML: `<button>`, `<input>`, `<select>`, `<table>`
- ✅ ARIA labels on complex components
- ✅ Keyboard navigation: Tab through all controls
- ✅ Focus indicators: Visible on all interactive elements
- ✅ Color contrast: WCAG AA compliant
- ✅ Touch targets: 44x44px minimum
- ✅ Alt text on images
- ✅ Form labels associated with inputs
- ✅ Error messages linked to form fields
- ✅ Loading states announced to screen readers
