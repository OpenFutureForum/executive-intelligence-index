import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import YAML from 'yaml';
import { DIRECTORY_SCHEMA, fail, listFiles, loadCanonical, published, readJson, recordId, sha256, stable, writeJson, type LoadedRecord } from './lib/records.js';
import { publicationIssues } from './lib/publication.js';

const root = process.cwd();
const args = process.argv.slice(2);
const records = loadCanonical(root);

function result(name: string, details: string): void { process.stdout.write(`PASS ${name}: ${details}\n`); }
function getSchemaValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const schemaFiles = listFiles(path.join(root, 'schema'), '.schema.json');
  const schemas = schemaFiles.map(readJson);
  for (const schema of schemas) ajv.addSchema(schema);
  return ajv;
}
function schemaId(name: string): string { return `https://openfutureforum.github.io/executive-intelligence-index/schema/${name}.schema.json`; }
function allStrings(value: any): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}
function validateData(): void {
  const errors: string[] = [];
  const ajv = getSchemaValidator();
  const ids = new Map<string, string>();
  const canonicalUrls = new Map<string, string>();
  const isbns = new Map<string, string>();
  const upstreamIds = new Map<string, string>();
  for (const item of records) {
    const validate = ajv.getSchema(schemaId(item.schema));
    if (!validate) errors.push(`${item.file}: missing schema ${item.schema}`);
    else if (!validate(item.record)) errors.push(`${item.file}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
    const id = recordId(item.record);
    if (!id) errors.push(`${item.file}: no stable ID`);
    else if (ids.has(id)) errors.push(`${item.file}: duplicate ID ${id} also in ${ids.get(id)}`);
    else ids.set(id, item.file);
    const url = item.record.canonical_url;
    if (url && canonicalUrls.has(url)) errors.push(`${item.file}: duplicate canonical URL ${url}`);
    else if (url) canonicalUrls.set(url, item.file);
    for (const key of ['ISBN-10', 'ISBN-13']) {
      const isbn = item.record[key]?.replaceAll('-', '');
      if (isbn && !validIsbn(isbn)) errors.push(`${item.file}: invalid ${key} check digit`);
      if (isbn && isbns.has(isbn)) errors.push(`${item.file}: duplicate ISBN ${isbn}`);
      else if (isbn) isbns.set(isbn, item.file);
    }
    for (const [key, value] of Object.entries(item.record)) {
      if ((key.endsWith('_date') || key.endsWith('_at') || key === 'accessed_at') && typeof value === 'string' && value.slice(0, 10) > '2026-08-14') errors.push(`${item.file}: future-date anomaly in ${key}`);
    }
    if (item.record.doi && !/^10\.\d{4,9}\/[\S]+$/i.test(item.record.doi)) errors.push(`${item.file}: invalid DOI`);
    if (item.schema === 'organization-reference' && item.record.canonical_cxo_ecosystem_id) {
      const upstreamId = item.record.canonical_cxo_ecosystem_id;
      if (upstreamIds.has(upstreamId)) errors.push(`${item.file}: upstream organization ID conflicts with ${upstreamIds.get(upstreamId)}`);
      else upstreamIds.set(upstreamId, item.file);
    }
  }
  const retired = path.join(root, 'data', 'aliases', 'retired-ids.json');
  if (fs.existsSync(retired)) for (const id of readJson(retired).retired_ids ?? []) if (ids.has(id)) errors.push(`retired ID reused: ${id}`);
  const aliases = path.join(root, 'data', 'aliases', 'aliases.json');
  if (fs.existsSync(aliases) && (readJson(aliases).unresolved ?? []).length) errors.push('unresolved aliases remain in canonical alias file');
  if (errors.length) fail(errors);
  result('data', `${records.length} canonical record(s), ${Object.keys(DIRECTORY_SCHEMA).length} entity directories`);
}
function validIsbn(isbn: string): boolean {
  if (/^\d{9}[\dX]$/.test(isbn)) return isbn.split('').reduce((sum, digit, index) => sum + (digit === 'X' ? 10 : Number(digit)) * (10 - index), 0) % 11 === 0;
  if (/^\d{13}$/.test(isbn)) return isbn.split('').reduce((sum, digit, index) => sum + Number(digit) * (index % 2 ? 3 : 1), 0) % 10 === 0;
  return false;
}
function validateProvenance(): void {
  const errors = records.flatMap(({ file, record }) => {
    const messages: string[] = [];
    if (!Array.isArray(record.provenance) || !record.provenance.length) messages.push(`${file}: missing provenance`);
    for (const entry of record.provenance ?? []) for (const field of ['source_url','accessed_at','retrieval_method','batch_id','prompt_id','prompt_version']) if (!entry[field]) messages.push(`${file}: provenance missing ${field}`);
    if (record.source_type && !record.original_url) messages.push(`${file}: source missing original URL`);
    if (record.source_type && !record.publisher) messages.push(`${file}: source missing original publisher`);
    if (record.source_type && !record.ownership_status) messages.push(`${file}: source missing ownership status`);
    if (record.source_type && !record.rights_status) messages.push(`${file}: source missing rights status`);
    return messages;
  });
  if (errors.length) fail(errors); result('provenance', `${records.length} record(s) checked`);
}
function validateStatements(): void {
  const errors: string[] = [];
  const sources = new Map(records.filter((item) => item.schema === 'source').map((item) => [item.record.source_id, item.record]));
  for (const { file, record } of records.filter((item) => item.schema === 'statement')) {
    const source = sources.get(record.source_id);
    if (!source) errors.push(`${file}: source ${record.source_id} not found`);
    if (!record.exact_locator) errors.push(`${file}: exact locator missing`);
    if (record.locator_type === 'timestamp') {
      const match = /^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/.exec(record.exact_locator);
      if (!match) errors.push(`${file}: invalid timestamp format`);
      else if (source?.duration_seconds) {
        const seconds = match[3] ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : Number(match[1]) * 60 + Number(match[2]);
        if (seconds > source.duration_seconds) errors.push(`${file}: timestamp exceeds source duration`);
      }
    }
    if (record.locator_type === 'page' && !record.book_edition_id) errors.push(`${file}: page locator lacks edition`);
    if (!record.person_id && !record.institutional_author) errors.push(`${file}: no attributed person or institution`);
    if (record.direct_quote && !record.direct_quote_rights_note) errors.push(`${file}: direct quote lacks rights note`);
    if (source?.original_abstract && normalize(record.neutral_paraphrase) === normalize(source.original_abstract)) errors.push(`${file}: paraphrase duplicates source abstract`);
    if (/[.;]\s+(Separately|Unrelatedly),/i.test(record.neutral_paraphrase)) errors.push(`${file}: possible multiple unrelated propositions`);
  }
  if (errors.length) fail(errors); result('statements', `${records.filter((item) => item.schema === 'statement').length} statement(s) checked`);
}
function normalize(text: string): string { return String(text ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function validatePropositions(): void {
  const errors: string[] = [];
  const statementIds = new Set(records.filter((item) => item.schema === 'statement').map((item) => item.record.statement_id));
  for (const { file, record } of records.filter((item) => item.schema === 'proposition')) {
    const links = [...(record.supporting_statement_ids ?? []), ...(record.challenging_statement_ids ?? []), ...(record.qualifying_statement_ids ?? []), ...(record.refining_statement_ids ?? [])];
    for (const id of links) if (!statementIds.has(id)) errors.push(`${file}: referenced statement ${id} not found`);
    if ((record.workflow_status === 'published' || record.publication_status === 'published') && new Set(links).size < 2) errors.push(`${file}: published proposition has fewer than two statements`);
    if (!record.scope) errors.push(`${file}: scope missing`);
    if (!record.source_diversity_metrics) errors.push(`${file}: source diversity metrics missing`);
    if (/\b(consensus|universally|everyone agrees)\b/i.test(record.neutral_formulation) && !record.consensus_methodology) errors.push(`${file}: unsupported consensus language`);
  }
  if (errors.length) fail(errors); result('propositions', `${records.filter((item) => item.schema === 'proposition').length} proposition(s) checked`);
}
function validateRights(): void {
  const errors: string[] = [];
  for (const { file, record } of records) {
    if (record.source_type && record.ownership_status === 'third_party' && record.transcript_status === 'full' && record.transcript_republication_permission !== 'permission_documented') errors.push(`${file}: third-party full transcript lacks permission`);
    const text = allStrings(record).join(' ');
    if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) errors.push(`${file}: email address detected`);
    if (/\b(attendee list|off[- ]the[- ]record|private forum select discussion)\b/i.test(text)) errors.push(`${file}: potential confidential content`);
    if (record.rights_status === 'disputed' && (record.workflow_status === 'published' || record.publication_status === 'published')) errors.push(`${file}: disputed rights record is public`);
  }
  const productionText = listFiles(path.join(root, 'content')).flatMap((file) => fs.readFileSync(file, 'utf8')).join('\n');
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(productionText)) errors.push('content/: email address detected');
  if (errors.length) fail(errors); result('rights/privacy', `${records.length} record(s) and public content checked`);
}
function validateContent(): void {
  const errors: string[] = [];
  const files = [...listFiles(path.join(root, 'content')), ...listFiles(path.join(root, 'src', 'pages'))];
  const seen = new Map<string, string>();
  const prohibited = [/in today'?s rapidly evolving landscape/i, /\bbest thought leaders\b/i, /\bworld[- ]class\b/i, /\bunprecedented transformation\b/i];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const pattern of prohibited) if (pattern.test(text)) errors.push(`${file}: prohibited generic or promotional language ${pattern}`);
    const paragraphs = text.split(/\n\s*\n/).map(normalize).filter((value) => value.length > 120);
    for (const paragraph of paragraphs) {
      if (seen.has(paragraph)) errors.push(`${file}: duplicate long-form paragraph also in ${seen.get(paragraph)}`);
      else seen.set(paragraph, file);
    }
  }
  if (errors.length) fail(errors); result('content quality', `${files.length} file(s) checked`);
}
function validatePublication(): void {
  const errors = records.flatMap(({ file, record }) => publicationIssues(record, file));
  if (errors.length) fail(errors); result('publication', `${published(records).length} public record(s); staging excluded by architecture`);
}
function validateAttributions(): void { validateStatements(); }
function validateBookEditions(): void {
  const works = new Set(records.filter((item) => item.schema === 'book-work').map((item) => item.record.book_work_id));
  const errors = records.filter((item) => item.schema === 'book-edition' && !works.has(item.record.book_work_id)).map((item) => `${item.file}: missing parent work ${item.record.book_work_id}`);
  if (errors.length) fail(errors); result('book editions', `${works.size} work(s) linked`);
}
function duplicateAudit(): void {
  const groups = new Map<string, string[]>();
  for (const item of records) for (const value of [item.record.canonical_name, item.record.canonical_title, item.record.title, item.record.neutral_formulation].filter(Boolean)) {
    const key = normalize(value); groups.set(key, [...(groups.get(key) ?? []), `${recordId(item.record)} (${item.file})`]);
  }
  const duplicates = [...groups.entries()].filter(([, values]) => values.length > 1);
  writeJson(path.join(root, 'operations', 'coverage-dashboard', 'duplicate-report.json'), { generated_at: '2026-08-14', duplicates });
  if (duplicates.length) fail(duplicates.map(([key, values]) => `near duplicate "${key}": ${values.join(', ')}`));
  result('duplicates', 'no duplicate normalized titles or names');
}
function concentrationAudit(): void {
  const publicSources = published(records).filter((item) => item.schema === 'source').map((item) => item.record);
  const byPublisher: Record<string, number> = {};
  for (const source of publicSources) byPublisher[source.publisher ?? 'unknown'] = (byPublisher[source.publisher ?? 'unknown'] ?? 0) + 1;
  const total = publicSources.length;
  const shares = Object.fromEntries(Object.entries(byPublisher).map(([name, count]) => [name, total ? count / total : 0]));
  writeJson(path.join(root, 'operations', 'coverage-dashboard', 'source-concentration.json'), { generated_at: '2026-08-14', total, publisher_shares: shares, warning_threshold: 0.4 });
  result('concentration', `${total} public source(s); ${Object.values(shares).filter((share) => share > .4).length} warning(s)`);
}
function coverageAudit(): void {
  const counts = Object.fromEntries(Object.keys(DIRECTORY_SCHEMA).map((directory) => [directory, published(records).filter((item) => item.directory === directory).length]));
  writeJson(path.join(root, 'operations', 'coverage-dashboard', 'coverage.json'), { generated_at: '2026-08-14', public_record_counts: counts, limitation: 'Counts describe the indexed corpus only.' });
  result('coverage', `${published(records).length} public record(s)`);
}
function generateExports(): void {
  const publicItems = published(records).sort((a, b) => recordId(a.record).localeCompare(recordId(b.record)));
  const grouped = Object.fromEntries(Object.keys(DIRECTORY_SCHEMA).map((directory) => [directory, publicItems.filter((item) => item.directory === directory).map((item) => item.record)]));
  fs.mkdirSync(path.join(root, 'exports', 'json'), { recursive: true });
  fs.mkdirSync(path.join(root, 'exports', 'csv'), { recursive: true });
  fs.mkdirSync(path.join(root, 'exports', 'ndjson'), { recursive: true });
  fs.mkdirSync(path.join(root, 'exports', 'graphml'), { recursive: true });
  fs.mkdirSync(path.join(root, 'exports', 'citations'), { recursive: true });
  fs.mkdirSync(path.join(root, 'exports', 'bibliographies'), { recursive: true });
  fs.mkdirSync(path.join(root, 'exports', 'release-manifests'), { recursive: true });
  writeJson(path.join(root, 'exports', 'json', 'catalog.json'), { schema_version: '1.0.0', generated_for_release: '0.1.0', records: grouped });
  fs.writeFileSync(path.join(root, 'exports', 'ndjson', 'catalog.ndjson'), publicItems.map((item) => JSON.stringify({ entity_type: item.schema, ...item.record })).join('\n') + (publicItems.length ? '\n' : ''));
  for (const directory of Object.keys(DIRECTORY_SCHEMA)) fs.writeFileSync(path.join(root, 'exports', 'csv', `${directory}.csv`), toCsv(grouped[directory] ?? []));
  fs.writeFileSync(path.join(root, 'exports', 'graphml', 'graph.graphml'), graphml(publicItems));
  fs.writeFileSync(path.join(root, 'exports', 'citations', 'records.bib'), '% No public research records in release 0.1.0.\n');
  fs.writeFileSync(path.join(root, 'exports', 'bibliographies', 'README.md'), '# Bibliographies\n\nNo public research records are present in release 0.1.0.\n');
  const exportFiles = listFiles(path.join(root, 'exports')).filter((file) => !file.endsWith('release-manifest.json'));
  const checksums = Object.fromEntries(exportFiles.map((file) => [path.relative(root, file), sha256(fs.readFileSync(file))]));
  const manifest = { release_id: 'release-0.1.0-framework', semantic_version: '0.1.0', schema_version: '1.0.0', data_version: '0.0.0', content_version: '0.1.0', release_date: '2026-08-14', public_record_counts: Object.fromEntries(Object.entries(grouped).map(([key, value]) => [key, value.length])), checksums, release_fingerprint: sha256(stable(checksums)), upstream_crosswalk_versions: YAML.parse(fs.readFileSync(path.join(root, 'config', 'external-projects.yml'), 'utf8')).projects.map((project: any) => ({ project_id: project.project_id, upstream_commit: project.upstream_commit })), limitations: ['Framework release contains no production research records.', 'No human editorial approval has occurred.', 'Live deployment has not been verified.'] };
  writeJson(path.join(root, 'exports', 'release-manifests', 'release-manifest.json'), manifest);
  result('exports', `${publicItems.length} public record(s), fingerprint ${manifest.release_fingerprint}`);
}
function toCsv(items: any[]): string {
  const headers = [...new Set(items.flatMap((item) => Object.keys(item)))].sort();
  if (!headers.length) return 'record_id\n';
  const cell = (value: any) => `"${String(typeof value === 'object' ? JSON.stringify(value) : value ?? '').replaceAll('"', '""')}"`;
  return `${headers.map(cell).join(',')}\n${items.map((item) => headers.map((key) => cell(item[key])).join(',')).join('\n')}${items.length ? '\n' : ''}`;
}
function graphml(items: LoadedRecord[]): string {
  const nodes = items.map((item) => `    <node id="${escapeXml(recordId(item.record))}"><data key="type">${item.schema}</data></node>`).join('\n');
  const stances = items.filter((item) => item.schema === 'stance').map((item) => `    <edge source="${escapeXml(item.record.statement_id)}" target="${escapeXml(item.record.proposition_id)}"><data key="relationship">${escapeXml(item.record.relationship_type)}</data></edge>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns"><key id="type" for="node" attr.name="type" attr.type="string"/><key id="relationship" for="edge" attr.name="relationship" attr.type="string"/><graph id="oeii" edgedefault="directed">\n${nodes}${nodes ? '\n' : ''}${stances}${stances ? '\n' : ''}  </graph></graphml>\n`;
}
function escapeXml(value: string): string { return String(value ?? '').replace(/[<>&"']/g, (char) => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;' }[char]!)); }
function reviewPackets(): void {
  const batches = listFiles(path.join(root, 'staging', 'batches')).filter((file) => file.endsWith('manifest.yml'));
  const index = batches.map((file) => ({ batch: path.basename(path.dirname(file)), manifest: path.relative(root, file) }));
  writeJson(path.join(root, 'review-tools', 'generated', 'packet-index.json'), { generated_at: '2026-08-14', batches: index, fields: ['proposed record','canonical source','exact locator','previous version','proposed change','statement type','confidence','rights status','duplication warnings','source concentration','AI-generated prose','reviewer decision'] });
  result('review packets', `${index.length} batch packet(s)`);
}
function rightsReport(): void {
  const rows = records.filter((item) => item.record.rights_status).map((item) => ({ record_id: recordId(item.record), entity_type: item.schema, rights_status: item.record.rights_status, ownership_status: item.record.ownership_status ?? 'not_applicable', permission: item.record.transcript_republication_permission ?? item.record.publication_permission ?? null }));
  writeJson(path.join(root, 'operations', 'coverage-dashboard', 'rights-review.json'), { generated_at: '2026-08-14', records: rows, unresolved_count: rows.filter((row) => ['unknown','disputed'].includes(row.rights_status)).length });
  result('rights report', `${rows.length} rights-bearing record(s)`);
}
function releaseReadiness(): void {
  const publicItems = published(records); const issues = records.flatMap(({ file, record }) => publicationIssues(record, file));
  const report = { generated_at: '2026-08-14', ready: issues.length === 0, public_record_count: publicItems.length, issues, required_human_action: publicItems.length ? 'Confirm named approvals and release record.' : 'Approve the framework; register a separate research protocol before ingestion.', live_verification: 'pending_until_deployment' };
  writeJson(path.join(root, 'operations', 'coverage-dashboard', 'release-readiness.json'), report);
  result('release readiness', `${issues.length} blocking record issue(s); live deployment pending`);
}
function calculateTrends(): void {
  const trendRecords = records.filter((item) => item.schema === 'trend-snapshot'); const errors: string[] = [];
  for (const { file, record } of trendRecords) {
    const weightTotal = Object.values(record.weights ?? {}).reduce((sum: number, value: any) => sum + Number(value), 0);
    if (Math.abs(weightTotal - 1) > 0.000001) errors.push(`${file}: trend weights sum to ${weightTotal}, not 1`);
    if (!record.frozen_corpus_release || record.eligible_source_count === null) errors.push(`${file}: frozen release or denominator missing`);
  }
  if (errors.length) fail(errors); result('trends', `${trendRecords.length} frozen-corpus snapshot(s) checked`);
}
function postbuild(): void {
  const target = path.join(root, 'docs', 'data'); fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(path.join(root, 'exports', 'json', 'catalog.json'), path.join(target, 'catalog.json'));
  fs.copyFileSync(path.join(root, 'exports', 'ndjson', 'catalog.ndjson'), path.join(target, 'catalog.ndjson'));
  fs.copyFileSync(path.join(root, 'exports', 'graphml', 'graph.graphml'), path.join(target, 'graph.graphml'));
  fs.copyFileSync(path.join(root, 'exports', 'release-manifests', 'release-manifest.json'), path.join(target, 'release-manifest.json'));
  fs.copyFileSync(path.join(root, 'schema', 'schema-index.json'), path.join(target, 'schema-index.json'));
  fs.copyFileSync(path.join(root, 'CITATION.cff'), path.join(root, 'docs', 'CITATION.cff'));
  for (const file of listFiles(path.join(root, 'schema'), '.json')) { const dir = path.join(target, 'schema'); fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(file, path.join(dir, path.basename(file))); }
  result('postbuild', 'public data, schemas, graph, manifest, and citation copied into docs/');
}
function verifyArtifacts(): void {
  const errors: string[] = [];
  const manifest = readJson(path.join(root, 'exports', 'release-manifests', 'release-manifest.json'));
  for (const [file, expected] of Object.entries(manifest.checksums)) {
    const actual = sha256(fs.readFileSync(path.join(root, file)));
    if (actual !== expected) errors.push(`${file}: checksum mismatch`);
  }
  const publicText = listFiles(path.join(root, 'docs')).flatMap((file) => fs.readFileSync(file)).join('\n');
  if (publicText.includes('fix-person-') || publicText.includes('staging/batches')) errors.push('synthetic or staging content exposed in docs');
  if (!fs.existsSync(path.join(root, 'docs', 'sitemap-index.xml'))) errors.push('sitemap missing');
  if (!fs.existsSync(path.join(root, 'docs', 'pagefind', 'pagefind.js'))) errors.push('Pagefind index missing');
  if (errors.length) fail(errors); result('artifacts', `${Object.keys(manifest.checksums).length} checksums; staging and fixtures absent`);
}
function syncExternal(): void {
  const config = YAML.parse(fs.readFileSync(path.join(root, 'config', 'external-projects.yml'), 'utf8'));
  for (const project of config.projects) writeJson(path.join(root, 'data', 'external', project.project_id, 'snapshot-manifest.json'), { project_id: project.project_id, upstream_repository: project.upstream_repository, upstream_commit: project.upstream_commit, synced_at: '2026-08-14', mapping_rules: project.local_use, matched_records: 0, unmatched_records: 0, ambiguous_records: 0, conflicts: [], last_successful_sync: '2026-08-14', local_fallback_snapshot: true, note: 'Framework-only pinned manifest; no upstream production records copied.' });
  result('external snapshots', `${config.projects.length} pinned manifest(s)`);
}

const command = args.join(' ');
const actions: Record<string, () => void> = {
  'validate data': validateData, 'validate provenance': validateProvenance, 'validate attributions': validateAttributions,
  'validate statements': validateStatements, 'validate propositions': validatePropositions, 'validate book-editions': validateBookEditions,
  'validate source-locators': validateStatements, 'validate rights': validateRights, 'validate review-status': validatePublication,
  'validate publication': validatePublication, 'audit duplicates': duplicateAudit, 'audit concentration': concentrationAudit,
  'validate content': validateContent,
  'audit coverage': coverageAudit, 'generate exports': generateExports, 'generate review-packets': reviewPackets,
  'generate search-index': () => result('search index', 'generated during npm run build by Pagefind'),
  'generate graph': generateExports, 'generate citations': generateExports, 'generate release': generateExports, 'generate postbuild': postbuild,
  'report rights': rightsReport, 'report release-readiness': releaseReadiness, 'calculate trends': calculateTrends,
  'verify artifacts': verifyArtifacts, 'sync external': syncExternal
};
if (!actions[command]) fail([`unknown command: ${command}`]);
actions[command]();
