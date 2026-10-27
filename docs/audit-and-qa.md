# Gold Zombie audit and QA — 2026-10-27

## Audit result

The old algebra reproduced the original spreadsheet. Initial uncertainty about the parenthesized 20 was resolved: user gameplay confirmation and community reward documentation describe two 10-stamina items. Keep 20 as default net return, distinguish it from upfront stamina, and require a successful boss kill/claim.

The spreadsheet's 168K hunt iron is not a transcription error, but is contradicted by the user's August 5 target screen and October 22, 2026 actual kill report. Active data now uses 268K. Original screenshot and literal transcription remain intact. The two October 22 loot views independently establish all six hunt rewards.

Rally-only means leading others' bosses. Free joining with reduced loot is a different action. Boss rewards are level-40 source examples; no universal fixed discovery probability is claimed. See the cited research for source confidence and remaining game-version limits.

## Verification

- `npm test`: 25 passing tests. Six metrics, all three strategies at rates 5–10, with 0/20 refund; literal original totals; corrected iron; independent other-rally settings; invalid/zero inputs; percentage baselines; fractional range; numeric overflow.
- `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`: 249 passing checks on 375px, 768px and 1280px Chromium viewports. Chart values, range table and current table agree for both level 40/55 presets and each reward at rates 5–10. Input editing, reset, keyboard chart selection, blank fields, zero rewards, tiny-value winner ranking and page containment checked. No page JavaScript errors.
- `node --check gold-zombies/app.mjs` and `git diff --check`: passed.
- Mobile full-page screenshot inspected. This is browser emulation, not a physical phone test.
- Fresh independent reviewer: no critical or important issues. Two extreme numerical issues found (overflow, tiny distinct values marked tied); both reproduced with failing tests and fixed, with full suites then passing.

The subsequent level55 leader and intel screenshots complete a second dataset: 80/300 medals, 20 returned stamina, 1.6K data, 2.7M XP, 825K iron/bread and 1.0M gold. Level55 is the default, level40 remains selectable. Expanded K/M values are confirmed accurate by the source player; switching presets resets edits.

## Decisions

Plain HTML/CSS/ES modules and a single active CSV; no runtime dependencies or build pipeline. Playwright is a development-only dependency. All visualizations use the same pure calculation model. User edits are transient. No backend, storage, analytics or login.

All source attachments are preserved unmodified. Potential chest loot, event caps, troop costs, target availability, time and failed/expired discoveries are excluded and disclosed. The model measures long-run net stamina efficiency, not total game value.

GitHub Actions initially selected Ubuntu26.04 via ubuntu-latest, unsupported by pinned Playwright1.58.2. The QA runner is pinned to Ubuntu24.04 for compatible browser dependencies. Publication API returned HTTP403 (integration lacks Pages-setting permissions); main was successfully pushed. The user subsequently enabled main / root in Settings → Pages.

## Public deployment verification

GitHub Pages is built, public and HTTPS-enforced at https://bornin1984.github.io/klzn-last-war-tools/ and /gold-zombies/. Both routes return HTTP200. GitHub Calculator QA run40580544578 and Pages deployment40580647056 completed successfully.

25 model tests pass. All249 browser checks also pass against published content at phone375px, tablet768px and desktop1280px. Chromium in this sandbox rejected the environment interception certificate even after importing the supplied CA; the final live-content browser run used a temporary local bridge that fetched each remote file with Python HTTPS certificate validation enabled. No site assets were substituted or cached locally by the bridge. This verifies published functionality in mobile emulation, not a physical phone or direct Chromium TLS path. Separate verified-HTTPS downloads confirm both HTML pages, both scripts, CSS and both datasets match the tested repository byte-for-byte. The mobile screenshot was inspected.

## Compact graph/table redesign

User feedback supersedes the previous presentation: remove prose sections and cards; use a single compact Graph / Data table interface. Shared5–10 slider defaults10. Graph shows three horizontal bars for a selected reward; table tab shows the same six-reward comparison plus editable source/stamina values. Long documentation remains in README; evidence links are tucked into the table footer. Both55/40 presets and all source artifacts are retained.

Verification:25 unchanged model tests and267 browser checks pass across375/768/1280 widths. Browser assertions cover all6 metrics ×6 rates ×2 presets, source cells, correct bar proportions, shared slider updating table, keyboard tabs, editing/reset, blank-cell validation and phone viewport containment. Graph fits the900px-high phone test viewport without scrolling. Desktop/mobile screenshots inspected. Independent reviewer found no important functional or mathematical defects.
