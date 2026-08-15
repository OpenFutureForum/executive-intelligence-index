# Validation results — BATCH-2026-001

Completed 2026-08-15. Candidate acceptance is not source or publication approval.

## Passed

- Canonical research-protocol schema and provenance: one protocol record.
- Batch-local candidate schema: 120 of 120 candidates.
- Decision partition: 91 accepted, 19 held, 10 rejected.
- Candidate identity and URL uniqueness.
- Source-identity completeness for accepted candidates.
- Rights/access and ownership/OFF-relationship fields for every candidate.
- Duplicate review: five alternate-rendition groups match five duplicate rejects.
- Search traceability: every candidate references logged query families; 38 main families and four supplementary low-yield or failed searches are documented.
- Coverage: all six pre-registered executive roles occur in the accepted set.
- Concentration: the largest accepted publisher label is arXiv at 17.6%, below the 20% failure threshold; structural vendor and preprint concentration remains disclosed.
- Staging isolation: no candidate IDs appear in production content, documentation, or exports.
- Batch size: 120, within the pre-registered 100–150 range.
- Repository gates: attribution, statements, propositions, book editions, locators, rights/privacy, review status, publication, content, duplicates, concentration, and coverage.
- Static checks: TypeScript and targeted ESLint.
- Tests: 24 passed across four test files.
- Whitespace: `git diff --check` passed.

## Warnings retained as findings

- India has no accepted candidate.
- Japan has no accepted candidate; one METI source remains held.
- All candidates are English-language because `lang-en` is the only active language vocabulary value.

These warnings are not validation failures. The protocol explicitly prioritizes quality over quota filling, so gaps remain visible for a later batch.

## Local runner note

The local seatbelt blocks the IPC pipe used by the `tsx` command wrapper. Equivalent commands were run with `node --import tsx`, which exercises the same TypeScript entry points without the blocked IPC server. Hosted CI should run the normal package scripts.
