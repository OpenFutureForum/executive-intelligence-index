# Validation results

Overall: **PASS**

| Check | Status | Detail |
|---|---|---|
| Structured YAML checks | PASS | Manifest and dossier protocol parse successfully. |
| Structured JSON checks | PASS | All machine-readable records parse and share the batch identifier. |
| Publication threshold checks | PASS | 0 verified production sources versus 30 required; all configured dossier requirements fail. |
| Public dossier withholding check | PASS | No thin public dossier or canonical dossier record was created. |
| Statement lineage checks | PASS | No staging statement is represented as production evidence. |
| Proposition lineage checks | PASS | No candidate proposition is represented as canonical. |
| Unsupported claim checks | PASS | The only editorial conclusion is the threshold failure and the report disclaims substantive answers. |
| Evidence-character checks | PASS | Potential empirical evidence is typed and its inference limit is explicit. |
| Source-concentration checks | PASS | Empty production denominator is null; staging vendor involvement is separately disclosed. |
| OFF ownership disclosure checks | PASS | Production denominator and staging share are separated; future OFF ingestion requires disclosure. |
| Role-representation checks | PASS | Role matrix prohibits inference from shared relevance tags. |
| Regional-representation checks | PASS | Region, study, organization, and regulatory coverage gaps are separated. |
| Consensus and AI-slop checks | PASS | Prohibited or generic language is absent and the editorial review records the check. |
| Near-duplicate content checks | PASS | 19 substantive paragraphs are unique. |
| Existing OFF content overlap checks | PASS | Three relevant OFF content families were reviewed for overlap only. |
| Claim-lineage checks | PASS | Ten gap-report claims have named lineage or calculation rows. |
| Staging isolation checks | PASS | The batch remains in staging and canonical dossier data is empty. |
| Human review checks | PASS | No machine-created record is marked human approved. |

## Repository-wide checks

Executed on 2026-08-15 after the dedicated batch checks:

- Canonical data, provenance, review-status, publication, and content validations: PASS
- External-link audit: PASS
- Repository tests: 24 passed across 4 test files
- Public build: PASS; 28 static pages generated
- Search index and post-build artifact generation: PASS
- Git whitespace/error check: PASS
