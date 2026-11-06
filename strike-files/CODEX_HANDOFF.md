# Codex handoff — KLZN Strike Files (2026-11-06)

## Start here

- Repository: https://github.com/bornin1984/klzn-last-war-tools
- Work branch: `feature/strike-files-rone`
- Open pull request (NOT merged): https://github.com/bornin1984/klzn-last-war-tools/pull/1
- Existing production tool: `gold-zombies/` (keep intact).
- Homepage navigation: `index.html` (modified on feature branch).
- New dashboard: `strike-files/index.html` (created on feature branch).
- **Transcribed roster and squad data: `strike-files/rone-2247.json` (created on feature branch).** This is the main machine-readable source of current draft data.

## User's intent

Extend the existing KLZN Last War website with a second navigation option, **Strike Files**, alongside **Gold Zombies**. First and only strike file needed now: **[ROnE] RiseAsOne, server 2247**. Do not spend time generalizing for multiple alliances yet.

Display:
1. HQ distribution as a pie chart, with **counts and percentages** for all alliance members.
2. Full alliance roster with player name, HQ level, alliance rank, total player power, **Best Squad**, and **Squad 1, Squad 2, Squad 3, Squad 4** in separate columns.
3. Default sort: **Best Squad descending**, with unknowns last. Support alternative sorts and search.
4. **Unknown squad values must display `?`, not `—` or 0.** Best Squad is the maximum *observed* squad power for the player, not necessarily their true maximum.
5. Ignore plunder/resource inventory entirely.
6. When a scout shows **reinforcements**, read the secondary player name: that formation belongs to the **reinforcing player**, not the owner of the base being scouted. Do not track which base was defended, as that changes before Buster Day.
7. The data is incomplete; never interpret an unobserved squad as absent or zero.

## Current data / counts

- 79 players; alliance power 5,601,391,779 (~5.60B); leader Leo Plov.
- HQ counts verified against the JSON transcription: HQ30 24, HQ29 21, HQ28 10, HQ27 12, HQ26 6, HQ25 3, HQ24 2, HQ19 1. Total 79.
- Alliance ranks in JSON: R5 1, R4 8, R3 35, R2 14, R1 21.
- 13 players currently represented with observed squad powers (including a reinforcement attributed to VerSashi). The other players have empty `squads` arrays, which mean unknown, not zero.
- Original screenshots were supplied **in the ChatGPT conversation**, not committed as image assets to GitHub. The JSON is a manual transcription from screenshots and previous chat analysis, **not authoritative raw screenshots**. If screenshot-level verification is required, ask the user to attach them in Codex or retrieve the conversation's attachments if supported.

## Critical data-integrity TODO — do this before polishing

**The current JSON `squads` field is a compact array of observed values, not a trustworthy Squad 1–4 positional map.** In the prior chat, Elf boy was recorded as Squad 1 = 22.32M and Squad 3 = 15.64M (Squad 2 unknown). However, the JSON currently stores `[22.32,15.64]`, and the page incorrectly renders 15.64 as Squad 2. Likewise, formations identified through reinforcements (e.g. VerSashi 15.21M, END NACK 17.88M) may not have a known squad slot. **Do not invent slot numbers.**

Recommended migration: represent `squads` as an object with keys `1`, `2`, `3`, `4` and null/omitted for unknown; keep `unassignedObservedSquads` for powers whose squad number is not established. Calculate Best Squad from *both* numbered and unassigned observations. Review the original screenshot evidence where possible. For the table, unknown slots show `?`. If a squad power is known but its slot is not, show it as an unassigned observation in the player detail rather than incorrectly labeling it S1.

Also check whether the 13 scouted players and power figures were transcribed correctly, and whether any other reinforcements in screenshots were overlooked. The current list is a working draft, not verified exhaustive scouting.

## Current implementation status

- Feature branch created and three files changed/added:
  - `index.html` — adds a Strike Files directory card.
  - `strike-files/index.html` — static HTML/JS dashboard, HQ canvas pie, sortable/searchable roster.
  - `strike-files/rone-2247.json` — all 79 player records and currently transcribed observed squad powers.
- A follow-up commit added Squad 1–4 columns and `?` display for unknown values. The positional data issue above remains.
- PR #1 is open and **not merged**. The live GitHub Pages website is not updated by these changes.
- No claim of completed browser/visual QA. Check mobile layout, loading, sorting, chart labels, and actual deployment after data correction.

## Suggested next steps for Codex

1. Checkout `feature/strike-files-rone` and inspect `strike-files/index.html`, `strike-files/rone-2247.json`, `assets/site.css`, and existing `gold-zombies/`.
2. Correct the squad schema to preserve unknown slots and distinguish own formations vs reinforcements attributed to other players. Validate against original screenshots if available.
3. Ensure all 79 members are visible in the roster and default sorting is based on highest observed squad, with unknowns last.
4. Improve mobile horizontal table usability and test the pie chart/counts/percentages.
5. Show the user a visual preview rather than asking them to interpret a PR. Merge/deploy only when approved.

## Explicit squad-number transcription (millions of power)

**Required:** Squad 1, Squad 2, Squad 3, and Squad 4 are four distinct fields. Do not compress observed powers into a positional array, reassign a power to a different slot, or infer that the strongest formation is Squad 1. A `?` means not confirmed in the screenshot/transcription, NOT zero. These positions reproduce the earlier in-chat scouting table, pending reinspection of screenshots.

| Player | Squad 1 | Squad 2 | Squad 3 | Squad 4 | Other observed reinforcement belonging to player (slot unconfirmed) |
|---|---:|---:|---:|---:|---|
| Trojan zzz | 25.38 | ? | ? | ? | ? |
| END NACK | 24.01 | ? | ? | ? | 17.88 |
| NKS Navigator | 23.78 | 18.36 | ? | ? | ? |
| King Omboo | 22.96 | 16.35 | 15.38 | 3.30 | ? |
| Kaifong22 | 22.56 | ? | ? | ? | ? |
| Gaijin | 22.48 | 12.14 | ? | ? | ? |
| Elf boy | 22.32 | ? | 15.64 | ? | ? |
| CALLMEBO | 22.21 | 16.12 | 13.48 | 10.33 | ? |
| jendral ganda juve | 22.09 | 16.66 | 16.43 | 12.13 | ? |
| RANAKAPUTRA | 21.81 | ? | ? | ? | ? |
| Milkow | 21.32 | ? | ? | ? | ? |
| Komandan Hansipp | 17.97 | 13.06 | 11.48 | 11.08 | ? |
| VerSashi | ? | ? | ? | ? | 15.21 |

**Crucial:** END NACK's 17.88M reinforcement and VerSashi's 15.21M reinforcement are attributed to those *players*, not to the bases where observed. Their exact Squad 1–4 slot is not established by the existing chat transcription. The original screenshots may show the squad number: inspect them and fill in the proper slot. If not legible, leave the numbered slot as `?` and retain the power as an unassigned observed formation. Likewise verify each numbered slot above against the screenshot before asserting it as confirmed.

The current JSON still contains compact `squads` arrays; **they are not authoritative positional data**. Migrate the JSON to explicit slots and update the UI. A correct default sort uses the maximum observed power from numbered squads *and* unassigned observed reinforcements. Keep `?` for all unknown slots. Also capture tank/air/missile classification per squad if heroes are legible, otherwise Unknown.

## Known observations from previous chat (millions of power)

Trojan zzz 25.38; END NACK 24.01 (also observed reinforcing with 17.88); NKS Navigator 23.78 and 18.36; King Omboo 22.96 / 16.35 / 15.38 / 3.30; Kaifong22 22.56; Gaijin 22.48 / 12.14; Elf boy S1 22.32, S3 15.64; CALLMEBO 22.21 / 16.12 / 13.48 / 10.33; jendral ganda juve 22.09 / 16.66 / 16.43 / 12.13; RANAKAPUTRA 21.81; Milkow 21.32; Komandan Hansipp 17.97 / 13.06 / 11.48 / 11.08; VerSashi 15.21 observed as reinforcement (squad slot unknown).

The squad values above are prior assistant transcriptions; preserve uncertainty and validate before treating them as verified game facts.
