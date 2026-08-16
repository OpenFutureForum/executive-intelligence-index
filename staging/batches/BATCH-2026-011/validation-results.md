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
- PASS — structured output set: 18 batch artifacts available before validation report

## Disclosures

- Production records created: 0.
- Regional pages created: 0.
- Candidate discovery and machine screening are not publication approval.
- Human review remains pending for all candidates.
- Machine-assisted translations are staging metadata only; translated quotations are prohibited.
- PASS — Repository data validation: 1 canonical record across 17 entity directories.
- PASS — Repository provenance validation: 1 canonical record checked.
- PASS — Attribution, publication, and content-quality validation; staging remained excluded from public records.
- PASS — Repository duplicate, concentration, and coverage audits.
- PASS — Type checking: 57 files, 0 errors, 0 warnings, 0 hints.
- PASS — Automated tests: 24 tests across 4 files.
- PASS — Public build: 28 static pages, Pagefind index, and post-build exports generated.
- NOTE — The npm wrappers that invoke `tsx` could not open their local IPC socket in the sandbox. Equivalent `node --import tsx` commands were used successfully, including the manual public-build sequence.
