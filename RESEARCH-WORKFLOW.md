# Research workflow

## One batch, one branch, one draft pull request

Never research on `main`. Create a branch such as `research/BATCH-2026-001-topic-slug`, register one protocol, scaffold one batch, and open one draft pull request after local validation. Schema and controlled-vocabulary changes are separate work unless explicitly authorized.

## Sequence

1. Register the question, scope, dates, inclusion, exclusion, diversity objectives, searches, and limitations.
2. Log every source considered. Record accepted, rejected, and held decisions.
3. Verify canonical identity, access, rights, ownership, publisher, and role at source time.
4. Create atomic but meaningful statements with exact locators.
5. Propose neutral propositions only when evidence and scope permit.
6. Run independent checking for configured high-impact records and record disagreements.
7. Generate a local review packet. Do not publish internal notes.
8. Run `npm run check`; include every command and actual outcome in the batch manifest.
9. Obtain named human approval where required. An agent never sets approval.
10. Generate release artifacts and request review through a draft pull request.

## Failure behavior

Never guess. Mark incomplete work `hold` or `research_required`, state missing evidence and the access that would resolve it, add it to the correct queue, and continue with valid records.
