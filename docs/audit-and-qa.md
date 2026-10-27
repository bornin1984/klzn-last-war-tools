# Gold Zombie audit and QA — 2026-10-27

## Audit result

The old algebra reproduced the original spreadsheet. Initial uncertainty about the parenthesized 20 was resolved: user gameplay confirmation and community reward documentation describe two 10-stamina items. Keep 20 as default net return, distinguish it from upfront stamina, and require a successful boss kill/claim.

The spreadsheet's 168K hunt iron is not a transcription error, but is contradicted by the user's August 5 target screen and October 22, 2026 actual kill report. Active data now uses 268K. Original screenshot and literal transcription remain intact. The two October 22 loot views independently establish all six hunt rewards.

Rally-only means leading others' bosses. Free joining with reduced loot is a different action. Boss rewards are level-40 source examples; no universal fixed discovery probability is claimed. See the cited research for source confidence and remaining game-version limits.

## Verification

- `npm test`: 23 passing tests. Six metrics, all three strategies at rates 5–10, with 0/20 refund; literal original totals; corrected iron; independent other-rally settings; invalid/zero inputs; percentage baselines; fractional range; numeric overflow.
- `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`: 138 passing checks on 375px, 768px and 1280px Chromium viewports. Chart values, range table and current table agree for each reward at rates 5–10. Input editing, reset, keyboard chart selection, blank fields, zero rewards, tiny-value winner ranking and page containment checked. No page JavaScript errors.
- `node --check gold-zombies/app.mjs` and `git diff --check`: passed.
- Mobile full-page screenshot inspected. This is browser emulation, not a physical phone test.
- Fresh independent reviewer: no critical or important issues. Two extreme numerical issues found (overflow, tiny distinct values marked tied); both reproduced with failing tests and fixed, with full suites then passing.

## Decisions

Plain HTML/CSS/ES modules and a single active CSV; no runtime dependencies or build pipeline. Playwright is a development-only dependency. All visualizations use the same pure calculation model. User edits are transient. No backend, storage, analytics or login.

All source attachments are preserved unmodified. Potential chest loot, event caps, troop costs, target availability, time and failed/expired discoveries are excluded and disclosed. The model measures long-run net stamina efficiency, not total game value.
