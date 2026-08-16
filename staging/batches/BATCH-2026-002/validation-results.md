# Validation results — BATCH-2026-002

Completed 2026-08-15. All records remain staging-only and human-pending.

## Passed

- Work schema: nine records.
- Edition schema: fourteen records.
- Person schema: thirty author candidates.
- Source schema: ten related-source candidates.
- ISBN check digits and ISBN-10/ISBN-13 pairing for every recorded identifier.
- Duplicate ISBN detection: no identifier assigned to multiple editions.
- Duplicate title and author detection: one materially revised same-title case is explicitly queued rather than merged.
- Work-edition relationships: fourteen reciprocal, internally consistent links.
- Author identity: thirty unique people with reciprocal work links; none is public-profile eligible.
- Access-basis validation: every work uses exactly one allowed primary basis.
- Deep-analysis readiness: two works have exact editions and complete lawful access.
- Provenance, rights status, publication limits, and staging isolation.
- Analysis-depth validation: all works remain `catalogued`; no metadata-only book is called reviewed or deeply analyzed.
- Human-review validation: no record is marked approved.
- Repository-wide schema, attribution, statements, propositions, edition, locator, rights, review, publication, content, duplicate, concentration, and coverage checks.
- TypeScript and targeted ESLint.
- Twenty-four unit tests across four files.
- `git diff --check`.

## Warnings retained as findings

- Only eight accepted books existed in the parent discovery batch, below the approximate 15–25 template target.
- The verified Italian edition uses BCP 47 `it`, while `lang-it` is not yet in the canonical controlled vocabulary.
- Individual official profiles and current roles remain unresolved for thirty author candidates.

## Unresolved conflicts

- One work-level conflict: whether the expanded second edition of *Solving Identity Management in Modern Applications* is a new intellectual work or a materially revised manifestation of the 2019 work.
- One translated-edition identity gap: the Italian translator for *Zero Trust Networks* is unresolved.

The warnings and conflicts remain visible because quality and edition identity take priority over completion quotas.
