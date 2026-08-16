# Validation results — BATCH-2026-003

Run date: 2026-08-15  
Branch: `analysis/books-governed-agent-identities-BATCH-2026-003`  
Overall machine result: **PASS with two documented editorial warnings**  
Human approval: **not performed**

## Batch-specific validation

Command: `node --import tsx scripts/validate-book-analysis-batch.ts BATCH-2026-003`

- PASS — 2 work, 2 exact-edition, 2 canonical-source, 36 statement, and 16 proposition-candidate records conform to their JSON schemas.
- PASS — batch is limited to two long or dense books and matches the resolved work-edition pairs.
- PASS — access gate covers title linkage, author attribution, publisher, publication date, format, pagination or stable locator system, lawful access basis, access date, rights, and reproducibility hashes.
- PASS — each book has 18 source statements, inside the required 8–20 range.
- PASS — all statement links resolve to the exact source and edition.
- PASS — PDF page ranges fall inside the 194-page edition; HTML locators include an official chapter file and stable section anchor.
- PASS — direct-quote count is 0; quotation-length and rights checks pass.
- PASS — no exact or near-duplicate statement paraphrases were detected.
- PASS — all 16 proposition candidates are distinct, evidence-linked, staging-only, and human-pending.
- PASS — both analyses contain all 26 required sections and contain 3,026 and 2,780 words respectively.
- PASS — cross-analysis near-duplicate prose check passes.
- PASS — review worksheet covers all 36 statements.
- PASS — 15/36 statements (41.7%) received an independent second pass, exceeding 20% and covering every flagged high-impact, criticism, and change claim. Four sampled statements were corrected for locator fidelity and then passed replay.
- PASS — all mandatory artifacts exist; six later-author and eight counterargument, qualifying, updating, or extending sources are recorded.
- PASS — every schema entity includes BATCH-2026-003 provenance.
- PASS — no record is human-approved or published.
- PASS — no BATCH-2026-003 identifier appears in production data, content, docs, or exports.

Warnings:

- Direct quotations were intentionally avoided. Exact locators support replay of original neutral paraphrases.
- Every proposition candidate begins with one-book support and therefore carries an ownership-concentration warning. Independent evidence is required before promotion.

## Repository validation

- PASS — canonical data validation.
- PASS — provenance, attribution, statement, proposition, book-edition, locator, rights, review-status, publication, and content validators.
- PASS — duplicate, source-concentration, and coverage audits.
- PASS — lint.
- PASS — Astro/TypeScript check: 0 errors, 0 warnings.
- PASS — test suite: 4 files and 24 tests.
- PASS — production static build and post-build export generation.
- PASS — whitespace/error-marker check (`git diff --check`).

The production validators correctly report zero staged statements and propositions because repository architecture excludes staging from public output. The batch-specific validator covers the staged records directly.

## Reproducibility anchors

- *Solving the Bottom Turtle* official PDF SHA-256: `8353e3cf6fb8859ff34b0a43fe8146d7580dd32c9ace863c1a4758440f898fcb`
- *Building Secure and Reliable Systems* official HTML manifest hash: `ae702b4e64364217f179317b4a46de6a5e7c51045a79efa67522245d76667e16`
- *Building Secure and Reliable Systems* normalized complete-text hash: `6bf5050c08be0bced81767ac14bd9b3303e34b3efb667806b3c9e9d6b0ed8cf1`
