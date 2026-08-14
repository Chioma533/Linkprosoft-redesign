# Mobile Implementation Plan - Default Buyer Screen

Convert the desktop layout of `DefaultBuyerScreen.jsx` into a fully responsive mobile interface referencing the mobile structure of `DefaultProfessionalScreen.jsx` and `MobileView-ProfessionalDefault screen.jpg`, adhering strictly to mobile-only constraints without altering desktop functionality or layout.

## Objective and Scope

- **Target Component**: `src/pages/buyer/DefaultBuyerScreen.jsx` and its child components (`BuyerNavbar.jsx`, `ProfessionalSearchBar.jsx`, `ProfessionalCard.jsx`).
- **New Component**: `src/components/buyer/BuyerBottomNav.jsx` for mobile bottom navigation.
- **Reference Context**: `DefaultProfessionalScreen.jsx` and `public/temp_figma_mockups/MobileView-ProfessionalDefault screen.jpg`
- **Scope**: Layout geometry, viewport behavior, element sizing, spacing, alignment, wrapping, overflow, safe areas, and mobile-only visibility rules. Strictly zero changes to desktop layouts or behavior.

## Comparison Analysis & Mobile Layout Decisions

1. **Mobile Top Navigation (`BuyerNavbar.jsx`)**:
   - **Desktop Header (`hidden md:flex`)**: Preserves original desktop navbar (Logo + 4 Nav Links + Messages + Notifications + Post a Job CTA + Profile Dropdown).
   - **Mobile Header (`flex md:hidden`)**: Mobile sticky top header:
     - Left: Hamburger menu icon (`FiMenu`/`FiX`) + Title "Browse Professionals" (`text-base font-bold text-gray-900`).
     - Right: Messages button (`FiMessageSquare`) + User avatar circle (`w-8 h-8 rounded-full`).
     - Mobile Drawer: Opens on hamburger click, listing nav links, divider, logout, and "Post a Job" CTA button.

2. **Hero Section & Compact Verification Banner (`DefaultBuyerScreen.jsx`)**:
   - **Desktop Hero (`hidden sm:flex` / `hidden sm:block`)**: Preserves large hero header, standard verification banner, and large tools illustration.
   - **Mobile Hero (`sm:hidden`)**:
     - Headline font size reduced to `text-[1.125rem] font-regular leading-[1.2]` on mobile.
     - Subtitle font size reduced to `text-[0.75rem] leading-relaxed`.
     - Mobile duplicated compact verification banner (`w-[248px]` with `bg-[#fff4ea]`, `border-[#ff8d28]/30`, micro text, and compact "Complete Verification" pill button).
     - Tools illustration (`/tools_illustration.png`) positioned side-by-side with banner on mobile screens (`w-[43%]`).

3. **Search & Filter Bar (`ProfessionalSearchBar.jsx`)**:
   - Search input formatted for mobile with compact padding (`pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm`).
   - Filter pills (`Location`, `Rating`, `Budget`) and `Apply` button wrapped in a horizontal scrollable container (`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0`) for single-row touch scrolling.

4. **Results Header & Professional Cards (`ProfessionalCard.jsx` & `DefaultBuyerScreen.jsx`)**:
   - Results container padding updated to `p-4 sm:p-8`.
   - Grid layout: 1 column on mobile (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5`).
   - Card padding adjusted to `p-4 sm:p-6` and `px-4 sm:px-6 pb-4 sm:pb-5` for clean mobile card proportions.

5. **Responsive Pagination (`BuyerPagination`)**:
   - Compact text on mobile: `Page X of Y` (`sm:hidden`) vs `Showing page X of Y pages` on desktop (`hidden sm:inline`).

6. **Mobile Bottom Navigation (`BuyerBottomNav.jsx`)**:
   - Sticky bottom nav fixed at screen bottom on mobile (`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg md:hidden`).
   - Includes 5 tabs: Overview, Browse, My Jobs, Community, Profile + iOS home indicator bar line.
   - Container padding `pb-24 md:pb-12` added to prevent bottom nav content occlusion.

---

## Element Visibility Matrix

| Element | Desktop (>= 768px) | Mobile (< 768px) | Visibility Logic / Tailwind Classes |
| --- | --- | --- | --- |
| Desktop Navbar Links & Actions | Visible | Hidden | `hidden md:flex` |
| Mobile Header Bar (Menu, Title, Messages, Avatar) | Hidden | Visible | `flex md:hidden` |
| Desktop Verification Banner | Visible | Hidden | `hidden sm:block` |
| Mobile Verification Banner + Illustration (Duplicated & Resized) | Hidden | Visible | `sm:hidden` (side-by-side micro layout) |
| Desktop Tools Illustration | Visible | Hidden | `hidden sm:flex` |
| Filter Pills Bar | Multi-line wrap | Horizontal scrollable row | `flex items-center gap-2 overflow-x-auto no-scrollbar` |
| Professional Cards Grid | 3 Columns | 1 Column | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Mobile Bottom Navigation | Hidden | Visible | `fixed bottom-0 left-0 right-0 z-50 md:hidden` |

---

## Implementation Steps

1. **Create `BuyerBottomNav.jsx`**:
   - Build a mobile bottom nav component with 5 tabs (`Overview`, `Browse`, `My Jobs`, `Community`, `Profile`).
   - Highlight `Browse` (`/home`) as active tab.
   - Add iOS home indicator bar line.

2. **Update `BuyerNavbar.jsx`**:
   - Maintain full desktop navbar for `md:flex`.
   - Add mobile top bar layout matching Figma/Professional pattern (`md:hidden`): Hamburger icon, "Browse Professionals" title, Chat icon button, User avatar circle button.
   - Retain mobile menu drawer behavior when hamburger is clicked, including Post a Job CTA.

3. **Update `ProfessionalSearchBar.jsx`**:
   - Wrap filter pills in a horizontal scrollable row with `overflow-x-auto no-scrollbar` for smooth touch scrolling on mobile viewports.
   - Ensure input and filter buttons use compact padding (`py-2 px-3 sm:py-2.5 sm:px-4 text-xs sm:text-sm`).

4. **Update `ProfessionalCard.jsx`**:
   - Make internal card padding responsive (`p-4 sm:p-6` for body, `px-4 sm:px-6 pb-4 sm:pb-5` for footer).

5. **Update `DefaultBuyerScreen.jsx`**:
   - Add mobile-only duplicated verification banner + side-by-side illustration block (`sm:hidden`) matching `DefaultProfessionalScreen.jsx`.
   - Wrap desktop verification banner in `hidden sm:block` and desktop illustration in `hidden sm:flex`.
   - Update pagination display to be responsive: `Page X of Y` on mobile (`sm:hidden`) and `Showing page X of Y pages` on desktop (`hidden sm:inline`).
   - Import and render `BuyerBottomNav` at the bottom of the page (`md:hidden`).
   - Add bottom safe padding (`pb-24 md:pb-12`) to parent wrapper.

---

## Acceptance Criteria & QA Checklist

- [ ] Desktop layout (`>= 768px`) remains 100% unchanged in visual appearance and functionality.
- [ ] Mobile view (`< 768px`) matches the mobile structure of `DefaultProfessionalScreen.jsx` and Figma mockup (`MobileView-ProfessionalDefault screen.jpg`).
- [ ] Mobile header displays hamburger menu, "Browse Professionals" title, messages icon button, and profile avatar.
- [ ] Hero section displays title, subtitle, duplicated compact verification banner, and tools illustration on mobile viewports.
- [ ] Search input and filter pills wrap/scroll horizontally on mobile without layout breakages.
- [ ] Professional cards render as a clean 1-column stack on mobile viewports.
- [ ] Mobile bottom navigation bar is fixed at the bottom with 5 tabs, active state on "Browse", and bottom indicator bar.
- [ ] Page content scroll has bottom padding so no content is blocked by the fixed bottom nav.
