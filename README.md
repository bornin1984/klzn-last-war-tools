# KLZN Last War Tools

Community-made tools for Last War: Survival. Not affiliated with the publisher.

## Gold Zombie Strategy Calculator

[Open the calculator](gold-zombies/) · [Raw source data](sources/gold-zombie-rewards.csv)

This calculator compares three approaches:
1. Hunt Gold Zombies and rally your own discovered boss.
2. Hunt Gold Zombies and have someone else rally your discovered boss.
3. Rally other players' bosses exclusively.

The discovery-rate slider varies from **one boss per 5 to one boss per 10 Gold Zombies**. A user observed approximately one discovery per ten kills, rather than the five kills used in the original screenshot.

## Original source

The source was a user-supplied screenshot of a spreadsheet with two sections: **Rallying Your Own Boss** and **Others Rallying Your Boss**. Its author and original publication date are unknown. The screenshot itself is **not yet included in this repository**; it must be uploaded separately as `sources/gold-zombie-original.jpg`. The values transcribed from it are stored in [sources/gold-zombie-rewards.csv](sources/gold-zombie-rewards.csv).

| Reward | Each Gold Zombie | Level 40 boss rally | Discovery reward |
|---|---:|---:|---:|
| Courage medals | 10 | 80 | 270 |
| Drone data | 1,300 | 1,500 | 1,500 |
| Hero XP | 263,000 | 2,200,000 | 2,200,000 |
| Iron | 168,000 | 735,000 | 735,000 |
| Bread | 268,000 | 735,000 | 735,000 |
| Gold | 268,000 | 936,000 | 936,000 |

The screenshot assigns **10 stamina per Gold Zombie**, **20 stamina per boss rally**, and shows **(20)** in the discovery-reward stamina column. The original table calculates the hunt + own rally total as 50 stamina for five Gold Zombies, and hunt + others rally as 30 stamina. This is interpreted in the calculator as a 20-stamina discovery credit, but **whether that represents an actual in-game refund is unverified**. Users can set the credit to zero.

## Calculation methodology

Let N = Gold Zombies killed per boss discovered, H = stamina per Gold Zombie, R = stamina per boss rally, C = discovery stamina credit, G = reward per Gold Zombie, B = boss rally reward, D = discovery reward.

All three formulas return **reward per 10 net stamina**:

- **Hunt + own rally:** `10 × (N×G + B + D) / (N×H + R − C)`
- **Hunt + others rally:** `10 × (N×G + D) / (N×H − C)`
- **Rally only:** `10 × B / R`

These formulas assume that the player collecting the discovery reward receives it even if another player rallies the boss; that boss-rally rewards are earned by the player doing the rally; and that rewards scale linearly over repeated cycles. These assumptions should be checked against actual gameplay.

## Review checklist for Codex

- Verify the source image transcription and whether the parenthesized 20 stamina is a real refund, accounting convention, or something else.
- Check that boss discovery and rally rewards are attributed to the correct players.
- Test every metric at discovery rates 5, 6, 7, 8, 9, and 10.
- Test zero discovery credit, unusual stamina settings, and division-by-zero safeguards.
- Check whether the screenshot's Gold Zombie kill rewards apply to hunting or to rallies joined by other players.
- Validate mobile layout, accessibility, chart scaling, and GitHub Pages paths.
- Avoid presenting efficiency winners as universally optimal without accounting for availability, time, and event constraints.
