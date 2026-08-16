# Open Executive Intelligence Index

**Trace executive ideas to their evidence.**

The Open Executive Intelligence Index is Open Future Forum's transparent data, methodology, provenance, and public-intelligence layer for selected books, reports, studies, talks, interviews, people, and source-located executive ideas.

Its primary unit is the **source statement**: an attributed, precisely located, neutrally paraphrased contribution. Statements may connect to carefully scoped propositions; dossiers, debates, role comparisons, and trends remain separate editorial-synthesis layers with higher publication thresholds.

## Public site

The human-readable index is published at:

https://openfutureforum.github.io/executive-intelligence-index/

Only named-human-approved production records appear on the public site, in exports, or in search. Candidate research remains in `staging/` and is not public evidence.

## Current public release

Release 0.2.0 is a narrowly scoped pilot on governed identities for AI agents. It publishes 8 verified works, 11 exact editions, 20 canonical sources, and 100 source-located statements. It also preserves 48 resolved identity records as data-only lineage; none currently meets the configured threshold for a public person profile page.

The pilot is substantially English-language, source-concentrated, and not representative of all executives, roles, industries, regions, or markets. Inclusion does not imply endorsement, prevalence, adoption, consensus, or truth. Candidate propositions and all higher-order synthesis remain unpublished.

## Publication boundaries

- Every public statement must be attributable to a reproducible source location.
- Attribution does not establish truth, prevalence, adoption, or consensus.
- Role analysis uses the person's role at source time.
- OFF-owned sources and relationships are disclosed.
- Engagement is kept separate from evidence quality.
- Copyrighted works are cited and summarized within defined limits, not republished.
- Held, rejected, unresolved, rights-limited, and unapproved records remain unpublished.

## Architecture

- Node.js 22+, TypeScript, Astro, JSON Schema 2020-12, AJV, Vitest, Playwright, and Pagefind.
- Canonical records in `data/`; optional long-form interpretation in `content/`.
- Deterministic static output in `docs/`, matching the established OFF GitHub Pages convention.
- No production database, runtime API, secret, or live upstream fetch.
- Pinned external-project manifests preserve builds when upstream repositories are unavailable.

## Start and verify

```sh
npm ci
npm run check
python3 -m http.server 8080 --directory docs
```

For a deployed release:

```sh
BASE_URL=https://openfutureforum.github.io/executive-intelligence-index/ npm run verify:live
```

## Research workflow

Work on one dedicated branch per research batch. Register the protocol before discovery, log accepted, rejected, and held sources, keep candidates in `staging/`, and require named human review before promotion.

```sh
npm run scaffold:batch -- BATCH-2026-001
npm run scaffold:record -- STMT-2026-001 statements
npm run generate:review-packets
```

See [METHODOLOGY.md](METHODOLOGY.md), [RESEARCH-WORKFLOW.md](RESEARCH-WORKFLOW.md), [ATTRIBUTION-STANDARD.md](ATTRIBUTION-STANDARD.md), [COPYRIGHT.md](COPYRIGHT.md), and [CONTRIBUTING.md](CONTRIBUTING.md).

## Related Open Future Forum projects

The CXO Ecosystem Index owns full organization records; Executive AI Research owns OFF report-library records; the Executive Communities Index owns community records and its disclosed editorial rankings; and the Executive Community Playbook owns practical guidance. This project stores pinned crosswalks or references rather than duplicating those records.

## Licensing

Code is MIT licensed. Original structured data and editorial content are CC BY 4.0 licensed. Third-party works, transcripts, video, reports, source text, metadata rights, and trademarks are not relicensed. See the license files and `COPYRIGHT.md`.
