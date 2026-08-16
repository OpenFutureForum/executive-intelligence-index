# Methodology

## Unit of analysis

The primary unit is a source statement, not a person, organization, book summary, or popularity score. A source statement records who or which institution expressed an idea, the role and organization at source time, what kind of statement it was, a neutral original paraphrase, and an exact reproducible locator.

## Analytical layers

1. Source statements preserve attribution and scope.
2. Normalized propositions connect multiple compatible statements without presuming truth.
3. Editorial synthesis interprets evidence through dossiers, debates, role comparisons, regional briefings, and trend snapshots.

No source URL may support a broad synthesis without statement and proposition lineage or an explicit editorial method.

## Discovery and selection

Material batches begin with a research protocol that fixes scope, time period, source types, inclusion and exclusion criteria, diversity objectives, queries, and expected limitations. Search results are discovery aids. Primary sources establish attribution; independent sources are required to verify performance or outcome claims. Accepted, rejected, and held sources remain visible in batch logs.

## Quality and diversity

Quality is multidimensional. Attribution strength, methodological transparency, independence, accessibility, bibliographic stability, recency, and diversity contribution remain separate. Selection seeks meaningful variation in executive role, industry, geography, language, organization type, source type, seniority, and position. Differences in scope are not forced into disagreement; distinct recommendations are not flattened into agreement.

## Review

Automated agents may draft, check, identify issues, or mark records ready for human review. They may not approve human-review fields. Production records require the configured checks and, where specified, a named human reviewer. Disagreements and unresolved questions remain recorded.

## Publication

Thresholds in `config/publication-thresholds.yml` govern public pages. The generator reads canonical `data/` records only and filters for published workflow state. Staging, review packets, private notes, rejected sources, and synthetic fixtures are not build inputs. Empty states are preferable to invented records.

## Trends and claims

Trend snapshots compare frozen corpus releases using disclosed raw values, denominators, weights, and limitations. They do not measure universal popularity, correctness, or market prevalence. The phrases “executive consensus” and “best thought leaders” are prohibited unless an explicit, configured methodology can substantiate them.

## Versioning

Schema, data, content, and semantic release versions are separate. Canonical IDs are stable and retired IDs remain reserved. Migrations are versioned and reversible. Release manifests record input counts, export checksums, upstream commits, and a deterministic fingerprint.
