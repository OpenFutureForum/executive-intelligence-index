# Research, validation, and release commands

The package scripts expose the required workflow: record, protocol, and batch scaffolding; schema, provenance, attribution, statement, proposition, edition, locator, rights, review, and publication validation; duplicate, concentration, and coverage audits; deterministic exports, review packets, graph, search, and release generation; pinned external snapshots; and live verification.

Scaffolds refuse to run on `main`. `npm run build` reads only `data/` and never reads `staging/` or `tests/fixtures/`. `npm run verify:artifacts` scans the built site for fixture and staging identifiers.

Examples:

```sh
npm run scaffold:batch -- batch-2026-001
npm run scaffold:record -- statement-2026-001 statements
npm run check
BASE_URL=https://openfutureforum.github.io/executive-intelligence-index/ npm run verify:live
```
