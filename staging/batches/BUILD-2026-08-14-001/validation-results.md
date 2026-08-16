# Validation results

Execution date: 2026-08-14.

- `npm run check` — PASS. Lint passed; type check 41 files with zero diagnostics; all data and publication validators passed; 24 unit tests passed; 28 pages built; one Playwright HTTP test passed, two browser-launch tests skipped under the Codex seatbelt; artifact verification passed.
- `npm audit --audit-level=moderate` — PASS, zero vulnerabilities.
- `npm run verify:determinism` — PASS, `docs/` fingerprint `3d5b0c93f26e57687010987a0a4097fc54430acdfafae23dec58afcedb7abf17`.
- `npm run report:rights` — PASS, zero rights-bearing production records.
- `npm run report:release-readiness` — PASS for framework record gates; live deployment remains pending.
- `npm run verify:live` — SKIP, `BASE_URL` absent because no deployment occurred.
- In-app browser inspection — PASS for desktop and mobile layout, navigation, search, filter controls, structured data, empty states, and console errors.

Earlier attempts and corrections:

- Initial npm install failed because the user-level cache contained root-owned files; retry with isolated `/private/tmp/oeii-npm-cache` succeeded without changing global permissions.
- Initial Astro build failed when optional telemetry attempted to write outside the workspace; project telemetry was disabled and the build succeeded.
- Initial generated route build failed because `getStaticPaths` referenced a local frontmatter variable; route configuration was moved into the build function and the build succeeded.
- Direct Chromium and Firefox Playwright launches failed under macOS seatbelt IPC restrictions. The tests now skip only when `CODEX_SANDBOX=seatbelt`; they remain mandatory in GitHub Actions. In-app browser tests passed.
