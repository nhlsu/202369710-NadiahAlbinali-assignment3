# AI Usage Report — Assignment 3
 
## Tools Used & Use Cases
 
**Claude (Anthropic), model Opus 5.5**, was the only AI tool used in this assignment.

I used it in one long session with a fixed workflow: **I wrote the plan for each phase, Claude reviewed the plan, then gave me code skeletons with blanks for the important logic, I filled in the blanks, and Claude reviewed what I wrote.** Markup and CSS were given more completely, so my time went into the logic.
 
| Use case | How it was used |
|---|---|
| **Planning** | Claude compared the assignment brief with my Assignment 2 code and showed what was already done (state, contact form) and what was missing. I then wrote a to-do list for each phase, and Claude pointed out gaps (e.g. a missing loading state, the "different messages" requirement, an empty-results case). |
| **API research** | I found a list of free APIs. Claude explained why any API needing a key was ruled out (a key in front-end code is public), then checked which candidates allow browser requests. I chose the GitHub API, and decided to show only my Omnia project as one card in the grid. |
| **Guided coding** | Claude gave me skeletons with blanks: 8 for the GitHub card (e.g. `!response.ok`, the cache freshness check, `JSON.stringify`, `dataset.date`) and 11 for filtering, sorting, and the timer (the filter conditions, the empty-results check, the comparator returns, `elapsedSeconds % 60`). Each blank had a hint, not the answer. |
| **Code review** | Claude reviewed every file I sent back and found bugs: functions that were never called, a call in the wrong order, and a missing `}` in the CSS. It gave hints first instead of fixes. |
| **Testing** | Claude ran my HTML and JS in a simulated browser to confirm filtering and sorting worked. I tested in Chrome DevTools (Slow 3G, Offline, Local Storage) and on my phone. |
| **Performance analysis** | Claude read my Lighthouse JSON reports, explained each flagged issue, calculated colour contrast ratios, and summarized before/after results. I chose which fixes to make and how. |
| **Git / GitHub help** | Commands to copy my A2 history into the new repo, fixing a repo name typo, setting up GitHub Pages. |
| **Documentation** | Drafted the README, technical documentation, and this report from our session. I reviewed and edited them. |
 
## Benefits & Challenges
  
**Benefits**
- Filling in blanks made me write the logic myself instead of pasting finished code. I can explain each line because I had to work out what goes there.
- Reviews caught bugs I wouldn't have spotted quickly, for example the missing `}` that would have nested the rest of my CSS inside `.btn-primary`.
- Lighthouse reports are long JSON files. Having them summarized with exact numbers (like 2.76:1 contrast) told me exactly what to fix.
- Planning before coding helped: by deciding the card attributes and the "one update function" design first, adding Omnia's live date to the sort later only needed one line.
**Challenges**
- **The AI made mistakes, so I had to verify.** It first suggested `updated_at` for the "last updated" date, but the real data showed it was 3 days behind my last commit, so I switched to `pushed_at`. It also claimed that each font weight is a separate download, which isn't true (browsers only download weights the page uses), so that fix wasn't worth doing.
- Some explanations were too complicated. Measuring the exact height for the layout-shift fix in DevTools was more effort than it was worth, so I used an estimate and checked it with Lighthouse instead (CLS went from 0.176 to 0.034).
- The same bug came back twice: I added new functions but forgot to call them in `DOMContentLoaded`. Now I check the startup list every time I add a feature.
## Learning Outcomes

- **`fetch()` only fails on network errors.** A 403 or 404 still "succeeds", so I have to check `response.ok` myself.
- **Caching:** storing a timestamp with the data and comparing it with `Date.now()`, and **versioning the cache key** when the cached data changes meaning, so old entries are ignored for every visitor, not just me.
- **`{ ...DEFAULT_PREFS, ...saved }`:** spreading defaults first means saved values win, and missing settings still get a default. Reversing the order would reset all choices on every reload.
- **Timers:** calculating `Date.now() - startTime` instead of counting ticks, because browsers slow down `setInterval` in background tabs.
- **Sorting with a comparator:** negative/positive return values, sorting `YYYY-MM-DD` dates as strings, and using the title as a tie-breaker so the order never changes randomly.
- **`appendChild()` moves** an existing element, which is how the grid gets reordered.
- **Layout shift (CLS):** content that appears after loading pushes the page down; reserving space with `min-height` prevents it.
- **Accessibility contrast:** the 4.5:1 minimum, and using a CSS variable so the text colour on the accent changes with the theme.
- **Lighthouse scores vary** between runs of the same code, so I ran each test 3 times and used the median.
- **GitHub API fields:** `updated_at` (repo settings) vs `pushed_at` (code pushes).
## Responsible Use & Modifications
 
- **I made the decisions:** choosing the GitHub API and showing only Omnia; using a placeholder card in the HTML; the category, level, and date for each project; my level messages; keeping the Coming Soon card outside the filters; saving filter choices; the Clear filters behaviour; the timer format; option (b) for the layout-shift fix; and testing only Chrome, Edge, and Safari.
- **I wrote the key logic** by filling in 19 blanks across two features, and answered understanding questions (why `.slice(0, 10)`, why defaults are spread first, why the timer uses `Date.now()`).
- **I verified the AI instead of trusting it:** checked the `updated_at` date against my real commits and switched fields; questioned whether the font-weight change was necessary; tested every feature in DevTools and on my phone; and used Lighthouse to confirm each fix worked.
- **The AI's own mistakes are documented** above and in the technical documentation, not hidden.
- **The documentation drafts were reviewed and edited by me** before committing. The original drafts are in the evidence ZIP.
- **Commits with AI-assisted code** are marked with `Assisted-by: Claude (Opus 5.5)`.
- The full conversation and the intermediate AI artifacts are submitted in the AI evidence ZIP on Blackboard, not in this repository.
## Usage Log
 
| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|----|--------------|------|---------|----------------|--------------------------------------|
| C01 | Claude (Opus 5.5) | 2026-11-20 – 2026-11-21 | Full Assignment 3 session: planning, API choice, guided coding, code review, Lighthouse analysis, documentation | All files below | Wrote each phase's plan myself; filled in the code blanks; full conversation in `conversations/` |
| A01 | Claude (Opus 5.5) | 2026-11-21 | Omnia card skeleton: placeholder HTML, skeleton CSS, JS with 8 blanks | `index.html`, `css/styles.css`, `js/script.js` | Filled all 8 blanks; wrote the description and fallback date; added the missing `initGitHubCard()` call; switched `updated_at` to `pushed_at` and versioned the cache key. Verified with Slow 3G, Offline, a typo URL, and cache reloads in DevTools. |
| A02 | Claude (Opus 5.5) | 2026-11-21 | SVG banner template for the Omnia card | `assets/images/project-omnia.svg` | Pasted in the Omnia favicon shapes. Checked in light/dark mode and at phone width. |
| A03 | Claude (Opus 5.5) | 2026-11-21 | Project controls HTML/CSS and JS with 11 blanks (filter, sort, saved choices, timer) | `index.html`, `css/styles.css`, `js/script.js` | Filled all 11 blanks; chose the metadata, messages, and behaviour; fixed the missing function calls and the `updateProjects()` order. Verified each filter/sort combination, reload persistence, and the timer in Chrome. |
| A04 | Claude (Opus 5.5) | 2026-11-21 | Baseline Lighthouse summary | None (source for the Performance section) | Used as source data; wrote the Performance section in my own words. |
| A05 | Claude (Opus 5.5) | 2026-11-21 | Lighthouse fix suggestions (contrast variables, preconnect, favicon, image size, `min-height`) | `index.html`, `css/styles.css` | Wrote the colour variables and chose the pending-tag colours; chose option (b) for layout shift; fixed a missing `}` the review caught. Verified with 3 Lighthouse runs per device. |
| A06 | Claude (Opus 5.5) | 2026-11-21 | Before/after Lighthouse comparison | None (source for the Performance section) | Checked the numbers against my own Lighthouse reports. |
| A07 | Claude (Opus 5.5) | 2026-11-21 | README draft | `README.md` | reviewed and improved wording, filled in template blanks |
| A08 | Claude (Opus 5.5) | 2026-11-21 | Technical documentation draft | `docs/technical-documentation.md` | reviewed and improved wording, filled in template blanks |
| A09 | Claude (Opus 5.5) | 2026-11-21 | AI usage report draft (this file) | `docs/ai-usage-report.md` | reviewed and improved wording, filled in template blanks |
 
## Declaration
 
I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.
 
**Name:** Nadiah Albinali
**Student ID:** 202369710
**Date:** 21/11/2026
 