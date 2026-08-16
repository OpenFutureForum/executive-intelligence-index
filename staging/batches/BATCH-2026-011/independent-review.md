# Independent verification — BATCH-2026-011

## Outcome

**Batch decision: return_for_research.** This automated independent reviewer does not grant publication approval. Fourteen records may proceed to named human review after the applied corrections; 22 remain on identity or translation hold, 20 are returned for narrower research, and 4 are rejected.

## Scope and independence

The review inspected all 60 candidate records, the 18 machine-accepted/high-impact records against official sources, repository methodology and evidence standards, publication thresholds, the manifest, validation output, rejected candidates, candidate schema precedent, prior BATCH-2026-001 URLs, and the public-build boundary. The initial design covered all 18 high-impact records plus a deterministic pseudo-random 12-record sample of the remaining 42, ranked by SHA-256 of `BATCH-2026-011|OEII-INDEPENDENT-VERIFICATION|<candidate_id>`. The 10% threshold was exceeded immediately, so review expanded to all 60.

The batch contains no people, roles, books, statements, propositions, quotations, criticism, or position-change claims. Those checks are not applicable. No current-role claims were made.

## Systemic findings

1. **No preregistered batch protocol or search log.** The manifest points to proposed future protocols, not a protocol registered before discovery. Search terms, engines, dates, result depths, language routing, and exclusion decisions cannot be independently reproduced.
2. **No batch-local schema and nonconformance with the repository candidate precedent.** Required access-basis, access-status, methodological-transparency, and identity-stability controls were absent.
3. **False study geography.** Twenty-two direct-topic records were assigned a study geography even though they are policy, law, guidance, administrative, blog, project-profile, or announcement sources. All 22 were corrected to an empty study-geography array.
4. **Author/publisher conflation.** All 60 records copied publisher into author without recording a verification state. Six high-impact attributions were demonstrably wrong or materially incomplete; 47 additional records remain unresolved after record-specific corrections.
5. **Locator/work conflation.** At least 19 records name an underlying work, chapter, slide, or framework while linking an announcement, hub, series, meeting deck, or larger report. Recoverable high-impact locators were corrected; unresolved cases are held.
6. **Blanket identity status.** The same machine status was applied to every record regardless of access result or identity match. It is now record-specific.
7. **Validation overclaim.** The prior validation marked geography, source identity, rights, and local grounding as PASS using structural checks that did not test the semantics above.

## High-impact record decisions

| ID | Verified source identity | Decision | Independent finding |
|---|---|---|---|
| 001 | IA agentique et données personnelles : la CNIL et le Conseil de l’IA et du Numérique publient une note exploratoire | approve_with_corrections_for_human_review | Official CNIL/CIANum page, title, date, and direct agentic-AI scope verified; remove false study geography and add access-basis controls. |
| 002 | Inteligencia Artificial Agéntica desde la perspectiva de protección de datos | approve_with_corrections_for_human_review | Official 76-page AEPD guidance verified; correct version date and remove false study geography; native-language title review remains required. |
| 003 | CCN-CERT BP/36 Buenas Practicas IA Ofensiva | approve_with_corrections_for_human_review | Underlying CCN-CERT BP/36 work verified on the official CCN-CERT register; replace the AEPD news locator, exact title, and date. |
| 004 | Tekoälyagenttien kyberturvallisuus | approve_with_corrections_for_human_review | Official Traficom/National Emergency Supply Agency publication and date verified; remove false study geography. |
| 005 | Thinking carefully before adopting agentic AI | approve_with_corrections_for_human_review | Official NCSC blog, date, and named authors verified; correct author and source type. |
| 006 | Cyber Shield: The path to an agentic AI future for cyber defence | approve_with_corrections_for_human_review | Official NCSC blog and named authors verified; replace unstable print-PDF locator with canonical landing page and exact date. |
| 007 | How are AI agents addressed within the AI Act? | approve_with_corrections_for_human_review | Official European Commission AI Act Service Desk FAQ and direct relevance verified; publication date remains undated on the page and must not be asserted beyond year-level staging. |
| 016 | Capacidades para la era de la IA agéntica: gobernanza epistémica y co-inteligencia humano-máquina | approve_with_corrections_for_human_review | Journal article, author Aurea Rodriguez Lopez, issue, and publication date verified; correct author attribution and remove false study geography. |
| 018 | Securing Agentic AI: A Discussion Paper | approve_with_corrections_for_human_review | Official CSA/FAR.AI discussion-paper page, co-authorship, and date verified; remove false study geography. |
| 019 | Securing Agentic AI — An Addendum to the Guidelines and Companion Guide on Securing AI Systems | approve_with_corrections_for_human_review | Final CSA publication page exists; replace the 2025 consultation press release and date with the final 17 June 2026 publication. |
| 020 | MDDI's Response to PQ on Ensuring Meaningful Human Accountability for Public-facing Autonomous AI Agents and Pathways to Mandatory Governance in High-risk Sectors | approve_with_corrections_for_human_review | Official Singapore parliamentary written answer and date verified; correct source type and preserve its limited evidentiary character. |
| 021 | AIによる代理行為を前提とした匿名認証基盤の開発 | hold_for_identity_review | The locator is an IPA project profile while the candidate names only the project; page author, project proposer, and work identity must be separated. |
| 022 | AIエージェント利活用に伴うリスクへの対応 | hold_for_identity_review | Candidate title is a slide heading inside a METI meeting deck, not the document title; exact deck and slide locator are required. |
| 024 | AIセキュリティ短信 | hold_for_identity_review | The locator is a rolling IPA bulletin-series hub; select and identify a specific issue and locator before use. |
| 027 | The Privacy Commissioner’s Office has Completed Compliance Checks on 60 Organisations Regarding the Impact of the Use of Artificial Intelligence on Personal Data Privacy | approve_with_corrections_for_human_review | Official Hong Kong PCPD compliance-check summary, date, 60-organization scope, and sector coverage verified; classify as a compliance-check summary, not a research report. |
| 029 | 《人工智能安全治理框架》2.0版发布 | approve_with_corrections_for_human_review | Official CAC release page, date, and attached framework verified; distinguish the release announcement from the 32 MB attached framework and require native-language review. |
| 036 | Agentic AI addendum: Whole of AI lifecycle | hold_for_identity_review | This is one section of the Australian Agentic AI addendum already represented by another section in BATCH-2026-001; model one canonical work with section locators. |
| 039 | Ataques cibernéticos autônomos com uso de agentes de inteligência artificial | hold_for_identity_review | Candidate names a subsection inside the ABIN 2026 report; canonical URL is unstable and exact section author/page locator was not verified. |

## Access

The direct machine check received HTTP 200/206 for 50 of 60 supplied URLs. Ten returned a block, server error, 404, or client failure. Browser inspection recovered official evidence for several high-impact items, but access failure was not treated as proof that a work does not exist. Record-specific access states now distinguish verified, blocked, and unresolved cases. A full-text claim is prohibited unless the corrected record explicitly states the analysis basis.

## Duplicate and overlap result

No exact BATCH-2026-001 canonical URL was repeated. However, BATCH-2026-011 items 036–038 are components or announcements of the same Australian Agentic AI addendum intellectual work, whose background section is already BATCH-2026-001 item 034. Items 037 and 038 are rejected as separate evidence works; item 036 is held so the addendum can be modeled once with section locators.

## Human-review status

All 60 records correctly remained machine-screened with human review pending. No named human approval was claimed, and no automated check was mislabeled as human review. False human-review status count: **0**.

## Publication threshold

The verified production corpus remains empty and no regional page meets the repository threshold. Candidate discovery across jurisdictions is not evidence of regional representation. No production record or regional page may be created from this batch until a registered follow-up protocol, source/locator reconciliation, native-language review where required, and named human decisions are complete.

## Recommendation

Return the batch for research. Preserve the corrected candidate queue as discovery material only. Do not merge or publish it as verified evidence.
