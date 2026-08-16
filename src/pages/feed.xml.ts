import type { APIRoute } from 'astro';
import { labelOf, loadCatalog, publicRecords } from '../lib/catalog';
const escape = (value: string) => value.replace(/[<>&"']/g, (character) => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;' }[character]!));
export const GET: APIRoute = () => {
  const catalog = loadCatalog();
  const entries = [...publicRecords(catalog.sources ?? []), ...publicRecords(catalog.dossiers ?? [])].sort((a, b) => String(b.published_at ?? b.publication_date ?? '').localeCompare(String(a.published_at ?? a.publication_date ?? ''))).slice(0, 20).map((record) => {
    const id = String(record.source_id ?? record.dossier_id); const date = String(record.published_at ?? record.publication_date ?? '2026-08-14');
    return `<entry><title>${escape(labelOf(record))}</title><id>urn:oeii:${escape(id)}</id><updated>${escape(date)}T00:00:00Z</updated><summary>${escape(String(record.original_abstract ?? record.inclusion_rationale ?? 'Reviewed index record.'))}</summary></entry>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Open Executive Intelligence Index</title><id>https://openfutureforum.github.io/executive-intelligence-index/</id><updated>2026-08-14T00:00:00-07:00</updated><link href="https://openfutureforum.github.io/executive-intelligence-index/feed.xml" rel="self"/><subtitle>${entries ? 'Recently published reviewed records.' : 'No production research entries have passed publication review.'}</subtitle>${entries}</feed>`, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
