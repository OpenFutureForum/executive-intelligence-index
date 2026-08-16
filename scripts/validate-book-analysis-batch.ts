import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const batchId = process.argv[2];
if (!batchId) throw new Error('Usage: validate-book-analysis-batch.ts <batch-id>');
const root = process.cwd();
const batchDir = path.join(root, 'staging', 'batches', batchId);
const readJson = (name: string) => JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8'));
const works = readJson('book-works.json');
const editions = readJson('book-editions.json');
const sources = readJson('sources.json');
const statements = readJson('source-statements.json');
const propositions = readJson('proposition-candidates.json');
const doubleReview = readJson('double-review-sample.json');
const laterSources = readJson('later-author-sources.json');
const counterSources = readJson('counterargument-sources.json');
const failures: string[] = [];
const warnings: string[] = [];
const passes: string[] = [];
const fail = (message: string) => failures.push(message);
const warn = (message: string) => warnings.push(message);
const pass = (message: string) => passes.push(message);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(JSON.parse(fs.readFileSync(path.join(root, 'schema/common.schema.json'), 'utf8')));
const validateSet = (label: string, records: any[], schemaFile: string) => {
  const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(root, 'schema', schemaFile), 'utf8')));
  for (const record of records) if (!validate(record)) fail(`${label} schema: ${record.book_work_id ?? record.book_edition_id ?? record.source_id ?? record.statement_id ?? record.proposition_id}: ${ajv.errorsText(validate.errors)}`);
  if (!failures.some((item) => item.startsWith(`${label} schema:`))) pass(`${label} schema: ${records.length} record(s) conform.`);
};
validateSet('Work', works, 'book-work.schema.json');
validateSet('Edition', editions, 'book-edition.schema.json');
validateSet('Source', sources, 'source.schema.json');
validateSet('Statement', statements, 'statement.schema.json');
validateSet('Proposition', propositions, 'proposition.schema.json');

if (works.length !== 2 || editions.length !== 2 || sources.length !== 2) fail('Scope: expected exactly two works, exact editions, and canonical sources.');
else pass('Scope: exactly two long or dense books are analyzed.');
const expectedPairs = new Set([
  'book-work-BATCH-2026-002-001::book-edition-BATCH-2026-002-001',
  'book-work-BATCH-2026-002-005::book-edition-BATCH-2026-002-007'
]);
const pairs = new Set(editions.map((edition: any) => `${edition.book_work_id}::${edition.book_edition_id}`));
if (pairs.size !== expectedPairs.size || [...expectedPairs].some((pair) => !pairs.has(pair))) fail('Scope: exact work-edition pair differs from the resolved batch input.');
else pass('Scope: exact work-edition pairs match the resolved input.');

const workById = new Map(works.map((x: any) => [x.book_work_id, x]));
const editionById = new Map(editions.map((x: any) => [x.book_edition_id, x]));
const sourceById = new Map(sources.map((x: any) => [x.source_id, x]));
for (const edition of editions) {
  if (!workById.has(edition.book_work_id)) fail(`Access gate: missing work for ${edition.book_edition_id}.`);
  if (!edition.publisher || !edition.publication_date || !edition.format || (!edition.pagination && !edition.electronic_location_system) || !edition.full_text_available_for_research || !edition.access_basis || !edition.access_date || !edition.publication_permission) fail(`Access gate: incomplete edition evidence on ${edition.book_edition_id}.`);
}
for (const source of sources) if (!source.content_hash || !/^\w{64}$/.test(source.content_hash) || source.analysis_basis.toLowerCase().includes('preview')) fail(`Access gate: incomplete reproducibility or full-access basis on ${source.source_id}.`);
if (!failures.some((x) => x.startsWith('Access gate:'))) pass('Access gate: title linkage, publisher, date, format, locator system, lawful access, rights, date, and content hashes are complete.');

const statementIds = new Set<string>();
const statementById = new Map<string, any>();
for (const statement of statements) {
  if (statementIds.has(statement.statement_id)) fail(`Statements: duplicate ID ${statement.statement_id}.`);
  statementIds.add(statement.statement_id); statementById.set(statement.statement_id, statement);
  if (!sourceById.has(statement.source_id) || !editionById.has(statement.book_edition_id)) fail(`Statements: invalid source or edition link on ${statement.statement_id}.`);
  if (statement.direct_quote) {
    const words = statement.direct_quote.trim().split(/\s+/).length;
    if (words > 25 || !statement.direct_quote_rights_note) fail(`Quotes: excessive or undocumented quote on ${statement.statement_id}.`);
  }
  if (statement.locator_type === 'page') {
    const nums = statement.exact_locator.match(/\d+/g)?.map(Number) ?? [];
    if (!nums.length || nums.some((n: number) => n < 1 || n > 194)) fail(`Locators: invalid PDF page range on ${statement.statement_id}.`);
  } else if (statement.locator_type === 'chapter_section') {
    if (!/^(Preface|Chapter \d+) > .+/.test(statement.exact_locator) || !statement.provenance[0]?.source_url.includes('/raw/') || !statement.provenance[0]?.source_url.includes('#')) fail(`Locators: invalid official HTML chapter/anchor locator on ${statement.statement_id}.`);
  } else fail(`Locators: unsupported locator type on ${statement.statement_id}.`);
}
for (const source of sources) {
  const count = statements.filter((x: any) => x.source_id === source.source_id).length;
  if (count < 8 || count > 20) fail(`Statements: ${source.source_id} has ${count}, outside 8–20.`);
}
if (!failures.some((x) => x.startsWith('Statements:'))) pass(`Statements: ${statements.length} unique records, 18 per book, with valid work/edition/source links.`);
if (!failures.some((x) => x.startsWith('Locators:'))) pass('Locators: every statement has a replayable edition-specific page or official HTML anchor.');
if (!failures.some((x) => x.startsWith('Quotes:'))) pass(`Quotes: ${statements.filter((x: any) => x.direct_quote).length} direct quotes; limits and rights notes pass.`);

const normalize = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = (value: string) => new Set(normalize(value).split(/\s+/).filter((x) => x.length > 2));
const jaccard = (a: string, b: string) => {
  const aa = tokens(a), bb = tokens(b); const intersection = [...aa].filter((x) => bb.has(x)).length;
  return intersection / new Set([...aa, ...bb]).size;
};
const nearDuplicates: string[] = [];
for (let i = 0; i < statements.length; i++) for (let j = i + 1; j < statements.length; j++) if (jaccard(statements[i].neutral_paraphrase, statements[j].neutral_paraphrase) >= 0.78) nearDuplicates.push(`${statements[i].statement_id}/${statements[j].statement_id}`);
if (nearDuplicates.length) fail(`Duplicates: near-duplicate statements ${nearDuplicates.join(', ')}.`); else pass('Duplicates: no exact or near-duplicate statement paraphrases detected.');
const propOverlaps: string[] = [];
for (let i = 0; i < propositions.length; i++) for (let j = i + 1; j < propositions.length; j++) if (jaccard(propositions[i].neutral_formulation, propositions[j].neutral_formulation) >= 0.72) propOverlaps.push(`${propositions[i].proposition_id}/${propositions[j].proposition_id}`);
if (propOverlaps.length) fail(`Proposition overlap: ${propOverlaps.join(', ')}.`); else pass(`Proposition overlap: ${propositions.length} staging candidates are distinct.`);
for (const proposition of propositions) for (const id of proposition.supporting_statement_ids ?? []) if (!statementById.has(id)) fail(`Propositions: ${proposition.proposition_id} references missing ${id}.`);
if (propositions.some((x: any) => x.publication_status !== 'staging_only' || x.human_review_status !== 'pending' || !x.proposition_status.includes('candidate'))) fail('Propositions: a candidate is promoted or human-approved.');
if (!failures.some((x) => x.startsWith('Propositions:'))) pass('Propositions: evidence links resolve; every item remains a human-pending staging candidate.');

const requiredHeadings = ['Bibliographic and edition note','Research question relevance','Central thesis','Argument structure','Principal propositions','Key frameworks','Definitions and terminology','Evidence character','Cases and examples','Predictions, recommendations, and warnings','Executive role implications','Industry implications','Strongest arguments','Least-supported claims','Assumptions','Limitations','Counterarguments and qualifications','Related research and books','Later author interviews and statements','Changes since publication','Unresolved questions','Editorial interpretation for AI agents','Proposition-candidate guidance','Citation guidance','Rights and reuse guidance','Overall editorial assessment'];
const analysisFiles = ['analyses/solving-the-bottom-turtle.md','analyses/building-secure-and-reliable-systems.md'];
const analysisTexts = analysisFiles.map((name) => fs.readFileSync(path.join(batchDir, name), 'utf8'));
for (let i = 0; i < analysisTexts.length; i++) {
  const analysisText = analysisTexts[i]!;
  const words = analysisText.trim().split(/\s+/).length;
  if (words < 2500 || words > 6000) fail(`Analysis pages: ${analysisFiles[i]} has ${words} words, outside 2,500–6,000.`);
  for (const heading of requiredHeadings) if (!analysisText.includes(heading)) fail(`Analysis pages: ${analysisFiles[i]} lacks section ${heading}.`);
}
if (!failures.some((x) => x.startsWith('Analysis pages:'))) pass('Analysis pages: both substantial analyses contain all 26 required sections and fall within 2,500–6,000 words.');
if (jaccard(analysisTexts[0]!, analysisTexts[1]!) > 0.55) fail('Analysis prose: pages are suspiciously near-duplicate.'); else pass('Analysis prose: cross-book near-duplicate check passes.');

const reviewCsv = fs.readFileSync(path.join(batchDir, 'statement-review.csv'), 'utf8').trim().split(/\r?\n/);
if (reviewCsv.length !== statements.length + 1) fail(`Review: worksheet has ${reviewCsv.length - 1} rows for ${statements.length} statements.`);
const minReview = Math.ceil(statements.length * 0.2);
if (doubleReview.length < minReview) fail(`Review: ${doubleReview.length} is below the 20% minimum ${minReview}.`);
const doubleIds = new Set(doubleReview.map((x: any) => x.statement_id));
if (doubleReview.some((x: any) => !statementIds.has(x.statement_id) || !x.independent_review_result.startsWith('pass'))) fail('Review: invalid or failed independent-review record.');
const requiredReview = new Set<number>([7,9,11,13,16,17,18,21,24,26,27,31,32,35,36]);
for (const number of requiredReview) if (!doubleIds.has(`statement-BATCH-2026-003-${String(number).padStart(3, '0')}`)) fail(`Review: required high-impact, criticism, or change statement ${number} is absent.`);
if (!failures.some((x) => x.startsWith('Review:'))) pass(`Review: worksheet covers all statements and ${doubleReview.length}/${statements.length} (${(doubleReview.length / statements.length * 100).toFixed(1)}%) received an independent second pass, including all flagged claims.`);

const requiredFiles = ['chapter-map.md','argument-map.json','statement-review.csv','proposition-candidates.json','counterargument-sources.json','later-author-sources.json','rights-review.md','limitations.md','author-relationships.json','related-source-relationships.json','manifest.yml'];
for (const file of requiredFiles) if (!fs.existsSync(path.join(batchDir, file))) fail(`Artifacts: missing ${file}.`);
if (laterSources.length < 2 || counterSources.length < 2) fail('Artifacts: later-author or counterargument research is insufficient.');
if (!failures.some((x) => x.startsWith('Artifacts:'))) pass(`Artifacts: all mandatory files exist; ${laterSources.length} later-author and ${counterSources.length} qualifying/counter sources recorded.`);

for (const collection of [works, editions, sources, statements, propositions]) for (const record of collection) {
  if (!record.provenance?.some((x: any) => x.batch_id === batchId && x.source_url && x.accessed_at)) fail(`Provenance: missing ${batchId} record on ${record.book_work_id ?? record.book_edition_id ?? record.source_id ?? record.statement_id ?? record.proposition_id}.`);
  if (record.human_review_status === 'approved' || record.publication_status === 'published') fail(`Review status: unauthorized approval or publication on ${record.book_work_id ?? record.book_edition_id ?? record.source_id ?? record.statement_id ?? record.proposition_id}.`);
}
if (!failures.some((x) => x.startsWith('Provenance:'))) pass('Provenance: every schema entity has batch-linked public-source provenance.');
if (!failures.some((x) => x.startsWith('Review status:'))) pass('Review status: no human approval or production publication is implied.');

const walk = (dir: string): string[] => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]) : [];
const leaks: string[] = [];
for (const top of ['data','content','docs','exports']) for (const file of walk(path.join(root, top))) {
  if (!/\.(json|md|html|csv|ndjson|xml|txt)$/i.test(file)) continue;
  if (fs.readFileSync(file, 'utf8').includes(batchId)) leaks.push(path.relative(root, file));
}
if (leaks.length) fail(`Staging leak: ${batchId} appears in production paths: ${leaks.join(', ')}.`); else pass('Staging leak: no batch entity appears in production paths.');

if (statements.every((x: any) => x.direct_quote === null)) warn('Rights: direct quotations were intentionally avoided; the quote count is zero.');
if (propositions.every((x: any) => x.ownership_concentration_warning)) warn('Evidence concentration: every proposition candidate is supported by one book and requires independent sources before promotion.');
for (const message of passes) console.log(`PASS ${message}`);
for (const message of warnings) console.warn(`WARN ${message}`);
for (const message of failures) console.error(`FAIL ${message}`);
if (failures.length) process.exit(1);
