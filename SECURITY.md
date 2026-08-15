# Security policy

Report security vulnerabilities privately through GitHub's security advisory feature when available. Do not open a public issue containing a secret, exploit detail, private source, personal data, or confidential OFF information.

The project has no production database or runtime API and requires no committed secret. Analytics identifiers are optional environment values. Workflows receive least-privilege permissions, builds do not fetch live upstream data, dependencies are pinned, and Dependabot proposes updates. Suspected secret exposure blocks release and requires credential rotation outside this repository.
