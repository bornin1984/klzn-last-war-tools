# Zombie Invasion mechanics research

Researched 2026-10-27. Updated after the user independently confirmed 268,000 hunt iron. The original spreadsheet image is separate evidence; none of the pages below is the spreadsheet's known origin. Community guides can be outdated or describe different servers/versions.

## Findings and confidence

| Question | Finding | Evidence status |
| --- | --- | --- |
| Is the 20 stamina real? | Yes: discoverer rewards include two 10-stamina items. Treat these as reusable stamina returned after the boss is defeated and rewards are claimed, rather than an immediate reduction in the hunt's upfront cost. | User explicitly confirms; independently corroborated by a detailed community reward guide [1]. |
| Hunt cost | 10 stamina per Invading/Gold Zombie. | Screenshot; corroborated by [1], [2]. |
| Lead a boss rally | 20 stamina whether the boss was discovered by you or another player. | Screenshot and community guides [1], [2]. |
| Join someone else's rally | Distinct from leading it: community sources report zero stamina and reduced rewards. | [1], [2]. The calculator's rally-only strategy must clearly mean **lead** rallies on other players' bosses. |
| Discoverer eligibility | The discoverer receives mailbox rewards when the boss is killed, even without joining its rally. | [2], [3], supported by Reddit discussion [4]. An un-killed boss does not generate the modeled payout. |
| Discovery frequency | Chance-based; no verified universal probability or guaranteed every-Nth-kill rule found. | [3]; Reddit users report long runs without spawns [5]. User's approximately 1 in 10 is an observation, not a hard guarantee. |
| Level 40 rewards | External community table agrees with the screenshot's level-40 boss resources, XP and drone data; its discoverer-medal progression gives 270 at level 40. | [1]; not independently certified by publisher documentation. |
| Hunt iron | Original screenshot says 168,000; external community table says 268,000. | Genuine source disagreement, not a transcription error. User subsequently checked the game and confirmed 268,000. Use 268,000 in the active reward CSV; preserve 168,000 in the separate original transcription. |
| Free participant rewards | Sources disagree on whether resources are half or 60% of a leader's. | [1] versus [2]; no claim of a precise participant payout is warranted. Free joins are outside this stamina-normalized three-strategy comparison. |

## Sources

### [1] Detailed community reward guide (Japanese author; English translation)

[すとれんじ, “About the Zombie Invasion / Zombie Bro,” August 7, 2024](https://note.com/11strange/n/ne26d074f2d58?hl=en).

Relevant sections: Invading Zombies; Defeat Rewards (Rally Leader); Victory Rewards (Rally Participants); Discoverer Rewards; Resource Acquisition Amounts.

Short direct quote: “the discoverer gets 20 AP back.”

The discoverer table shows two 10AP items. The level-40 row gives iron/food 735k, gold 936k, XP 2.2M, data 1.5k. Finder medals rise from 200 at level 5 by ten per five levels, consistent with 270 at level 40. Hunts cost ten and leaders twenty. It distinguishes zero-cost participants with reduced loot. Its hunt iron is 268k rather than the screenshot's 168k. This is an independent player's guide, not an official publisher statement.

### [2] Contemporary community cross-check

[Last War Game Online, “Zombie Invasion: A Gold Mine in Last War,” updated September 2026](https://www.lastwargame.online/en/zombie-invasion/).

The page explicitly identifies itself as an unofficial fan site. It documents ten-stamina hunts, twenty-stamina rally organization, zero-stamina participation, and finder mail even without participation. It calls participant rewards half the leader's, unlike [1]'s 60% resource statement. Use it to corroborate the leadership/participation distinction, not to settle the participant payout.

### [3] Community guide and reproduced rules

[Last War Tutorial, “Zombie Invasion”](https://www.lastwartutorial.com/zombie-invasion/).

This site describes itself as unofficial. It documents random boss spawning; finder mail when anyone defeats the discovered boss; level-dependent rewards; and an initial ten-minute alliance-only rally window. Its summoning-level section attributes information to customer support forwarded by a player. That attribution is secondary reporting and should not be presented as direct official confirmation of stamina or reward numbers.

### [4] Reddit strategy discussion

[r/LastWarMobileGame, “Best use of Stamina during Zombie Invasion?”](https://www.reddit.com/r/LastWarMobileGame/comments/1n80kj7/best_use_of_stamina_during_zombie_invasion/).

Players distinguish hunting, hosting boss rallies, free joining, and finder rewards; emphasize ensuring discovered bosses get defeated; and discuss approximately one spawn per ten kills. This is anecdotal corroboration, not a measured drop-rate study. Recommendations conflict because troop losses, boss levels, alliance strength and time constraints differ.

### [5] Reddit discovery-rate counterexamples

[r/LastWarMobileGame, “Zombie invasion/golden zombies,” February 21, 2025](https://www.reddit.com/r/LastWarMobileGame/comments/1iuq72b/zombie_invasiongolden_zombies/).

Players report 20–25 kills without a boss; proposed timing/grouping tricks are explicitly challenged for lack of evidence. Do not implement these theories or describe the discovery slider as a guaranteed schedule.

### [6] Official distribution-platform editorial and publisher search

[Google Play, “How Events work in Last War: Survival Game”](https://play.google.com/store/apps/editorial?hl=en_US&id=mc_games_editorialevergreen_events_in_last_war_survival_game_postinstall_fcp).

This Google Play editorial associated with the game confirms the broad event flow: defeat world-map zombies to uncover a boss. It does **not** specify stamina costs, discovery refunds, exact drop rates or level-40 payouts. It is a distribution-platform source, not a detailed publisher rulebook.

[Official Last War website](https://www.lastwar.com/) was checked; no readable detailed Zombie Invasion rulebook was available through the research tool. Targeted searches of official domains did not produce a direct official page establishing the numerical mechanics. Accordingly, numerical defaults are screenshot evidence corroborated by community sources and the user's gameplay confirmation, not labeled “officially verified.”

## Modeling consequences

- Subtract 20 returned stamina **once per successfully resolved discovered boss**, including when someone else leads the kill. Do not subtract it per hunt or again for leading the boss.
- Show gross stamina spent and returned stamina separately. Net-stamina efficiency assumes claimed stamina is reusable; users still need enough upfront stamina to complete actions.
- Strategy 2 means hunting plus finder rewards while another player **leads** the rally; no participant rewards are included. The player may be able to free-join for additional rewards, but that is a separate opportunity.
- Strategy 3 means **leading** others' bosses at 20 stamina and earning leader loot. Calling it merely “joining” would be mathematically wrong.
- Use average hunts per discovery as a sensitivity parameter. Do not claim 1/5 or 1/10 is an official fixed spawn probability.
- Six tracked rewards exclude random loot, leaderboard rewards, event-store conversion value, free participant loot, troop losses, travel/waiting time, boss availability and failed/expired bosses. Efficiency is conditional on successful kills, not a universal strategy recommendation.

## Additional primary evidence supplied by user

[In-game Invading Zombie screenshot](invading-zombie-august-5.jpg), photo header August 5 (year unspecified), level 10. Visible guaranteed rewards: 10 medals, 1.3K drone data, 263K XP, **268K iron**, 268K bread; cost 10 stamina. Gold is clipped beyond the horizontal reward area. This confirms the iron correction directly; it does not establish the level-40 boss or discovery payouts. Potential/random rewards are visible but excluded from the calculator. Original attachment preserved without edits.

[Kill report, loot left](zombie-kill-2026-10-22-loot-1.jpg) and [loot right](zombie-kill-2026-10-22-loot-2.jpg), timestamp **2026-10-22 15:50:12**, same battle report ID 1430091843144044982. Across both views: 10 medals, 1.3K drone data, 263K XP, 268K iron, 268K bread, 268K gold. These are direct observed kill rewards, strengthening the primary evidence for all six hunt values. They do not show stamina consumption or discovery/boss payouts. Additional chest loot is excluded rather than assigned an unsupported value. Both attachments preserved unmodified.
