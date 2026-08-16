# Stable ID standard

IDs are lowercase ASCII, immutable, opaque to editorial ranking, and unique across the repository. They use an entity prefix and stable slug or sequence, for example `person-…`, `orgref-…`, `bookwork-…`, `bookedition-…`, `source-…`, `statement-…`, `proposition-…`, `stance-…`, `topic-…`, `debate-…`, `dossier-…`, `trend-…`, `protocol-…`, `batch-…`, `review-…`, `correction-…`, and `release-…`.

An ID does not encode a current role, employer, rank, status, geography, or title likely to change. Renames preserve the ID and add an alias. Merges retain one canonical ID and retire the other with a redirect or alias record. Withdrawn and retired IDs remain reserved in `data/aliases/retired-ids.json` and are never reassigned.

Fixture IDs begin `fix-`, exist only under `tests/fixtures/`, and are rejected from public artifacts. External IDs retain their source namespace and never silently become local canonical IDs.
