# Technical Documentation
 
## Overview
 
A static single-page portfolio (About, Projects, Experience, Contact) built with vanilla HTML, CSS, and JavaScript, with no frameworks or build tools. It is hosted on GitHub Pages.
 
Assignment 3 adds:
- a project card that loads live data from the **GitHub REST API**, with a loading skeleton, a one-hour cache, and a fallback when the request fails;
- **filtering and sorting** of the project cards, with messages that change based on the visitor's choices;
- a **time-on-site timer**;
- saved visitor choices in `localStorage`;
- fixes from a **Lighthouse** performance and accessibility audit.
## File Structure
 
| File | Purpose |
|---|---|
| `index.html` | Page markup: header/nav, hero (greeting + name form), About, Projects (controls, project grid, Up Next), Experience, Contact, footer (timer). |
| `css/styles.css` | All styling: theme variables, reset, layout (Flexbox/Grid), components, GitHub card skeleton, project controls, responsive breakpoints. |
| `js/script.js` | All interactivity, organized into 7 numbered sections (see below). |
| `assets/images/` | SVG images for the profile and project cards (all under 1.1 KB). |
| `docs/` | This file and the AI usage report. |
 
## JavaScript Structure
 
Everything starts from one `DOMContentLoaded` listener, in this order:
 
```js
initThemeToggle();      // 1
renderGreeting();       // 2
initNameForm();         // 2b
initMobileNav();        // 3
initContactForm();      // 4
initFooterYear();
initProjectControls();  // 6: set up controls before data arrives
initGitHubCard();       // 5: may call updateProjects() when its data loads
initVisitTimer();       // 7
```
 
`initProjectControls()` runs before `initGitHubCard()` so the controls and saved choices are ready before the Omnia card's data arrives and triggers a re-sort.
 
| Section | Functions | Purpose |
|---|---|---|
| 1. Theme | `initThemeToggle()` | Dark/light toggle; falls back to the OS setting on first visit |
| 2. Greeting | `getTimeGreeting()`, `renderGreeting()`, `playFadeIn()` | Time-of-day greeting with the saved name |
| 2b. Name form | `initNameForm()` | Saves/clears the visitor name; shows the form or "Change name" |
| 3. Navigation | `initMobileNav()` | Mobile menu toggle with `aria-expanded` |
| 4. Contact form | `initContactForm()`, `validateField()` | Empty vs invalid messages, focus on first error |
| 5. GitHub card | `initGitHubCard()`, `pickRepoFields()`, `readRepoCache()`, `writeRepoCache()`, `renderRepo()`, `renderRepoFallback()`, `finishLoading()`, `formatDate()` | Fetch, cache, and display the Omnia repo |
| 6. Projects | `initProjectControls()`, `updateProjects()`, `compareCards()`, `loadProjectPrefs()`, `saveProjectPrefs()` | Filter, sort, messages, saved choices |
| 7. Timer | `initVisitTimer()`, `pad()` | Time on site in mm:ss |
 
## API Integration: Live Omnia Card
 
### Why this API
The site is static, so any API key in `script.js` would be public. I only considered APIs that need **no key** and allow **CORS** (browser requests from another site). The GitHub REST API meets both for public data, and showing live data about my own project fits a portfolio better than a generic widget like quotes or weather.
 
### Endpoint and data used
`GET https://api.github.com/repos/nhlsu/Omnia` returns one repository object. Only four fields are kept (`pickRepoFields()`), which keeps the cache small:
 
| Card shows | API field |
|---|---|
| Description | `description` |
| Main language | `language` |
| Stars | `stargazers_count` |
| "Updated" date + sort date | `pushed_at` |
 
`pushed_at` (last code push) is used instead of `updated_at`. `updated_at` only changes when the repo's settings or description change, so it was 3 days behind the latest commit (11 Nov vs 14 Nov) and would never move when new code is pushed.
 
### Request flow
1. **Cache check:** `readRepoCache()` looks for a saved response under `omniaRepoCache-v2`. If it is less than one hour old, it is shown immediately and no request is made.
2. **Fetch:** otherwise `fetch()` requests the repo.
3. **Status check:** `fetch()` only rejects on network failure. An HTTP error such as **403** (rate limit) or **404** still resolves, so the code checks `response.ok` and throws if it is false.
4. **Success:** the four fields are saved with a timestamp (`writeRepoCache()`) and displayed (`renderRepo()`). `renderRepo()` also updates the card's `data-date` and calls `updateProjects()` so the sort order reflects the new date.
5. **Failure:** `renderRepoFallback()` hides the stats row and shows a note. The description written in the HTML stays visible, with a link to the repo.
### Loading state
The card is written in the HTML as a placeholder with class `is-loading` and `aria-busy="true"`. While loading, CSS makes the text transparent and shows pulsing grey bars in its place (a "skeleton"), so the layout doesn't jump when the data arrives. The animation is turned off for `prefers-reduced-motion`. `finishLoading()` removes the class and sets `aria-busy="false"`.
 
### Caching
- **Why:** unauthenticated GitHub requests are limited to **60 per hour per IP address**. Caching for one hour keeps each visitor far below that and makes repeat visits instant.
- **Format:** `{ "savedAt": <timestamp in ms>, "data": { description, language, stars, updatedAt } }`
- **Freshness:** `Date.now() - savedAt < 60 * 60 * 1000`
- **Robustness:** invalid JSON or a missing timestamp makes the check fail safely, so the page fetches fresh data instead of crashing.
- **Versioned key:** the key is `omniaRepoCache-v2`. When I switched from `updated_at` to `pushed_at`, browsers that already had a cached entry kept showing the old date for up to an hour. Changing the key makes every browser ignore the old entry immediately.
## Complex Logic: Filtering and Sorting
 
### Card metadata
Each card in `.projects-grid` has three data attributes:
 
| Project | `data-category` | `data-level` | `data-date` |
|---|---|---|---|
| Omnia | web | advanced | from GitHub (`pushed_at`), fallback `2026-11-14` |
| Factors Affecting Study Performance | data | beginner | 2026-05-31 |
| CPU Design | hardware | advanced | 2026-05-31 |
| Traffic Light Controller | hardware | beginner | 2025-12-31 |
| Football Analytics Dashboard | data | advanced | 2026-07-31 |
 
The dates for the four course projects are month-end dates, because those projects have no public repository with exact dates. The "Up Next" card is outside the grid, so filters and sorting never affect it.
 
### One update function
Every control (category buttons, both dropdowns, Clear filters) and the GitHub fetch call a single function, `updateProjects()`, which:
 
1. Shows a card only if it matches **both** filters:
   `(category === 'all' || card.dataset.category === category) && (level === 'all' || card.dataset.level === level)`
2. Sorts the cards with `compareCards()` and re-appends them. `appendChild()` moves an element that is already on the page, so this reorders the grid without copying anything.
3. Shows the empty-results message only when no cards are visible.
4. Shows the message for the selected level (`LEVEL_MESSAGES`).
5. Updates `aria-pressed` on the category buttons so the active one is highlighted and announced by screen readers.
6. Saves the current choices.
Having one function means the order of these steps is always the same, whichever control triggered it.
 
### Sorting rules (`compareCards`)
- **A–Z:** `localeCompare()` on the card titles.
- **Newest / Oldest:** compares `data-date` strings. Dates in `YYYY-MM-DD` format sort correctly as plain text because the year comes first, then the month, then the day.
- **Ties:** Study Performance and CPU Design share a date, so equal dates fall back to A–Z. Without this, their order could change between sorts.
### Clear filters
Resets category and level to "all" but keeps the current sort, because the sort is a display preference, not a filter.
 
## State Management
 
### Saved data (`localStorage`)
 
| Key | Value | Set by |
|---|---|---|
| `theme` | `"dark"` or `"light"` | Theme toggle |
| `visitorName` | The visitor's name | Name form |
| `projectPrefs` | `{ "category", "level", "sort" }` | Project controls |
| `omniaRepoCache-v2` | `{ "savedAt", "data" }` | GitHub card |
 
### Loading saved choices with defaults
```js
return { ...DEFAULT_PREFS, ...saved };
```
Defaults are spread first and saved values second, so saved values win. If a saved object is missing a setting (for example, after a new setting is added in a later version), the default fills it in. Reversing the order would reset every choice to the defaults on each reload.
 
All data stays in the visitor's own browser. User text (the visitor name) is always inserted with `textContent`, never `innerHTML`, so it can't inject HTML.
 
## Timer
 
`initVisitTimer()` records `startTime = Date.now()` and updates the footer every second with the elapsed time:
 
```js
const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
```
 
It calculates the real elapsed time each tick instead of adding 1 to a counter. Browsers slow down `setInterval` in background tabs (Chrome can delay it to once a minute), so a counter would fall behind when the visitor switches tabs. With this approach, the interval only controls how often the display refreshes, not what time it shows. The timer resets on reload by design.
 
## Performance
 
### Method
Lighthouse in Chrome DevTools, run on the live GitHub Pages site in an **Incognito window** so browser extensions couldn't affect the results. Before the fixes: one run per device. After the fixes: three runs per device, reporting the **median**, because scores varied between runs of the same code.
 
### Results
 
| Category | Mobile before | Mobile after (median) | Desktop before | Desktop after (median) |
|---|:-:|:-:|:-:|:-:|
| Performance | 98 | 92 | 92 | **99** |
| Accessibility | 96 | **100** | 96 | **100** |
| Best Practices | 96 | **100** | 96 | **100** |
| SEO | 100 | 100 | 100 | 100 |
| Cumulative Layout Shift | 0 | 0.001 | 0.176 | **0.034** |
 
### What was fixed
 
| Issue found | Fix | Result |
|---|---|---|
| Hero content jumped after load (desktop CLS 0.176). The name form appears for first-time visitors and the greeting is filled in by JavaScript, pushing content down. | Wrapped the greeting, name form, and "Change name" button in `.name-area` with `min-height: 8rem`; gave `.greeting` a `min-height` | CLS 0.034 (under Google's 0.1 "good" threshold) |
| Dark-mode buttons: white text on `#9b8cff` = 2.76:1 contrast (minimum is 4.5:1) | New variable `--color-on-accent`: white in light mode, `#14151f` in dark mode. Used for primary buttons, outline-button hover, and the active filter | 6.56:1 |
| "Pending" tag: 3.91:1 contrast | New variable `--color-pending-text`: `#805900` (light) and `#e0b84a` (dark) | 5.81:1 and 6.74:1 |
| Console error: `/favicon.ico` returned 404 | `<link rel="icon" href="data:," />` tells the browser there is no icon, so it doesn't request one | No console errors |
| Google Fonts blocked rendering | Added `preconnect` to `fonts.gstatic.com` (with `crossorigin`, because font files are downloaded in CORS mode) | Connection starts earlier; still flagged, because the font CSS must load before text is drawn |
| Profile image had no `width`/`height` | Added `width="400" height="400"`, plus `height: auto` on `img` so the image keeps its 1:1 shape when CSS shrinks it | No longer flagged |
 
### Already efficient (no change needed)
- **Images:** all 7 are SVGs under 1.1 KB each. SVG stays sharp at any size, so no resizing or compression is needed.
- **Unused code:** every CSS class in `styles.css` is used in the HTML or JavaScript.
- **JavaScript:** Total Blocking Time was 0 ms on every run.
- **Font weights:** I considered removing unused font weights from the Google Fonts URL but didn't, because browsers only download font files that the page actually uses. The extra weights only add a few lines to a small CSS file.
### Known limits
- **Cache lifetimes:** GitHub Pages serves files with a 10-minute cache, and this can't be changed on Pages. Lighthouse flags it, but it's a hosting limitation.
- **Score variation:** mobile Performance ranged from **89 to 99** across runs of the same code within two minutes, depending on how fast the server responded (for example, `styles.css` took 1.75 s in one run and 0.66 s in another). The mobile Performance "drop" from 98 to 92 is within this range. The Accessibility, Best Practices, and layout-shift improvements were the same in every run.
## Compatibility
 
Tested on the live site:
 
| Feature | Chrome | Edge | Safari (iPhone) |
|---|:-:|:-:|:-:|
| Theme toggle (remembered) | ✓ | ✓ | ✓ |
| Name form + greeting | ✓ | ✓ | ✓ |
| Omnia card (live GitHub data) | ✓ | ✓ | ✓ |
| Filters, sort, saved choices | ✓ | ✓ | ✓ |
| Contact form validation | ✓ | ✓ | ✓ |
| Timer | ✓ | ✓ | ✓ |
| Mobile menu | — | — | ✓ |
 
Chrome and Edge use the Chromium engine; Safari uses WebKit. Firefox (Gecko engine) was not tested. The JavaScript uses features supported by all current browsers (`fetch`, `async/await`, spread syntax, `padStart`, `localStorage`).
 
## Accessibility Notes
- Category buttons use `aria-pressed` to announce which filter is active, inside a `role="group"` with a label.
- Every dropdown has a `<label for>`.
- The level message and the greeting use `aria-live="polite"`, so changes are announced.
- The Omnia card uses `aria-busy` while loading.
- Visible focus outline on buttons and dropdowns (`:focus-visible`).
- All text meets the 4.5:1 contrast ratio in both themes (Lighthouse Accessibility 100).
- Animations (fade-in, skeleton pulse) are off for `prefers-reduced-motion`.
## Bugs Found and Fixed in Assignment 3
 
| Bug | Cause | Fix |
|---|---|---|
| Omnia card stuck on the loading skeleton | `initGitHubCard()` was defined but never called | Added it to the `DOMContentLoaded` list |
| Card showed an outdated date (11 Nov instead of 14 Nov) | Used `updated_at`, which tracks settings changes, not code pushes | Switched to `pushed_at` |
| Old date still showed after switching fields | The browser kept the cached response from before the change | Versioned the cache key (`omniaRepoCache-v2`) |
| Filters and timer did nothing | `initProjectControls()` and `initVisitTimer()` were not called | Added both to the startup list |
| Re-sort after GitHub loaded used the old date | `updateProjects()` was called before `data-date` was updated | Moved the call after the update |
| Most styles after `.btn-primary` could break | Missing `}` in `.btn-primary`; modern browsers treat the following rules as nested inside it (CSS nesting) | Closed the rule |
| Profile photo would be stretched | `height="400"` with `max-width: 100%` shrinks the width but keeps the height | Added `height: auto` to `img` |
| Omnia image would be blurry and cropped | Linked the repo's 32×32 favicon from GitHub; `object-fit: cover` scaled it up to the card width | Made a local 600×320 SVG banner around the icon |
| First "after" Lighthouse run showed no improvement | The fixes hadn't been pushed yet / GitHub Pages hadn't finished deploying | Pushed, waited for the deploy, re-ran |
 
## Known Limitations
- The contact form has no backend; submissions are validated but not sent.
- Saved data (name, choices, cache) is per browser and per device.
- If GitHub's rate limit is reached, the Omnia card shows its fallback until the limit resets.
- Course project dates are approximate (month-end).
- Firefox and screen readers have not been tested.
 