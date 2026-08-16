# Validation results

Overall: **PASS**

| Check | Status | Detail |
|---|---|---|
| Structured data checks | PASS | JSON and YAML records parse successfully. |
| Role-at-source-time checks | PASS | Current title and relevance tags are excluded; source-time role controls attribution. |
| Role threshold checks | PASS | All three roles fail the pre-registered editorial comparison floor. |
| Sample-size disclosure checks | PASS | Every role denominator is disclosed as zero. |
| Source concentration checks | PASS | Shares remain null rather than 0% for empty denominators. |
| Scope mismatch checks | PASS | Seven mismatches were explicitly corrected. |
| Unsupported generalization checks | PASS | Role stereotypes and universal claims are absent. |
| Proposition lineage checks | PASS | No candidate proposition is treated as role evidence. |
| Statement lineage checks | PASS | No staging statement is included in the comparison corpus. |
| Existing content overlap checks | PASS | OFF content is overlap-only and combined role categories are excluded. |
| Comparison withholding checks | PASS | No alignment or disagreement is fabricated. |
| Question deliverable checks | PASS | Interview and roundtable instruments are present. |
| Matrix completeness checks | PASS | All requested evidence, proposition, risk, measurement, distribution, and gap matrices exist. |
| Staging isolation checks | PASS | No production content or canonical comparison record was created. |
| Human review checks | PASS | No machine output is marked human approved. |
| Near-duplicate checks | PASS | 16 substantive paragraphs are unique. |

## Repository-wide checks

Executed on 2026-08-15 after the dedicated batch checks:

- Canonical data, provenance, review-status, publication, and content validations: PASS
- External-link audit: PASS
- Repository tests: 24 passed across 4 test files
- Public build: PASS; 28 static pages generated
- Search index and post-build artifact generation: PASS
- Git whitespace/error check: PASS
