# KLZN Last War Tools

Public, mobile-first strategy calculators for **Last War: Survival**. Static HTML, CSS and JavaScript; no backend, accounts, runtime packages or build step. Independent community project, not affiliated with the publisher.

**Live directory:** https://bornin1984.github.io/klzn-last-war-tools/

**Gold Zombie calculator:** https://bornin1984.github.io/klzn-last-war-tools/gold-zombies/

## Gold Zombie strategies

1. **Hunt + own rally:** hunt until you discover a boss, lead its successful rally, claim both leader and discoverer rewards.
2. **Hunt + others rally:** hunt until discovery; someone else leads and defeats that boss. Claim discoverer rewards; no leader or participant loot is counted for you.
3. **Rally others only:** **lead** rallies against bosses other players discovered. Earn leader rewards; you receive neither their discovery reward nor their stamina items.

**Leading is different from joining.** Community guides describe joining someone else's rally as free with reduced rewards. Free participant loot is outside this three-strategy model; finite rewards per stamina cannot be defined for an action costing zero stamina. Players can combine free joins with hunting. “Others rally” assumes you don't join your discovered boss; no participant rewards are added.

## Source evidence

- [Original screenshot](sources/gold-zombie-original.jpg), preserved byte-for-byte from the user's attachment. Author, original date, server and version unknown. It contains five hunt rows, a level-40 boss row, discovery rewards and two derived comparisons.
- [Original transcription](sources/gold-zombie-spreadsheet.csv): literal reward values from that image, including **168,000 hunt iron**. This remains separate from the corrected active data.
- [In-game screenshot, August 5](sources/invading-zombie-august-5.jpg): user-supplied level-10 Invading Zombie screen, year unspecified. Directly shows 10 stamina, 10 medals, 1.3K drone data, 263K XP, 268K iron and 268K bread. Gold is outside the visible horizontal reward area, so this image does not independently verify gold. Potential rewards are excluded from this model.
- [October 22, 2026 kill report, left view](sources/zombie-kill-2026-10-22-loot-1.jpg) and [right view](sources/zombie-kill-2026-10-22-loot-2.jpg): two horizontal loot views of the same battle report (ID 1430091843144044982). Together they directly confirm all six active hunt rewards, including 268K gold and iron. Extra chest loot is visible but is outside the six-resource comparison. Neither view establishes the discovery or boss reward. Original images are preserved unchanged.
- [Active calculator rewards](sources/gold-zombie-rewards.csv): **268,000 hunt iron**, after the user independently checked and corrected this value. The August 5 in-game screenshot and a community reward guide corroborate 268,000. Every other reward agrees with the original image.
- [Cited mechanics research](sources/mechanics-research.md): detailed community guides, Reddit discussions, Google Play editorial and an official-site check, with evidence limits and conflicting source details.

### Evidence status

**Confirmed against the image:** all transcribed values, the 10-stamina hunt, 20-stamina boss rally, parenthesized `(20)` discovery entry, and arithmetic of its original totals.

**User-confirmed gameplay and community corroboration:** the discovery reward genuinely includes **20 stamina**, paid as **two 10-stamina items after the boss is defeated and rewards claimed**. This is a real reward, not merely an accounting convention. It is subtracted once per discovery in long-run **net** stamina. Players still need upfront stamina; the model assumes the returned items are redeemed. The user's in-game check corrects hunt iron to 268,000.

**User observation:** approximately ten Gold Zombies per discovered boss. The spreadsheet uses five. Neither is an official guaranteed drop rate. The slider allows 5–10 in 0.1 increments to express averages.

**Community evidence, not publisher-certified numerical rules:** leading others' bosses costs twenty, joining is free, and the discoverer receives mail when others kill the boss. No detailed official numerical rulebook was located. Community guides disagree on participant loot fractions, which are not modeled.

### All active source data

| Event | Stamina spent | Stamina returned | Courage medals | Drone data | Hero XP | Iron | Bread | Gold |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Gold Zombie kill | 10 | 0 | 10 | 1,300 | 263,000 | 268,000 | 268,000 | 268,000 |
| Own boss rally led, level 40 | 20 | 0 | 80 | 1,500 | 2,200,000 | 735,000 | 735,000 | 936,000 |
| Successful discovery, claimed | 0 | 20 | 270 | 1,500 | 2,200,000 | 735,000 | 735,000 | 936,000 |
| Other boss rally led | 20 | 0 | 80 | 1,500 | 2,200,000 | 735,000 | 735,000 | 936,000 |

Other-boss rewards initially copy the own-boss row; the screenshot has no separate other-boss row. Cost and rewards are independently editable to accommodate different boss levels or mechanics. The CSV stores hunt, own boss and discovery rewards; the other boss defaults are explicitly inferred by the model.

## Mathematical audit

The prior formulas were algebraically consistent with the spreadsheet and its real refund; the initial uncertainty about that refund was resolved by the user and external community evidence. The screenshot's source iron value, rather than its transcription, required correction. The prior implementation also lacked percentage comparisons and cycle totals, silently converted invalid fields to zero, omitted chart y-axis values, produced invalid SVG points for nonpositive denominators, and gave no distinction between leading and free joining. Those are addressed.

At five hunts, the original source totals reproduce exactly:

| Strategy | Net stamina | Medals | Drone data | XP | Iron | Bread | Gold |
|---|---:|---:|---:|---:|---:|---:|---:|
| Hunt + own rally | 50 | 400 | 9,500 | 5,715,000 | 2,310,000 | 2,810,000 | 3,212,000 |
| Hunt + others rally | 30 | 320 | 8,000 | 3,515,000 | 1,575,000 | 2,075,000 | 2,276,000 |

The original rounded per-10 values are correct, including 106.666… → 107 medals for others rallying. Correcting hunt iron adds `N × 100,000` iron to each hunting cycle; at N=5 the corrected iron totals are **2,810,000** and **2,075,000**. The untouched screenshot and original CSV retain the original evidence.

## Formulas

For each reward independently:

- `N`: average hunts per discovered boss, 5–10.
- `H`, `R`, `J`: stamina per hunt, own boss rally, other boss rally.
- `C`: claimed discovery stamina, default 20.
- `G`, `B`, `O`, `D`: hunt, own leader, other leader and discoverer rewards.

| Strategy | Reward per cycle | Gross stamina spent | Net stamina | Reward per 10 net stamina |
|---|---|---|---|---|
| Hunt + own rally | `N×G + B + D` | `N×H + R` | `N×H + R − C` | `10×(N×G+B+D)/(N×H+R−C)` |
| Hunt + others rally | `N×G + D` | `N×H` | `N×H − C` | `10×(N×G+D)/(N×H−C)` |
| Rally others only | `O` | `J` | `J` | `10×O/J` |

Percentage of A relative to B: `100 × (A/B − 1)`. Both zero is displayed as 0%; a positive value relative to zero is N/A. Nonpositive net stamina or numerical overflow yields N/A and is excluded from best-value rankings and chart lines. Blank, negative, non-finite or >1 trillion assumptions produce a visible validation message. Zero input costs are allowed for exploration but do not create infinite efficiency. Comparisons use full precision, with a relative 1e-10 tolerance for ties; formatting rounds only the display.

The chart samples every 0.1 hunts, marks every integer rate, uses a zero y-axis baseline, and shares the same pure calculation module as both result tables. No unlike rewards are summed into an arbitrary score.

### Which strategy wins?

With corrected defaults and the 20-stamina reward:

- **Medals, drone data, iron and bread:** hunt and let others lead throughout N=5–10.
- **Hero XP:** hunt and let others lead below approximately **5.257** hunts/discovery; lead others' bosses above that.
- **Gold:** hunt and let others lead below **9.36**; lead others' bosses above that.
- At either exact threshold all three strategies tie for that reward.

With identical own/other leader costs and rewards, own-rally efficiency is a stamina-weighted average of the other two strategies (when both component costs are positive). It therefore cannot be the unique efficiency winner. Editing the separate rally costs/rewards can change that. For defaults, each finite break-even follows the expression below. A nonpositive denominator means no positive crossing and hunting is favored with these positive rewards.

`N_break_even = (R×D + B×C) / (B×H − R×G)` when `O=B` and `J=R`.

These are stamina-efficiency statements, not universal recommendations. The model assumes successful kills, collected discoverer rewards, no relevant daily caps, and linear repeats. Time, troops, healing, expired bosses, random loot, leaderboard rewards, free joins and boss availability are excluded.

## Development and QA

Serve without any install:

```sh
python3 -m http.server 8000
# Open http://localhost:8000/
```

Do not open with `file://`: ES modules and CSV fetch need HTTP.

Node 20+ tests (no installation required):

```sh
npm test
```

23 model tests include independent fixtures at N=5,6,7,8,9,10 with refunds 0 and 20 for all six rewards and three strategies; literal screenshot totals; corrected iron; separate other-rally inputs; invalid denominators; zero rewards; bad inputs; ties/zero percentage baselines; fractional range consistency; subnormal stamina overflow.

Browser tests (development dependencies only):

```sh
npm ci
npx playwright install chromium
# Start the local server in another terminal.
npm run test:browser
# Optionally use an installed browser:
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
# Or verify deployment:
BASE_URL=https://bornin1984.github.io/klzn-last-war-tools npm run test:browser
```

Checks cover 375px, 768px and 1280px viewports, directory navigation, all 6 metrics × 6 integer discovery rates, chart/table numerical agreement, keyboard chart selection, edits, reset, invalid fields and zero rewards. Browser testing is mobile emulation, not physical-device certification.

## Structure and maintenance

- `index.html`: directory. Add a descriptive link when a calculator is ready.
- `assets/site.css`: shared responsive design, no font or chart CDN.
- `gold-zombies/index.html`: calculator content, controls and evidence labels.
- `gold-zombies/model.mjs`: pure math, validation and chart range; no DOM or display rounding.
- `gold-zombies/app.mjs`: CSV loading, inputs, comparison tables and SVG chart.
- `sources/`: original evidence, original transcription, corrected data and cited research.
- `tests/`: Node mathematical regression tests and Playwright browser checks.

For another tool, add `<tool-name>/index.html`, keep its model separate, link from the homepage and document its evidence and assumptions. Use relative URLs so all assets work under the GitHub project prefix. Do not overwrite original evidence when correcting defaults: record the reason and add regression fixtures. Updating active CSV values changes runtime defaults without editing JavaScript; update documentation and independent test fixtures intentionally.

## Publication

GitHub Pages serves **main / (root)**. `.nojekyll` disables unnecessary processing; no build system is required. Pushes to main trigger GitHub's Pages deployment. `.github/workflows/qa.yml` runs model and browser checks. The test dependencies are not used by the published site.

To configure manually if needed: Repository **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**. Do not choose `/docs`.
