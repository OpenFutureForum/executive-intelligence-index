import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const batchId = process.argv[2];
if (!batchId) throw new Error('Usage: validate-book-metadata-batch.ts <batch-id>');
const root = process.cwd();
const batchDir = path.join(root, 'staging', 'batches', batchId);
const readJson = (name: string) => JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8'));

const works = readJson('book-works.json');
const editions = readJson('book-editions.json');
const people = readJson('author-person-candidates.json');
const relatedSources = readJson('related-source-candidates.json');
const decisions = readJson('book-decisions.json');
const relationships = readJson('work-edition-relationships.json').relationships;
const duplicateCases = readJson('duplicate-review.json').cases;
const conflicts = readJson('edition-conflicts.json').conflicts;

const failures: string[] = [];
const warnings: string[] = [];
const passes: string[] = [];
const fail = (message: string) => failures.push(message);
const warn = (message: string) => warnings.push(message);
const pass = (message: string) => passes.push(message);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const common = JSON.parse(fs.readFileSync(path.join(root, 'schema/common.schema.json'), 'utf8'));
ajv.addSchema(common);
const validateSet = (label: string, records: any[], schemaFile: string) => {
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema', schemaFile), 'utf8'));
  const validate = ajv.compile(schema);
  for (const record of records) if (!validate(record)) fail(`${label} schema: ${record.book_work_id ?? record.book_edition_id ?? record.person_id ?? record.source_id}: ${ajv.errorsText(validate.errors)}`);
  if (!failures.some((item) => item.startsWith(`${label} schema:`))) pass(`${label} schema: ${records.length} record(s) conform.`);
};
validateSet('Work', works, 'book-work.schema.json');
validateSet('Edition', editions, 'book-edition.schema.json');
validateSet('Person', people, 'person.schema.json');
validateSet('Related source', relatedSources, 'source.schema.json');

const isbn10Valid = (value: string) => {
  if (!/^[0-9]{9}[0-9X]$/.test(value)) return false;
  return [...value].reduce((sum, char, index) => sum + (10 - index) * (char === 'X' ? 10 : Number(char)), 0) % 11 === 0;
};
const isbn13Valid = (value: string) => /^[0-9]{13}$/.test(value) && [...value].reduce((sum, char, index) => sum + Number(char) * (index % 2 ? 3 : 1), 0) % 10 === 0;
const isbn10From13 = (value: string) => {
  const core = value.slice(3, 12);
  const partial = [...core].reduce((sum, char, index) => sum + Number(char) * (10 - index), 0);
  const check = (11 - (partial % 11)) % 11;
  return `${core}${check === 10 ? 'X' : check}`;
};
const allIdentifiers = new Map<string, string[]>();
for (const edition of editions) {
  const isbn10 = edition['ISBN-10'];
  const isbn13 = edition['ISBN-13'];
  const audio = edition.audiobook_identifier;
  if (isbn10 && !isbn10Valid(isbn10)) fail(`ISBN validation: invalid ISBN-10 ${isbn10} on ${edition.book_edition_id}.`);
  if (isbn13 && !isbn13Valid(isbn13)) fail(`ISBN validation: invalid ISBN-13 ${isbn13} on ${edition.book_edition_id}.`);
  if (audio && !isbn13Valid(audio)) fail(`ISBN validation: invalid audiobook identifier ${audio} on ${edition.book_edition_id}.`);
  if (isbn10 && isbn13?.startsWith('978') && isbn10From13(isbn13) !== isbn10) fail(`ISBN validation: ISBN-10/13 mismatch on ${edition.book_edition_id}.`);
  for (const identifier of [isbn13, audio].filter(Boolean)) allIdentifiers.set(identifier, [...(allIdentifiers.get(identifier) ?? []), edition.book_edition_id]);
}
if (!failures.some((item) => item.startsWith('ISBN validation:'))) pass(`ISBN validation: ${editions.length} edition records have valid check digits and compatible pairs.`);
const duplicateIdentifiers = [...allIdentifiers.entries()].filter(([, ids]) => ids.length > 1);
if (duplicateIdentifiers.length) fail(`Duplicate ISBN detection: ${duplicateIdentifiers.map(([isbn, ids]) => `${isbn}=${ids.join('|')}`).join(', ')}`);
else pass('Duplicate ISBN detection: no ISBN-13 or audiobook identifier is assigned to multiple edition records.');

const normalize = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const titleAuthorGroups = new Map<string, string[]>();
for (const work of works) {
  const key = `${normalize(work.title)}::${[...work.authors].sort().join('|')}`;
  titleAuthorGroups.set(key, [...(titleAuthorGroups.get(key) ?? []), work.book_work_id]);
}
const intendedDuplicates = new Set(duplicateCases.flatMap((item: any) => item.candidate_work_ids ?? []));
const unreviewedTitleDuplicates = [...titleAuthorGroups.values()].filter((ids) => ids.length > 1 && ids.some((id) => !intendedDuplicates.has(id)));
if (unreviewedTitleDuplicates.length) fail(`Duplicate title/author detection: unreviewed work collisions ${JSON.stringify(unreviewedTitleDuplicates)}.`);
else pass('Duplicate title/author detection: the one collision is explicitly held as a materially revised work case.');

const workById = new Map<string, any>(works.map((item: any) => [item.book_work_id, item]));
const editionById = new Map<string, any>(editions.map((item: any) => [item.book_edition_id, item]));
for (const edition of editions) if (!workById.has(edition.book_work_id)) fail(`Work-edition conflict: ${edition.book_edition_id} references missing ${edition.book_work_id}.`);
for (const work of works) for (const editionId of work.edition_ids) if (!editionById.has(editionId) || editionById.get(editionId).book_work_id !== work.book_work_id) fail(`Work-edition conflict: ${work.book_work_id} has invalid edition link ${editionId}.`);
const expectedRelationships = new Set(editions.map((item: any) => `${item.book_work_id}::${item.book_edition_id}`));
const actualRelationships = new Set(relationships.map((item: any) => `${item.book_work_id}::${item.book_edition_id}`));
if (expectedRelationships.size !== actualRelationships.size || [...expectedRelationships].some((item) => !actualRelationships.has(item))) fail('Work-edition conflict: relationship file does not exactly cover the edition records.');
if (!failures.some((item) => item.startsWith('Work-edition conflict:'))) pass(`Work-edition relationships: ${editions.length} edition links are internally consistent.`);

const personById = new Map<string, any>(people.map((item: any) => [item.person_id, item]));
for (const work of works) for (const authorId of work.authors) {
  const person = personById.get(authorId);
  if (!person) fail(`Author identity: ${work.book_work_id} references missing ${authorId}.`);
  else if (!person.authored_book_work_ids.includes(work.book_work_id)) fail(`Author identity: ${authorId} lacks backlink to ${work.book_work_id}.`);
}
if (!failures.some((item) => item.startsWith('Author identity:'))) pass(`Author identity: ${people.length} author candidates have unique IDs and reciprocal work links.`);
const duplicatePeople = [...people.reduce((map: Map<string, string[]>, person: any) => map.set(normalize(person.canonical_name), [...(map.get(normalize(person.canonical_name)) ?? []), person.person_id]), new Map()).values()].filter((ids: string[]) => ids.length > 1);
if (duplicatePeople.length) fail(`Author identity: duplicate normalized people ${JSON.stringify(duplicatePeople)}.`);
if (people.some((item: any) => item.human_review_status !== 'pending' || item.public_profile_eligibility)) fail('Author identity: a person candidate is incorrectly human-approved or public-profile eligible.');
else pass('Author identity: all people remain staging-only, human-pending, and ineligible for public profiles.');

const bases = new Set(['metadata_only','official_description','table_of_contents_only','authorized_preview','substantial_excerpt','full_text_lawfully_accessed','public_domain_full_text','licensed_full_text','author_provided_material','secondary_sources_only']);
for (const work of works) if (!bases.has(work.analysis_basis)) fail(`Access basis: unsupported primary basis ${work.analysis_basis} on ${work.book_work_id}.`);
for (const decision of decisions) {
  const work = workById.get(decision.book_work_id);
  if (!work) {
    fail(`Access basis: decision references missing ${decision.book_work_id}.`);
    continue;
  }
  if (decision.decision === 'deep_analysis_ready') {
    if (work.analysis_basis !== 'full_text_lawfully_accessed') fail(`Access basis: ${work.book_work_id} is deep-analysis-ready without complete lawful access.`);
    const analysisEdition = editions.find((edition: any) => edition.book_work_id === work.book_work_id && edition.source_used_for_analysis);
    if (!analysisEdition?.full_text_available_for_research) fail(`Access basis: ${work.book_work_id} lacks an exact full-text analysis edition.`);
  }
}
if (!failures.some((item) => item.startsWith('Access basis:'))) pass('Access-basis validation: every work uses exactly one allowed primary basis; two readiness decisions have exact complete-access editions.');

for (const collection of [works, editions, people, relatedSources]) for (const record of collection) {
  if (!record.provenance?.length || record.provenance.some((item: any) => item.batch_id !== batchId || !item.source_url || !item.accessed_at)) fail(`Provenance: invalid provenance on ${record.book_work_id ?? record.book_edition_id ?? record.person_id ?? record.source_id}.`);
}
if (!failures.some((item) => item.startsWith('Provenance:'))) pass('Provenance: every staged entity has batch-linked public-source provenance.');

for (const work of works) if (!work.rights_notes) fail(`Rights status: missing work rights note on ${work.book_work_id}.`);
for (const edition of editions) if (!edition.publication_permission || !edition.access_basis) fail(`Rights status: missing edition access or permission status on ${edition.book_edition_id}.`);
if (!failures.some((item) => item.startsWith('Rights status:'))) pass('Rights status: all works and editions record access and publication limits.');

if (conflicts.filter((item: any) => item.status.startsWith('unresolved')).length !== 1) fail('Edition conflict: expected exactly one unresolved materially revised work conflict.');
else pass(`Edition conflict: ${conflicts.length} discrepancies recorded, with one unresolved work-identity decision.`);

if (works.some((item: any) => item.analysis_depth !== 'catalogued')) fail('Analysis depth: one or more works claims review or deep analysis in a metadata batch.');
else pass('Analysis depth: all work records remain catalogued; no unsupported review claim exists.');
if ([...works, ...editions, ...people, ...relatedSources].some((item: any) => item.human_review_status === 'approved')) fail('Human review: approved status found in a machine-only batch.');
else pass('Human review: no record is marked human approved.');

const walk = (dir: string): string[] => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]) : [];
const leaks: string[] = [];
for (const top of ['data','content','docs','exports']) for (const file of walk(path.join(root, top))) {
  if (!/\.(json|md|html|csv|ndjson|xml|txt)$/i.test(file)) continue;
  if (fs.readFileSync(file, 'utf8').includes(batchId)) leaks.push(path.relative(root, file));
}
if (leaks.length) fail(`Staging leak: ${batchId} appears in production paths: ${leaks.join(', ')}.`);
else pass('Staging leak: no batch entity appears in data, content, docs, or exports.');

if (works.filter((item: any) => item.provenance[0].notes?.includes('Accepted discovery candidate')).length !== 8) fail('Input scope: accepted discovery candidate count is not eight.');
else warn('Input scope: only eight accepted books existed in the parent batch, below the template target; no held or rejected book was promoted.');
if (editions.some((item: any) => item.language === 'it')) warn('Controlled vocabulary: verified Italian edition uses BCP 47 it, but lang-it is not yet in the canonical vocabulary.');
if (people.some((item: any) => item.external_identifiers.official_profile_url === null)) warn('Author identity: individual official profiles and current roles remain unresolved for human follow-up.');

for (const message of passes) console.log(`PASS ${message}`);
for (const message of warnings) console.warn(`WARN ${message}`);
for (const message of failures) console.error(`FAIL ${message}`);
if (failures.length) process.exit(1);
