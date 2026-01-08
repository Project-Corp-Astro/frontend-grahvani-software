# Grahvani Frontend Architecture & Design Specification

## 1. User Flow

The astrologer's journey is linear, efficient, and focused on managing their consultations ("Sessions").

1.  **Login Successful** → Redirects to **Dashboard**.
2.  **Dashboard** → Astrologer clicks **"Clients"** in the main navigation (Header).
3.  **Client List** → Astrologer sees a searchable list of all saved profiles.
    *   *Action:* Click **"Add New Client"** to create a fresh profile.
    *   *Action:* Click on a **Client Name** to enter their sanctuary (Detail Page).
4.  **Client Detail (Sanctuary)** → View client summary.
    *   *Default View:* **Charts** tab is open immediately. No extra clicks needed to see the Horoscope.
5.  **Charts View** → Interact with the chart (South Indian / North Indian), toggle divisional charts (D9, D10), but keep the context of the client visible.

---

## 2. Client Management Page

**Purpose:** A digital "Rolodex" or "Registry" of all souls (clients). Fast search and clarity are paramount here.

### Layout Structure
*   **Background:** Luxury Radial (from Dashboard).
*   **Container:** A central parchment-colored container (max-w-6xl) with a subtle "Antique Frame" border.
*   **Header:**
    *   Title: "Client Registry" (Serif, Gold).
    *   Search Bar: Large, prominent input field styled like an old ledger line.
    *   "Add Client" Button: Premium Gold CTA (Top Right).

### Data Shown (List Items)
Each client row is a "Card" strip, not a spreadsheet table.
*   **Photo/Avatar:** framed in a gold circle.
*   **Name:** Bold Serif font.
*   **Details:** Location, Date of Birth (Secondary text).
*   **Last Consulted:** Date (useful for history).

### UX Actions
*   **Primary:** Click anywhere on the card → Go to Client Detail.
*   **Secondary:** "Edit" icon (Pencil) and "Delete" icon (Trash) on the far right, appearing on hover.

---

## 3. Add / Edit Client Form

**Purpose:** Accurate data entry. Precision is critical for astrology.

### Sections
1.  **Personal Details:**
    *   Name (Full Name).
    *   Gender (Male/Female/Other).
    *   Relationships (optional link to other charts).
2.  **Birth Data (The "Cosmic Snapshot"):**
    *   **Date of Birth:** Day, Month, Year (Clear separate inputs or high-quality date picker).
    *   **Time of Birth:** Hour, Minute, Second, AM/PM (Crucial).
    *   **Place of Birth:** Integration with Google Places API or distinct City/Country fields. Lat/Long auto-calculation is hidden but editable if needed.
    *   **Time Zone:** Auto-detected based on City/Date, but manually overridable.

### UX Rules
*   **Validation:** Do not allow submission without valid Lat/Long coordinates (backend requires this).
*   **Mandatory:** Name, DOB, TOB, POB.
*   **Confirm:** A "Review" step or clear visual summary before saving minimizes calculation errors later.
*   **CTA:** "Save Profile" (Gold Button).

---

## 4. Client Detail Page

**Purpose:** The workbench. Once here, the astrologer stays here for the consultation duration.

### Header Layout (Sticky / Persistent)
*   **Top Bar:** Client Name (H1), Birth Details (small text below).
*   **Right Side:** "Edit Profile" button, "New Consultation" button.
*   **Summary Cards:** Small visual blocks at the top showing key info:
    *   *Rashi (Moon Sign)*
    *   *Nakshatra*
    *   *Current Dasha*
    *   *Lagna (Ascendant)*

### Tabs Structure
Use a horizontal tab navigation styled like tabs in a physical folder/ledger.
1.  **Charts** (Default & Active)
2.  **Dashas** (Timeline)
3.  **Planetary Details** (Degrees, Avasthas)
4.  **Reports/Notes**

### Why Charts by Default?
Astrologers think visually. The first thing they need is the visual map of the planets. It anchors the entire consultation.

---

## 5. Charts UI (Core Feature)

**Purpose:** High-readability, professional-grade chart rendering.

### Layout
**Split View:**
*   **Left Sidebar (Controls):** Fixed width (e.g., 250px).
    *   *Chart Type Selector:* Rasi, Navamsa (D9), Dasamsa (D10), etc. List of radio buttons or elegant list items.
    *   *Style Toggle:* North Indian (Diamond) vs. South Indian (Square) toggle switch.
    *   *Options:* Toggle Degrees, Toggle Arudhas, Toggle Retrograde indicators.
*   **Right Area (Canvas):** The Chart itself.
    *   Takes up maximum remaining space.
    *   Aspect ratio preservation is critical.

### Chart Visuals (The "Grahvani" Look)
*   **Container:** The chart box itself should look like it's drawn on the parchment.
*   **Lines:** Dark Brown (`#3E2A1F`), crisp SVG lines. Not pure black.
*   **Planets:** Serif fonts.
    *   *Benefics:* Gold/Warm tones.
    *   *Malefics:* Darker/Bronze tones (subtle distinction).
    *   *Retrograde:* Indicated by `(R)` or specific symbol.
*   **House Numbers:** Small, opacity 50%, corner placement.

### UX Best Practices
*   **NO Scrolling:** The main chart should fit on the screen without scrolling.
*   **Tooltips:** Hovering over a planet shows exact degrees, nakshatra, and lordship details instantly.
*   **Mobile:** On mobile, controls move to a bottom drawer; Chart takes 100% width.

---

## 6. Routing Structure (Next.js App Router)

```
src/app/
├── (auth)/                 # Auth Layout
│   └── login/
├── (dashboard)/            # Dashboard Layout (Header + BG)
│   ├── dashboard/          # Main Overview
│   ├── clients/            # Client List
│   │   ├── page.tsx        # Registry View
│   │   └── new/            # Add Client Page
│   │       └── page.tsx
│   └── client/             # Single Client Domain
│       └── [id]/           # Dynamic Client ID
│           ├── layout.tsx  # Holds the persistent Header & Tabs
│           ├── page.tsx    # Redirects to /charts
│           ├── charts/     # The Main View
│           │   └── page.tsx
│           ├── dashas/
│           │   └── page.tsx
│           └── edit/
│               └── page.tsx
└── layout.tsx              # Root Layout
```

---

## 7. File & Folder Structure

Focused on scalable Domain-Driven Design for the frontend.

```
src/
├── components/
│   ├── ui/                 # Generic UI (Buttons, Inputs, Modals)
│   │   ├── PremiumButton.tsx
│   │   ├── ParchmentCard.tsx
│   │   └── ...
│   ├── shared/             # App-wide shared components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── astrology/          # Pure UI components for Astrology (Stateless)
│       ├── SouthIndianChart.tsx
│       ├── NorthIndianChart.tsx
│       └── PlanetGlyph.tsx
├── features/               # Feature-based folders
│   ├── clients/
│   │   ├── components/     # ClientList, ClientCard, ClientForm
│   │   ├── hooks/          # useClients, useClientDetail
│   │   └── utils/          # formatBirthDate, etc.
│   └── charts/
│       ├── components/     # ChartControls, ChartContainer
│       └── hooks/          # useChartCalculations (interfacing with backend)
├── lib/
│   ├── api/                # API definitions
│   └── constants/          # Astrology constants (Planets, Rashis)
└── styles/                 # Global styles
```

---

## 8. Component List

### Core UI (Design System)
1.  **`GoldenButton`**: Primary actions (Already exists).
2.  **`ParchmentInput`**: Text fields with bottom-border only style, antique font.
3.  **`AntiqueCard`**: Container with the stylized border and background.
4.  **`TabNavigation`**: The folder-tab switcher for the Client Detail view.

### Client Feature
5.  **`ClientListRow`**: Individual client strip in the registry.
6.  **`ClientForm`**: The complex form for adding/editing.
7.  **`ClientHeader`**: Sticky header for user details.

### Astrology Feature
8.  **`ChartCanvasWrapper`**: Handles the SVG aspect ratio and sizing.
9.  **`SouthIndianChart`**: SVG implementation of the square chart.
10. **`NorthIndianChart`**: SVG implementation of the diamond chart.
11. **`PlanetRow`**: A small component to render Planet + Sign + Degree text.
