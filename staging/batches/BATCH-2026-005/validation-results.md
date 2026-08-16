# Validation results — BATCH-2026-005

Completed 2026-08-15. All records remain staging-only and require named human review.

## Passed

- Source schema: 9 of 9 source proposals.
- Statement schema: 22 of 22 evidence statements.
- DOI validation: five asserted DOIs resolved by HTTPS GET; no guessed DOI was assigned to NIST AI 800-5.
- Source-version validation: nine exact versions have SHA-256 hashes and stable identifiers or official URLs.
- Duplicate detection: the OpenID PDF and arXiv v1 are retained as related renditions and are blocked from independent-evidence double counting.
- Methodology fields: all 23 required fields are populated for all nine sources; missing information is recorded as `not reported` or explicitly not applicable.
- Sample context: the response-synthesis sample gap is visible; all benchmark samples and populations are scoped.
- Statistics: seven rows include numerator status, denominator, sample, population, geography, dates, locator, unit, interval status, caveat, and reported/calculated status.
- PDF and locator review: all 22 statement locators passed; relevant tables, figures, axes, labels, footnotes, and versioned page numbers were visually checked.
- Funding and conflicts: one complete row per source; only one source contains explicit funding disclosures and no source contains a formal conflict statement.
- Corrections and retractions: AgentDojo v3 bug-fix update and NIST PDF metadata anomaly are flagged; no retractions identified.
- OFF crosswalk: nine explicit unmatched records against pinned Executive AI Research commit `d205a6b2e6f4`; no OFF ownership asserted.
- Rights: no PDFs, full text, tables, figures, or direct quotations staged.
- Analytical abstracts and separate evidence-quality dimensions: complete for all nine sources.

## Required shell gates

The repository data/provenance validators, staging-leak search, whitespace check, and targeted project tests are run separately and recorded in the final manifest/PR checks.
