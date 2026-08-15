# Validation results - BATCH-2026-004

Completed 2026-08-15. These checks establish staging consistency; they do not constitute named-human editorial approval.

## Batch checks passed

- Canonical schemas: 2 source proposals, 9 person candidates, 18 statement candidates, and 12 organization-reference proposals.
- Decision partition: 2 accepted, 3 held, and 0 rejected across the five inherited media candidates.
- Source identity: canonical titles, publishers, series or event identities, dates, language, URLs, ownership, rights, and OFF relationship are present for all five decisions.
- Duration and timestamps: 29 chapters are continuous and non-overlapping. The podcast map ends at 3,353 seconds; the webinar map ends at the measured 3,435.627 seconds. All statement locators fall within the corresponding source duration.
- Attribution: every statement resolves to a verified accepted-source speaker and a source-time role. No ambiguous statement was assigned. Advertised-but-absent, uploader, and off-camera support identities are explicitly excluded.
- Historical roles: source-time roles are stored separately from current roles. Unverified current roles remain null or unresolved.
- Rights: both accepted third-party transcripts are research aids only, no direct quotes are stored in statements, and no transcript, caption, audio, video, or PDF research asset appears in the batch directory.
- Duplicates and reposts: five canonical URLs are unique. The podcast's listening-platform mirrors and the inherited OpenID event-artifact duplicate are grouped rather than counted as additional sources.
- Statement rules: each accepted source contributes between 5 and 15 statements; 18 total. All are single-proposition paraphrases with explicit evidence character, verification status, scope, uncertainty, extraction method, and review status.
- Abstract quality: the two original analytical abstracts are distinct and are not copied publisher descriptions.
- Staging isolation: proposed source and statement IDs do not appear in production content, canonical data, documentation, or exports.

## Repository checks passed

- Canonical data validation.
- Provenance validation.
- Attribution and statement validation.
- Source-locator validation.
- Rights and privacy validation.
- Review-status and publication gating.
- Content-quality validation.
- 24 unit tests across four test files.
- Typecheck: 57 files, zero errors, warnings, or hints.
- ESLint.
- `git diff --check`.

## Human review still required

- Confirm all 18 statement paraphrases and locators.
- Confirm vendor-claim framing for the eight SailPoint statements.
- Decide whether a Spotify embed is acceptable for the podcast source page.
- Resolve or retain the three recording-access holds.
- Approve any promotion from staging to canonical data.
