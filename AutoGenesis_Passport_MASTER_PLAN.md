# 🚗 AutoGenesis Vehicle Passport — MASTER BUILD PLAN v2.0
> Complete specification for building the full demo web application in a single prompt.
> Every section, component, state, interaction, animation, data field, and CSS rule is described here.

---

## TABLE OF CONTENTS
1. Project Overview & Goals
2. Tech Stack & Delivery Format
3. Design System (Colors, Typography, Spacing, Tokens)
4. File Architecture
5. Complete Vehicle Dataset (5 Vehicles, all fields)
6. Page 1 — Gallery / Home (`index.html`)
7. Page 2 — Passport Detail View (`passport.html`)
8. Page 3 — Compare View (`compare.html`)
9. Page 4 — Swap View (`swap.html`)
10. Global Components (Navbar, Footer, Modals, Loaders)
11. All Animations & Micro-interactions
12. All JS Logic & Functions
13. Responsive Behavior
14. Demo Walkthrough Script
15. Future Roadmap

---

## 1. PROJECT OVERVIEW & GOALS

**Product:** AutoGenesis Passport  
**Client:** AutoGenesis (Sri Lanka auto platform)  
**Purpose:** A digital vehicle history passport — a single URL per vehicle that shows its entire verified life story from factory in Japan to its current owner in Sri Lanka. It aggregates data from multiple verified sources: manufacturer, auction houses, exporters (like SAS3), inspection companies (JEVIC), Sri Lanka Customs, RMV (Road Motor Vehicles dept), insurance companies, and local service centers.

**Demo Goal:** Impress the client with a fully interactive, beautiful, animated demo with 5 real-looking vehicles, all features working, no placeholders.

**Key features to demo:**
- Vehicle Gallery with search & filters
- Full Passport per vehicle (hero, stats, grade, badges, timeline tabs)
- 6 history tabs: Full Timeline / Accident History / Travel History / Ownership History / Service History / Registration History
- Depreciation chart per vehicle
- Compare feature (2 vehicles side by side)
- Swap/trade feature (value delta between vehicles)
- Fully animated, dark luxury aesthetic

---

## 2. TECH STACK & DELIVERY FORMAT

**Deliver as:** A single self-contained `index.html` file with all CSS in `<style>` and all JS in `<script>` tags. No build tools. No npm. Opens directly in browser by double-clicking.

**External CDN libraries only (loaded via script tags):**
```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Chart.js for depreciation graph -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Lucide icons (SVG icon system) -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

**No:** React, Vue, Angular, Tailwind, Bootstrap, jQuery. Pure vanilla JS + CSS.

**Routing:** All "pages" are `<div>` sections. Show/hide via JS with `display:none` / `display:block`. URL hash (`#gallery`, `#passport`, `#compare`, `#swap`) updated with `history.pushState()` for back-button support.

**State management:** A single global `window.APP` object:
```javascript
window.APP = {
  vehicles: [],          // All 5 vehicle objects
  currentVehicle: null,  // Currently viewed passport
  compareList: [],       // Array of up to 2 vehicle IDs for compare
  swapSource: null,      // Vehicle ID being offered for swap
  activeTab: 'timeline', // Current passport tab
  depreciationChart: null // Chart.js instance
};
```

---

## 3. DESIGN SYSTEM

### 3.1 Color Palette
```css
:root {
  /* Backgrounds */
  --bg-base:        #080808;   /* Page background */
  --bg-surface:     #111111;   /* Card / section background */
  --bg-elevated:    #181818;   /* Elevated card (on surface) */
  --bg-hover:       #202020;   /* Hover state */
  --bg-overlay:     rgba(0,0,0,0.85); /* Modal overlay */

  /* Accent Colors */
  --green:          #00C875;   /* Primary accent — AutoGenesis brand */
  --green-dim:      #009955;   /* Darker green for hover */
  --green-glow:     rgba(0, 200, 117, 0.15);
  --green-glow-lg:  rgba(0, 200, 117, 0.30);
  --gold:           #F5C842;   /* Grade stars, premium labels */
  --gold-dim:       rgba(245, 200, 66, 0.15);
  --red:            #FF4545;   /* Accidents, warnings */
  --red-dim:        rgba(255, 69, 69, 0.12);
  --blue:           #4A9EFF;   /* Travel, manufacture */
  --blue-dim:       rgba(74, 158, 255, 0.12);
  --orange:         #FF8C42;   /* Service events */
  --orange-dim:     rgba(255, 140, 66, 0.12);
  --purple:         #A855F7;   /* Export, shipping */
  --purple-dim:     rgba(168, 85, 247, 0.12);
  --teal:           #22D3EE;   /* Customs, registration */
  --teal-dim:       rgba(34, 211, 238, 0.12);

  /* Text */
  --text-primary:   #F0F0F0;
  --text-secondary: #999999;
  --text-muted:     #555555;
  --text-inverse:   #080808;

  /* Borders */
  --border:         rgba(255,255,255,0.06);
  --border-strong:  rgba(255,255,255,0.12);
  --border-accent:  rgba(0, 200, 117, 0.3);

  /* Shadows */
  --shadow-sm:   0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:   0 4px 20px rgba(0,0,0,0.6);
  --shadow-lg:   0 8px 40px rgba(0,0,0,0.8);
  --shadow-green: 0 0 20px rgba(0,200,117,0.25);
  --shadow-red:   0 0 20px rgba(255,69,69,0.25);

  /* Radii */
  --r-sm:  6px;
  --r-md:  12px;
  --r-lg:  20px;
  --r-xl:  28px;
  --r-full: 9999px;

  /* Spacing scale */
  --sp-1:  4px;
  --sp-2:  8px;
  --sp-3:  12px;
  --sp-4:  16px;
  --sp-5:  20px;
  --sp-6:  24px;
  --sp-8:  32px;
  --sp-10: 40px;
  --sp-12: 48px;
  --sp-16: 64px;
  --sp-20: 80px;

  /* Transitions */
  --t-fast:   all 0.15s ease;
  --t-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --t-slow:   all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  --t-bounce: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 3.2 Typography
```css
/* Display / Hero headings */
font-family: 'Bebas Neue', sans-serif;
letter-spacing: 0.04em;
/* Use for: page titles, vehicle names, stat numbers, section headers */

/* Body / UI text */
font-family: 'DM Sans', sans-serif;
/* Use for: labels, descriptions, table content, badges, buttons */

/* Type Scale */
--text-xs:   11px;
--text-sm:   13px;
--text-base: 15px;
--text-md:   17px;
--text-lg:   20px;
--text-xl:   24px;
--text-2xl:  32px;
--text-3xl:  48px;
--text-4xl:  64px;
--text-hero: 96px; /* Only for passport hero car name */
```

### 3.3 Phase Color Map (for timeline events)
```javascript
const PHASE_COLORS = {
  manufacture:  { color: '#4A9EFF', bg: 'rgba(74,158,255,0.12)',  label: 'Manufacturer' },
  first_sale:   { color: '#00C875', bg: 'rgba(0,200,117,0.12)',   label: 'Dealer' },
  service:      { color: '#FF8C42', bg: 'rgba(255,140,66,0.12)',  label: 'Service Center' },
  insurance:    { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)',  label: 'Insurance' },
  accident:     { color: '#FF4545', bg: 'rgba(255,69,69,0.12)',   label: 'Accident Report' },
  export_sale:  { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', label: 'Auction House' },
  export:       { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', label: 'Exporter' },
  inspection:   { color: '#F5C842', bg: 'rgba(245,200,66,0.12)', label: 'JEVIC' },
  arrival:      { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)', label: 'Port Authority' },
  customs:      { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)', label: 'Customs' },
  registration: { color: '#00C875', bg: 'rgba(0,200,117,0.12)',  label: 'RMV' },
  ownership:    { color: '#F5C842', bg: 'rgba(245,200,66,0.12)', label: 'Owner' },
};
```

---

## 4. FILE ARCHITECTURE

Since everything is in one HTML file, organize the code into clearly labeled sections inside the file:

```
index.html
├── <head>
│   ├── Meta tags (charset, viewport, title, description, og:image)
│   ├── Google Fonts link
│   ├── CDN: Chart.js
│   ├── CDN: Lucide icons
│   └── <style> block (all CSS — ~800 lines)
│
├── <body>
│   ├── #navbar (sticky top nav)
│   ├── #page-gallery (the vehicle gallery — default visible)
│   ├── #page-passport (passport detail — hidden by default)
│   ├── #page-compare (compare view — hidden by default)
│   ├── #page-swap (swap view — hidden by default)
│   ├── #compare-bar (sticky bottom bar — appears when 2 vehicles selected)
│   ├── #modal-swap-detail (swap detail modal overlay)
│   ├── #modal-share (share passport modal)
│   └── <script> block (all JS — ~600 lines)
│       ├── const VEHICLES = [...] (all 5 vehicles data)
│       ├── APP state object
│       ├── Router functions
│       ├── Gallery render functions
│       ├── Passport render functions
│       ├── Timeline render functions
│       ├── Tab system functions
│       ├── Compare render functions
│       ├── Swap render functions
│       ├── Chart.js depreciation setup
│       ├── Animation / IntersectionObserver
│       ├── Utility functions
│       └── Init / DOMContentLoaded
```

---

## 5. COMPLETE VEHICLE DATASET

### VEHICLE 1 — Toyota Aqua 2014

```javascript
{
  id: "AG-001",
  make: "Toyota",
  model: "Aqua",
  variant: "G Grade",
  year: 2014,
  color: "Pearl White",
  colorHex: "#F5F5F0",
  vin: "NHP10-1234567",
  chassisNo: "NHP10-1234567",
  engineNo: "1NZ-B456789",
  fuelType: "Hybrid",
  transmission: "CVT",
  displacement: "1500cc",
  driveType: "FWD",
  doors: 5,
  seats: 5,
  bodyType: "Hatchback",
  age: 11,
  mileage: 87450,
  condition_grade: 4,
  condition_label: "Good",
  market_value_lkr: 8750000,
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Toyota_Aqua_G_grade_--_10-22-2011.jpg/1280px-Toyota_Aqua_G_grade_--_10-22-2011.jpg",
  thumbnailColor: "#c8d4c0",
  badges: {
    on_time_service: true,
    one_owner: true,
    no_accident: true,
    untampered_mileage: true
  },
  depreciation: [
    { year: 2014, value: 14500000 },
    { year: 2015, value: 13800000 },
    { year: 2016, value: 13200000 },
    { year: 2017, value: 12300000 },
    { year: 2018, value: 11400000 },
    { year: 2019, value: 10600000 },
    { year: 2020, value: 10100000 },
    { year: 2021, value: 9700000 },
    { year: 2022, value: 9200000 },
    { year: 2023, value: 9000000 },
    { year: 2024, value: 8750000 }
  ],
  timeline: [
    {
      phase: "manufacture",
      source: "Toyota Motor Corporation",
      sourceType: "Manufacturer",
      date: "2014-02-15",
      mileage: 0,
      title: "Manufactured at Toyota Iwate Plant",
      detail: "Assembled at Toyota's Iwate Plant, Iwate Prefecture, Japan. Full factory quality control inspection passed. Hybrid battery pack (Panasonic NiMH) installed and load-tested. Paint applied: Pearl White (070). Rolled off production line unit #IW-2014-44821.",
      icon: "🏭",
      verified: true
    },
    {
      phase: "first_sale",
      source: "Toyota Corolla Dealers, Osaka",
      sourceType: "Dealer",
      date: "2014-06-03",
      mileage: 12,
      title: "First Sold — Japan Domestic Market",
      detail: "Sold to Mr. Kenji Yamamoto, Namba, Osaka. Registered under Japan plate 大阪 300 さ 1234. 3-year dealer warranty activated. Sales invoice #OSD-2014-88234.",
      icon: "🤝",
      verified: true
    },
    {
      phase: "insurance",
      source: "Tokio Marine Insurance, Japan",
      sourceType: "Insurance",
      date: "2014-06-03",
      mileage: 12,
      title: "Comprehensive Insurance Issued",
      detail: "Comprehensive auto insurance policy issued. Policy #TM-2014-NHP10-9821. Coverage: full vehicle damage, third-party, natural disaster. Premium: ¥84,000/year.",
      icon: "🛡️",
      verified: true
    },
    {
      phase: "service",
      source: "Toyota Service Center, Namba, Osaka",
      sourceType: "Service Center",
      date: "2015-06-10",
      mileage: 15200,
      title: "1st Periodic Service — 15,000km",
      detail: "Engine oil change (Toyota 0W-20 synthetic), oil filter replaced, brake pads inspected (75% remaining), tyre rotation, hybrid battery diagnostic — SOH 99%. Air filter replaced. All systems nominal. Service record #TSC-OSK-2015-0610.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "service",
      source: "Toyota Service Center, Namba, Osaka",
      sourceType: "Service Center",
      date: "2016-08-22",
      mileage: 31400,
      title: "2nd Periodic Service — 30,000km",
      detail: "Full 30,000km service. Oil + filter, air filter, cabin filter replaced. AC service (re-gas + compressor check). Hybrid battery: SOH 97%. Brake fluid test — OK. Coolant topped. Service record #TSC-OSK-2016-0822.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "service",
      source: "Toyota Service Center, Namba, Osaka",
      sourceType: "Service Center",
      date: "2017-09-14",
      mileage: 45800,
      title: "3rd Periodic Service — 45,000km",
      detail: "Oil change, spark plugs replaced (iridium), brake fluid flush, tyre pressure check. Hybrid battery: SOH 96%. Drive belt inspection — no cracks. Service record #TSC-OSK-2017-0914.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "export_sale",
      source: "USS Tokyo Auto Auction",
      sourceType: "Auction House",
      date: "2018-03-14",
      mileage: 54300,
      title: "Auctioned — USS Tokyo",
      detail: "Listed and sold at USS Tokyo Auto Auction, largest vehicle auction in Japan. Auction grade: 4B (Good condition, minor paint fade on roof noted). Hammer price: ¥540,000. Buyer: SAS3 Exports Ltd, Kobe. Auction lot #USS-TKO-2018-AB7744.",
      icon: "🔨",
      verified: true
    },
    {
      phase: "inspection",
      source: "JEVIC Japan",
      sourceType: "Inspection",
      date: "2018-03-28",
      mileage: 54320,
      title: "Pre-Export JEVIC Inspection",
      detail: "Japan Export Vehicle Inspection Center (JEVIC) inspection completed. Grade: 4. Exterior: A1 (minor paint fade on roof panel only — 20cm area). Interior: A (very good). Engine: clean, no leaks. Chassis: no rust, no structural damage. Odometer verified at 54,320km. Certificate #JEVIC-2018-KOB-38821.",
      icon: "🔍",
      verified: true
    },
    {
      phase: "export",
      source: "SAS3 Exports Ltd, Kobe",
      sourceType: "Exporter",
      date: "2018-04-02",
      mileage: 54320,
      title: "Shipped from Port of Kobe",
      detail: "Vehicle loaded at Port of Kobe, Japan. Vessel: NYK Constellation (Panama flag). Container: TCKU3456789. Bill of Lading #NYKK-2018-KOB-4421. Estimated transit: 18 days. Destination: Port of Colombo, Sri Lanka.",
      icon: "🚢",
      verified: true
    },
    {
      phase: "arrival",
      source: "Sri Lanka Ports Authority",
      sourceType: "Port Authority",
      date: "2018-05-10",
      mileage: 54320,
      title: "Arrived — Port of Colombo",
      detail: "Vessel docked at Jaye Container Terminal, Port of Colombo at 06:30. Vehicle offloaded and moved to Customs bonded yard, Terminal 2, Bay C-14. Arrival reference #SLPA-2018-COL-99231.",
      icon: "⚓",
      verified: true
    },
    {
      phase: "customs",
      source: "Sri Lanka Customs / Prestige Auto Imports",
      sourceType: "Customs",
      date: "2018-05-18",
      mileage: 54320,
      title: "Sri Lanka Customs Clearance",
      detail: "Cleared under import permit #SLC-2018-44821. Vehicle age at import: 4 years 3 months. Import duties paid: LKR 3,200,000 (hybrid concessionary rate applied). VAT: LKR 640,000. Customs declaration #CD-2018-COL-22441. Cleared by Prestige Auto Imports (Pvt) Ltd, Colombo 3.",
      icon: "📋",
      verified: true
    },
    {
      phase: "registration",
      source: "Department of Motor Traffic (RMV), Sri Lanka",
      sourceType: "RMV",
      date: "2018-06-01",
      mileage: 54350,
      title: "Registered — Sri Lanka (RMV)",
      detail: "Vehicle registered at RMV Western Province office. Registration number: WP CAR-4421. Certificate of Registration issued. Revenue licence obtained. First registration in Sri Lanka. Registered owner: Mr. Chaminda Perera.",
      icon: "📄",
      verified: true
    },
    {
      phase: "ownership",
      source: "RMV Sri Lanka",
      sourceType: "Owner Record",
      date: "2018-06-01",
      mileage: 54350,
      title: "First Sri Lankan Owner",
      detail: "Mr. Chaminda Perera, 45/3 Flower Road, Nugegoda, Western Province. NIC: 19XXXXXXXXV. Purchased at LKR 7,200,000 from Prestige Auto Imports.",
      icon: "👤",
      verified: true
    },
    {
      phase: "service",
      source: "Toyota Lanka (Pvt) Ltd, Peliyagoda",
      sourceType: "Service Center",
      date: "2019-01-15",
      mileage: 62100,
      title: "1st Sri Lanka Service",
      detail: "Full service at authorized Toyota Lanka dealer. Engine oil, oil filter, air filter, cabin filter replaced. AC re-gas (R134a). Hybrid battery system check: SOH 95%. Brake pads: 60% remaining. Wiper blades replaced. Service record #TLK-2019-0115.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "service",
      source: "AutoCare Service Center, Nugegoda",
      sourceType: "Service Center",
      date: "2020-07-20",
      mileage: 74500,
      title: "2nd Sri Lanka Service",
      detail: "Engine oil (Castrol Magnatec 0W-20), oil filter, spark plugs replaced. Tyre rotation done. Belt inspection — no issues. Brake fluid test. Service record #AC-NUG-2020-0720.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "service",
      source: "AutoCare Service Center, Nugegoda",
      sourceType: "Service Center",
      date: "2022-03-05",
      mileage: 83900,
      title: "3rd Sri Lanka Service",
      detail: "Full periodic service. New tyres fitted: Bridgestone Ecopia 175/65R15 (all 4). Brake fluid flush. Battery terminals cleaned and greased. Cabin filter replaced. AC service. Service record #AC-NUG-2022-0305.",
      icon: "🔧",
      verified: true
    }
  ]
}
```

---

### VEHICLE 2 — Honda Vezel 2016

```javascript
{
  id: "AG-002",
  make: "Honda",
  model: "Vezel",
  variant: "Hybrid Z — Honda Sensing",
  year: 2016,
  color: "Lunar Silver Metallic",
  colorHex: "#B0B4BA",
  vin: "RU3-4567890",
  chassisNo: "RU3-4567890",
  engineNo: "LEB-1234567",
  fuelType: "Hybrid",
  transmission: "7-Speed DCT",
  displacement: "1500cc",
  driveType: "FWD",
  doors: 5,
  seats: 5,
  bodyType: "Crossover SUV",
  age: 9,
  mileage: 61200,
  condition_grade: 5,
  condition_label: "Excellent",
  market_value_lkr: 14200000,
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Honda_Vezel_Hybrid_Z_--_Honda_Sensing_%28RU3%29%2C_front_8.21.18.jpg/1280px-Honda_Vezel_Hybrid_Z_--_Honda_Sensing_%28RU3%29%2C_front_8.21.18.jpg",
  thumbnailColor: "#b0b4ba",
  badges: {
    on_time_service: true,
    one_owner: false,
    no_accident: true,
    untampered_mileage: true
  },
  depreciation: [
    { year: 2016, value: 21000000 },
    { year: 2017, value: 20200000 },
    { year: 2018, value: 19400000 },
    { year: 2019, value: 18200000 },
    { year: 2020, value: 17100000 },
    { year: 2021, value: 16000000 },
    { year: 2022, value: 15400000 },
    { year: 2023, value: 14800000 },
    { year: 2024, value: 14200000 }
  ],
  timeline: [
    {
      phase: "manufacture",
      source: "Honda Motor Co. Ltd",
      sourceType: "Manufacturer",
      date: "2016-04-10",
      mileage: 0,
      title: "Manufactured — Honda Yorii Plant",
      detail: "Assembled at Honda's Yorii Plant, Saitama Prefecture, Japan. Honda Sensing collision avoidance system calibrated and tested. Earth Dreams Technology 1.5L hybrid engine installed. Factory QC inspection passed. Unit serial #YOR-2016-RU3-22891.",
      icon: "🏭",
      verified: true
    },
    {
      phase: "first_sale",
      source: "Honda Cars Tokyo, Shinjuku",
      sourceType: "Dealer",
      date: "2016-09-22",
      mileage: 8,
      title: "First Sold — Japan",
      detail: "Sold to Ms. Yuki Tanaka, Shinjuku, Tokyo. Registered plate 品川 500 の 8842. 3-year Honda warranty activated. Sold with Honda Internavi lifetime map subscription. Sales invoice #HCT-2016-44123.",
      icon: "🤝",
      verified: true
    },
    {
      phase: "insurance",
      source: "Mitsui Sumitomo Insurance, Japan",
      sourceType: "Insurance",
      date: "2016-09-22",
      mileage: 8,
      title: "Insurance Issued",
      detail: "Comprehensive policy #MS-2016-RU3-7712. Includes roadside assistance, rental car cover, legal liability. Premium: ¥96,000/year.",
      icon: "🛡️",
      verified: true
    },
    {
      phase: "service",
      source: "Honda Cars Tokyo, Shinjuku",
      sourceType: "Service Center",
      date: "2017-09-15",
      mileage: 12400,
      title: "1st Annual Service",
      detail: "12,000km service. Oil change (Honda 0W-20), oil filter. DCT fluid level checked. Brake pads: 85%. Hybrid battery: SOH 99%. Honda Sensing camera recalibration done. Service #HCT-2017-0915.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "service",
      source: "Honda Cars Tokyo, Shinjuku",
      sourceType: "Service Center",
      date: "2019-02-10",
      mileage: 28700,
      title: "2nd Service — 30,000km",
      detail: "Full periodic. Oil, filter, air filter, cabin filter. DCT fluid replaced. Brake pads: 65%. AC service. Hybrid battery: SOH 97%. Tyre rotation. Service #HCT-2019-0210.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "export_sale",
      source: "CAA Chubu Auto Auction, Aichi",
      sourceType: "Auction House",
      date: "2020-11-05",
      mileage: 41200,
      title: "Auctioned — CAA Chubu",
      detail: "Sold at CAA Chubu auction. Grade 5 (Excellent condition, no defects). Hammer price: ¥1,020,000. Buyer: Global Motors Exports, Nagoya. Lot #CAA-CHB-2020-RR9912.",
      icon: "🔨",
      verified: true
    },
    {
      phase: "inspection",
      source: "JEVIC Japan",
      sourceType: "Inspection",
      date: "2020-11-20",
      mileage: 41230,
      title: "JEVIC Pre-Shipment Inspection",
      detail: "JEVIC Grade 5. Exterior: perfect (no scratches, no dents). Interior: A (immaculate). Engine: clean. Chassis: no rust, no repair. Odometer verified at 41,230km. Emission test: passed. Certificate #JEVIC-2020-NGY-55612.",
      icon: "🔍",
      verified: true
    },
    {
      phase: "export",
      source: "Global Motors Exports, Nagoya",
      sourceType: "Exporter",
      date: "2020-12-01",
      mileage: 41230,
      title: "Shipped from Port of Nagoya",
      detail: "Loaded at Port of Nagoya. Vessel: Höegh Singapore (Norway flag). B/L #HGS-2020-NGY-8821. Container: MSCU7712345. Transit time: 21 days. Destination: Colombo.",
      icon: "🚢",
      verified: true
    },
    {
      phase: "arrival",
      source: "Sri Lanka Ports Authority",
      sourceType: "Port Authority",
      date: "2021-01-14",
      mileage: 41230,
      title: "Arrived — Port of Colombo",
      detail: "Vessel berthed at South Asia Gateway Terminal (SAGT), Colombo. Vehicle offloaded without damage. Moved to bonded warehouse, LMD Imports Bay 3. SLPA arrival ref #SLPA-2021-COL-10441.",
      icon: "⚓",
      verified: true
    },
    {
      phase: "customs",
      source: "Sri Lanka Customs / LMD Imports (Pvt) Ltd",
      sourceType: "Customs",
      date: "2021-01-28",
      mileage: 41230,
      title: "Sri Lanka Customs Clearance",
      detail: "Cleared under permit #SLC-2021-11203. Duties paid: LKR 5,800,000. VAT: LKR 1,160,000. Hybrid concessionary rate applied. Import age: 4 years 4 months. Declaration #CD-2021-COL-8831. Importer: LMD Imports (Pvt) Ltd, Colombo 4.",
      icon: "📋",
      verified: true
    },
    {
      phase: "registration",
      source: "RMV Sri Lanka",
      sourceType: "RMV",
      date: "2021-02-10",
      mileage: 41260,
      title: "Registered — Sri Lanka",
      detail: "Registered at RMV Western Province. Plate: WP CBB-7732. Revenue licence obtained. Owner: Capital Leasing Ltd (Corporate fleet registration). Certificate #RMV-2021-CBB7732.",
      icon: "📄",
      verified: true
    },
    {
      phase: "ownership",
      source: "RMV Sri Lanka / LMD Imports",
      sourceType: "Owner Record",
      date: "2021-02-10",
      mileage: 41260,
      title: "First SL Owner — Corporate Fleet",
      detail: "Capital Leasing Ltd, No. 120, Bauddhaloka Mawatha, Colombo 2. Fleet vehicle assigned to senior management. Purchased at LKR 12,800,000.",
      icon: "🏢",
      verified: true
    },
    {
      phase: "service",
      source: "Honda Lanka (Pvt) Ltd, Borella",
      sourceType: "Service Center",
      date: "2022-04-18",
      mileage: 52300,
      title: "1st SL Service",
      detail: "Authorized Honda Lanka service. Brake pads replaced (front). AC service, oil change, cabin filter. DCT fluid checked — OK. Hybrid battery: SOH 95%. Service #HLK-2022-0418.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "ownership",
      source: "RMV Sri Lanka",
      sourceType: "Owner Record",
      date: "2023-03-01",
      mileage: 57800,
      title: "Second SL Owner — Private",
      detail: "Ownership transferred to Mr. Ruwan Silva, 22 Nawala Road, Battaramulla. NIC: 19XXXXXXXXV. Transfer value: LKR 13,500,000. Transfer fee paid at RMV.",
      icon: "👤",
      verified: true
    },
    {
      phase: "service",
      source: "Honda Lanka (Pvt) Ltd, Borella",
      sourceType: "Service Center",
      date: "2023-09-22",
      mileage: 59100,
      title: "2nd SL Service",
      detail: "Full periodic service. New wiper blades, engine oil, oil filter. AC re-gas. Tyre rotation. Brake check — 50% remaining. Service #HLK-2023-0922.",
      icon: "🔧",
      verified: true
    }
  ]
}
```

---

### VEHICLE 3 — Suzuki Wagon R 2019

```javascript
{
  id: "AG-003",
  make: "Suzuki",
  model: "Wagon R",
  variant: "FX Stingray Hybrid T",
  year: 2019,
  color: "Speedy Blue",
  colorHex: "#3A6EA5",
  vin: "MH55S-7654321",
  chassisNo: "MH55S-7654321",
  engineNo: "R06A-654321",
  fuelType: "Mild Hybrid (SHVS)",
  transmission: "5AGS (Auto Gear Shift)",
  displacement: "660cc Turbo",
  driveType: "FWD",
  doors: 5,
  seats: 4,
  bodyType: "Kei Car / Mini MPV",
  age: 6,
  mileage: 38900,
  condition_grade: 4,
  condition_label: "Good",
  market_value_lkr: 5900000,
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Suzuki_Wagon_R_Stingray_Hybrid_T_%28MH55S%29%2C_front_8.16.19.jpg/1280px-Suzuki_Wagon_R_Stingray_Hybrid_T_%28MH55S%29%2C_front_8.16.19.jpg",
  thumbnailColor: "#3a6ea5",
  badges: {
    on_time_service: true,
    one_owner: true,
    no_accident: false,
    untampered_mileage: true
  },
  depreciation: [
    { year: 2019, value: 9200000 },
    { year: 2020, value: 8400000 },
    { year: 2021, value: 7800000 },
    { year: 2022, value: 7200000 },
    { year: 2023, value: 6500000 },
    { year: 2024, value: 5900000 }
  ],
  timeline: [
    {
      phase: "manufacture",
      source: "Suzuki Motor Corporation",
      sourceType: "Manufacturer",
      date: "2019-01-20",
      mileage: 0,
      title: "Manufactured — Suzuki Kosai Plant",
      detail: "Assembled at Suzuki's Kosai Plant, Shizuoka Prefecture, Japan. 660cc R06A turbo engine with SHVS mild-hybrid system installed. Passed all factory tests. Color: Speedy Blue (ZLD). Unit #KSI-2019-MH55-91234.",
      icon: "🏭",
      verified: true
    },
    {
      phase: "first_sale",
      source: "Suzuki Arena, Hamamatsu",
      sourceType: "Dealer",
      date: "2019-05-12",
      mileage: 5,
      title: "First Sold — Japan",
      detail: "Sold to Mr. Hiroshi Ito, Hamamatsu, Shizuoka. Plate: 浜松 580 あ 4412. 3-year Suzuki warranty. Invoice #SZK-2019-HMS-3341.",
      icon: "🤝",
      verified: true
    },
    {
      phase: "insurance",
      source: "Aioi Nissay Dowa Insurance, Japan",
      sourceType: "Insurance",
      date: "2019-05-12",
      mileage: 5,
      title: "Insurance Issued",
      detail: "Policy #AI-2019-MH55-4451. Comprehensive coverage including natural disaster. Premium: ¥52,000/year.",
      icon: "🛡️",
      verified: true
    },
    {
      phase: "service",
      source: "Suzuki Service, Hamamatsu",
      sourceType: "Service Center",
      date: "2020-05-05",
      mileage: 15200,
      title: "1st Service — 15,000km",
      detail: "Oil change (Suzuki genuine 0W-20), oil filter, air filter. AGS fluid level check. Hybrid 12V battery check OK. Brake pads: 85%. Service #SZK-HMS-2020-0505.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "accident",
      source: "Aioi Nissay Dowa Insurance, Japan",
      sourceType: "Accident Report",
      date: "2020-08-30",
      mileage: 19400,
      title: "Minor Accident — Rear Bumper",
      detail: "Reported low-speed parking lot collision. Rear bumper cracked, minor paint scuff on rear right quarter panel. Airbags: NOT deployed. No structural damage. Claim #AI-ACC-2020-8893. Repaired at Suzuki authorized body shop, Hamamatsu: bumper replaced (OEM), rear right panel repainted. Repair cost: ¥88,000. Odometer at time: 19,400km.",
      icon: "⚠️",
      verified: true,
      severity: "minor"
    },
    {
      phase: "export_sale",
      source: "TAA Osaka Auto Auction",
      sourceType: "Auction House",
      date: "2022-06-18",
      mileage: 32100,
      title: "Auctioned — TAA Osaka",
      detail: "Sold at TAA Osaka. Auction grade 3.5 (A2 exterior — prior minor repair noted, A interior). Hammer price: ¥280,000. Buyer: Island Auto Exports, Osaka. Lot #TAA-OSK-2022-3312.",
      icon: "🔨",
      verified: true
    },
    {
      phase: "inspection",
      source: "JEVIC Japan",
      sourceType: "Inspection",
      date: "2022-07-01",
      mileage: 32120,
      title: "JEVIC Inspection",
      detail: "Grade 3.5. Exterior: A2 (prior rear bumper repair noted, well executed, no structural damage). Interior: A. Engine: clean. Odometer verified at 32,120km. Certificate #JEVIC-2022-OSK-44123.",
      icon: "🔍",
      verified: true
    },
    {
      phase: "export",
      source: "Island Auto Exports, Osaka",
      sourceType: "Exporter",
      date: "2022-07-15",
      mileage: 32120,
      title: "Shipped from Osaka",
      detail: "Port of Osaka. Vessel: K-Line Pacific Highway. B/L #KLP-2022-OSK-7712. Transit: 19 days.",
      icon: "🚢",
      verified: true
    },
    {
      phase: "arrival",
      source: "Sri Lanka Ports Authority",
      sourceType: "Port Authority",
      date: "2022-08-28",
      mileage: 32120,
      title: "Arrived — Colombo Port",
      detail: "Vessel berthed at Jaye Container Terminal. Vehicle inspected at port — no transit damage. SLPA ref #SLPA-2022-COL-44821.",
      icon: "⚓",
      verified: true
    },
    {
      phase: "customs",
      source: "Sri Lanka Customs / Budget Cars SL",
      sourceType: "Customs",
      date: "2022-09-10",
      mileage: 32120,
      title: "Customs Clearance",
      detail: "Cleared under permit #SLC-2022-31221. Duties: LKR 1,900,000. VAT: LKR 380,000. Kei car rate applied. Import age: 3 years 8 months. Importer: Budget Cars SL (Pvt) Ltd.",
      icon: "📋",
      verified: true
    },
    {
      phase: "registration",
      source: "RMV Sri Lanka",
      sourceType: "RMV",
      date: "2022-09-25",
      mileage: 32150,
      title: "Registered — Sri Lanka",
      detail: "Plate: WP CAF-8819. RMV Western Province. Owner: Ms. Priyanka Fernando, Maharagama.",
      icon: "📄",
      verified: true
    },
    {
      phase: "ownership",
      source: "RMV Sri Lanka",
      sourceType: "Owner Record",
      date: "2022-09-25",
      mileage: 32150,
      title: "First SL Owner",
      detail: "Ms. Priyanka Fernando, 14/B Jayantha Mawatha, Maharagama. Purchased at LKR 5,500,000.",
      icon: "👤",
      verified: true
    },
    {
      phase: "service",
      source: "Suzuki Lanka, Peliyagoda",
      sourceType: "Service Center",
      date: "2023-10-14",
      mileage: 38400,
      title: "1st SL Service",
      detail: "Engine oil, oil filter, air filter, cabin filter replaced. AC clean and check. Hybrid battery 12V check — OK. Tyre inspection. Service #SLK-2023-1014.",
      icon: "🔧",
      verified: true
    }
  ]
}
```

---

### VEHICLE 4 — Mitsubishi Outlander PHEV 2018

```javascript
{
  id: "AG-004",
  make: "Mitsubishi",
  model: "Outlander PHEV",
  variant: "G Premium Package 4WD",
  year: 2018,
  color: "Ironside Black",
  colorHex: "#1A1A1A",
  vin: "GG2W-9876543",
  chassisNo: "GG2W-9876543",
  engineNo: "4B12-987654",
  fuelType: "Plug-in Hybrid",
  transmission: "Auto (PHEV S-AWC)",
  displacement: "2000cc + Dual Electric Motors",
  driveType: "AWD (S-AWC)",
  doors: 5,
  seats: 5,
  bodyType: "Mid-size SUV",
  age: 7,
  mileage: 72100,
  condition_grade: 3,
  condition_label: "Fair",
  market_value_lkr: 22500000,
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/2018_Mitsubishi_Outlander_PHEV_%28GG2W%29_G_Premium_Package%2C_front_8.21.18.jpg/1280px-2018_Mitsubishi_Outlander_PHEV_%28GG2W%29_G_Premium_Package%2C_front_8.21.18.jpg",
  thumbnailColor: "#1a1a1a",
  badges: {
    on_time_service: false,
    one_owner: false,
    no_accident: false,
    untampered_mileage: false
  },
  depreciation: [
    { year: 2018, value: 38000000 },
    { year: 2019, value: 36000000 },
    { year: 2020, value: 33000000 },
    { year: 2021, value: 30000000 },
    { year: 2022, value: 28000000 },
    { year: 2023, value: 25000000 },
    { year: 2024, value: 22500000 }
  ],
  timeline: [
    {
      phase: "manufacture",
      source: "Mitsubishi Motors Corporation",
      sourceType: "Manufacturer",
      date: "2018-03-08",
      mileage: 0,
      title: "Manufactured — Mitsubishi Okazaki Plant",
      detail: "Assembled at Mitsubishi Okazaki Plant, Aichi. S-AWC (Super All Wheel Control) PHEV system installed and calibrated. 12kWh EV battery pack installed. QC passed. Unit #OKZ-2018-GG2W-34521.",
      icon: "🏭",
      verified: true
    },
    {
      phase: "first_sale",
      source: "Mitsubishi Motors, Nagoya",
      sourceType: "Dealer",
      date: "2018-07-30",
      mileage: 10,
      title: "First Sold — Corporate Fleet",
      detail: "Sold to Aichi Corporate Fleet Co. Ltd, Nagoya. Registered as corporate vehicle. Plate: 名古屋 330 け 7781. Invoice #MMN-2018-NGY-22341.",
      icon: "🤝",
      verified: true
    },
    {
      phase: "service",
      source: "Mitsubishi Service, Nagoya",
      sourceType: "Service Center",
      date: "2019-07-20",
      mileage: 20000,
      title: "Service — 20,000km",
      detail: "Engine oil change, oil filter. PHEV battery diagnostic: SOH 97%. Brake fluid check. Tyre rotation. Service #MMN-2019-0720.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "accident",
      source: "Sompo Japan Insurance",
      sourceType: "Accident Report",
      date: "2019-11-12",
      mileage: 24500,
      title: "Moderate Accident — Front Left",
      detail: "Front-left collision with stationary object at approx. 35km/h. Airbags: NOT deployed. Damage: front left fender, headlight unit (cracked), front bumper (cracked), bonnet minor dent. PHEV battery and chassis: undamaged per inspection. Claim #SJ-ACC-2019-14421. Repaired at Mitsubishi authorized body shop: fender replaced, headlight replaced, bumper replaced, bonnet straightened and repainted. Total repair: ¥420,000.",
      icon: "⚠️",
      verified: true,
      severity: "moderate"
    },
    {
      phase: "service",
      source: "Mitsubishi Service, Nagoya",
      sourceType: "Service Center",
      date: "2020-11-05",
      mileage: 38200,
      title: "Service — 38,000km (Overdue)",
      detail: "Delayed by 8 months from scheduled interval. Oil, filter, air filter, cabin filter, spark plugs. PHEV battery: SOH 93%. Brake pads: 50%. Service #MMN-2020-1105.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "ownership",
      source: "Japan DMV",
      sourceType: "Owner Record",
      date: "2021-04-01",
      mileage: 48900,
      title: "Second Owner — Japan",
      detail: "Sold privately to Mr. Takashi Mori, Osaka. Transfer registered at DMV. New plate: 大阪 302 む 4412. Purchase price: ¥1,100,000.",
      icon: "👤",
      verified: true
    },
    {
      phase: "export_sale",
      source: "BayAuction, Osaka",
      sourceType: "Auction House",
      date: "2022-10-20",
      mileage: 68200,
      title: "Auctioned — BayAuction Osaka",
      detail: "Auctioned at BayAuction Osaka. Grade 3 (B1 exterior — prior front-left repair noted). Hammer price: ¥880,000. Buyer: Premier Auto SL. Lot #BAY-OSK-2022-9981.",
      icon: "🔨",
      verified: true
    },
    {
      phase: "inspection",
      source: "JEVIC Japan",
      sourceType: "Inspection",
      date: "2022-11-02",
      mileage: 68220,
      title: "JEVIC Inspection",
      detail: "Grade 3. Exterior: B1 (prior front-left repair noted — professional, no structural deformation). Interior: B (minor wear on driver seat). Engine: clean, no leaks. PHEV battery: SOH 88%. Odometer verified. Certificate #JEVIC-2022-OSK-88231.",
      icon: "🔍",
      verified: true
    },
    {
      phase: "export",
      source: "Premier Auto SL, Kobe",
      sourceType: "Exporter",
      date: "2022-11-20",
      mileage: 68220,
      title: "Shipped from Kobe",
      detail: "Port of Kobe. Vessel: MOL Triumph (Panama). B/L #MOL-2022-KOB-5512. Container: MSKU4456789. Transit: 22 days.",
      icon: "🚢",
      verified: true
    },
    {
      phase: "arrival",
      source: "Sri Lanka Ports Authority",
      sourceType: "Port Authority",
      date: "2023-01-05",
      mileage: 68220,
      title: "Arrived — Colombo",
      detail: "Docked at Jaye Terminal, Colombo. Minor surface dust — no transit damage. SLPA ref #SLPA-2023-COL-1121.",
      icon: "⚓",
      verified: true
    },
    {
      phase: "customs",
      source: "Sri Lanka Customs / Premier Auto SL",
      sourceType: "Customs",
      date: "2023-01-22",
      mileage: 68220,
      title: "Customs Clearance",
      detail: "Cleared under permit #SLC-2023-4421. Duties: LKR 8,400,000. VAT: LKR 1,680,000. PHEV concessionary rate. Import age: 4 years 10 months. Declaration #CD-2023-COL-2231.",
      icon: "📋",
      verified: true
    },
    {
      phase: "registration",
      source: "RMV Sri Lanka",
      sourceType: "RMV",
      date: "2023-02-10",
      mileage: 68260,
      title: "Registered — Sri Lanka",
      detail: "Plate: WP CBC-2201. RMV Western Province. Owner: Mr. Anura Dissanayake, Colombo 7.",
      icon: "📄",
      verified: true
    },
    {
      phase: "ownership",
      source: "RMV Sri Lanka",
      sourceType: "Owner Record",
      date: "2023-02-10",
      mileage: 68260,
      title: "First SL Owner",
      detail: "Mr. Anura Dissanayake, 32 Maitland Crescent, Colombo 7. Purchased at LKR 20,500,000.",
      icon: "👤",
      verified: true
    },
    {
      phase: "service",
      source: "Diesel & Motor Engineering (DIMO), Colombo",
      sourceType: "Service Center",
      date: "2023-09-18",
      mileage: 71800,
      title: "SL Service — DIMO",
      detail: "Full service. Engine oil, filter, spark plugs. PHEV battery diagnostic: SOH 87%. Brake inspection. Tyre check. AC service. Service #DIMO-2023-0918.",
      icon: "🔧",
      verified: true
    }
  ]
}
```

---

### VEHICLE 5 — Nissan Leaf 2020

```javascript
{
  id: "AG-005",
  make: "Nissan",
  model: "Leaf",
  variant: "e+ G 62kWh",
  year: 2020,
  color: "Gun Metallic",
  colorHex: "#555F6A",
  vin: "ZE1-1122334",
  chassisNo: "ZE1-1122334",
  engineNo: "EM57-112233",
  fuelType: "Full Electric",
  transmission: "Single-Speed Reduction Gear",
  displacement: "Electric — 217hp / 340Nm",
  driveType: "FWD",
  doors: 5,
  seats: 5,
  bodyType: "Hatchback EV",
  age: 5,
  mileage: 28400,
  condition_grade: 5,
  condition_label: "Excellent",
  market_value_lkr: 18900000,
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2018_Nissan_Leaf_%28ZE1%29_110kW_Tekna_hatchback_%282018-11-15%29_01.jpg/1280px-2018_Nissan_Leaf_%28ZE1%29_110kW_Tekna_hatchback_%282018-11-15%29_01.jpg",
  thumbnailColor: "#555f6a",
  badges: {
    on_time_service: true,
    one_owner: true,
    no_accident: true,
    untampered_mileage: true
  },
  depreciation: [
    { year: 2020, value: 29000000 },
    { year: 2021, value: 27000000 },
    { year: 2022, value: 24500000 },
    { year: 2023, value: 21800000 },
    { year: 2024, value: 18900000 }
  ],
  timeline: [
    {
      phase: "manufacture",
      source: "Nissan Motor Company",
      sourceType: "Manufacturer",
      date: "2020-02-14",
      mileage: 0,
      title: "Manufactured — Nissan Oppama Plant",
      detail: "Assembled at Nissan's Oppama Plant, Kanagawa Prefecture, Japan. 62kWh lithium-ion battery pack installed and load-tested. ProPilot Assist calibrated. e-Pedal system activated. Color: Gun Metallic (KAD). Unit #OPP-2020-ZE1-78231.",
      icon: "🏭",
      verified: true
    },
    {
      phase: "first_sale",
      source: "Nissan Dealers, Yokohama",
      sourceType: "Dealer",
      date: "2020-06-18",
      mileage: 3,
      title: "First Sold — Japan",
      detail: "Sold to Ms. Emi Nakamura, Yokohama, Kanagawa. Plate: 横浜 502 さ 8832. Nissan LEAF 8-year battery warranty activated. Nissan Connect EV app registered. Invoice #NDY-2020-YKH-7712.",
      icon: "🤝",
      verified: true
    },
    {
      phase: "insurance",
      source: "Tokio Marine Insurance, Japan",
      sourceType: "Insurance",
      date: "2020-06-18",
      mileage: 3,
      title: "Insurance Issued",
      detail: "Comprehensive EV policy #TM-2020-ZE1-4421. Includes EV-specific battery damage cover. Premium: ¥88,000/year.",
      icon: "🛡️",
      verified: true
    },
    {
      phase: "service",
      source: "Nissan EV Center, Yokohama",
      sourceType: "Service Center",
      date: "2021-06-15",
      mileage: 10200,
      title: "1st Annual EV Service",
      detail: "Annual EV health check. Battery: SOH 98% (62kWh actual: 60.8kWh). ProPilot camera clean and recalibrate. Brake fluid test. Tyre rotation. Cabin filter replaced. Software: updated to v4.2. Service #NEV-YKH-2021-0615.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "service",
      source: "Nissan EV Center, Yokohama",
      sourceType: "Service Center",
      date: "2022-07-01",
      mileage: 19800,
      title: "2nd Service",
      detail: "Battery: SOH 95% (58.9kWh). Software update v4.5. Brake pads: 80%. Tyre check: 4mm remaining (all good). ProPilot recalibration. Service #NEV-YKH-2022-0701.",
      icon: "🔧",
      verified: true
    },
    {
      phase: "export_sale",
      source: "JU Kanagawa Auto Auction",
      sourceType: "Auction House",
      date: "2023-04-05",
      mileage: 24100,
      title: "Auctioned — JU Kanagawa",
      detail: "Sold at JU Kanagawa. Grade 5 (immaculate). Battery health disclosed: 94%. Hammer price: ¥1,580,000. Buyer: EV Sri Lanka Imports. Lot #JUK-2023-KNG-5591.",
      icon: "🔨",
      verified: true
    },
    {
      phase: "inspection",
      source: "JEVIC Japan",
      sourceType: "Inspection",
      date: "2023-04-18",
      mileage: 24110,
      title: "JEVIC Inspection",
      detail: "Grade 5. Exterior: perfect. Interior: immaculate. No defects. Battery: SOH 94% (confirmed via OBD). Odometer verified 24,110km. Certificate #JEVIC-2023-KNG-19921.",
      icon: "🔍",
      verified: true
    },
    {
      phase: "export",
      source: "EV Sri Lanka Imports, Yokohama",
      sourceType: "Exporter",
      date: "2023-05-02",
      mileage: 24110,
      title: "Shipped — Port of Yokohama",
      detail: "Loaded at Port of Yokohama. Vessel: NYK Blue Jay (Japan). B/L #NYK-2023-YKH-8812. Battery at 80% SOC for safe transport (EV standard). Transit: 20 days.",
      icon: "🚢",
      verified: true
    },
    {
      phase: "arrival",
      source: "Sri Lanka Ports Authority",
      sourceType: "Port Authority",
      date: "2023-06-19",
      mileage: 24110,
      title: "Arrived — Colombo Port",
      detail: "Docked at SAGT Terminal. EV protocols followed for offloading. No damage. SLPA ref #SLPA-2023-COL-8831.",
      icon: "⚓",
      verified: true
    },
    {
      phase: "customs",
      source: "Sri Lanka Customs / EV SL Imports",
      sourceType: "Customs",
      date: "2023-07-04",
      mileage: 24110,
      title: "Customs Clearance — EV Concession",
      detail: "Cleared under permit #SLC-2023-EV-3312. Full EV concessionary duty applied. Total duties: LKR 2,100,000 (significantly reduced vs ICE vehicles). VAT: LKR 420,000. Declaration #CD-2023-COL-EV-112. Importer: EV Sri Lanka Imports (Pvt) Ltd.",
      icon: "📋",
      verified: true
    },
    {
      phase: "registration",
      source: "RMV Sri Lanka",
      sourceType: "RMV",
      date: "2023-07-22",
      mileage: 24130,
      title: "Registered — Sri Lanka (Green Plate)",
      detail: "Registered with green EV number plate: WP CBG-5501. RMV Western Province. Owner: Dr. Nalin Rathnayake. EV registration benefits applied.",
      icon: "📄",
      verified: true
    },
    {
      phase: "ownership",
      source: "RMV Sri Lanka",
      sourceType: "Owner Record",
      date: "2023-07-22",
      mileage: 24130,
      title: "First SL Owner",
      detail: "Dr. Nalin Rathnayake, 18 Horton Place, Colombo 7. NIC: 19XXXXXXXXV. Purchased at LKR 17,500,000.",
      icon: "👤",
      verified: true
    },
    {
      phase: "service",
      source: "Charge & Drive Lanka (Pvt) Ltd, Colombo",
      sourceType: "Service Center",
      date: "2024-07-30",
      mileage: 28200,
      title: "1st SL Service",
      detail: "EV annual service. Battery: SOH 93% (57.7kWh). Brake fluid test. Tyre rotation. Cabin filter replaced. Software update v5.0. ProPilot check. All nominal. Service #CDL-2024-0730.",
      icon: "🔧",
      verified: true
    }
  ]
}
```

---

## 6. PAGE 1 — GALLERY / HOME

### Layout Structure
```
#page-gallery
├── .gallery-hero          ← full-width banner
│   ├── .hero-bg           ← animated gradient background
│   ├── .hero-logo         ← "AutoGenesis" wordmark + "Passport" subtitle
│   ├── .hero-tagline      ← "Every vehicle. Every detail. One passport."
│   └── .hero-stats-bar    ← "5 Vehicles · 47 Verified Records · Trusted by 3,200+ Owners"
│
├── .gallery-controls      ← search + filters row
│   ├── .search-input      ← text search (make, model, plate)
│   ├── .filter-fuel       ← dropdown: All Fuel Types / Hybrid / EV / Petrol
│   ├── .filter-grade      ← dropdown: All Grades / 5 / 4 / 3 / 2 / 1
│   ├── .filter-sort       ← dropdown: Sort by: Newest / Oldest / Lowest Price / Highest Price / Best Grade
│   └── .results-count     ← "Showing 5 vehicles"
│
├── .gallery-grid          ← CSS grid: 3 cols desktop, 2 tablet, 1 mobile
│   └── .vehicle-card × 5 ← one per vehicle
│
└── .compare-bar           ← sticky bottom, hidden until 2 vehicles selected
```

### `.gallery-hero` — Exact Spec
- Height: 340px
- Background: animated radial gradient from `#0a1a0a` to `#080808` with a subtle green glow pulse (CSS `@keyframes` that slowly shifts the green glow)
- Top-left: AutoGenesis logo text in `Bebas Neue`, 42px, white + green "Passport" subscript
- Center: tagline in `DM Sans` 300 weight, 18px, `--text-secondary` color
- Bottom bar: 3 stats separated by `·` in small caps, `--text-muted`
- Subtle grain texture overlay via CSS `url("data:image/svg+xml...")` at 4% opacity

### `.vehicle-card` — Exact Spec

Each card is a `<div class="vehicle-card" data-id="AG-001">` with:

```
.vehicle-card
├── .card-image-wrap        ← aspect ratio 16:9, overflow hidden
│   ├── <img>               ← vehicle image, object-fit: cover
│   ├── .card-grade-badge   ← top-right corner overlay: grade circle
│   └── .card-compare-check ← top-left corner: checkbox (☐ → ☑)
│
├── .card-body
│   ├── .card-make-model    ← "Toyota Aqua" in Bebas Neue 22px
│   ├── .card-variant       ← "G Grade · 2014" in DM Sans 13px muted
│   │
│   ├── .card-stats-row     ← 3 inline stats
│   │   ├── .stat-item      ← icon + value + label (Age / Mileage / Grade)
│   │   └── ...
│   │
│   ├── .card-value         ← "LKR 8,750,000" in Bebas Neue 24px green
│   │
│   ├── .card-badges-mini   ← 4 small dot indicators (green=earned, grey=not)
│   │   ← tooltip on hover showing badge name
│   │
│   └── .card-actions       ← button row
│       ├── [View Passport] ← primary green button, full width
│       ├── [Compare]       ← outline button, adds to compare list
│       └── [Swap]          ← outline button, opens swap view
```

**Card hover state:**
- `transform: translateY(-4px)`
- `box-shadow: 0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px var(--border-accent)`
- Image slightly zooms: `transform: scale(1.03)` (transition 0.4s)

**Grade badge in card corner:**
- Circle 36px diameter
- Grade 5: `background: var(--green)`, `color: #000`
- Grade 4: `background: #7BC67E`, `color: #000`
- Grade 3: `background: var(--gold)`, `color: #000`
- Grade 2: `background: var(--orange)`, `color: #000`
- Grade 1: `background: var(--red)`, `color: #fff`
- Shows number + star character

**Compare checkbox behavior:**
- Click adds `data-id` to `APP.compareList`
- Card gets `.selected` class → green border glow
- If 2 vehicles selected → `.compare-bar` slides up from bottom
- If 3rd vehicle clicked → toast message: "Max 2 vehicles for compare. Remove one first."

### `.compare-bar` — Bottom Sticky
- Position: `fixed; bottom: 0; left: 0; right: 0`
- Height: 72px
- Background: `var(--bg-elevated)` with top border accent green
- Content: two small car thumbnails + names + "Compare Now →" button
- Slides up with `transform: translateY(100%)` → `translateY(0)` animation (0.3s ease)
- `×` button on each car to remove from compare list
- "Clear All" link on right

### Gallery Search & Filter Logic
```javascript
function filterVehicles() {
  const q = document.querySelector('#search-input').value.toLowerCase();
  const fuel = document.querySelector('#filter-fuel').value;
  const grade = document.querySelector('#filter-grade').value;
  const sort = document.querySelector('#filter-sort').value;

  let results = VEHICLES.filter(v => {
    const matchQ = !q || `${v.make} ${v.model} ${v.variant}`.toLowerCase().includes(q);
    const matchFuel = !fuel || v.fuelType.toLowerCase().includes(fuel.toLowerCase());
    const matchGrade = !grade || v.condition_grade === parseInt(grade);
    return matchQ && matchFuel && matchGrade;
  });

  // Sort
  if (sort === 'price_asc')  results.sort((a,b) => a.market_value_lkr - b.market_value_lkr);
  if (sort === 'price_desc') results.sort((a,b) => b.market_value_lkr - a.market_value_lkr);
  if (sort === 'year_desc')  results.sort((a,b) => b.year - a.year);
  if (sort === 'grade_desc') results.sort((a,b) => b.condition_grade - a.condition_grade);

  renderGalleryGrid(results);
}
```

---

## 7. PAGE 2 — PASSPORT DETAIL VIEW

### Full Page Structure
```
#page-passport
├── .passport-back-btn         ← "← Back to Gallery" top left
├── .passport-hero             ← Full-width car image section
├── .passport-quick-stats      ← 3-column animated stat bar
├── .passport-grade-badges     ← Grade gauge + 4 badges side by side
├── .passport-vehicle-specs    ← 2-column spec table
├── .passport-tabs-section     ← Tab bar + tab content panel
│   ├── .tab-bar               ← 6 tabs
│   └── .tab-content           ← Active tab content
├── .passport-depreciation     ← Depreciation chart section
└── .passport-action-bar       ← Compare / Swap / Share / PDF buttons
```

---

### Section A — `.passport-hero`

**Layout:**
- Height: 520px on desktop, 320px mobile
- Full-bleed image: `background-image: url(vehicle.image)`, `background-size: cover`, `background-position: center`
- Overlay: `linear-gradient(to bottom, rgba(8,8,8,0) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.95) 100%)`
- Parallax: on scroll, `background-position-y` shifts at 0.4x scroll speed (JS scroll listener)

**Content inside hero (bottom-aligned):**
```
.hero-content (position: absolute, bottom: 40px, left: 40px)
├── .hero-passport-badge     ← "AutoGenesis Passport" pill badge (green border)
├── .hero-vehicle-name       ← "TOYOTA AQUA" in Bebas Neue, 72px, white
├── .hero-variant            ← "G Grade · 2014 · Pearl White" 16px muted
├── .hero-plate              ← "WP CAR-4421" in monospace, green pill badge
└── .hero-vin                ← "VIN: NHP10-1234567" small muted text
```

**Top-right corner:**
- AutoGenesis logo small + "VERIFIED PASSPORT" text
- Green checkmark circle icon

---

### Section B — `.passport-quick-stats`

3 equal columns, separated by vertical dividers:

| Column 1 | Column 2 | Column 3 |
|---|---|---|
| AGE | MILEAGE | MARKET VALUE |
| "11 Years" | "87,450 km" | "LKR 8,750,000" |
| Animated count-up on first view | Odometer-style animation | Count up with comma formatting |
| Sub-label: "Manufactured 2014" | Sub-label: "Verified across 14 checkpoints" | Sub-label: "Current market estimate" |

**Animation:** Intersection Observer triggers count-up animation once when section scrolls into view. Never re-animates.

Count-up logic:
```javascript
function animateCounter(el, target, duration, formatter) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = formatter(Math.floor(start));
  }, 16);
}
// Usage:
animateCounter(ageEl, 11, 1200, n => `${n} Years`);
animateCounter(mileageEl, 87450, 2000, n => `${n.toLocaleString()} km`);
animateCounter(valueEl, 8750000, 1800, n => `LKR ${n.toLocaleString()}`);
```

---

### Section C — Condition Grade + Badges

**Left side: Grade Gauge (40% width)**
- Large SVG circular progress ring (SVG `<circle>` with `stroke-dasharray` animation)
- Ring fills from 0% to (grade/5 × 100%) over 1.2 seconds on scroll-enter
- Inside ring: big number (e.g. "4") in Bebas Neue 64px
- Below ring: grade label ("Good") and description
- Ring color: matches grade color (grade 4 = `#7BC67E`)
- Sub-text: "AutoGenesis Condition Grade" label

Grade SVG ring animation:
```javascript
function animateGradeRing(svgCircle, grade) {
  const circumference = 2 * Math.PI * 54; // r=54
  svgCircle.style.strokeDasharray = circumference;
  svgCircle.style.strokeDashoffset = circumference;
  const target = circumference - (grade / 5) * circumference;
  setTimeout(() => {
    svgCircle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
    svgCircle.style.strokeDashoffset = target;
  }, 200);
}
```

**Right side: 4 Badges (60% width, 2×2 grid)**

Each badge card:
```
.badge-card (.earned or .not-earned)
├── .badge-icon     ← emoji or SVG icon, 32px
├── .badge-title    ← "On-Time Service"
└── .badge-desc     ← "All services completed within schedule"
```

Earned badge: green border, green icon tint, green checkmark top-right
Not earned badge: `opacity: 0.4`, grey border, red × top-right
Hover on all badges: tooltip with detailed explanation

| Badge | Icon | Description |
|---|---|---|
| On-Time Service | 🔧 | All recorded services were completed within 3 months of the recommended interval |
| One Owner | 👤 | This vehicle has had only one registered owner since new |
| No Accident History | 🛡️ | No accidents or insurance claims recorded across all verified sources |
| Untampered Mileage | 📍 | Odometer reading verified and consistent across all 14+ checkpoints |

---

### Section D — Vehicle Specifications Table

Two-column grid of spec rows:

| Spec | Value |
|---|---|
| Make / Model | Toyota Aqua G Grade |
| Year | 2014 |
| Body Type | Hatchback |
| Fuel Type | Hybrid |
| Engine | 1NZ-FXE 1497cc |
| Transmission | CVT |
| Drive Type | FWD |
| Doors / Seats | 5 / 5 |
| Color | Pearl White (#070) |
| VIN / Chassis | NHP10-1234567 |
| Engine Number | 1NZ-B456789 |

Style: alternating row background `var(--bg-surface)` / `var(--bg-elevated)`. Labels in `--text-muted`, values in `--text-primary`.

---

### Section E — Tabbed History Panel

#### Tab Bar
6 tabs as `<button class="tab-btn" data-tab="timeline">`:
```
[Full Timeline] [Accident History] [Travel History] [Ownership History] [Service History] [Registration History]
```

Tab bar styling:
- Sticky `position: sticky; top: 60px` (below navbar) while scrolling through content
- Active tab: green bottom border (3px), `--text-primary` color
- Inactive: `--text-muted`
- Hover: `--text-secondary`
- On mobile: horizontal scroll (no wrap)
- Tab switch: fade out old content (opacity 0, translateY 10px), swap HTML, fade in (opacity 1, translateY 0). Duration: 200ms.
- If "Accident History" tab has no accidents: show badge count 0 in green. If has accidents: show count in red.

---

#### TAB 1: Full Timeline

Vertical timeline — each event is a `.timeline-node`:

```
.timeline-node (data-phase="manufacture")
├── .node-connector          ← vertical line connecting nodes
│   └── .node-dot            ← colored circle matching phase color
├── .node-card
│   ├── .node-header
│   │   ├── .node-icon       ← emoji/icon in colored pill badge
│   │   ├── .node-title      ← bold event title
│   │   ├── .node-date       ← formatted date (e.g. "15 Feb 2014")
│   │   └── .node-verified   ← green "✓ Verified" badge if verified:true
│   ├── .node-source         ← "Source: Toyota Motor Corporation · Manufacturer"
│   ├── .node-detail         ← full detail text (expandable if > 3 lines)
│   └── .node-mileage        ← "📍 Odometer: 0 km" (shown if mileage exists)
```

**Timeline line:** CSS `::before` pseudo-element, 2px wide, `--border` color, connecting all nodes vertically.

**Node dot:** 16px circle, colored per phase, with a subtle glow (`box-shadow: 0 0 8px [phase-color]`).

**Animation on scroll:** Each `.timeline-node` starts at `opacity: 0; transform: translateX(-20px)`. IntersectionObserver adds class `.visible` which animates to `opacity: 1; transform: translateX(0)`. Stagger: 80ms per node.

**Expand/collapse long detail:** If detail > 120 chars, show first 120 + "...Read more" link. Click expands full text with smooth height animation.

**Accident nodes special styling:**
- Node card has `border-left: 3px solid var(--red)`
- Background tint: `var(--red-dim)`
- Dot pulses with CSS keyframe: `@keyframes pulse-red { 0%,100%{box-shadow:0 0 4px red} 50%{box-shadow:0 0 16px red} }`
- Severity label pill (minor = orange, moderate = red)

---

#### TAB 2: Accident History

**If no accidents (Aqua, Vezel, Leaf):**
```
.accident-clean-banner
├── Big green checkmark SVG (64px)
├── "Clean Accident Record" heading
├── "No accidents or insurance claims found across all verified data sources."
└── Verified source list (insurance companies checked)
```

**If accidents exist (Wagon R, Outlander):**
```
.accident-summary-bar
├── "[N] Accident(s) Recorded" in red
└── Severity breakdown: "Minor: 1 · Moderate: 0"

.accident-card × N (per accident event)
├── .accident-header
│   ├── Severity badge (MINOR / MODERATE / SEVERE)
│   ├── Date + Mileage at time
│   └── Insurance company name
├── .accident-body
│   ├── Description of incident
│   ├── Damage listed
│   ├── Airbag status (deployed / not deployed)
│   ├── Repair details
│   └── Repair cost (if available)
└── .accident-impact
    └── "Impact on Grade: -1 point noted (Exterior grade A2)"
```

---

#### TAB 3: Travel History

Static visual travel route:

```
.travel-map
├── .route-visual (SVG or CSS layout)
│   Japan [flag] ──── ship ──── Indian Ocean ──── Sri Lanka [flag]
│
├── .travel-stops (vertical list of location cards)
│   ├── 🏭 Manufactured: Iwate Plant, Japan
│   ├── 🏬 First Sold: Osaka, Japan
│   ├── 🔨 Auctioned: USS Tokyo, Tokyo
│   ├── 🚢 Port of Kobe → Departed 2 Apr 2018
│   ├── 🌊 In Transit: 18 days at sea
│   ├── ⚓ Port of Colombo → Arrived 10 May 2018
│   ├── 📋 Customs Yard, Terminal 2, Bay C-14
│   └── 📄 Registered: Nugegoda, Sri Lanka
│
└── .travel-stats
    ├── Total distance: ~7,200 km (Japan to Sri Lanka)
    ├── Sea transit time: 18 days
    └── Time from auction to registration: 79 days
```

The route visual is a CSS/SVG animated dotted line with a ship emoji that animates along the path (CSS `animation: move-ship 3s ease-in-out infinite`).

---

#### TAB 4: Ownership History

Timeline of owners (filtered from main timeline, `phase === 'ownership'`):

```
.ownership-card × N
├── .owner-number         ← "Owner #1" label
├── .owner-avatar         ← Initials-based avatar circle (e.g. "CP" for Chaminda Perera)
├── .owner-name           ← Partial name for privacy ("Mr. C. Perera")
├── .owner-location       ← "Nugegoda, Western Province"
├── .owner-period         ← "Jun 2018 – Present (6 years 6 months)"
├── .owner-mileage        ← "Mileage: 54,350 km → 87,450 km (+33,100 km)"
├── .owner-source         ← "Source: RMV Sri Lanka"
└── .owner-type-badge     ← "Private" / "Corporate" / "Current"
```

Bottom: "Total owners in Sri Lanka: 1" or "2" as a clear stat.

---

#### TAB 5: Service History

Table format on desktop, card format on mobile:

**Desktop Table columns:** Date · Mileage · Service Center · Work Done · Status

**Status logic:**
- If time since last service ≤ recommended interval (every ~10,000km or 12 months): ✅ On Time
- If overdue: ⚠️ Late (with how late, e.g. "8 months overdue")

**Summary stats bar above table:**
- Total services recorded: N
- Last service: [date] at [mileage]
- Average service interval: X,XXX km
- On-time rate: XX%

Each table row hover: highlight background `var(--bg-hover)`.

---

#### TAB 6: Registration History

Cards per registration event:

```
.registration-card × N
├── Country flag emoji
├── Registration number (styled as actual plate)
│   Japan: [大阪 300 さ 1234] in Japanese plate style
│   Sri Lanka: [WP CAR-4421] in SL plate style
├── Registration date
├── Issuing authority (RMV / Japan DMV)
├── Owner at time of registration
└── Permit / Declaration number
```

**Plate styling (CSS):**
```css
/* SL plate */
.plate-sl {
  background: #fff;
  color: #000;
  border: 3px solid #000;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 22px;
  padding: 6px 16px;
  border-radius: 4px;
  letter-spacing: 2px;
  display: inline-block;
}
/* Japan plate */
.plate-jp {
  background: #fff;
  color: #000;
  border: 3px solid #000;
  font-family: 'MS Gothic', monospace;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 4px;
}
```

---

### Section F — Depreciation Chart

**Container:** Full-width card, dark background, rounded corners.

**Header:** "Depreciation History" + "Market Value Over Time" sub-label + current value in green large text

**Chart (Chart.js Line Chart):**
- X-axis: years (2014 to 2024)
- Y-axis: LKR value (formatted as "LKR Xm")
- Line: smooth curve (`tension: 0.4`), green color with gradient fill below
- Data points: filled circles, on hover show tooltip: "2018: LKR 11,400,000"
- Grid lines: `--border` color (very subtle)
- When compare mode active: second line added in blue/gold

**Below chart:**
- Total depreciation since new: "LKR 5,750,000 (39.7%)"
- Average annual depreciation: "LKR 522,727/year"
- Current value vs class average: sparkline comparison

Chart init:
```javascript
function renderDepreciationChart(vehicle, compareVehicle = null) {
  const ctx = document.getElementById('depreciation-chart').getContext('2d');
  if (APP.depreciationChart) APP.depreciationChart.destroy();

  const datasets = [{
    label: `${vehicle.make} ${vehicle.model}`,
    data: vehicle.depreciation.map(d => d.value),
    borderColor: '#00C875',
    backgroundColor: createGradient(ctx, '#00C875'),
    tension: 0.4,
    pointRadius: 5,
    pointHoverRadius: 8,
  }];

  if (compareVehicle) {
    datasets.push({
      label: `${compareVehicle.make} ${compareVehicle.model}`,
      data: alignDepreciation(compareVehicle.depreciation, vehicle.depreciation),
      borderColor: '#4A9EFF',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 5,
      borderDash: [5, 5],
    });
  }

  APP.depreciationChart = new Chart(ctx, {
    type: 'line',
    data: { labels: vehicle.depreciation.map(d => d.year), datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#999' } },
        tooltip: {
          callbacks: {
            label: ctx => `LKR ${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: { ticks: { color: '#666' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#666', callback: v => 'LKR ' + (v/1000000).toFixed(1) + 'M' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}
```

---

### Section G — Action Bar (Passport Footer)

4 buttons in a row:

| Button | Icon | Action |
|---|---|---|
| Compare | ⇄ | Adds current vehicle to compare, redirects to Compare page |
| Swap | ↔ | Opens Swap view with this vehicle as source |
| Share Passport | 🔗 | Opens share modal with fake URL |
| Download PDF | ↓ | Shows "Coming Soon" toast |

Button styles:
- Compare: solid green
- Swap: solid gold/orange
- Share: outline white
- PDF: outline white with lock icon + "Coming Soon" badge

---

## 8. PAGE 3 — COMPARE VIEW

### Layout
```
#page-compare
├── .compare-header          ← "Compare Vehicles" heading + back button
├── .compare-selector        ← if < 2 vehicles selected, show selector
│   └── vehicle picker grid (mini cards with + button)
├── .compare-main            ← 2-column side by side
│   ├── .compare-col × 2    ← one per vehicle
│   │   ├── vehicle hero image (fixed height 200px)
│   │   ├── vehicle name + variant
│   │   └── change vehicle button
│   └── .compare-rows        ← spec comparison rows
├── .compare-chart           ← overlaid depreciation chart (both vehicles)
├── .compare-badges          ← side by side badge comparison
└── .compare-timeline        ← condensed dual timeline
```

### Comparison Rows

Each row: `[Label] [Value A] [Winner badge] [Value B]`

Rows to compare:
1. Year
2. Age
3. Mileage (lower = better ✓)
4. Condition Grade (higher = better ✓)
5. Market Value LKR
6. Fuel Type
7. Transmission
8. Drive Type
9. Displacement
10. No. of SL Owners
11. Accident History (Clean / N accidents)
12. Last Service Date
13. On-Time Service? (Yes/No)
14. Untampered Mileage? (Yes/No)

**Winner logic:**
```javascript
function getWinner(rowKey, v1, v2) {
  const rules = {
    mileage:         (a, b) => a < b ? 'left' : b < a ? 'right' : 'tie',
    condition_grade: (a, b) => a > b ? 'left' : b > a ? 'right' : 'tie',
    market_value_lkr:(a, b) => 'tie', // no winner for price
    age:             (a, b) => a < b ? 'left' : b < a ? 'right' : 'tie',
  };
  const fn = rules[rowKey];
  return fn ? fn(v1[rowKey], v2[rowKey]) : 'tie';
}
```

Winner column gets: green text, subtle `background: var(--green-glow)`, small "✓ Better" label in green.

### Overlaid Depreciation Chart
Same Chart.js setup but both vehicle lines shown simultaneously. Different colors: V1 = green, V2 = gold. Legend shows both vehicle names.

### Condensed Dual Timeline
Show only key milestones side by side (manufacture, first sale, SL arrival, SL registration, last service):

```
[V1 Date]   [Event Label]   [V2 Date]
2014-02-15  Manufactured    2016-04-10
2014-06-03  First Sold      2016-09-22
2018-05-10  Arrived in SL   2021-01-14
2018-06-01  Registered SL   2021-02-10
2022-03-05  Last Service    2023-09-22
```

---

## 9. PAGE 4 — SWAP VIEW

### Layout
```
#page-swap
├── .swap-header             ← "Vehicle Swap" + description
├── .swap-your-vehicle       ← "Your Vehicle" card (selected vehicle)
├── .swap-divider            ← "↔ Swap With" animated divider
├── .swap-options-grid       ← all other 4 vehicles as swap option cards
└── .swap-modal              ← overlay when swap option clicked
```

### `.swap-your-vehicle`
Large card showing the source vehicle with:
- Image, name, grade, mileage, value
- "Offering This Vehicle" green label
- "Change" button to go back and select different vehicle

### `.swap-options-grid`
4 cards (all vehicles except source), each showing:
- Vehicle image + name + grade + mileage
- **Value difference badge:**
  - If swap vehicle > source: `+LKR X,XXX,XXX` in green (you gain value)
  - If swap vehicle < source: `-LKR X,XXX,XXX` in red (you lose value)
  - If roughly equal (within 500k): `≈ Fair Trade` in gold
- "View Swap Details →" button

Value difference calculation:
```javascript
function swapDelta(source, target) {
  const diff = target.market_value_lkr - source.market_value_lkr;
  if (Math.abs(diff) < 500000) return { label: '≈ Fair Trade', color: 'gold', diff };
  if (diff > 0) return { label: `+LKR ${diff.toLocaleString()}`, color: 'green', diff };
  return { label: `-LKR ${Math.abs(diff).toLocaleString()}`, color: 'red', diff };
}
```

### `.swap-modal` (overlay)
When "View Swap Details" is clicked, a full-screen modal overlays showing:

```
.swap-modal
├── close button (×)
├── .swap-modal-header    ← "Swap Summary"
├── .swap-vs-layout       ← side by side
│   ├── .swap-side-a      ← Your vehicle card (full details)
│   │   └── "You Give"
│   ├── .swap-vs-badge    ← "VS" circle in center
│   └── .swap-side-b      ← Target vehicle card (full details)
│       └── "You Receive"
├── .swap-value-summary   ← value delta prominent display
│   ├── Value difference: [green/red amount]
│   ├── Grade comparison
│   └── Mileage comparison
└── .swap-cta             ← "Express Interest" button (shows contact toast)
    └── Note: "Connect with AutoGenesis to finalize the swap"
```

---

## 10. GLOBAL COMPONENTS

### Navbar
```
#navbar (position: fixed, top: 0, z-index: 1000)
├── .nav-logo              ← "AutoGenesis" wordmark + green dot
├── .nav-links             ← "Vehicles · Compare · Swap" (hidden mobile)
├── .nav-passport-badge    ← "Passport" in green pill label
└── .nav-menu-btn          ← hamburger (mobile only)
```

Background: `rgba(8,8,8,0.9)` with `backdrop-filter: blur(20px)`. Adds `.scrolled` class (slight border-bottom) after 10px scroll.

### Toast Notifications
```javascript
function showToast(message, type = 'info') {
  // types: 'success' (green), 'warning' (orange), 'error' (red), 'info' (blue)
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 300); }, 3000);
}
```

Toast style: `position: fixed; bottom: 90px; right: 24px`. Slides in from right. Auto-dismiss 3s.

### Loading Screen
On initial page load, show a branded loading screen for 1.2s:
```
#loading-screen
├── AutoGenesis logo (animated fade-in)
├── "Loading Passport Data..." text
└── Green progress bar (CSS animation, 0% → 100% over 1s)
```
After 1.2s, fade out and show gallery.

### Back to Top Button
Fixed bottom-right (above toast area). Appears after 400px scroll. Smooth-scrolls to top.

---

## 11. ALL ANIMATIONS & MICRO-INTERACTIONS

### CSS Keyframes to Define
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 4px var(--green); }
  50%       { box-shadow: 0 0 20px var(--green), 0 0 40px var(--green-glow); }
}
@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 4px var(--red); }
  50%       { box-shadow: 0 0 20px var(--red); }
}
@keyframes ship-move {
  0%   { left: 5%; }
  50%  { left: 50%; top: -8px; }
  100% { left: 90%; }
}
@keyframes drawLine {
  from { stroke-dashoffset: 1000; }
  to   { stroke-dashoffset: 0; }
}
@keyframes countUp { /* handled by JS */ }
@keyframes heroGlow {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
@keyframes badgeBounce {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes tabSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes loadingBar {
  from { width: 0%; }
  to   { width: 100%; }
}
@keyframes nodeStagger {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

### IntersectionObserver Triggers
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observe: all .timeline-node, .badge-card, .stat-counter, .spec-row, .compare-row
```

### Hover Micro-interactions
- **Vehicle cards:** lift + border glow (CSS transition)
- **Buttons:** subtle scale(1.02) + color darken
- **Tab buttons:** bottom border slide-in from left (CSS `::after` transform)
- **Timeline nodes:** node dot scales to 1.3x, card border lights up
- **Badge cards:** scale(1.03) + glow if earned
- **Comparison winner cells:** pulse glow once on tab open

---

## 12. ALL JS LOGIC & FUNCTIONS

### Complete Function List

```javascript
// ── INIT ──────────────────────────────────────────────────
function init()                        // DOMContentLoaded: load data, render gallery, setup router
function showLoading()                 // Show loading screen
function hideLoading()                 // Fade out loading screen after 1.2s

// ── ROUTER ────────────────────────────────────────────────
function navigateTo(page, params)      // Switch visible page (gallery/passport/compare/swap)
function showPage(pageId)              // Hide all pages, show #page-{pageId}
function getUrlParam(key)              // Read ?id=AG-001 from URL

// ── GALLERY ───────────────────────────────────────────────
function renderGalleryGrid(vehicles)   // Render all vehicle cards to DOM
function renderVehicleCard(vehicle)    // Return HTML string for one card
function filterVehicles()              // Filter + sort + re-render
function handleCompareToggle(id)       // Add/remove from APP.compareList
function updateCompareBar()            // Show/hide compare bar based on list
function removeFromCompare(id)         // Remove vehicle from compare list

// ── PASSPORT ──────────────────────────────────────────────
function loadPassport(id)              // Set APP.currentVehicle, render all passport sections
function renderHero(vehicle)           // Render hero image + overlay text
function renderQuickStats(vehicle)     // Render 3-stat bar
function renderGradeBadges(vehicle)    // Render grade ring + 4 badges
function renderSpecsTable(vehicle)     // Render spec rows
function renderTabs(vehicle)           // Render tab bar + initial tab content
function switchTab(tabName)            // Switch active tab, update content
function renderTimeline(vehicle)       // Render full timeline nodes
function renderAccidentHistory(vehicle)// Render accident tab content
function renderTravelHistory(vehicle)  // Render travel map + stops
function renderOwnershipHistory(vehicle) // Render owner cards
function renderServiceHistory(vehicle) // Render service table
function renderRegistrationHistory(vehicle) // Render registration cards

// ── DEPRECIATION CHART ────────────────────────────────────
function renderDepreciationChart(vehicle, compareVehicle)
function createGradient(ctx, color)    // Chart.js area gradient
function alignDepreciation(dep1, dep2) // Align years for comparison overlay
function calcDepreciationStats(vehicle) // Total %, annual avg

// ── COMPARE ───────────────────────────────────────────────
function loadCompare(id1, id2)         // Load compare page for 2 vehicles
function renderCompareHeader(v1, v2)   // Render two vehicle headers
function renderCompareRows(v1, v2)     // Render all comparison rows with winners
function getWinner(key, v1, v2)        // Return 'left'/'right'/'tie' for a stat
function renderCompareBadges(v1, v2)   // Side-by-side badge comparison
function renderCondensedTimeline(v1, v2) // Dual timeline key events

// ── SWAP ──────────────────────────────────────────────────
function loadSwap(sourceId)            // Load swap view for a vehicle
function renderSwapSource(vehicle)     // Render "Your Vehicle" card
function renderSwapOptions(sourceId)   // Render 4 other vehicle option cards
function swapDelta(source, target)     // Calculate value difference + label
function openSwapModal(sourceId, targetId) // Open swap detail modal
function closeSwapModal()              // Close swap modal

// ── ANIMATIONS ────────────────────────────────────────────
function animateCounter(el, target, duration, formatter)
function animateGradeRing(svgEl, grade)
function initScrollObserver()          // Setup IntersectionObserver for all animated elements
function initParallax()                // Attach scroll listener for hero parallax
function animateBadgesEntrance()       // Staggered badge bounce-in

// ── UTILITIES ─────────────────────────────────────────────
function formatLKR(n)                  // → "LKR 8,750,000"
function formatKm(n)                   // → "87,450 km"
function formatDate(isoString)         // → "15 Feb 2014"
function timeBetween(date1, date2)     // → "3 years 4 months"
function getVehicleById(id)            // Lookup in VEHICLES array
function showToast(message, type)      // Show toast notification
function copyToClipboard(text)         // For share passport URL
function getPhaseColor(phase)          // Return color + bg from PHASE_COLORS map
function getServiceStatus(event, allEvents) // On-time or late
```

---

## 13. RESPONSIVE BEHAVIOR

### Desktop (≥ 1200px)
- Gallery: 3-column grid
- Passport: full layout, all sections visible
- Timeline: left-aligned with wide cards
- Compare: 2-column side-by-side with all rows visible
- Navbar: full horizontal links

### Tablet (768px – 1199px)
- Gallery: 2-column grid
- Passport hero: 320px height
- Stats bar: 3 columns stack to 2+1
- Specs table: still 2 columns
- Compare: 2 columns with condensed rows
- Tab bar: horizontal scroll enabled

### Mobile (< 768px)
- Gallery: 1-column
- Passport hero: 240px height, smaller text
- Stats bar: 1 column stacked
- Grade + badges: grade on top, badges below (2×2 grid)
- Specs: full width rows
- Tabs: horizontal scroll, shorter labels
- Timeline: full-width cards (no left indent)
- Compare: vertical layout, v1 above v2, rows stacked
- Compare bar: shows only car count + "Compare" button
- Navbar: hamburger menu

---

## 14. DEMO WALKTHROUGH SCRIPT (for client presentation)

### Step 1: Gallery Page
> "When a user opens AutoGenesis and clicks on a vehicle, they see the Passport system. Here's our gallery — 5 vehicles, each with grade, mileage, age, and market value in LKR. Notice you can search by make or model, filter by fuel type, and sort."

### Step 2: Open Passport (Toyota Aqua — clean record)
> "Click View Passport on the Aqua. Watch the hero animation. The car fills the screen. Below it — Age: 11 years, Mileage: 87,450 km, Market Value: LKR 8.75M — all animated."

> "The condition grade is 4 out of 5 — 'Good.' The circular gauge fills up with a smooth animation. And all 4 trust badges are earned — On-Time Service, One Owner, No Accidents, Untampered Mileage."

### Step 3: Full Timeline Tab
> "This is the heart of the passport. Every single event in this vehicle's life — from the day it left Toyota's factory in Iwate, Japan, to its last service in Nugegoda. 15 verified events. Source of each event is clearly labelled — manufacturer, dealer, JEVIC inspector, Sri Lanka Customs, RMV."

> "Scroll through — the events animate in one by one. Each node shows the date, odometer reading, and full details."

### Step 4: Switch Tabs
> "Accident History — clean record, green confirmation. Travel History — you can see the route from Kobe port to Colombo. Ownership — one owner. Service — 6 services, all on time."

### Step 5: Depreciation Chart
> "Below the tabs — the depreciation curve. This car started at LKR 14.5M in 2014 and is now at LKR 8.75M. That's a 39.7% drop over 11 years. The client can overlay another vehicle's curve to compare."

### Step 6: Wagon R — Accident Record
> "Now let's look at the Wagon R. Notice its Accident History badge is not earned. Click its passport — the badge is greyed out with a red X. Go to Accident History tab. Here's the event: rear bumper collision in 2020, repaired at authorized Suzuki body shop. Severity: Minor. Odometer at time: 19,400 km. Insurance claim number shown."

### Step 7: Compare Feature
> "Back to gallery. Check any two vehicles — say the Aqua and the Vezel. The compare bar slides up from the bottom. Hit Compare. Now we see them side by side. Every spec aligned. Green 'Better' labels highlight the winner per row. The depreciation chart shows both curves overlaid."

### Step 8: Swap Feature
> "Hit Swap on the Aqua. You see the Aqua on the left — 'Your Vehicle.' On the right — the other 4 vehicles with value difference labels. The Vezel is +LKR 5.45M (you'd need to pay up), the Wagon R is -LKR 2.85M (you'd gain cash). Click View Swap Details to see the full side-by-side summary."

---

## 15. FUTURE ROADMAP (Client Slide)

| Phase | Feature | Timeline |
|---|---|---|
| v1.1 | QR code on physical vehicles → passport URL | Month 2 |
| v1.2 | PDF download with AutoGenesis watermark | Month 2 |
| v1.3 | WhatsApp / Email share passport link | Month 3 |
| v2.0 | Live RMV API integration | Month 4–6 |
| v2.0 | Live JEVIC API integration | Month 4–6 |
| v2.0 | Insurance company data feed | Month 5–7 |
| v2.1 | Dealer portal: add service records | Month 6 |
| v2.1 | Owner login: view private passport data | Month 6 |
| v3.0 | Mobile app (iOS + Android) | Month 8–12 |
| v3.0 | Blockchain-verified record hashing | Month 10–12 |
| v3.1 | ML price prediction / market trend | Month 12+ |
| v3.2 | Integrated marketplace (buy/sell/swap) | Month 14+ |

---

## APPENDIX A — HTML SCAFFOLD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoGenesis Passport</title>
  <meta name="description" content="Complete vehicle history passport — trusted, verified, transparent.">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    /* ~800 lines of CSS here */
  </style>
</head>
<body>

  <!-- Loading Screen -->
  <div id="loading-screen">...</div>

  <!-- Navbar -->
  <nav id="navbar">...</nav>

  <!-- Page: Gallery -->
  <div id="page-gallery" class="page active">
    <div class="gallery-hero">...</div>
    <div class="gallery-controls">...</div>
    <div class="gallery-grid" id="gallery-grid">...</div>
  </div>

  <!-- Page: Passport -->
  <div id="page-passport" class="page hidden">
    <button class="back-btn" onclick="navigateTo('gallery')">← Back to Gallery</button>
    <div class="passport-hero" id="passport-hero">...</div>
    <div class="passport-quick-stats" id="passport-stats">...</div>
    <div class="passport-grade-badges" id="passport-grade">...</div>
    <div class="passport-specs" id="passport-specs">...</div>
    <div class="passport-tabs-section" id="passport-tabs">...</div>
    <div class="passport-depreciation" id="passport-depreciation">...</div>
    <div class="passport-action-bar" id="passport-actions">...</div>
  </div>

  <!-- Page: Compare -->
  <div id="page-compare" class="page hidden">...</div>

  <!-- Page: Swap -->
  <div id="page-swap" class="page hidden">...</div>

  <!-- Sticky Compare Bar -->
  <div id="compare-bar" class="compare-bar hidden">...</div>

  <!-- Swap Detail Modal -->
  <div id="modal-swap" class="modal-overlay hidden">...</div>

  <!-- Share Modal -->
  <div id="modal-share" class="modal-overlay hidden">...</div>

  <!-- Toast Container -->
  <div id="toast-container"></div>

  <!-- Back to Top -->
  <button id="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>

  <script>
    // All JS here — ~600 lines
    const VEHICLES = [ /* all 5 vehicle objects */ ];
    const APP = { vehicles: VEHICLES, currentVehicle: null, compareList: [], swapSource: null, activeTab: 'timeline', depreciationChart: null };
    // ... all functions ...
    document.addEventListener('DOMContentLoaded', init);
  </script>

</body>
</html>
```

---

## APPENDIX B — PHASE FILTER MAPPING (for tabs)

```javascript
const TAB_FILTERS = {
  timeline:     () => true,  // all events
  accident:     e => e.phase === 'accident',
  travel:       e => ['manufacture','export_sale','export','inspection','arrival','customs'].includes(e.phase),
  ownership:    e => ['first_sale','ownership'].includes(e.phase),
  service:      e => e.phase === 'service',
  registration: e => ['registration','customs'].includes(e.phase),
};
```

---

*Master Plan v2.0 — AutoGenesis Passport Full Demo*
*All vehicle data, names, VINs, plates, permit numbers are fictional and for demo purposes only.*
*Built for single-file HTML delivery — opens in any modern browser, no server needed.*
