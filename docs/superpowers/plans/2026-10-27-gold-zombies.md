# Gold Zombie audit and implementation plan

Goal: ship an auditable, mobile-friendly static calculator and publish on GitHub Pages.
Authority: user's detailed task and permission to execute routine decisions without approval.
Architecture: static HTML/CSS, an independently tested pure ES module, and a small DOM controller. CSV is the single source of default rewards; immutable screenshot remains separate.

1. Preserve screenshot; audit every reward and total. Test regression fixtures for spreadsheet reproduction and zero-credit behavior at N=5..10, all metrics, percentages, invalid denominators and inputs.
2. Extract model into gold-zombies/model.mjs; default credit to 20 (user confirmed refund). Allow separate own/join costs and rewards (join defaults are inferred). Build responsive accessible controls, per-metric comparisons, pairwise percentages, chart and tables from the same model. Avoid invalid SVG paths when denominators fail.
3. Document evidence, mathematical audit, source limitations, conditional strategy winners and maintenance. Add browser checks at mobile and desktop sizes and a small CI workflow running Node tests.
4. Run tests, inspect mobile screenshot, review changes, commit, push main, configure Pages branch deployment and verify both public URLs plus live calculator interaction.

Review focus: zero baselines and costs; non-finite/blank/negative inputs; ties/flat charts; joins inferred from own-rally evidence; mobile table containment and keyboard access.
Progress: repository fully read (4 files); source transcription matches screenshot; initial credit uncertainty resolved by user and community guides. Hunt iron corrected to 268,000 per user, original 168,000 transcription preserved. Pages GET returns 404; repository admin access confirmed.
Ruling: user explicitly delegates routine design and publication; execute in fresh clone on audit-gold-zombies branch without further approval gates.

Implementation complete: source attachments preserved; active iron268K; independent review clean after two regression fixes; 23 model tests and138 browser checks pass. See docs/audit-and-qa.md. Publication and live verification follow.
