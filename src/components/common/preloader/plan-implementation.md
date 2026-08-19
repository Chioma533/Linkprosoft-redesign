# Mobile View Implementation Plan: SkeletonLoader & LoadingScreen

## Objective & Scope
Adapt `SkeletonLoader.jsx` and `LoadingScreen.jsx` to render a pixel-accurate mobile ghost skeleton on mobile screens (`< 640px` / `< 768px`) that mirrors the responsive mobile layouts of `DefaultBuyerScreen.jsx` and `DefaultProfessionalScreen.jsx`. 

**Non-negotiable Constraint**: Desktop layout (`sm` / `md` / `lg` and above) MUST remain 100% untouched and pixel-identical to the existing implementation.

---

## Mobile Design Analysis & Comparison

### 1. Navbar
- **Desktop**: Logo (left), 4 navigation text bars (center), message icon + bell icon + avatar (right). Height: `64px`.
- **Mobile**: Hamburger icon stub + Page Title bar ("Browse Professionals" / "Browse Jobs") (left), Message icon stub + Avatar circle `32px` (right). Height: `56px` - `64px`.

### 2. Hero Section
- **Desktop**: `py-10 sm:py-14`, H1 height `32px` (~55% width), Subtitle height `14px`, Verification banner `h-56px` (`max-w-md`), Right illustration stub (`230px x 180px`).
- **Mobile**: `py-3`, H1 height `18px` (smaller text scale), Subtitle height `10px`, Compact Mobile Verification Banner stub (`w-[248px]` x `h-[38px]`) + Mobile Illustration stub (`w-[35%]` x `h-[60px]`).

### 3. Search & Filter Bar
- **Desktop**: `py-6`, multi-row wrap with search pill `h-40px` and filter pills `h-40px`.
- **Mobile**: `py-2`, single horizontal scrollable row (`overflow-x-auto flex-nowrap`) with compact search input pill (`h-36px`, `min-w-[140px]`) and filter pill chips (`h-36px`).

### 4. Results Card & Grid
- **Desktop**: Card container padding `p-6 sm:p-8`, Section header `mb-6`, 3-column grid (`grid-cols-3 gap-5`), 9 cards rendered.
- **Mobile**: Card container padding `p-4`, Section header `mb-4`, 1-column grid (`grid-cols-1 gap-4`), 3-4 cards rendered on mobile to match viewport height.
- **Mobile Cards**: `p-4` padding, header with `48px` / `44px` avatar, name/role bars, bookmark button stub, rating & success rate row, bio 3-line bars, footer with starting rate bar and CTA pill button (`h-32px`).

### 5. Bottom Navigation (Mobile-Only)
- **Desktop**: Hidden (`hidden md:flex` / none).
- **Mobile**: Fixed bottom bar (`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 h-16`), 5 bottom nav icon + text stubs evenly distributed.

---

## Elements Visibility Matrix

| Element / Component | Desktop View | Mobile View (`< 768px`) | Action / Styling |
|---|---|---|---|
| Desktop Navbar Links | Visible (`hidden md:flex`) | Hidden (`hidden md:flex`) | Scope to desktop |
| Mobile Navbar Header | Hidden (`flex md:hidden`) | Visible (`flex md:hidden`) | Mobile-only skeleton header |
| Desktop Hero Illustration | Visible (`hidden sm:block`) | Hidden (`hidden sm:block`) | Hide on mobile |
| Mobile Hero Illustration & Banner | Hidden (`hidden sm:flex`) | Visible (`flex sm:hidden`) | Mobile-only compact banner + illustration |
| Grid Layout | 3 Columns (`grid-cols-3`) | 1 Column (`grid-cols-1`) | Responsive CSS grid |
| Mobile Bottom Navigation | Hidden | Visible (`fixed bottom-0`) | Mobile-only bottom nav skeleton bar |

---

## Implementation Order
1. Update `SkeletonLoader.jsx`:
   - Add media queries / responsive CSS class wrappers while preserving inline styles for desktop.
   - Refactor `NavSkeleton` to switch between Desktop and Mobile layout variants cleanly.
   - Refactor `HeroSkeleton` with compact mobile height, small banner, and mobile illustration stub.
   - Refactor `SearchSkeleton` to single-row scrollable horizontal pills on mobile.
   - Refactor `GridSkeleton` to single column grid on mobile with 4 cards.
   - Add `BottomNavSkeleton` for mobile screens.
2. Verify `LoadingScreen.jsx` floating preloader centering on mobile viewports.
3. Validate on both mobile (`<640px`) and desktop viewports.

---

## QA & Validation Checklist
- [ ] Desktop layout (`>= 768px`) matches the existing layout 100%.
- [ ] Mobile layout (`< 768px`) displays single column cards, compact hero, horizontal search bar, and bottom nav skeleton.
- [ ] No overflow issues or broken keyframes.
- [ ] Preloader pulse animation remains centered over the skeleton.
