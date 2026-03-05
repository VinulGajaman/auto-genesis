# AutoGenesis Passport — Project Structure Reference

> **Generated:** March 2026  
> **Stack:** React 18 · CRA · Mantine v7 · Zustand · TanStack Query · React Hook Form + Zod

---

## Top-Level Structure

```
Autogenesis/
├── public/
│   ├── favicon.svg          # Double-chevron logo (SVG, shown in browser tab)
│   ├── logo192.svg          # Apple touch icon version (dark bg + logo)
│   ├── index.html           # CRA entry HTML — links fonts, sets meta tags
│   └── manifest.json        # PWA manifest
│
├── src/
│   ├── assets/              # (future) images, icons, fonts
│   ├── components/layout/   # App shell components (Navbar, CompareBar, LoadingScreen)
│   ├── features/            # Feature-based page modules
│   ├── store/               # Zustand global state
│   ├── theme/               # Mantine theme configuration
│   ├── hooks/               # Reusable React hooks
│   ├── data/                # Static data (vehicles, colors)
│   ├── utils/               # Utility functions
│   ├── styles/              # Global CSS + legacy page CSS
│   ├── App.js               # Root router + AppShell layout
│   └── index.js             # React entry — providers, theme, notifications
│
├── package.json
├── AutoGenesis_Passport_MASTER_PLAN.md
└── PROJECT_STRUCTURE.md     (this file)
```

---

## `src/index.js` — Application Entry Point

**Purpose:** Bootstraps the entire React app with all providers.

**Providers (in order):**
1. `QueryClientProvider` — TanStack React Query (async data caching)
2. `MantineProvider` — injects the custom dark theme globally
3. `ColorSchemeScript` — prevents flash of light theme on load
4. `Notifications` — Mantine toast system (top-right, z=9999)
5. `NotifyBridge` — custom component that injects Mantine `notifications.show()` into the Zustand `useAppStore` so any component can call `showToast()` without importing Mantine

```js
// Key logic — bridge pattern
useEffect(() => {
  injectNotify(({ message, type }) => {
    notifications.show({ message, color: ... });
  });
}, [injectNotify]);
```

---

## `src/App.js` — Router & Shell

**Purpose:** Defines the Mantine `AppShell` (64px header) and React Router routes.

| Route | Component |
|-------|-----------|
| `/` | `features/gallery/Gallery.jsx` |
| `/passport/:id` | `features/passport/Passport.jsx` |
| `/compare` | `features/compare/Compare.jsx` |
| `/swap/:id` | `features/swap/Swap.jsx` |
| `/add-vehicle` | `features/add-vehicle/AddVehicle.jsx` |

**Loading gate:** renders `<LoadingScreen onComplete>` first, then shows routes after 1.7s.

---

## `src/theme/mantineTheme.js` — Mantine Theme

**Purpose:** Full Mantine v7 dark theme with AutoGenesis brand colors.

**Key overrides:**
- `colors.brand` = 10-shade green palette centered on `#00C875`
- `colors.dark` = 10-shade near-black palette (`#080808` → `#C1C2C5`)
- `fontFamily` = `'DM Sans'`; headings use `'Bebas Neue'`
- Per-component overrides: `Input`, `Select` (dropdown, option), `Button`, `Card`, `Paper`, `Table`, `Tabs`, `Stepper`, `Switch`, `Notification`, `Tooltip`

---

## `src/store/useAppStore.js` — Global UI State (Zustand)

**Replaces:** `src/context/AppContext.js`

**State:**
| Field | Type | Purpose |
|-------|------|---------|
| `compareList` | `string[]` | Up to 2 vehicle IDs added to comparison |
| `_notifyFn` | `function` | Injected Mantine notify function |

**Actions:** `addToCompare(id)`, `removeFromCompare(id)`, `clearCompare()`, `isInCompare(id)`, `showToast(message, type)`, `injectNotify(fn)`

```js
// Usage in any component:
const addToCompare = useAppStore(s => s.addToCompare);
const showToast    = useAppStore(s => s.showToast);
```

---

## `src/store/useVehicleStore.js` — Vehicle Data (Zustand)

**Purpose:** Merges the static `VEHICLES` array with any custom vehicles saved to localStorage.

**State:**
| Field | Type | Purpose |
|-------|------|---------|
| `vehicles` | `Vehicle[]` | All static + custom vehicles merged |

**Actions:** `getVehicleById(id)`, `refreshCustomVehicles()` (re-reads localStorage)

```js
// Key merge logic:
function buildVehicleList() {
  const custom = getCustomVehicles().map(v => ({
    ...v, image: getVehicleImage(v.id) || v.image
  }));
  return [...VEHICLES, ...custom];
}
```

---

## `src/components/layout/` — Layout Components

### `Navbar.jsx`
- Mantine `Group` + `Button` + `Badge`
- Logo: SVG chevron icon + "AUTO **GENESIS**" (gradient text) + pulsing green dot
- Center: frosted-glass pill with Vehicles + Compare nav links
- Right: green `+ Add Vehicle` CTA button
- Compare badge: shows count from `useAppStore.compareList`

### `CompareBar.jsx`
- Mantine `Transition slide-up` — appears when `compareList.length > 0`
- Shows 2 vehicle slots with thumbnails + names
- "Compare Now" button → navigates to `/compare`
- Data from `useAppStore` + `useVehicleStore`

### `LoadingScreen.jsx`
- Animated logo + Mantine `Progress` bar
- Auto-hides after 1.7s, calls `onComplete` callback

---

## `src/features/` — Feature Pages

### `gallery/Gallery.jsx`
**Mantine components:** `TextInput`, `Select` (clearable), `SimpleGrid`, `Paper`, `Tooltip`, `Button`, `Badge`  
**State:** `search`, `fuelFilter`, `gradeFilter`, `sortBy` (local `useState`)  
**Data:** `useVehicleStore.vehicles` (reactive, includes custom vehicles)

**Filter logic (useMemo):**
```js
const filtered = useMemo(() => {
  return allVehicles
    .filter(v => matchSearch && matchFuel && matchGrade)
    .sort(bySortKey);
}, [search, fuelFilter, gradeFilter, sortBy, allVehicles]);
```

**VehicleCard subcomponent:** Paper card with image, grade badge, Tooltip trust dots, Compare checkbox, View Passport + Swap buttons.

---

### `compare/Compare.jsx`
**Mantine components:** `Table`, `Paper`, `SimpleGrid`, `Badge`, `Divider`  
**Chart:** `@mantine/charts` `LineChart` (replaces Chart.js)  
**State:** reads `compareList` from `useAppStore`, vehicles from `useVehicleStore`

**Empty state:** renders vehicle selector grid so user can pick 2 vehicles.  
**Comparison table:** 9 spec rows + winner highlights + accident status icons.  
**Trust badges section:** CheckCircle/XCircle per badge, per vehicle.  
**Depreciation chart:** Mantine `LineChart` with 2 series, custom tooltip.

---

### `swap/Swap.jsx`
**Mantine components:** `Modal` (useDisclosure), `SimpleGrid`, `Paper`, `Badge`, `Divider`  
**Logic:** `swapDelta(source, target)` — computes value difference and generates label + color.  
**Modal:** full swap summary (YOU GIVE / YOU RECEIVE) with value delta.  
**Toast:** on "Express Interest" click → `showToast()`

---

### `passport/Passport.jsx`
Re-exports `pages/Passport.js` while the feature folder is in place.  
`Passport.js` uses: Mantine store (Zustand) for `addToCompare` + `showToast`. Chart.js for depreciation.

---

### `add-vehicle/AddVehicle.jsx`
**Mantine components:** `Stepper`, `TextInput`, `NumberInput`, `Select`, `ColorInput`, `FileInput`, `Textarea`, `Switch`, `Paper`, `SimpleGrid`, `Alert`, `ActionIcon`  
**Form state:** Mantine `useForm` + `zodResolver` — validates per-step using Zod schemas  
**Validation:** `schema/validation.js` — `step1Schema`…`step4Schema` (Zod objects)

**6 Steps:**
| Step | Form fields |
|------|-------------|
| 0 Basic Info | Make, Model, Variant, Year, Color Name, Color Hex, Photo upload |
| 1 Tech Specs | VIN, Engine No, Fuel Type, Displacement, Transmission, Drive, Body, Doors, Seats |
| 2 Condition | Grade picker (1–5 color buttons), Mileage, Market Value |
| 3 Badges | 4 Switch toggles in badge cards |
| 4 Timeline | Dynamic event list — Select phase, TextInput source/title/date, Textarea detail |
| 5 Review | Summary grid + submit → `saveVehicle()` + `saveVehicleImage()` + Zustand refresh |

---

### `add-vehicle/schema/validation.js`
**Purpose:** Declarative Zod schemas replacing the old manual `validateStep()` function.

```js
export const step1Schema = z.object({
  make:  z.string().min(1, 'Make is required'),
  year:  z.coerce.number().min(1900).max(2027),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  ...
});
```

---

## `src/data/`

### `vehicles.js`
Contains the 5 static demo vehicles as a `const VEHICLES` array.  
Exports both `default` and named `{ VEHICLES }`.  
Each vehicle: full passport object with `make`, `model`, `timeline[]`, `depreciation[]`, `badges{}`, etc.

### `phaseColors.js`
Maps phase keys (`manufacture`, `accident`, `service`, ...) to `{ color, bg, label }`.  
Also exports `GRADE_COLORS` (grade 1–5 → hex) and `TAB_FILTERS` for Passport tabs.

---

## `src/utils/`

### `helpers.js`
- `formatLKR(n)`, `formatKm(n)`, `formatDate(iso)` — display formatters
- `getVehicleById(id)` — looks up static + custom (localStorage) vehicles
- `swapDelta(source, target)` — value difference + label + color
- `getWinner(rowKey, v1, v2)` — comparison row winner calculation
- `calcDepreciationStats(vehicle)` — total loss %, annual avg loss
- `getAccidentCount(vehicle)` — filters timeline for accident events
- `getPlateNumber(vehicle)` — regex extracts plate from registration event detail

### `vehicleStorage.js`
localStorage-based demo persistence. **Replace internals with real API when backend is ready.**
- `getCustomVehicles()` — reads `ag_custom_vehicles` from localStorage
- `saveCustomVehicle(v)` / `saveVehicle(v)` (alias) — appends a new vehicle
- `saveVehicleImage(id, dataUrl)` — saves base64 image to `ag_img_<id>`
- `getVehicleImage(id)` — retrieves base64 image string
- `getCustomVehicleById(id)` — find a custom vehicle by ID

### `formatters.js`
New file (preferred over helpers.js for new code):
- `formatLKR(value)` — Intl.NumberFormat Sri Lankan currency
- `formatKm(value)` — adds comma separators + " km"
- `formatDate(dateStr)` — "05 Mar 2026" format
- `formatYear(dateStr)`, `calcAge(year)`

---

## `src/hooks/`

### `useCountUp.js`
Animates a number from 0 to `target` over `duration` ms.  
Used in Gallery hero stats (5 vehicles, 47 records, 3200+ owners).

### `useIntersectionObserver.js`
Returns `[ref, isVisible]`. Triggers when element enters viewport.  
Used for scroll-triggered animations (vehicle cards, feature cards, stats bar).

---

## `src/styles/`

### `global.css`
Minimal global styles: CSS custom properties (brand tokens), reset, scrollbar, utility classes.  
All component styling lives in `src/theme/mantineTheme.js` component overrides.

### `Gallery.css`, `Passport.css`, `Compare.css`, `Swap.css`, `AddVehicle.css`, `Components.css`
Legacy page-specific CSS. Hero section, timeline, depreciation chart, cards.  
Being progressively replaced by Mantine component styling as pages are fully migrated.

---

## Key Libraries & Their Roles

| Library | Version | Role |
|---------|---------|------|
| `react` | 18 | UI framework |
| `react-router-dom` | 7 | Client-side routing (HashRouter) |
| `@mantine/core` | 7 | UI components (Button, Input, Select, Modal, Stepper, Table, ...) |
| `@mantine/hooks` | 7 | `useDisclosure`, `useForm`, etc. |
| `@mantine/form` | 7 | Form state management |
| `@mantine/notifications` | 7 | Toast/notification system |
| `@mantine/charts` | 7 | LineChart for depreciation (built on recharts) |
| `@emotion/react` | latest | Mantine's CSS-in-JS engine |
| `zustand` | latest | Global state (compareList, toast, vehicle data) |
| `immer` | latest | Immutable state updates inside Zustand |
| `@tanstack/react-query` | 5 | Async data layer (ready for backend integration) |
| `react-hook-form` | latest | Form state (used via `@mantine/form` integration) |
| `zod` | latest | Schema validation for AddVehicle wizard steps |
| `@hookform/resolvers` | latest | Connects Zod to React Hook Form |
| `lucide-react` | latest | Icon system (all UI icons) |
| `recharts` | latest | Required peer dep for `@mantine/charts` |
| `chart.js` + `react-chartjs-2` | 4 | Passport depreciation chart (legacy, being replaced) |

---

## State Flow Diagram

```
                    ┌─────────────────────┐
                    │   useVehicleStore   │
                    │  (Zustand + immer)  │
                    │  vehicles[]         │
                    │  getVehicleById()   │
                    │  refreshCustoms()   │
                    └──────────┬──────────┘
                               │ reads
           ┌───────────────────┼────────────────────┐
           ▼                   ▼                    ▼
      Gallery.jsx        Passport.jsx          Compare.jsx
   (vehicle grid)     (detail + tabs)       (side by side)

                    ┌─────────────────────┐
                    │    useAppStore      │
                    │  (Zustand + immer)  │
                    │  compareList[]      │
                    │  showToast()        │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼──────────────┐
           ▼                   ▼              ▼
      Navbar.jsx        CompareBar.jsx    Swap.jsx
   (badge count)       (slide-up bar)   (interest toast)
```

---

## Backend Integration Checklist

When the backend is ready, replace:

| File | Replace with |
|------|-------------|
| `utils/vehicleStorage.js` | Real API calls (`fetch`/`axios`) |
| `store/useVehicleStore.js` | Wrap with `@tanstack/react-query` `useQuery` |
| `features/add-vehicle/AddVehicle.jsx` submit handler | `POST /vehicles` API |
| `utils/helpers.js getVehicleById` | `GET /vehicles/:id` |
| Image storage (localStorage base64) | File upload endpoint + CDN URL |
