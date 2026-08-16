# Optional analytics

Analytics are disabled by default and configured through public environment variables documented in `config/analytics.example.yml`. Canonical source records never receive tracking parameters. Rendered links and controls emit named first-party events without email addresses, private IDs, attendee information, search-account identifiers, or other personal data.

Test by listening for the browser event `oeii:analytics` in a local build, activating the relevant control, and confirming only the configured event name and non-personal value are present. Connect an approved provider at the layout boundary; do not commit credentials. Google Search Console ownership and sitemap submission are deployment-administrator steps and are not claimed by this repository build.
