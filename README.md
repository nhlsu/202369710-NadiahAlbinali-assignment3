# Nadiah Albinali — Personal Portfolio (Assignment 3)
 
A responsive single-page portfolio built with plain **HTML, CSS, and JavaScript** (no frameworks, no build step).
It started in Assignment 1, gained interactive features in Assignment 2, and in Assignment 3 (*Advanced Functionality*) it now pulls live data from the GitHub API, lets visitors filter and sort projects, remembers their choices, and has been optimized with Lighthouse.
 
**Live site:** https://nhlsu.github.io/202369710-NadiahAlbinali-assignment3/
 
## Project Description
 
The page has four sections:
 
- **About Me:** a short introduction and quick facts.
- **Projects:** project cards that can be filtered by category and level and sorted by date or title. The **Omnia** card loads live data from GitHub. An **Up Next** card shows an upcoming project.
- **Experience:** my roles in student organizations and activities.
- **Contact:** a client-side form with validation (no backend).
### Features at a glance
 
| Feature | Added in |
|---|---|
| Dark / light theme toggle, remembered between visits | A1 |
| Mobile navigation menu, smooth scrolling | A1 |
| Personalized time-of-day greeting with a saved visitor name | A2 |
| Contact form validation with separate "empty" and "invalid" messages | A2 |
| Fade-in animation (respects `prefers-reduced-motion`) | A2 |
| **Live Omnia project card from the GitHub API** (loading skeleton, 1-hour cache, fallback on error) | **A3** |
| **Project filters (category + level) and sorting (newest / oldest / A–Z)**, with choices saved | **A3** |
| **Level-specific messages** (Beginner / Advanced) and an empty-results message | **A3** |
| **Time-on-site timer** in the footer | **A3** |
| **Performance and accessibility fixes from a Lighthouse audit** | **A3** |
 
### New in Assignment 3: where to find each requirement
 
| Requirement | Feature | Where in the code | How to check |
|---|---|---|---|
| **API integration** | Omnia card fetches description, language, stars, and last-push date from `api.github.com/repos/nhlsu/Omnia` | `index.html` (`#omnia-card`), `js/script.js` section 5 | Open the site: the card pulses briefly, then shows live stats |
| **API error handling** | If GitHub is unreachable or returns an error (e.g. rate limit), the card keeps its built-in description and shows a friendly note | `renderRepoFallback()` | DevTools → Network → *Offline*, delete `omniaRepoCache-v2` from Local Storage, reload |
| **Complex logic** | Category buttons + level dropdown filter together (a card must match both); sort by newest, oldest, or A–Z; ties sorted by title | `js/script.js` section 6: `updateProjects()`, `compareCards()` | Try **Web + Beginner** (shows the empty message), then **Clear filters** |
| **Different content per choice** | Selecting Beginner or Advanced shows a matching message above the projects | `LEVEL_MESSAGES` in `js/script.js` | Change the Level dropdown |
| **Timer** | Footer shows time on site (mm:ss), reset on reload | `js/script.js` section 7: `initVisitTimer()` | Watch the footer |
| **State management** | Theme, visitor name, filter/sort choices, and the GitHub response are saved in `localStorage` | See *Saved data* in the technical documentation | Change filters, reload: your choices are still selected |
| **Performance** | Lighthouse audit before and after fixes: Accessibility and Best Practices 96 → 100, desktop layout shift 0.176 → 0.034 | `docs/technical-documentation.md` → *Performance* | Run Lighthouse in an Incognito window |
 
## Folder Structure
 
```
202369710-NadiahAlbinali-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/          # SVG images (each under 1.1 KB)
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```
 
## Setup Instructions (Run Locally)
 
No installation or build step is needed.
 
1. Clone the repository:
```bash
git clone https://github.com/nhlsu/202369710-NadiahAlbinali-assignment3.git
cd 202369710-NadiahAlbinali-assignment3
```
2. Serve the folder with a local server (recommended), for example:
   - **VS Code:** install the *Live Server* extension, right-click `index.html` → **Open with Live Server**, or
   - **Python 3:** `python3 -m http.server 8000`, then open http://localhost:8000
3. You can also open `index.html` directly in a browser. Everything works, including the GitHub card, as long as you're online.
**Internet connection:** the GitHub card and Google Fonts need internet access. Offline, the page still works: the Omnia card shows its built-in description, and text falls back to system fonts.
 
## How to Test the Assignment 3 Features
 
1. **GitHub card:** open the site and watch the Omnia card change from a pulsing skeleton to live stats.
2. **Cache:** reload. In DevTools → Network, there should be no new request to `api.github.com` (the response is reused for one hour).
3. **API failure:** DevTools → Application → Local Storage → delete `omniaRepoCache-v2`, then set Network to *Offline* and reload. The card keeps its description and shows "Live stats couldn't load right now".
4. **Filters:** click **Hardware**, then choose **Beginner** (only the Traffic Light Controller shows). Choose **Web + Beginner** to see the empty-results message.
5. **Sorting:** switch between **Newest**, **Oldest**, and **A–Z**.
6. **Saved choices:** pick a filter and sort, reload, and they are still selected. **Clear filters** resets the category and level but keeps the sort.
7. **Timer:** the footer counts up in mm:ss and restarts when you reload.
To reset everything: DevTools → Application → Local Storage → delete `theme`, `visitorName`, `projectPrefs`, and `omniaRepoCache-v2`.
 
## Browser Compatibility
 
Tested on **Chrome** and **Edge** (desktop, Chromium engine) and **Safari on iPhone** (WebKit engine). All features worked in each. Firefox was not tested. Details are in the technical documentation.
 
## AI Usage
 
I used **Claude (Opus 5.5)** throughout Assignment 3. I planned each phase myself, then Claude gave me code skeletons with blanks for the key logic (fetch and error handling, caching, filtering, sorting, the timer), which I filled in, and reviewed my code afterwards. It also helped choose the API, analyze the Lighthouse reports, and draft this documentation, which I reviewed and edited. AI-assisted commits are marked with `Assisted-by: Claude (Opus 5.5)`. Full details, including the mistakes the AI made and how I caught them, are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).
 
## Author
 
**Nadiah Albinali** (ID 202369710), Computer Science student at King Fahd University of Petroleum and Minerals (KFUPM).
GitHub: [@nhlsu](https://github.com/nhlsu)