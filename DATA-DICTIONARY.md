# Data dictionary and entity contribution guide

JSON Schema 2020-12 files in `schema/` are authoritative for field types and required properties. `schema/schema-index.json` maps every entity to its stable ID field.

| Entity | Directory | Purpose |
| --- | --- | --- |
| Person | `data/people/` | Public professional identity and documented corpus contributions |
| Organization reference | `data/organization-references/` | Minimal versioned CXO Ecosystem crosswalk |
| Book work | `data/book-works/` | Underlying intellectual work |
| Book edition | `data/book-editions/` | Exact edition, identifiers, locators, and access basis |
| Source | `data/sources/` | Canonical media, research, publication, or OFF source |
| Statement | `data/statements/` | Attributed neutral paraphrase with exact locator |
| Proposition | `data/propositions/` | Neutral scoped idea connected to statements |
| Stance | `data/stances/` | Explicit statement-to-proposition relationship |
| Topic | `data/topics/` | Controlled hierarchical term |
| Debate | `data/debates/` | Comparable positions and evidence limitations |
| Dossier | `data/dossiers/` | Editorial synthesis with evidence lineage |
| Trend snapshot | `data/trends/` | Frozen release-to-release change measurement |
| Research protocol | `data/protocols/` | Registered discovery and synthesis plan |
| Research batch | `data/batches/` | Completed batch execution record |
| Review | `data/reviews/` | Reviewer decision, correction, disagreement, and recommendation |
| Correction | `data/corrections/` | Submitted issue, evidence, decision, and before/after values |
| Release | `data/releases/` | Approved version, counts, checksums, fingerprint, and limitations |

Start every record in `staging/` with the relevant scaffold command. Complete schema fields and provenance, validate, generate a review packet, obtain required review, then move the record into its canonical directory through the reviewed pull request. Never edit generated exports or public pages as factual sources of truth.
