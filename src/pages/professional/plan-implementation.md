# Mobile Implementation Plan - Default Professional Screen

Convert the desktop layout of `DefaultProfessionalScreen.jsx` into a fully responsive mobile interface referencing the Figma mobile mockup `MobileView-ProfessionalDefault screen.jpg`, adhering strictly to mobile-only constraints without altering desktop functionality or layout.

## Objective and Scope

- **Target Component**: `src/pages/professional/DefaultProfessionalScreen.jsx` and its child components (`ProfessionalNavbar.jsx`, `JobSearchBar.jsx`, `JobCard.jsx`).
- **New Component**: `src/components/professional/ProfessionalBottomNav.jsx` for mobile bottom navigation.
- **Reference Mockup**: `public/temp_figma_mockups/MobileView-ProfessionalDefault screen.jpg`
- **Scope**: Layout geometry, viewport behavior, element sizing, spacing, alignment, wrapping, overflow, safe areas, and mobile-only visibility rules. Strictly zero changes to desktop layouts or behavior.

## Design Analysis Summary & Measurements

1. **Mobile Top Navigation**:
   - Top Header Bar: `h-14 md:h-16`, sticky top navigation with `px-4`.
   - Left: Mobile hamburger menu button (`FiMenu`) triggering mobile drawer menu.
   - Center/Left: Title "Browse Jobs" (`text-base font-bold text-gray-900`).
   - Right: Chat button (`FiMessageSquare`) + User avatar circle (`w-8 h-8 rounded-full`).
   - Desktop view (`hidden md:flex`): Preserves current desktop header (Logo + Nav Links + Messages/Notifications + Avatar Dropdown).

2. **Hero Section & Verification Banner**:
   - Hero container: `bg-[#EEF5F9]`, padding `py-6 px-4 sm:py-14 sm:px-8`.
   - Title: "Find Your Next Opportunity" (`text-xl sm:text-4xl font-bold text-gray-900`).
   - Subtitle: "Looking for jobs? Browse our latest job openings to view" (`text-xs sm:text-base text-gray-600 mt-2`).
   - Verification Banner & Tools Illustration:
     - On mobile, display the verification banner and tools illustration gracefully in a responsive flex layout so both fit seamlessly within mobile width without overflowing.
     - Illustration sized `w-28 xs:w-36 sm:w-64` on mobile viewports.

3. **Search & Filter Bar (`JobSearchBar`)**:
   - Input: Pill-shaped search bar with `FiSearch` icon (`pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-700 placeholder-gray-400`).
   - Filter pills (`Location`, `Date posted`, `Budget`): Wrapped in a horizontal scrollable row (`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0`) on mobile so pills remain neatly aligned on a single row.
   - Apply button: `px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 rounded-full shrink-0`.

4. **Results Header & Job Cards Grid**:
   - Headline: `Related to "Carpentry"` (`text-base sm:text-lg font-semibold text-gray-900`).
   - Count: `108 jobs availabe` (`text-xs text-gray-400 mt-0.5`).
   - Card Stack: 1 column on mobile (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5`).
   - Cards: White background (`bg-white` or `bg-[#f9f9f9]`), `p-4 sm:p-5`, `rounded-2xl`, border divider above price/apply action area.
   - Apply Button: `bg-[#e6f1f6] text-[#2683b3] font-semibold text-xs rounded-full px-4 py-1.5 hover:bg-[#d5e7ef]`.

5. **Mobile Pagination**:
   - Text: `Page 1 of 5` (`text-xs text-gray-700 font-medium` on mobile, `Showing page 1 of 5 pages` on desktop).
   - Numeric buttons: `1`, `2`, `3`, `...`, `5` (`w-8 h-8 rounded-full`). Active page `1` is blue circle `bg-[#016EA6] text-white font-bold`.

6. **Mobile Bottom Navigation (`ProfessionalBottomNav`)**:
   - Sticky bottom bar (`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 py-2 px-4 shadow-lg md:hidden`).
   - Items: `Overview`, `Browse jobs` (Active), `My Jobs`, `Applications`, `Wallet`.
   - Bottom home indicator pill for mobile devices.
   - Page container adds `pb-24 md:pb-12` so fixed bottom nav does not obstruct content.

## Element Visibility Matrix

| Element | Desktop (>= 768px) | Mobile (< 768px) | Visibility Logic / Tailwind Classes |
| --- | --- | --- | --- |
| Desktop Navbar Links & Avatar Dropdown | Visible | Hidden | `hidden md:flex` |
| Mobile Top Bar (Menu, Title, Chat, Avatar) | Hidden | Visible | `flex md:hidden` |
| Mobile Drawer Menu | Hidden | Toggle on Menu Click | `md:hidden` conditional render |
| Tools Illustration | Visible (`sm:flex`) | Visible (`flex`) | Responsive scaling `w-28 xs:w-36 sm:w-64` |
| Filter Pills Bar | Standard flex row | Scrollable flex row | `flex items-center gap-2 overflow-x-auto no-scrollbar` |
| Job Grid Layout | 3 Columns (`lg:grid-cols-3`) | 1 Column (`grid-cols-1`) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Mobile Bottom Nav | Hidden | Visible | `fixed bottom-0 left-0 right-0 z-40 md:hidden` |

## Implementation Steps

1. **Create `ProfessionalBottomNav.jsx`**:
   - Build a mobile bottom nav component with 5 tabs (`Overview`, `Browse jobs`, `My Jobs`, `Applications`, `Wallet`).
   - Highlight `Browse jobs` as active tab.
   - Add iOS home indicator bar line.

2. **Update `ProfessionalNavbar.jsx`**:
   - Maintain full desktop navbar for `md:flex`.
   - Add mobile top bar layout matching Figma mockup (`md:hidden`): Hamburger icon, "Browse Jobs" title, Chat icon button, User avatar circle button.
   - Retain mobile menu drawer behavior when hamburger is clicked.

3. **Update `JobSearchBar.jsx`**:
   - Wrap filter pills in a horizontal scrollable row with `overflow-x-auto no-scrollbar` for smooth touch scrolling on mobile viewports.
   - Ensure input and filter buttons use compact padding (`py-2 px-3 sm:py-2.5 sm:px-4 text-xs sm:text-sm`).

4. **Update `DefaultProfessionalScreen.jsx`**:
   - Update hero section flex order and illustration visibility so tools bucket displays cleanly alongside banner on mobile screens.
   - Update pagination display to be responsive: `Page X of Y` on mobile (`sm:hidden`) and `Showing page X of Y pages` on desktop (`hidden sm:inline`).
   - Import and render `ProfessionalBottomNav` at the bottom of the page (`md:hidden`).
   - Add bottom safe padding (`pb-24 md:pb-12`) to parent wrapper.

## Acceptance Criteria & QA Checklist

- [ ] Desktop layout (`>= 768px`) remains 100% unchanged in visual appearance and functionality.
- [ ] Mobile view (`< 768px`) matches the Figma mockup layout (`MobileView-ProfessionalDefault screen.jpg`).
- [ ] Mobile header displays hamburger menu, "Browse Jobs" title, chat button, and profile avatar.
- [ ] Hero section displays title, subtitle, verification banner, and tools illustration on mobile viewports.
- [ ] Search input and filter pills wrap/scroll horizontally on mobile without overflow bugs.
- [ ] Job cards render as a clean 1-column stack with rounded cards, employer avatar, timestamp, price, and apply button.
- [ ] Mobile bottom navigation bar is fixed at the bottom with 5 tabs, active state on "Browse jobs", and bottom indicator bar.
- [ ] Page content scroll has bottom padding so no content is blocked by the fixed bottom nav.
