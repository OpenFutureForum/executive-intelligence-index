# Release process

1. Freeze the included batch IDs and upstream crosswalk commits.
2. Confirm named approvals required by publication thresholds.
3. Run `npm ci`, `npm run check`, `npm run report:rights`, `npm run report:release-readiness`, and `npm run verify:determinism`.
4. Update schema, data, content, and semantic versions independently; add migration notes when contracts change.
5. Generate exports and the release manifest. Confirm counts, checksums, and fingerprint.
6. Review the generated `docs/` site, Pagefind search, accessible relationship table, schemas, sitemap, Atom feed, robots file, structured data, and fixture/staging exclusions.
7. Record limitations and changes; create a reviewed release record.
8. Merge only with authorized human approval. GitHub Pages builds and validates `docs/` from `main`.
9. Run `BASE_URL=… npm run verify:live` and record the actual outcome. A local build does not constitute deployment verification.

Generated artifacts are deterministic and inspectable. GitHub workflow artifacts are not themselves approved releases.
