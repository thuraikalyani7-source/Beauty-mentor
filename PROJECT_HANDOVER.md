# Beauty Mentor — Project Handover

## Project purpose

Beauty Mentor is an educational beauty and self-care web app. Users can select body areas and concerns, read general guidance, explore publicly catalogued cosmetic product information, keep private local journal records, and view weather-based care reminders. It does not diagnose conditions or generate AI recommendations.

**Project folder:** `C:\Users\Hp\OneDrive\Desktop\beauty mentor`

## Technologies and dependencies

- React `19.2.8` and React DOM `19.2.8`
- Vite `8.2.2` with `@vitejs/plugin-react` `6.1.0`
- React Three Fiber `9.8.2` and Three.js `0.186.1`
- ESLint `10.9.0` with React Hooks and React Refresh plugins
- No separate router, barcode-scanning package, backend, or weather API key is configured.

Versions are read from the current `package.json` and lockfile. Install from the project root with `npm install` (or `npm ci` to use the lockfile), then run:

```powershell
npm run dev
```

Open the local URL printed by Vite in Chrome (normally `http://localhost:5173/`). Other available commands are `npm run lint`, `npm run build`, and `npm run preview`.

## Project structure

```text
beauty mentor/
├── asset-inspection/       # downloaded male and female GLB base meshes
├── public/                 # app icons and favicon
├── src/
│   ├── assets/             # illustration images and template assets
│   ├── components/         # body maps, product explorer, journey, weather, etc.
│   ├── data/               # concern guidance, weather rules, journey storage
│   ├── services/           # weather API requests
│   ├── App.jsx             # app screens, selection state, and navigation
│   ├── App.css
│   ├── index.css
│   └── main.jsx            # React entry point
├── package.json / package-lock.json
├── vite.config.js
└── PROJECT_HANDOVER.md
```

Important files:

- `src/App.jsx`: launch, onboarding, dashboard, body selection, lifestyle/budget, review and guide screens; app-level preferences, selected areas/concerns, proposed routine, and hash navigation.
- `src/data/guidanceData.js`: educational guidance entries and guide-generation helpers.
- `src/components/AnimeGirlMap.jsx`, `src/components/AnimeBoyMap.jsx`: illustration maps with interactive SVG paths and area selection.
- `src/components/ProductExplorer.jsx`, `src/components/BarcodeScanner.jsx`: live catalogue lookup, manual barcode lookup, scanner entry, product details, and proposed routines.
- `src/components/BeautyJourney.jsx`, `src/data/journeyStorage.js`: journal/photos/check-ins and local persistence.
- `src/components/WeatherTips.jsx`, `src/services/weatherService.js`, `src/data/weatherTips.js`: weather page, Open-Meteo requests, and rule-based tips.
- `src/components/BodyViewer.jsx`: a separate female GLB viewer component.

## Current features (Stages 1–4)

### Launch, onboarding, and dashboard

- A CSS launch screen transitions after about four seconds, or the user can press its start button.
- Optional age-range and skincare-experience onboarding is stored in browser `localStorage`; users can revisit preferences from the dashboard.
- Dashboard links to the Personalized Beauty Guide, Product Explorer, My Routine, Beauty Journey, and Weather Tips. The AI Assistant is visibly marked “Coming soon.”

### Beauty guide and body maps

- Users can choose male/female mode and select concerns from body areas, then set lifestyle and budget preferences, review their choices, edit earlier choices, and generate the educational starter guide.
- Face, hair/scalp, eye/lip, and body/hand/foot/nail guidance is in `src/data/guidanceData.js`; the current UI includes a safe missing-guidance message.
- Female and male anime illustrations have SVG selection paths. An original body-map SVG remains available. These image-based SVG maps are the current body selection interface.
- **3D limitation:** `BodyViewer.jsx` loads only the female GLB and has rotate/zoom/reset/loading/error controls, but inspection found no import or render of `BodyViewer` in `App.jsx`. Therefore it is not currently connected to the app screens. The GLB files are in `asset-inspection/`; no 3D region selection is implemented. Individual nails are not separate verified 3D selection targets.
- The GLB assets are retained in the project. Their license/source records are not documented in the current source tree, so verify asset rights before redistribution or commercial use.

### Product Explorer and proposed routines

- Product search and manual barcode entry use separate React state and independent result/loading/error states.
- Product data is requested from Open Beauty Facts; barcode requests use its `/api/v2/product/{barcode}.json` endpoint. The code distinguishes a confirmed status-0 “not found” response from request/API errors and preserves leading zeros while trimming whitespace.
- Product details show returned fields when available and identify community-data limitations. The app does not invent live product data.
- The scanner uses the browser's built-in `BarcodeDetector` when available; it is not backed by a scanner library and may be unsupported in some browsers. Camera access starts only when the user opens the scanner. Manual barcode entry remains available.
- Products can be added to or removed from proposed morning/evening routines. Routine contents are stored in browser `localStorage`, not synced to an account or cloud.

### Beauty Journey

- The page provides overview, optional private photo journal, editable text journal, routine check-ins/history, and product start-date/observation records when products are in the proposed routine.
- Journal text, check-ins, and product history use `localStorage` (`beauty-mentor-journey-v1`). Photo blobs use IndexedDB (`beauty-mentor-private-journey`). Photos are not uploaded. Clearing browser data or changing devices can remove or strand local records. Photos over 10 MB are rejected by the UI.

### Weather Tips

- Uses Open-Meteo's city geocoding and forecast endpoints from `src/services/weatherService.js`; no API key or environment variable is required by the current implementation.
- Users can search a city or explicitly request browser geolocation. Conditions and available fields come from the provider. `src/data/weatherTips.js` defines threshold-based general suggestions and the page labels general tips when live data is absent.
- Open-Meteo attribution and terms are linked in the UI. The current page notes the free API is for non-commercial use; check provider terms and choose an appropriate plan before commercial launch.

## Navigation and hash routes

Navigation is currently implemented with React state in `src/App.jsx`, not a routing package. The following routes are mapped to URL hashes:

- `#beauty-journey` → Beauty Journey
- `#product-explorer` → Product Explorer
- `#my-routine` → My Routine tab

Dashboard cards push these hashes, and the app listens for browser `hashchange`/`popstate` events. Leaving these pages returns to the dashboard and clears the route hash. Other screens (including weather and guide steps) use in-app React state without dedicated hash routes. Manual browser back/forward behavior still needs verification after the most recent navigation fix.

## Known limitations and unverified behavior

- The barcode input separation, API response handling, and hash routing fixes are present in the current source. **They have not been manually verified in Chrome during this handover.** First verify a known Open Beauty Facts barcode, an unknown barcode, a network failure, and direct/back/forward route navigation.
- A successful production build does not prove browser interactions, camera access, network requests, or third-party API availability work at runtime.
- Barcode scanning depends on browser support for `BarcodeDetector`, camera permission, and a secure context (localhost is generally treated as secure). If unsupported or denied, use manual entry.
- The catalogue may not contain every cosmetic product and its records may be incomplete or outdated.
- `BodyViewer.jsx` exists but is not rendered by the current application; it is only a female preview and does not provide region picking. SVG/image maps provide the active selection experience.
- Current local data is browser/device-specific. There is no backend, account, cloud sync, or database server.
- The AI Assistant is a coming-soon dashboard placeholder. No AI service or AI-generated guidance is implemented.
- No weather integration test or product API/browser interaction test was run as part of this handover.
- The project does not contain a `.git` directory and is not a Git repository in this folder. Consequently, Git cannot report modified/added/deleted/untracked files or identify a baseline. Current project files are saved on disk; no separate Codex-only worktree changes were identified. Unsaved editor buffers cannot be checked from the filesystem.
- No `.env` file was found during inspection. The backup excludes `.env*`, `*.local`, and log files.
- `README.md` remains the default React/Vite template text and is not a project-specific setup guide.

## Latest checks

Run on **2026-10-21** from the project root:

- `npm run lint` — completed successfully with no ESLint diagnostics.
- `npm run build` — passed; Vite transformed 28 modules and emitted the production bundle.

These checks validate static lint/build output only. They do **not** prove the UI, browser storage, camera, live Open Beauty Facts requests, or live Open-Meteo requests work in Chrome.

## Suggested next work

1. Manually verify the recent barcode lookup and hash-navigation fixes in Chrome.
2. Plan the Beauty Mentor AI Assistant, including its scope, safety rules, and whether a secure backend is needed. Do not expose API credentials in frontend code.
3. Review security and privacy, especially local photo handling, uploaded assets, dependencies, and any future API integration.
4. Decide whether to add a backend for accounts, synchronization, or protected API credentials; none exists now.
5. Prepare deployment configuration, hosting, privacy/terms content, accessibility checks, and a production smoke test.
6. Confirm all image/model licenses and commercial terms before public or commercial launch.

## Handover prompt for a new coding assistant

> Continue the existing Beauty Mentor React + Vite project in `C:\Users\Hp\OneDrive\Desktop\beauty mentor`. Read `PROJECT_HANDOVER.md`, inspect the actual source before editing, and preserve all existing functionality. Do not rebuild the app. First manually verify the Product Explorer's independent search/barcode inputs, Open Beauty Facts lookup states, and the `#beauty-journey`, `#product-explorer`, and `#my-routine` routes including browser back/forward behavior. Report what was actually tested; do not claim a live API or browser feature works without testing it. Keep credentials out of frontend source. Ask before adding unrelated features, changing the design, or introducing a backend.
