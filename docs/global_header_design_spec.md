# Global Software Header Design Specification

## 1. PURPOSE OF THE GLOBAL HEADER
The Global Header serves as the **immutable anchor** of the Grahvani software. It provides stable access to the application's core modules and global utilities regardless of the user's current context.

*   **Responsibility**: To facilitate switching between major functional areas (e.g., Client Management vs. Muhurta Calculator) and accessing universal tools (e.g., Settings, Profile, Logout).
*   **NEVER Contain**: 
    *   **Context-specific actions**: Do not put "Save Chart", "Print Report", or "Edit Client" here. Those belong in the *Page Header* or *Client Header*.
    *   **Breadcrumbs**: Keep the global header clean. Breadcrumbs belong in the page layout below the header.
    *   **Dense Data**: No scrolling tickers or complex planetary dashboards. Keep it "calm."

## 2. HEADER CONTENT ZONES

### LEFT ZONE (Navigation & Identity)
*   **Logo / Brand Mark**: A simplified "Grahvani" logo or Icon (e.g., stylized Astrolabe) appearing in Gold/Bronze. Clicking typically resets to the Dashboard.
*   **Module Navigation**: The primary layout switcher.
    *   *Dashboard* (Home)
    *   *Clients* (The Registry)
    *   *Tools* (Calculators, Matching, Panchang)
    *   *Research* (Optional: Classics, Notes)

### CENTER ZONE (The "Calm" Space)
*   **Empty / Negative Space**: To maintain the "luxury/calm" aesthetic, strictly avoid clutter here.
*   *Optional*: A very subtle, centered **Global Search** ("Search Clients..."). If implemented, it must be visually integrated (e.g., a simple magnifying glass icon that expands, rather than a permanently visible white box). For this phase, **keep it empty** to emphasize the texture and material of the UI.

### RIGHT ZONE (Utilities & Account)
*   **Quick Utilities**:
    *   *Current Mode*: A small indicator if using a specific Ayanamsa (optional, for pro users).
    *   *Clock/Time*: A small digital clock (Vedic time/Ghatis optional).
*   **System Extensions**:
    *   *Settings* (Gear icon): Global preferences (Ayanamsa, Language, Theme).
    *   *Help/Manual* (Question mark or "Book" icon).
*   **User Profile**:
    *   *Avatar*: User's initials or photo in a circular frame.
    *   *Dropdown*: Subscription status, Logout.

## 3. NAVIGATION DESIGN

The top-level navigation items are limited to **high-level functional modules**:

1.  **Dashboard**: The landing view. Summary of recent work, upcoming transits, daily panchanga.
    *   *Why*: Astrologers need a "morning briefing" screen.
2.  **Registry (Clients)**: The core database of profiles.
    *   *Why*: This is the entry point for 90% of work. Note: Actual *chart viewing* happens *inside* a client's page, so "Charts" is not a top-level item; "Clients" is.
3.  **Muhurta (Electional)**: A dedicated workspace for finding auspicious times.
    *   *Why*: This matches professional workflows where one might calculate a Muhurta independent of a specific client profile.
4.  **Matchmaking (Synastry)**: A dedicated workspace for comparing two charts.
    *   *Why*: Often involves picking two people from the registry or entering temporary data.
5.  **Calendar (Panchang)**: A full-screen monthly/daily view of cosmic events.
    *   *Why*: For planning and look-ahead work.

**What is NOT here:**
*   "South Indian Chart" toggles (That's a Page/User Setting).
*   "Export PDF" (That's a Page Action).

## 4. VISUAL & UX RULES

*   **Height**: Fixed at **64px** (Desktop) / **56px** (Mobile).
*   **Materiality**: 
    *   Background: Deep, rich **Dark Wood/Leather** texture or a very dark **liinear gradient** (`linear-gradient(180deg, #2A1810 0%, #3E2A1F 100%)`). This grounds the top of the screen.
    *   Border: A thin generic **Gold separation line** at the bottom (1px solid `#9C7A2F` or an ornate 2px border image).
    *   Shadow: A heavy, soft drop shadow (`shadow-md`) to lift the header above the parchment page content.
*   **Typography**:
    *   Links: **Serif** (Cinzel or Playfair Display), Small Caps, Tracking Widest (`tracking-[0.15em]`).
    *   Color: **Antique Gold** (`#D4AF37`) for text. **White** is only for high-contrast active states or critical alerts.
*   **States**:
    *   *Idle*: Gold text, transparent background.
    *   *Hover*: Subtle glow (`text-shadow`), optional background tint (`bg-white/5`).
    *   *Active*: Brighter Gold/White text, distinct bottom indicator (e.g., a small diamond or underline).

## 5. COMPONENT STRUCTURE (Frontend)

Suggested Path: `src/components/layout/GlobalHeader.tsx`

```tsx
// Component Hierarchy
<GlobalHeader>
  <HeaderContainer>         // <header> tag, fixed position, z-50, flexbox
    <LogoSection />         // Left: Logo SVG + Title
    <DesktopNavigation />   // Left-Center: <nav> with Link[]
    <MobileMenuToggle />    // Right (Mobile Only): Hamburger Icon
    <UtilitySection />      // Right: <div flex> with Icons (Settings, Profile)
  </HeaderContainer>
  {/* Mobile Menu Overlay would live here or in a Portal */}
</GlobalHeader>
```

**Props Interface**:
Most global headers do typically not need props as they rely on internal state (Router) or Global Context (User Auth).

```typescript
interface GlobalHeaderProps {
  className?: string; // For customized positioning if needed
  // No user/auth props -> Use useAuth() hook inside
}
```

## 6. RESPONSIVE / PWA BEHAVIOR

*   **Desktop (>1024px)**:
    *   Full navigation visible links.
    *   Full profile info (Avatar + Name).
*   **Tablet (768px - 1024px)**:
    *   Show Icons + Text for Nav if space permits, or collapse less critical items (Muhurta, Matchmaking) into a "More" dropdown.
*   **Mobile (<768px)**:
    *   **Strictly Icon-based** or **Hamburger Menu**.
    *   Recommended: **Hamburger Menu** on Left, **Logo** Center, **Profile/Action** on Right.
    *   The "Navigation" moves into a slide-out drawer (Off-canvas menu), styled like a rolling scroll opening up.

## 7. NEXT.JS ROUTING RELATIONSHIP

*   **Layout.tsx**: The `<GlobalHeader />` should be placed in the **Root Layout** (`src/app/layout.tsx`) so it persists across all route changes without re-rendering.
*   **Active State**: Use `usePathname()` hook to determine which navigation link is active.
    *   If path starts with `/clients` -> Activate "Registry".
    *   If path starts with `/muhurta` -> Activate "Muhurta".
*   **Client Context**: When a user navigates from "Registry" (`/clients`) into a specific client (`/client/[id]`), the *Global Header* remains unchanged. The *Client Header* (which you already built) appears *below* it as part of the page layout. This creates a "Commander (Global) / Workplace (Local)" hierarchy.
