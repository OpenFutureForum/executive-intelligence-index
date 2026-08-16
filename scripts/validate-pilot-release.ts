import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative: string): any => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const failures: string[] = [];
const fail = (message: string): void => { failures.push(message); };
const expect = (condition: unknown, message: string): void => { if (!condition) fail(message); };

const people = read('data/people/governed-identities-pilot.json');
const works = read('data/book-works/governed-identities-pilot.json');
const editions = read('data/book-editions/governed-identities-pilot.json');
const sources = read('data/sources/governed-identities-pilot.json');
const statements = read('data/statements/governed-identities-pilot.json');
const review = read('data/reviews/governed-identities-pilot.json');
const release = read('data/releases/release-0.2.0-governed-identities-pilot.json');
const promotion = read('operations/releases/0.2.0-pilot-promotion.json');

const counts = { people: 48, works: 8, editions: 11, sources: 20, statements: 100 };
const collections: Record<string, any[]> = { people, works, editions, sources, statements };
for (const [name, expected] of Object.entries(counts)) {
  const actual = collections[name]?.length ?? -1;
  expect(actual === expected, `${name}: expected ${expected}, received ${actual}`);
}

const all = [...people, ...works, ...editions, ...sources, ...statements];
const ids = new Set(all.map((record) => Object.entries(record).find(([key]) => key === 'id' || key.endsWith('_id'))?.[1]));
expect(ids.size === all.length, 'stable record IDs are not unique');
expect(review.record_ids.length === all.length && review.record_ids.every((id: string) => ids.has(id)), 'human review record does not enumerate every production research record');
expect(promotion.proposed_production_record_ids.length === all.length && promotion.proposed_production_record_ids.every((id: string) => ids.has(id)), 'promotion manifest does not enumerate every production research record');

for (const record of [...all, review, release]) {
  expect(record.workflow_status === 'published', `${record.person_id ?? record.book_work_id ?? record.book_edition_id ?? record.source_id ?? record.statement_id ?? record.review_id ?? record.release_id}: not published`);
  expect(record.human_review_status === 'approved' && record.reviewed_by === 'Murray Newlands' && record.reviewed_at, 'published record lacks Murray Newlands approval metadata');
}
expect(release.approval_status === 'APPROVE PILOT PROMOTION', 'release approval decision is missing');
expect(release.provenance.some((item: any) => String(item.source_url).includes('issuecomment-5310177421')), 'release does not link to the exact approval comment');

const excludedIds = new Set([
  ...promotion.exact_exclusions.work_ids,
  ...promotion.exact_exclusions.edition_ids,
  ...promotion.exact_exclusions.source_ids,
  ...promotion.exact_exclusions.held_media_source_ids
]);
for (const id of excludedIds) expect(!ids.has(id), `excluded record was promoted: ${id}`);
expect(release.included_record_counts.propositions === 0 && release.included_record_counts.debates === 0 && release.included_record_counts.dossiers === 0 && release.included_record_counts.trends === 0, 'excluded synthesis entity count is nonzero');

expect(people.every((person: any) => person.public_profile_eligibility === false), 'a person below the configured profile threshold was marked profile-eligible');
for (const personId of ['person-BATCH-2026-005-mislav-balunovic', 'person-BATCH-2026-005-richard-fang']) {
  const person = people.find((item: any) => item.person_id === personId);
  expect(person && person.current_role === null && person.current_organization_reference === null, `${personId}: unresolved current role was published as resolved`);
}

const sourceIds = new Set(sources.map((source: any) => source.source_id));
const editionIds = new Set(editions.map((edition: any) => edition.book_edition_id));
const workIds = new Set(works.map((work: any) => work.book_work_id));
const personIds = new Set(people.map((person: any) => person.person_id));
for (const statement of statements) {
  expect(sourceIds.has(statement.source_id), `${statement.statement_id}: source lineage is missing`);
  if (statement.book_edition_id) expect(editionIds.has(statement.book_edition_id), `${statement.statement_id}: edition lineage is missing`);
  if (statement.person_id) expect(personIds.has(statement.person_id), `${statement.statement_id}: person lineage is missing`);
  expect(statement.direct_quote === null, `${statement.statement_id}: direct quotation is outside this pilot's rights treatment`);
  expect(Boolean(statement.exact_locator), `${statement.statement_id}: exact locator is missing`);
}
for (const edition of editions) expect(workIds.has(edition.book_work_id), `${edition.book_edition_id}: parent work is missing`);

for (const work of works.filter((item: any) => item.analysis_depth === 'deeply_analyzed')) {
  const linked = statements.filter((statement: any) => work.related_statement_ids?.includes(statement.statement_id));
  expect(linked.length >= 8, `${work.book_work_id}: deep analysis has fewer than eight published statements`);
  expect(work.human_review_status === 'approved', `${work.book_work_id}: deep analysis lacks named human approval`);
}

const canonicalUrls = sources.map((source: any) => source.canonical_url);
expect(new Set(canonicalUrls).size === canonicalUrls.length, 'canonical source URLs are duplicated');
for (const source of sources) {
  expect(!['unknown', 'disputed'].includes(source.rights_status), `${source.source_id}: unresolved rights`);
  expect(source.transcript_status !== 'full' || source.transcript_republication_permission === 'permission_documented', `${source.source_id}: full transcript lacks permission`);
}

if (failures.length) {
  for (const failure of failures) process.stderr.write(`ERROR ${failure}\n`);
  process.exit(1);
}
process.stdout.write(`PASS pilot release: ${all.length} exact production research records; exclusions, thresholds, lineage, rights, and approval verified\n`);
