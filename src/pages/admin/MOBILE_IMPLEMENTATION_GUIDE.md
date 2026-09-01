# Mobile View Implementation Guide - Verification Dashboard

This document provides implementation details and mobile-specific CSS utilities for the verification admin dashboard.

## Component Mobile Variants

### 1. AdminVerificationSubpage - List View

#### Mobile Optimizations

```jsx
// Tabs: Preserved existing functionality with slight mobile adjustments
<div className="flex bg-gray-50 p-1 rounded-xl w-fit overflow-x-auto">
  {/* Tabs with whitespace-nowrap to prevent wrapping */}
  <button className="px-3 sm:px-4 py-2 ... whitespace-nowrap">
```

- **Tab Container:** Horizontal scroll on mobile, normal flex on desktop
- **Padding:** `px-3` on mobile, `sm:px-4` on desktop
- **Search Input:** Full width on mobile, constrained on desktop
  - Mobile: `w-full` with `pl-9 pr-4 py-2`
  - Desktop: `w-56` via `sm:w-56`

- **Filter Dropdown:** Full width on mobile
  - Mobile: `w-full`
  - Desktop: `sm:w-auto`

#### Card List Layout (Mobile - Already Implemented)

```jsx
<div className="md:hidden divide-y divide-gray-100">
  {/* Each card is full-width with proper padding */}
  <div className="p-4 space-y-3">
```

**Card Dimensions:**

- Padding: `p-4` (16px)
- Spacing: `space-y-3` (12px gaps)
- Status Badge: `px-2 py-0.5` (compact sizing)
- Button: Full width, `py-1.5` minimum (40px total height)

#### Table View (Desktop Only)

```jsx
<div className="hidden md:block">
  {/* Table structure preserved for desktop */}
```

---

### 2. VerificationReviewModal - Review Modal

#### Responsive Positioning

```jsx
<div className="fixed inset-x-0 bottom-0 z-50 ... md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-2xl md:rounded-2xl">
```

**Mobile Mode (< 768px):**

- Position: Bottom drawer (`inset-x-0 bottom-0`)
- Rounding: `rounded-t-3xl` (top-only rounding)
- Border: `border-t border-gray-100` (top border only)
- Height: `max-h-[95vh]` (95% of viewport)
- Animation: `transition-all duration-300 ease-out`

**Desktop Mode (≥ 768px):**

- Position: Centered modal (`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`)
- Rounding: `rounded-2xl` (all sides)
- Border: `border border-gray-100` (full border)
- Width: `w-full max-w-2xl` (768px max)
- Height: `max-h-[85vh]` (85% of viewport)

#### Document Grid - Responsive

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <div className="h-40 sm:h-44 bg-gray-50 ...">
      {/* Document preview image */}
    </div>
  </div>
  {/* Selfie preview */}
</div>
```

**Heights:**

- Mobile: `h-40` (160px)
- Tablet+: `sm:h-44` (176px)
- Reduced from desktop design (224px) for mobile space efficiency

#### Action Buttons - Mobile Stack

```jsx
<div className="sticky bottom-0 ... flex flex-col gap-3 sm:flex-row z-10">
  <button>Cancel</button>
  <button>Reject</button>
  <button>Approve</button>
</div>
```

**Button Layout:**

- Mobile: `flex-col` (vertical stack)
- Desktop+: `sm:flex-row` (horizontal row)
- Gap: `gap-3` (12px on all sizes)
- Height: `py-2.5` (40px)

#### Header - Responsive

```jsx
<div className="sticky top-0 ... px-6 py-4 flex items-center justify-between">
```

- Sticky position preserved on both mobile and desktop
- Full width on mobile, padding inherited
- Close button always visible (right-aligned)

---

### 3. VerificationSuccessModal - Success Modal

#### Responsive Presentation

```jsx
<div className="fixed inset-x-0 bottom-0 z-50 ... md:inset-auto md:top-1/2 md:left-1/2">
```

**Mobile Mode:**

- Drawer-style from bottom
- `rounded-t-3xl` (top-only rounding)
- `max-h-[95vh]` (full screen minus safe areas)

**Desktop Mode:**

- Centered modal
- `rounded-2xl` (all sides)
- `max-w-md` (448px max width)

#### Celebration Illustration - Responsive

```jsx
<div className="relative h-40 flex items-center justify-center">
  <div className="w-24 h-24 ...">
    <CheckCircle className="w-16 h-16" />
  </div>
</div>
```

**Sizes:**

- Container height: `h-40` (160px)
- Circle size: `w-24 h-24` (96px)
- Icon size: `w-16 h-16` (64px)
- Decorative emojis: `text-2xl` and `text-xl` for variety

#### Buttons - Mobile Stack

```jsx
<div className="flex flex-col gap-3 pt-4">
  <button className="w-full py-3">View Details</button>
  <button className="w-full py-3">Go back home</button>
</div>
```

**Button Properties:**

- Width: `w-full` (full width on all sizes)
- Height: `py-3` (48px, touch-friendly)
- Gap: `gap-3` (12px between buttons)

---

### 4. VerificationRequestDetailPage - Full-Page Review

#### Header - Sticky Mobile Header

```jsx
<div className="bg-white border-b border-gray-100 sticky top-0 z-40">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>
```

**Mobile Optimizations:**

- Sticky positioning maintained on mobile
- Padding: `px-4` on mobile, `sm:px-6 lg:px-8` on larger screens
- Back button ensures mobile navigation
- Title and status badge both visible

#### Two-Column Layout (Desktop) → Single Column (Mobile)

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Documents column - full width on mobile */}
  <div className="lg:col-span-2 space-y-6">

  {/* Review panel - moves below on mobile */}
  <div className="lg:col-span-1">
    <div className="... sticky top-24">
```

**Layout:**

- Mobile: Single column, full width
- Desktop: 3-column grid (2/3 content, 1/3 sidebar)
- Review panel: No sticky positioning on mobile (flows naturally)
- Gap: `gap-8` preserved (Tailwind handles responsively)

#### Info Grid - Mobile Responsive

```jsx
<div className="grid grid-cols-2 gap-4 pt-4">
  <div className="flex items-start gap-3">
    <Globe className="w-4 h-4 ... shrink-0" />
```

**Info Grid:**

- Columns: `grid-cols-2` on all sizes (works well on mobile)
- Gap: `gap-4` (16px)
- Icon size: `w-4 h-4` (16px - compact for mobile)
- Text size: `text-xs` to `text-sm` (readable on mobile)

#### Document Preview Cards

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="... flex flex-col justify-between">
    <div className="h-56 bg-gray-50 ... overflow-hidden group">
      <img src={docPlaceholder} className="max-h-full max-w-full object-contain p-3" />
```

**Card Layout:**

- Mobile: `grid-cols-1` (single column)
- Tablet+: `sm:grid-cols-2` (two columns)
- Image height: `h-56` (224px)
- Image container: `max-h-full max-w-full object-contain` (preserves aspect ratio)

#### Review Decision Panel - Sticky vs. Flowing

```jsx
<div className="... sticky top-24">
  {/* On desktop: sticky positioning */}
  {/* On mobile: flows normally */}
</div>
```

**Behavior:**

- Sticky on desktop (stays visible while scrolling)
- Normal flow on mobile (user scrolls through it)
- Position: `top-24` offset below header on desktop

---

## Tailwind Utility Reference

### Responsive Utilities Used

- `flex-col` / `sm:flex-row` - Stack vertically on mobile, row on tablet+
- `w-full` / `sm:w-56` - Full width on mobile, constrained on desktop
- `px-4` / `sm:px-6 lg:px-8` - Progressive padding increase
- `h-40` / `sm:h-44` - Progressive height scaling
- `grid-cols-1` / `sm:grid-cols-2` / `lg:grid-cols-3` - Column scaling
- `hidden` / `md:block` - Hide/show based on breakpoints
- `sticky` with `top-0`, `top-24` - Sticky positioning at different offsets
- `inset-x-0 bottom-0` / `md:inset-auto md:top-1/2` - Position switching

### Breakpoints

- Default (mobile): No prefix, applies to all widths
- `sm:` - 640px and above
- `md:` - 768px and above (primary mobile/desktop break)
- `lg:` - 1024px and above
- `xl:` - 1280px and above

---

## Mobile-Specific Patterns

### Touch-Friendly Button Sizing

```jsx
/* Minimum 44x44px tap target (Apple UX guidelines) */
<button className="py-2.5 px-3.5">/* Equivalent to 40px height + padding */</button>
<button className="py-3">/* Equivalent to 48px height */</button>
```

### Full-Width Forms & Inputs

```jsx
<input className="w-full pl-9 pr-4 py-2 ..." />
<select className="w-full pl-8 pr-8 py-2 ..." />
<textarea className="w-full px-3 py-2.5 ..." />
```

### Stacked Cards on Mobile

```jsx
<div className="divide-y divide-gray-100 md:hidden">
  {/* Each item is full-width, stacked vertically */}
</div>
```

### Header/Footer Sticky Zones

```jsx
<div className="sticky top-0 z-40 bg-white border-b">
  {/* Stays visible while scrolling content */}
</div>

<div className="sticky bottom-0 z-40 bg-white border-t">
  {/* Action buttons stay accessible */}
</div>
```

### Safe Area Awareness

```jsx
{
  /* Uses viewport-relative positioning */
}
<div className="fixed inset-x-0 bottom-0 max-h-[95vh]">
  {/* Leaves room for bottom nav/controls on mobile */}
</div>;
```

---

## QA Testing Checklist - Mobile

- [ ] List view: No horizontal scroll on 375px (iPhone SE)
- [ ] List view: Cards display properly on 390px (iPhone 12)
- [ ] List view: Filter inputs stack vertically
- [ ] Review modal: Appears as bottom drawer on mobile
- [ ] Review modal: Scrollable content fits in 95vh
- [ ] Review modal: All buttons 44px+ height for tapping
- [ ] Success modal: Full-screen drawer presentation
- [ ] Detail page: Single column layout on mobile
- [ ] Detail page: Review panel below documents
- [ ] All text readable without zoom on mobile
- [ ] Touch targets minimum 44x44px
- [ ] No layout shift when scrolling
- [ ] No unnecessary horizontal scroll
- [ ] Sticky headers/footers don't overlap content
- [ ] Images maintain aspect ratio on mobile

---

## Browser Compatibility Notes

- **iOS Safari:** Backdrop blur requires `-webkit-backdrop-filter`
- **Android Chrome:** Safe area insets may need adjustment
- **Mobile Firefox:** Test sticky positioning behavior
- **Samsung Internet:** Verify border and overflow handling

---

## Future Mobile Enhancements (Phase 2)

1. **Swipe Gestures:** Swipe to dismiss drawer modals
2. **Image Lightbox:** Tap to zoom document previews
3. **Pull-to-Refresh:** Refresh verification list
4. **Infinite Scroll:** Lazy-load more requests
5. **Bottom Navigation:** Quick access to other admin sections
6. **Dark Mode:** Mobile-optimized dark theme
7. **Progressive Web App:** Mobile app-like experience
8. **Offline Support:** Cached data for offline browsing
