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
| **Documentation** | Drafted the README, technical documentation, and this report from our session. I reviewed all three against my code and results, and rewrote the reflection sections of this report in my own words. |
 
## Benefits & Challenges
 
### Benefits
 
- Filling in the blanks helped me write the logic myself instead of pasting finished code. Working out each answer also made it easier to explain what the code does.
- The reviews caught bugs I might not have noticed quickly, such as the missing `}` that caused the CSS after `.btn-primary` to be nested inside it.
- The Lighthouse reports were long JSON files. Having the key results summarized, including the exact contrast ratio of 2.76:1, made it clear what needed attention.
- Planning before coding helped. Once I had chosen the card attributes and the single `updateProjects()` function, updating Omnia's sort date only required one line.
### Challenges
 
- **I had to verify the AI's suggestions.** It first recommended `updated_at` for the date, but the data showed that value was three days behind my latest commit, so I switched to `pushed_at`. It also said each font weight requires a separate download. Since only the weights used on the page are downloaded, that proposed change wasn't worthwhile.
- Some explanations were more complicated than necessary. Measuring the exact space needed for the layout shift in DevTools felt like too much effort, so I estimated it and checked the result with Lighthouse. The CLS score improved from 0.176 to 0.034.
- I twice added new functions but forgot to call them in `DOMContentLoaded`. Now I check the startup list whenever I add a feature.
## Learning Outcomes
 
- **`fetch()` and errors:** `fetch()` only rejects when a network error occurs. For HTTP errors such as 403 or 404, I need to check `response.ok`.
- **Caching:** I learned to save a timestamp with cached data and compare it with `Date.now()` to check whether the cache is still fresh. I also learned to change the cache key when the stored data's meaning changes, so visitors won't reuse outdated entries.
- **Default preferences:** In `{ ...DEFAULT_PREFS, ...saved }`, saved settings override the defaults, while any missing settings keep their default values. Reversing the order would cause the defaults to overwrite saved choices.
- **Timers:** I used `Date.now() - startTime` to calculate elapsed time because browsers can slow down `setInterval` in background tabs.
- **Sorting:** I learned how comparator return values control order, how `YYYY-MM-DD` dates can be sorted as strings, and how a title tie-breaker keeps cards with matching dates in a consistent order.
- **`appendChild()` and reordering:** Calling `appendChild()` on an element that's already in the page moves it, which lets the project grid be sorted.
- **Layout shift (CLS):** Content that appears after loading can push the page down. Reserving space with `min-height` helps prevent that shift.
- **Accessible colour contrast:** I learned about the 4.5:1 contrast minimum for normal text and used a CSS variable to adjust text colour on the accent for each theme.
- **Lighthouse results:** Scores can vary between runs, even when the code is unchanged. I ran each test three times and used the median score.
- **GitHub date fields:** `updated_at` changes when the repository's settings or description change, while `pushed_at` changes when code is pushed.
## Responsible Use & Modifications
 
- **I made the decisions:** choosing the GitHub API and showing only Omnia; using a placeholder card in the HTML; the category, level, and date for each project; my level messages; keeping the Coming Soon card outside the filters; saving filter choices; the Clear filters behaviour; the timer format; option (b) for the layout-shift fix; and testing only Chrome, Edge, and Safari.
- **I wrote the key logic** by filling in 19 blanks across two features, and answered understanding questions (why `.slice(0, 10)`, why defaults are spread first, why the timer uses `Date.now()`).
- **I verified the AI instead of trusting it:** checked the `updated_at` date against my real commits and switched fields; questioned whether the font-weight change was necessary; tested every feature in DevTools and on my phone; and used Lighthouse to confirm each fix worked.
- **The AI's own mistakes are documented** above and in the technical documentation, not hidden.
- **Documentation:** I reviewed all three AI drafts against my code and test results. I kept the wording of the README and technical documentation, and rewrote the Benefits & Challenges and Learning Outcomes of this report in my own words. The original drafts are in the evidence ZIP.
- **Commits with AI-assisted code** are marked with `Assisted-by: Claude (Opus 5.5)`.
- The full conversation and the intermediate AI artifacts are submitted in the AI evidence ZIP on Blackboard, not in this repository.
## Usage Log
 
| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|----|--------------|------|---------|----------------|--------------------------------------|
| C01 | Claude (Opus 5.5) | 2026-11-20 – 2026-11-21 | Full Assignment 3 session: planning, API choice, guided coding, code review, Lighthouse analysis, documentation | All files below | Wrote each phase's plan myself; filled in the code blanks; full conversation in `conversations/` |
| A01 | Claude (Opus 5.5) | 2026-11-21 | Omnia card skeleton: placeholder HTML, skeleton CSS, JS with 8 blanks | `index.html`, `css/styles.css`, `js/script.js` | Filled all 8 blanks; wrote the description and fallback date; added the missing `initGitHubCard()` call; switched `updated_at` to `pushed_at` and versioned the cache key. Verified with Slow 3G, Offline, a typo URL, and cache reloads in DevTools. |
| A02 | Claude (Opus 5.5) | 2026-11-21 | SVG banner template for the Omnia card | `assets/images/project-omnia.svg` | Pasted in the Omnia favicon shapes. Checked in light/dark mode and at phone width. |
| A03 | Claude (Opus 5.5) | 2026-11-21 | Project controls HTML/CSS and JS with 11 blanks (filter, sort, saved choices, timer) | `index.html`, `css/styles.css`, `js/script.js` | Filled all 11 blanks; chose the metadata, messages, and behaviour; fixed the missing function calls and the `updateProjects()` order. Verified each filter/sort combination, reload persistence, and the timer in Chrome. |
| A04 | Claude (Opus 5.5) | 2026-11-21 | Baseline Lighthouse summary | None (source for the Performance section) | Checked the numbers against my own Lighthouse reports; used as source data for the Performance section. |
| A05 | Claude (Opus 5.5) | 2026-11-21 | Lighthouse fix suggestions (contrast variables, preconnect, favicon, image size, `min-height`) | `index.html`, `css/styles.css` | Wrote the colour variables and chose the pending-tag colours; chose option (b) for layout shift; fixed a missing `}` the review caught. Verified with 3 Lighthouse runs per device. |
| A06 | Claude (Opus 5.5) | 2026-11-21 | Before/after Lighthouse comparison | None (source for the Performance section) | Checked the numbers against my own Lighthouse reports. |
| A07 | Claude (Opus 5.5) | 2026-11-21 | README draft | `README.md` | Reviewed against my code and test results; kept the draft wording. |
| A08 | Claude (Opus 5.5) | 2026-11-21 | Technical documentation draft | `docs/technical-documentation.md` | Reviewed against my code and test results; kept the draft wording. |
| A09 | Claude (Opus 5.5) | 2026-11-21 | AI usage report draft (this file) | `docs/ai-usage-report.md` | Rephrased Benefits & Challenges and Learning Outcomes in my own words (same points as the draft); checked every statement against what I actually did. |
| A10 | Claude (Opus 5.5) | 2026-11-21 | Formatting pass on my rewritten report | `docs/ai-usage-report.md` | Claude fixed heading levels and bullet formatting, and corrected 3 statements that contradicted my log (Documentation row, Documentation bullet, A04). Reviewed each change before committing. |
 
## Declaration
 
I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.
 
**Name:** Nadiah Albinali
**Student ID:** 202369710
**Date:** 21/11/2026
 