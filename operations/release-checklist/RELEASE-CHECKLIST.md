# Release checklist

- Confirm one reviewed batch per research branch and exact prompt version.
- Run `npm ci` and `npm run check` from a clean checkout.
- Confirm human approvals required by thresholds name the actual reviewer.
- Confirm staging, fixtures, review notes, private data, and disputed rights are absent from `docs/`.
- Confirm exports, checksums, release counts, fingerprint, schemas, sitemap, feed, search, and structured data agree.
- Inspect representative pages with keyboard navigation and at mobile and desktop widths.
- Confirm the upstream snapshot commits and fallback manifests.
- Review changelog, correction history, limitations, licensing, analytics privacy, and deployment source.
- Deploy through GitHub Pages workflow; run `verify:live` against the resulting URL.
- Do not merge without authorized human approval.
