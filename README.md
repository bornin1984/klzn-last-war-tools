# KLZN Last War Tools

Static community calculators for Last War: Survival. No backend or login. Not affiliated with the publisher.

- [Tools directory](https://bornin1984.github.io/klzn-last-war-tools/)
- [Gold Zombie calculator](https://bornin1984.github.io/klzn-last-war-tools/gold-zombies/)

## Starting-stamina calculator

Enter **starting stamina**, choose **5–25 hunts per discovery** (default20), and choose a verified boss level (default55). Starting stamina defaults220. The graph shows total rewards for whole affordable actions, not proportional rewards per10 stamina. Discovery refunds are reused automatically.

The discovery setting is a deterministic scenario: one boss every N hunts, starting with no existing discovery progress. Actual drops are random. All kills are assumed successful, discovered bosses led by others are assumed defeated immediately, stamina items are claimed and redeemed immediately, and suitable bosses to lead remain available. Time, troop losses, reward caps, random loot and free joining are excluded.

### Strategies

1. **Hunt, then rally your own:** pay for each hunt. On discovery, prioritize leading your boss if affordable. Pay the leading cost before leader and discoverer rewards/refund arrive. If leading is unaffordable, spend any remaining affordable stamina hunting; leave the discovered boss unresolved without a payout.
2. **Hunt, then someone else rallies:** pay for hunts. Every discovered boss is assumed defeated by someone else; receive discoverer rewards and returned stamina, without leader or free-participant rewards.
3. **Leading rallies only:** lead affordable rallies against other players’ bosses. No hunt rewards, discoverer rewards or refunds. Leading is distinct from free joining.

### Stamina accounting and rewards

Let H be total hunts, R rallies you lead, D your discovered bosses successfully defeated, and S starting stamina:

`remaining = S − H × huntCost − R × leadingCost + D × discoveryRefund`

`reward = H × huntReward + R × leaderReward + D × discoveryReward`

Own/other leader costs and rewards remain independently editable. Only resolved discoveries earn refunds. An unresolved boss earns neither leader nor discovery rewards.

The graph and comparison table show the same six reward totals. The action summary shows hunts, rallies led, discoveries, resolved/unresolved bosses, gross spending, refunds and remaining stamina. Select a strategy in **Show the work** to inspect each action’s spending, refund, balance and cumulative rewards,50 rows per page. The source table remains editable. Switching levels resets source edits while preserving starting stamina and discovery setting. Portrait table views show a rotation cue; reduced-motion preferences are respected.

### Efficient calculation without fractional actions

`simulate()` in `gold-zombies/model.mjs` batches completed cycles and generates ledger rows on demand. It is checked against an independent one-action-at-a-time reference implementation.

For a hunting strategy, let N be hunts per discovery, A the upfront cost of one complete cycle (`N×huntCost + ownLeadingCost` for own rallies, `N×huntCost` for others), and C the discovery refund:

- Completed cycles: `q = 0` if `S < A`; otherwise `1 + floor((S − A)/(A − C))`.
- Remaining stamina after completed cycles: `S − q×(A−C)`.
- Additional hunts: `floor(remainingAfterCycles/huntCost)`.
- Total hunts: `q×N + additionalHunts`.
- Resolved discoveries: q; any additional discoveries remain unresolved.
- Leading only: `floor(S/otherLeadingCost)` rallies, without refunds.

These are whole counts with the initial upfront affordability check. A discovery alone does not trigger the reward: boss defeat and claim are required. Lazy ledger rows reconstruct the actual hunt → lead → claim sequence and its intermediate balances.

Inputs are whole nonnegative numbers up to1trillion; action costs must be positive. A refund at least as large as a discovery’s hunting cost is rejected because the others-lead strategy would recycle stamina indefinitely. Values that exceed JavaScript’s exact integer range are rejected instead of silently rounded. Zero starting stamina gives zero actions/rewards.

### Worked level55 examples

| Start | Hunts/discovery | Strategy | Hunts | Rallies led | Resolved discoveries | Medals | Remaining |
|---:|---:|---|---:|---:|---:|---:|---:|
| 10 | 20 | Leading only | 0 | 0 | 0 | 0 | 10 |
| 10 | 20 | Hunt + own | 1 | 0 | 0 | 10 | 0 |
| 120 | 10 | Hunt + own | 12 | 1 | 1 | 500 | 0 |
| 120 | 10 | Hunt + others | 14 | 0 | 1 | 440 | 0 |
| 120 | 10 | Leading only | 0 | 6 | 0 | 480 | 0 |
| 210 | 20 | Hunt + own | 21 | 0 | 0 | 210 | 0 |
| 220 | 20 | Hunt + own | 22 | 1 | 1 | 600 | 0 |

The210-stamina own-rally example has one unresolved discovered boss. No refund is credited.

## Source evidence and all defaults

| Reward | Each hunt | Level55 leader | Level55 discovery | Level70 leader | Level70 discovery |
|---|---:|---:|---:|---:|---:|
| Courage medals | 10 | 80 | 300 | 80 | 330 |
| Drone data | 1,300 | 1,600 | 1,600 | 1,900 | 1,900 |
| Hero XP | 263,000 | 2,700,000 | 2,700,000 | 3,100,000 | 3,100,000 |
| Iron | 268,000 | 825,000 | 825,000 | 942,000 | 942,000 |
| Bread | 268,000 | 825,000 | 825,000 | 942,000 | 942,000 |
| Gold | 268,000 | 1,000,000 | 1,000,000 | 1,200,000 | 1,200,000 |

Costs: hunt10; own/other leading20; discovery returns20 as two10-stamina items. User confirmed expanded K/M values as accurate. Other-boss leading defaults copy the verified leader rewards; free-participant loot is not modeled.

- [Level55 CSV](sources/gold-zombie-rewards.csv), [level70 CSV](sources/gold-zombie-level-70.csv).
- Actual hunt loot: [left](sources/zombie-kill-2026-10-22-loot-1.jpg), [right](sources/zombie-kill-2026-10-22-loot-2.jpg), dated October22,2026.
- [August5 target screen](sources/invading-zombie-august-5.jpg), year unspecified; independently shows268K hunt iron. Gold is clipped in this image.
- Level55 leading: [left](sources/boss-level-55-2026-10-16-loot-1.jpg), [right](sources/boss-level-55-2026-10-16-loot-2.jpg); [discovery/intel](sources/boss-level-55-intel.jpg).
- Level70 evidence: [screen1](sources/boss-level-70-screen-1.jpg), [screen2](sources/boss-level-70-screen-2.jpg), [screen3](sources/boss-level-70-screen-3.jpg), supplied October28,2026.
- [Original spreadsheet image](sources/gold-zombie-original.jpg) and [literal transcription](sources/gold-zombie-spreadsheet.csv). Its author/date are unknown. It contains168K hunt iron; later in-game evidence confirms268K. Original evidence is preserved unchanged.
- [Archived corrected level40 data](sources/gold-zombie-level-40.csv), unavailable as a website option.
- [Cited mechanics research](sources/mechanics-research.md): community guides, Reddit and an official-source check. No detailed publisher-certified numerical rulebook was found. User screenshots independently establish the55/70 rewards and real stamina items.

The original spreadsheet’s arithmetic correctly reproduced its own inputs, including the discovery credit. The previous site normalized completed-cycle rewards per10 net stamina and multiplied by a chosen amount. Those were long-run efficiencies, not starting-budget forecasts. Legacy `calculate()`/`forStamina()` helpers and their regression fixtures remain for archival verification; the live UI uses only `simulate()`.

## Development, checks and maintenance

Serve with `python3 -m http.server 8000`, then open http://localhost:8000/. Do not use file:// because modules and CSV loading require HTTP.

- Node20+: `npm test` runs historical mathematical fixtures and the new simulation suite.
- Browser setup: `npm ci` then `npx playwright install chromium`.
- Browser checks against the running local server: `npm run test:browser`.
- Use an installed Chromium with `CHROMIUM_PATH=/usr/bin/chromium npm run test:browser`.
- Set `BASE_URL=https://bornin1984.github.io/klzn-last-war-tools` to check a deployment.

Simulation tests cover504 independent-reference scenarios (both levels, every N5–25,12 starting balances), hand-worked examples, edited costs, accounting/ledger invariants, unsafe/free/self-funding inputs and huge lazy ledger pages. Browser checks cover both levels, representative discovery boundaries, budgets, graph/table agreement, pending bosses, ledger pagination, edits/reset, zero/invalid input, keyboard tabs and mobile layouts. Browser emulation is not physical-device certification.

### Adding a boss level (data only)

1. Copy an existing reward CSV into `sources/gold-zombie-level-80.csv` (80 is an example, not verified data). Replace the leader/discoverer values with verified rewards and confirm the hunt values. Keep six reward rows. The third column may be named `boss_rally` or `level_80_boss_rally`.
2. Add one entry to the `levels` array in [sources/gold-zombie-levels.json](sources/gold-zombie-levels.json):

```json
{
  "id": "80",
  "label": "80",
  "csv": "gold-zombie-level-80.csv",
  "evidence": [
    {"label": "Level 80 rewards", "file": "boss-level-80.jpg"}
  ]
}
```

3. Save the source screenshots alongside the CSV. Evidence is optional in the loader, but preserve it for review. Filenames are local to `sources/`; no directory prefix is needed. Change `defaultLevel` only if a different initial selection is desired.
4. Run `npm test` and `npm run test:browser` against a local server, then publish normally.

No calculator JavaScript, HTML dropdown, formulas, or switch statements need editing. The level selector, source download and evidence links are generated from the catalog. Stamina costs/refund continue using the shared editable defaults.

Validation requires six unique known reward names, four expected columns, and nonnegative whole reward values up to1trillion. Reward rows may be reordered. Missing fields, duplicates, bad numbers and unavailable CSVs exclude only the broken level; other levels keep working. If the configured default is unavailable, the first valid level becomes the default. If no levels are usable, the site displays a clear error. The tests validate every published entry and demonstrate a synthetic new level without changing application code.

Structure: homepage directory; shared directory CSS in `assets/`; calculator UI/model in `gold-zombies/`; evidence and CSVs in `sources/`; tests in `tests/`. The model is independent of the DOM. Never replace original evidence with corrected data. Add another tool in its own directory and link it from the homepage. Keep relative URLs for the GitHub project prefix, and retain versioned script/style URLs when deploying changed interfaces.

GitHub Pages publishes **main / (root)**; `.nojekyll` avoids unnecessary processing. `.github/workflows/qa.yml` runs checks. No runtime packages or backend are needed; Playwright is development-only.

Rotation icon: [Lucide smartphone](https://github.com/lucide-icons/lucide/blob/main/icons/smartphone.svg), [ISC license](assets/licenses/lucide.txt), self-hosted with CSS animation.
