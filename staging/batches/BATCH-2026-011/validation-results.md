# Validation results — BATCH-2026-011

- PASS — required outputs: 18 required files present
- PASS — candidate batch size: 60 candidates is within the requested 50–80 range
- PASS — candidate IDs: all IDs are unique
- PASS — duplicate URLs: no duplicate canonical URL inside the batch
- PASS — source identity URLs: all candidate URLs use HTTPS
- PASS — existing-content overlap: no BATCH-2026-001 canonical URL was re-queued
- PASS — geography schema: all nine geographic dimensions and inference control are present
- PASS — geographic inference control: every record prohibits inference across geography dimensions
- PASS — language schema: all staging language identifiers are stable BCP-47-style IDs
- PASS — non-English metadata: 29 non-English records contain required title, publisher, author, language, and URL fields
- PASS — translation status: all non-English translations are disclosed as machine-assisted and human review pending
- PASS — quotation restriction: no translated quotation is approved before native-language review
- PASS — translation queue calculation: 29 records appear in translation-review.csv
- PASS — decision partition: 18 accepted + 40 held + 2 rejected = 60
- PASS — decision exclusivity: each candidate occurs in exactly one decision file
- PASS — acceptance threshold: every accepted record has direct agentic-AI or agent-identity relevance
- PASS — publication isolation: all records remain candidates with human review pending
- PASS — rights and privacy: link-and-metadata-only rights status on every candidate
- PASS — privacy check: no sensitive personal data was collected
- PASS — local grounding list: 60 institutionally local or regionally institutional candidates listed; no representativeness claim implied
- PASS — representation calculations: 7 regional rows preserve the zero-production baseline
- PASS — language readiness: candidate languages do not satisfy production representation
- PASS — regional-page thresholds: 0 of 7 regional pages pass the production threshold
- PASS — role-region matrix: 70 region-by-role gap rows calculated
- PASS — structured output set: 31 batch artifacts available before validation report

## Disclosures

- Production records created: 0.
- Regional pages created: 0.
- Candidate discovery and machine screening are not publication approval.
- Human review remains pending for all candidates.
- Machine-assisted translations are staging metadata only; translated quotations are prohibited.

## Independent-review validation

- PASS — all 60 records received a permitted independent decision.
- PASS — all 18 generating-batch accepts received high-impact review.
- PASS — all 60 records now contain record-specific access and author-verification states.
- PASS — all 22 false study-geography values were removed.
- PASS — no automated record is marked publication approved.
- PASS — the 10% threshold was exceeded, full review was completed, and the batch was returned for research.

## Repository-wide validation

- PASS — lint.
- PASS — type check: 57 files, 0 errors, 0 warnings, 0 hints.
- PASS — data, provenance, attribution, statement, proposition, book-edition, source-locator, rights, review-status, publication, and content validation.
- PASS — duplicate, concentration, coverage, external-link, and role-freshness audits.
- PASS — automated tests: 24 tests across 4 files.
- PASS — public build: 28 static pages and Pagefind index; staging remains excluded.
- PASS — browser artifact test: 1 passed; 2 fixture-dependent empty-corpus tests skipped by design.
- PASS — artifact verification: 22 checksums; staging and fixtures absent from public artifacts.
