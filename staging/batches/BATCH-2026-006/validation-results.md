# Validation results — BATCH-2026-006

Status: PASS on 2026-08-15. Named human review remains pending; these checks do not confer publication approval.

- PASS — 46 statement records conform to the canonical statement schema; all IDs are unique.
- PASS — All nine verified source records satisfy metadata, access, rights, canonical-ID, and author-linkage gates; one source is coded only through duplicate holds.
- PASS — Each record has one canonical statement type, an allowed evidence character, and an allowed factual-verification status.
- PASS — Joint authorship, role at source time, and organization at source time are explicit; no current role was substituted.
- PASS — Source URL, source-version hash, exact locator, batch ID, prompt ID, and prompt version are preserved in provenance.
- PASS — PDF page locators are within verified document lengths; HTML locators name stable sections; every cited PDF page was rendered and visually inspected.
- PASS — No paraphrase shares ten or more consecutive normalized words with its source; no direct quotation is retained.
- PASS — No exact or high-overlap statement duplicate was found; four OpenID/arXiv rendition duplicates are explicitly held.
- PASS — Statement decisions partition 46 accepted and four held candidates.
- PASS — The double-review sample includes six of 16 high-impact items (37.5%) and four of 30 normal items (13.3%); review completion remains pending.
- PASS — 85 proposed links connect statements to nine candidate-only ideas; no canonical proposition or stance was created.
- PASS — Attribution and locator review CSV files contain one row for every statement.
- PASS — Duration and book-edition checks are correctly not applicable.
- PASS — Canonical repository validators and audits for data, provenance, attributions, statements, propositions, book editions, source locators, rights, review status, publication, content, duplicates, concentration, and coverage.
- PASS — 24 tests across four test files.
- PASS — Whitespace validation and staging-isolation scan; no BATCH-2026-006 statement ID appears in canonical data or generated publication surfaces.
