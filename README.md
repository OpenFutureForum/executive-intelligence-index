# Open Executive Intelligence Index

A cited map of the books, people, research, ideas, evidence, and media shaping executive decision-making.

This repository is Open Future Forum's transparent data, methodology, provenance, and public-intelligence layer for source-located executive ideas. Its primary unit is the **source statement**: an attributed, precisely located, neutrally paraphrased contribution. Statements connect to normalized propositions; dossiers and debates form a separate editorial-synthesis layer.

## Current status

Version 0.1.0 is a framework release. It contains no production research records and makes no claim of human editorial approval. Synthetic records exist only under `tests/fixtures/` and are excluded from the public build, exports, sitemap, and search index.

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

Work on one dedicated branch per research batch. Register the protocol before discovery, scaffold the batch, log accepted, rejected, and held sources, keep candidate records in `staging/`, and request named human review before publication.

```sh
npm run scaffold:batch -- BATCH-2026-001
npm run scaffold:record -- STMT-2026-001 statements
npm run generate:review-packets
```

See [METHODOLOGY.md](METHODOLOGY.md), [RESEARCH-WORKFLOW.md](RESEARCH-WORKFLOW.md), [ATTRIBUTION-STANDARD.md](ATTRIBUTION-STANDARD.md), [COPYRIGHT.md](COPYRIGHT.md), and [CONTRIBUTING.md](CONTRIBUTING.md).

## Related OFF projects

The CXO Ecosystem Index owns full organization records; Executive AI Research owns OFF report-library records; the Executive Communities Index owns community records and its disclosed editorial rankings; the Executive Community Playbook owns practical guidance. This project stores pinned crosswalks or references instead of duplicating those records. Exact inspected commits are recorded in `config/external-projects.yml` and `DECISIONS.md`.

## Licensing

Code is MIT licensed. Original structured data and original editorial content are CC BY 4.0 licensed. Third-party works, transcripts, video, reports, source text, metadata rights, and trademarks are not relicensed. See the three license files and `COPYRIGHT.md`.
