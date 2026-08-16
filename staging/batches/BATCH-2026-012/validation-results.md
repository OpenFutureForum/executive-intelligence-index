# Validation results

Overall: **PASS — baseline-only evidence-gap edition; no material signal and no canonical trend snapshot admitted.**

| Check | Result | Basis |
|---|---|---|
| Frozen-release validation | PASS; comparison ineligible | Release ID and fingerprint match the deterministic framework manifest; no previous frozen release |
| Denominator checks | Pass | Current eligible source denominator 0; previous denominator null |
| Trend calculation checks | Pass by withholding | Default weights sum to 1; change values, normalized values, and score remain null |
| Source eligibility checks | Pass | Published production records only; staging excluded |
| Statement lineage checks | Pass | Zero admitted signals; the one eligibility finding is explicitly withheld and has no source or statement IDs |
| Unsupported market-language checks | Pass | Findings scoped to indexed corpus |
| Engagement-evidence separation checks | Pass | No analytics supplied; separate disclosure retained |
| Source-concentration checks | Pass | Shares null with zero denominator |
| OFF-ownership disclosure checks | Pass | Count 0; share null; no signal dependency |
| Structured data checks | Pass | JSON and YAML parse; canonical data, provenance, publication, and content validation pass |
| Public build | Pass | 28 static pages built; release artifacts generated and all 22 checksums verified |
| Near-duplicate monthly prose review | Pass | Repository content-quality validator found no duplicated substantive paragraph |

## Repository-wide checks

- Lint: PASS
- Type checking: PASS; 57 files, zero errors and warnings
- Canonical data validation: PASS; one protocol record and zero trend snapshots
- Provenance, attribution, statements, propositions, source locators, rights, review status, and publication gates: PASS
- Duplicate, concentration, coverage, external-link, and role-freshness audits: PASS
- Unit tests: PASS; 24 tests across four files
- Public build: PASS; 28 static pages
- Search index: PASS; 28 pages indexed
- Browser artifact test: PASS; one passed and two fixture-dependent UI tests skipped by repository configuration
- Generated artifact verification: PASS; 22 checksums and staging/fixture isolation
- Git whitespace/error check: PASS

## Execution note

The repository’s `tsx` command-line wrapper attempted to create a local IPC socket that the sandbox initially denied. The same TypeScript entry points were executed with Node’s `tsx` loader, preserving their code paths and arguments. After localhost permission was granted, the repository browser suite ran normally.
