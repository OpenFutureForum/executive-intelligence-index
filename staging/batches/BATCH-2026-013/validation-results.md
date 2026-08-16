# Validation results

Overall: **PASS — proposal-only original-research agenda; named human review pending.**

| Required check | Result | Detail |
|---|---|---|
| Gap lineage checks | PASS | Ten gaps cite the dossier, debate, role, regional, unresolved-question, prior-opportunity, or signal-gap records that generated them. Every concept has lineage. |
| Existing OFF content overlap | PASS | CISO, Executive, CEO, CFO, and CMO AI Leverage reports; CFO/CISO/CTO/public-board communities; event formats; track record; and the existing CISO executive briefing were reviewed as OFF-owned overlap, not independent evidence. |
| Privacy checks | PASS | No private target list, personal contact data, attendee identity, private event content, or participant commitment appears. |
| Confidential-event safeguards | PASS | Every roundtable separates event participation from research consent, defines attribution, publication, off-record material, data capture, and follow-up. |
| Survey-claim checks | PASS | Each survey states target population, selection limits, role and geography strata, measures, bias, analysis, publication floor, and permitted and prohibited claims. |
| Sponsor-conflict checks | PASS | All 41 concepts contain sponsor category, conflict, disclosure, funding/findings separation, data-access limit, and publication-independence fields. |
| Source availability checks | PASS | Eleven public OFF research, community, event, and video URLs returned HTTP 200 on 2026-08-15. Availability does not make them independent evidence. |
| Proposed-output duplication checks | PASS | Forty-one concept IDs and normalized titles are unique. Proposed videos and reports add decision-rights, implementation, outcome, counterposition, or regional evidence beyond existing OFF leverage titles. |
| Separate-priority-dimension checks | PASS | Ten gaps each contain all 13 requested 1–5 dimensions. No total, average, weighted score, or composite rank is stored. |
| Minimum concept counts | PASS | 12 interviews, 6 cross-role concepts, 3 surveys, 4 roundtables, 4 panels, 8 videos, and 4 flagship reports. |
| Named-target and commitment checks | PASS | Concepts specify role and experience profiles only; no private person is named and no participation is implied. |
| Structured data checks | PASS | Eight JSON files and the YAML manifest parse successfully; agenda-specific structural validator passes. |
| Rights and recording checks | PASS | Every interview, panel, roundtable, and intended video source specifies consent, rights, transcript, attribution, or indexing boundaries appropriate to the format. |
| Public-source capture checks | PASS | Panels and videos include source-capture or intended-source-record plans with role at source time, timestamps, transcript rights, OFF ownership, and independent verification boundaries. |
| Content and privacy language checks | PASS | No email address, unsupported participant commitment, private-event finding, or promotional superlative detected. |
| Git whitespace/error checks | PASS | No trailing whitespace or patch errors in intended files. |

## Repository-wide checks

- Lint: PASS
- Type checking: PASS; 58 files, zero errors, warnings, or hints
- Unit tests: PASS; 24 tests across four files
- Canonical data and provenance validation: PASS
- Attribution, statements, propositions, books, source locators, rights, review status, and publication gates: PASS
- Content quality, duplicate, concentration, coverage, external-link, role-freshness, and trend checks: PASS
- Deterministic export fingerprint: unchanged at `3527bda659346bd2f07569f394d14bc43f2065ef4e5dc800d6c10ca7ea747d3b`
- Public build: PASS; 28 static pages
- Search index: PASS; 28 pages
- Browser release-artifact test: PASS; one passed and two fixture-dependent UI tests skipped by repository configuration
- Artifact verification: PASS; 22 checksums and no staging or fixture exposure

## Execution note

The sandbox blocks the `tsx` command-line wrapper’s local IPC socket. The repository’s TypeScript validation entry points were therefore executed with Node’s `tsx` loader, using the same source files and arguments. The public browser suite ran normally after localhost permission was granted.
