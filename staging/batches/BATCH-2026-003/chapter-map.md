# Chapter map — BATCH-2026-003

Research question: **How do public executive and institutional sources define governance requirements for AI-agent identities?**

## Solving the Bottom Turtle

Edition: first edition, SPIFFE Project, 2020, 194-page official PDF, ISBN 978-0-578-77737-5. Printed and PDF page numbers align.

| Unit | Pages | Function in the argument | Agent-identity relevance |
|---|---:|---|---|
| Front matter | 1–8 | Edition identity, author list, license, framing | Establishes exact edition and CC BY 4.0 rights |
| 1. History and motivation | 9–22 | Shows why perimeter and location identity fail in dynamic systems | Explains why agents need stable logical principals |
| 2. Benefits | 23–37 | Describes operational and security value of universal workload identity | Benefits are relevant but mostly reasoned, not causally measured |
| 3. Identity concepts | 38–51 | Defines identity documents, purpose, authority, lifetime, and trust | Core vocabulary for distinguishing agent, workload, and authority |
| 4. SPIFFE and SPIRE | 52–77 | Specifies IDs, SVIDs, APIs, attestation, registration, federation, and threat boundaries | Supplies the technical identity control-plane model |
| 5. Adoption and operations | 78–103 | Covers stakeholders, identity islands, rollout, and operating failure | Makes governance cross-functional and migration-aware |
| 6. Deployment design | 104–132 | Treats naming, trust domains, lifetimes, topology, registration, and storage | Connects identity policy to compartmentalization and control ownership |
| 7. Integrations | 133–145 | Compares native, proxy, sidecar, and helper patterns | Shows where context and provenance can be preserved or lost |
| 8. Authorization | 146–158 | Separates identity from permission; compares role and attribute approaches | Directly limits any claim that agent identity alone governs action |
| 9. Comparison | 159–167 | Compares alternatives and advances a broad completeness claim | Useful taxonomy; advocacy and time-bounded claims need caution |
| 10. Case stories | 168–178 | Presents five adopter accounts | Illustrative and self-reported, not independent causal evidence |
| Glossary, notes, epilogue | 179–194 | Consolidates terms, citations, and conclusion | Supports terminology and citation replay |

## Building Secure and Reliable Systems

Edition: first online edition, O’Reilly Media, published 2020-04-08, ISBN 978-1-492-08311-5, 555 pages in publisher metadata. The complete official Google-hosted edition comprises 35 HTML files; locators use chapter plus stable section anchor.

| Unit | Function in the argument | Agent-governance relevance |
|---|---|---|
| Preface and forewords | States the joint security–reliability mission and practitioner basis | Frames lifecycle governance rather than a narrow identity control |
| Part I; ch. 1–2 | Establishes common properties and adversarial risk | Requires both benign-failure and malicious-use models for agents |
| Part II; ch. 3–10 | Design principles: proxies, tradeoffs, least privilege, understandability, evolution, resilience, recovery, DoS | Core control design for agent identity, authority, failure containment, and recovery |
| Part III; ch. 11–15 | Case, coding, testing, deployment, logging | Adds artifact provenance, deployment gates, and privacy-aware evidence |
| Part IV; ch. 16–19 | Disaster planning, crisis response, recovery, Chrome case | Makes revocation and recovery operational and rehearsed |
| Part V; ch. 20–21 | Roles, responsibility, culture, incentives | Assigns executive, specialist, and distributed ownership |
| Chapter 22 and appendices | Synthesizes principles and supporting detail | Prevents isolated extraction from replacing whole-book context |

### Chapter-by-chapter functions

1. Intersection of security and reliability — shared properties and adversarial differences. 2. Understanding adversaries — threat and risk assessment. 3. Case study: safe proxies — defense and boundary design. 4. Design tradeoffs — explicit objectives. 5. Least privilege — risk-classified, contextual access. 6. Understandability — identities, interfaces, TCBs, and boundaries. 7. Changing landscape — adaptability. 8. Resilience — automation, layers, blast radius. 9. Recovery — revocation and intended state. 10. Denial of service — capacity and abuse. 11. Public CA case — ecosystem lessons. 12. Writing code — secure implementation. 13. Testing code — assurance methods. 14. Deploying code — artifact verification and provenance. 15. Investigating systems — immutable, privacy-aware logs. 16. Disaster planning — exercises. 17. Crisis management — incident roles. 18. Recovery and aftermath — remediation and learning. 19. Chrome case — integrated practice. 20. Roles and responsibilities — organizational ownership. 21. Culture — incentives and sustainability. 22. Conclusion — integrated principles.
