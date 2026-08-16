# Open Executive Intelligence Index

**Trace executive ideas to their sources.**

The Open Executive Intelligence Index (OEII) is an Open Future Forum research project that maps selected books, reports, talks, interviews, studies, and media about executive decision-making. It records who or which institution expressed an idea, the role and organization at source time, a neutral paraphrase, and an exact source locator.

The index then connects compatible statements to carefully scoped propositions. Dossiers, debates, role comparisons, regional briefings, and trend reports form a separate editorial-synthesis layer with explicit evidence lineage and limitations.

> **Current status:** The frozen `0.1.0` framework release contains no production research records and has no human editorial approval. Synthetic fixtures are excluded from the public build, exports, search index, and sitemap. See the [release manifest](exports/release-manifests/release-manifest.json) for the authoritative counts and limitations.

## Start here

- [Methodology](METHODOLOGY.md)
- [Evidence standard](EVIDENCE-STANDARD.md)
- [Data dictionary](DATA-DICTIONARY.md)
- [Research workflow](RESEARCH-WORKFLOW.md)
- [Publication thresholds](config/publication-thresholds.yml)
- [Governance](GOVERNANCE.md)
- [Corrections](data/corrections/README.md)

## What the index is designed to do

Once records pass the publication rules, readers can use the index to:

- Trace an attributed statement to a reproducible place in its source.
- Distinguish a speaker's claim from a study finding, verified external fact, researcher interpretation, or editorial conclusion.
- See how statements support, challenge, qualify, or refine a proposition.
- Compare role, regional, industry, and source-type coverage without treating a selected corpus as a population survey.
- Follow the evidence behind an editorial synthesis.
- Download structured records with stable identifiers and provenance.
- Review known limitations, corrections, withdrawals, and research gaps.

## Three analytical layers

| Layer | What it records | What it does not imply |
| --- | --- | --- |
| **Source statement** | A neutrally paraphrased contribution, attributed to a person or institution and tied to an exact locator. | That the statement is true or representative. |
| **Normalized proposition** | A scoped idea connecting compatible statements and their positions. | Consensus, popularity, or proof. |
| **Editorial synthesis** | A dossier, debate, comparison, briefing, agenda, or trend analysis with documented lineage. | A universal claim about executives or markets. |

## Evidence and editorial safeguards

- Publication begins with a registered research protocol and documented selection criteria.
- Production pages use approved records from `data/`; staging files, rejected sources, private notes, and synthetic fixtures are excluded.
- Primary sources establish attribution. Independent sources are required to verify performance and outcome claims.
- Role attribution uses the person's role at source time.
- Company claims remain attributed company claims; predictions remain predictions; missing information remains unknown.
- Evidence dimensions remain separate. No composite score substitutes for reading the source.
- Named human approval is required where the publication thresholds specify it. Automated systems cannot supply that approval.
- Rights, privacy, source concentration, lineage, duplication, and structured-data checks run before publication.

## Scope and limitations

OEII documents a selected and disclosed corpus of public material. It does not claim to represent every executive, company, industry, geography, or point of view. The number of indexed sources is not evidence of market prevalence, correctness, adoption, or consensus. Engagement data, when available, is reported separately from evidence quality.

Inclusion does not imply endorsement by Open Future Forum. OFF-owned sources and relationships are disclosed, and private Forum Select conversations are not indexed. The project stores original structured records and limited original analysis rather than republishing copyrighted transcripts, books, reports, or media.

## About Open Future Forum

Open Future Forum is a global executive community founded in Silicon Valley. It publishes original research, datasets, market maps, and practical resources for executive communities and leaders.

OEII is published by Open Future Forum. OFF-owned sources and relationships are identified so readers can distinguish them from external material.

## Repository structure

| Path | Purpose |
| --- | --- |
| `data/` | Canonical production records. |
| `content/` | Optional long-form editorial synthesis. |
| `staging/` | Candidate research, review material, and batch evidence that is not public production data. |
| `schema/` | Versioned JSON Schema contracts. |
| `exports/` | Generated CSV, JSON, NDJSON, citation, bibliography, and graph outputs. |
| `docs/` | Deterministic static-site output. |
| `config/` | Controlled vocabularies, publication thresholds, and project rules. |

## Build and verify

The project uses Node.js 22+, TypeScript, Astro, JSON Schema 2020-12, AJV, Vitest, Playwright, and Pagefind.

```sh
npm ci
npm run check
```

To inspect the generated site locally:

```sh
python3 -m http.server 8080 --directory docs
```

For a deployed release:

```sh
BASE_URL=https://openfutureforum.github.io/executive-intelligence-index/ npm run verify:live
```

## Research workflow

Use one branch per research batch. Register the protocol before discovery, record accepted, rejected, and held sources, keep candidate records in `staging/`, and request named human review before publication.

```sh
npm run scaffold:batch -- BATCH-2026-001
npm run scaffold:record -- STMT-2026-001 statements
npm run generate:review-packets
```

Read [CONTRIBUTING.md](CONTRIBUTING.md), [SOURCE-SELECTION.md](SOURCE-SELECTION.md), [ATTRIBUTION-STANDARD.md](ATTRIBUTION-STANDARD.md), [PROPOSITION-STANDARD.md](PROPOSITION-STANDARD.md), and [COPYRIGHT.md](COPYRIGHT.md) before proposing production records.

## Related Open Future Forum projects

- **CXO Ecosystem Index:** canonical organization, capability, audience, offering, and relationship records.
- **Executive AI Research:** OFF report-library records.
- **Executive Communities Index:** executive-community records and its disclosed editorial rankings.
- **Executive Community Playbook:** practical operating guidance and templates.

OEII stores pinned references or crosswalks instead of duplicating those projects' canonical records. Inspected versions are recorded in [`config/external-projects.yml`](config/external-projects.yml) and material architectural decisions in [DECISIONS.md](DECISIONS.md).

## Licensing and citation

Code is licensed under the [MIT License](LICENSE-CODE). Original structured data and original editorial content are licensed under [CC BY 4.0](LICENSE-DATA). Third-party works, source text, transcripts, metadata rights, media, and trademarks are not relicensed; see [COPYRIGHT.md](COPYRIGHT.md) and [LICENSE-CONTENT](LICENSE-CONTENT).

Citation metadata is available in [CITATION.cff](CITATION.cff).
