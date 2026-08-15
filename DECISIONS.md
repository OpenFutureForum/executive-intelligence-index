# Architecture decisions

## ADR-001 — Data-first static architecture

**Date:** 2026-08-14. **Decision:** TypeScript, Astro, JSON Schema 2020-12, AJV, Vitest, Playwright, and Pagefind, with deterministic output in `docs/` and no runtime database or API.

The inspected OFF repositories use static public output, explicit methods, canonical source data, generated downloads and discovery files, and GitHub Pages. The CXO Ecosystem Index at `45ca4066fc00` provides the closest convention: Node-based deterministic generation, `npm run check`, committed `docs/`, release fingerprints, and workflow deployment. Astro adds reusable layouts and route generation for this project's larger entity model while preserving those conventions.

## ADR-002 — Distinct source-statement unit

Full organization records remain in `cxo-ecosystem-index`; OFF report-library records remain in `executive-ai-research` at `d205a6b2e6f4`; community ranking records remain in `executive-communities-index` at `ba9bab57a774`; practical guidance remains in `executive-community-playbook` at `2a0936b00c75`. The `.github` profile (`c3fe1e9e27cc`) and root Pages repository (`12505350a4d9`) provide publisher and deployment context.

This project stores minimal versioned crosswalks, not duplicate canonical identities. Its primary unit is the attributed, exact-locator source statement.

## ADR-003 — Truthful empty production state

No production research record was added because the build task supplied architecture requirements but no verified research source corpus or named human approval. Synthetic fixtures exercise every schema only under tests. This prevents fabricated evidence, metadata, roles, and approvals.

## ADR-004 — Generated schemas and exports

Entity schemas are generated deterministically from one maintained definition to prevent drift. Public exports are rebuilt from approved canonical records, checksummed, and fingerprinted. Staging is outside all build inputs.

## Duplication risks

Risks include creating local organization biographies, reproducing OFF report summaries, copying playbook guidance, and generating reciprocal SEO links. Crosswalk-only organization records, canonical report references, content-quality validation, and contextual linking mitigate these risks.
