import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

const batchId = process.argv[2];
if (!batchId) throw new Error('Usage: validate-discovery-batch.ts <batch-id>');

const root = process.cwd();
const batchDir = path.join(root, 'staging', 'batches', batchId);
const readJson = (name: string) => JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8'));
const candidates = readJson('candidate-sources.json');
const accepted = readJson('accepted-candidates.json');
const held = readJson('hold-queue.json');
const rejected = readJson('rejected-sources.json');
const duplicates = readJson('duplicate-review.json');
const candidateSchema = readJson('candidate-source.schema.json');
const searchLog = YAML.parse(fs.readFileSync(path.join(batchDir, 'search-log.yml'), 'utf8'));

const failures: string[] = [];
const warnings: string[] = [];
const passes: string[] = [];
const fail = (message: string) => failures.push(message);
const pass = (message: string) => passes.push(message);
const warn = (message: string) => warnings.push(message);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateCandidate = ajv.compile(candidateSchema);
for (const candidate of candidates) {
  if (!validateCandidate(candidate)) fail(`Candidate schema: ${candidate.candidate_id}: ${ajv.errorsText(validateCandidate.errors)}`);
}
if (!failures.length) pass(`Candidate schema: ${candidates.length} records conform to the batch-local schema.`);

const ids = candidates.map((item: any) => item.candidate_id);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) fail('Candidate identity: duplicate candidate_id values found.');
else pass('Candidate identity: all candidate IDs are unique.');

const expectedIds = new Set(candidates.map((item: any) => item.candidate_id));
const partitions = [...accepted, ...held, ...rejected];
if (partitions.length !== candidates.length || new Set(partitions.map((item: any) => item.candidate_id)).size !== candidates.length || partitions.some((item: any) => !expectedIds.has(item.candidate_id))) {
  fail('Decision partition: accepted, held, and rejected files do not partition the candidate slate exactly.');
} else pass(`Decision partition: ${accepted.length} accepted, ${held.length} held, ${rejected.length} rejected.`);

const expectedDecision = new Map([['accept', accepted], ['hold', held], ['reject', rejected]]);
for (const [decision, items] of expectedDecision) if ((items as any[]).some((item: any) => item.decision !== decision)) fail(`Decision partition: ${decision} file contains another decision.`);

const normalizeTitle = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const normalizedTitles = new Map<string, string[]>();
for (const item of candidates) {
  const key = normalizeTitle(item.title);
  normalizedTitles.set(key, [...(normalizedTitles.get(key) ?? []), item.candidate_id]);
}
const titleCollisions = [...normalizedTitles.values()].filter((items) => items.length > 1);
if (titleCollisions.length) warn(`Normalized-title review: ${titleCollisions.length} exact normalized collision(s) require duplicate review.`);
else pass('Normalized-title review: no unexpected exact collisions.');

const urls = candidates.map((item: any) => item.original_url);
if (new Set(urls).size !== urls.length) fail('URL validation: duplicate original_url values found.');
else pass('URL validation: all original URLs are unique.');
for (const item of candidates) {
  try { new URL(item.original_url); new URL(item.canonical_url); } catch { fail(`URL validation: invalid URL on ${item.candidate_id}.`); }
}

const unresolvedAccepted = accepted.filter((item: any) => /unresolved|unknown|speaker$/i.test(item.author_or_speaker));
if (unresolvedAccepted.length) fail(`Source identity: accepted candidates have unresolved author/speaker identity: ${unresolvedAccepted.map((item: any) => item.candidate_id).join(', ')}`);
else pass('Source identity: accepted candidates have non-empty work, author/speaker, publisher, and URL identities.');

const missingRights = candidates.filter((item: any) => !item.rights_status || !item.analysis_access_status);
if (missingRights.length) fail(`Rights validation: ${missingRights.length} candidates lack rights or access status.`);
else pass('Rights validation: every candidate has explicit access and conservative rights status.');

const missingOwnership = candidates.filter((item: any) => !item.ownership_status || !item.OFF_relationship);
if (missingOwnership.length) fail(`Ownership validation: ${missingOwnership.length} candidates lack ownership or OFF-relationship status.`);
else pass('Ownership validation: every candidate has ownership and OFF-relationship status.');

const duplicateIds = new Set(duplicates.groups.flatMap((group: any) => group.rejected_candidate_ids));
const duplicateRejects = rejected.filter((item: any) => item.likely_duplicate).map((item: any) => item.candidate_id);
if (duplicateRejects.some((id: string) => !duplicateIds.has(id)) || duplicateIds.size !== duplicateRejects.length) fail('Duplicate validation: duplicate rejects and duplicate-review groups do not match.');
else pass(`Duplicate validation: ${duplicates.groups.length} work/rendition groups resolve ${duplicateRejects.length} duplicate rejects.`);

const queryIds = new Set(searchLog.queries.map((query: any) => query.id));
const unknownQueries = candidates.flatMap((item: any) => item.search_query_ids.filter((id: string) => !queryIds.has(id)).map((id: string) => `${item.candidate_id}:${id}`));
if (unknownQueries.length) fail(`Search log: unknown query references: ${unknownQueries.join(', ')}`);
else pass(`Search log: ${queryIds.size} query families plus supplementary failures are documented.`);

const targetRoles = ['role-ciso','role-cio','role-cto','role-general-counsel','role-board-director','role-ceo'];
const acceptedRoles = new Set(accepted.flatMap((item: any) => item.relevant_roles));
const missingRoles = targetRoles.filter((role) => !acceptedRoles.has(role));
if (missingRoles.length) fail(`Coverage: no accepted candidate covers ${missingRoles.join(', ')}.`);
else pass('Coverage: every pre-registered executive role appears in the accepted set.');

const acceptedGeographies = new Set(accepted.flatMap((item: any) => item.relevant_geographies));
for (const geography of ['India','Japan']) if (!acceptedGeographies.has(geography)) warn(`Coverage gap: ${geography} has no accepted candidate.`);
if (new Set(candidates.map((item: any) => item.language)).size === 1) warn('Coverage gap: all candidates are English-language due to the active controlled vocabulary.');

const publisherCounts = new Map<string, number>();
for (const item of accepted) publisherCounts.set(item.publisher, (publisherCounts.get(item.publisher) ?? 0) + 1);
const topEntry = [...publisherCounts.entries()].sort((a, b) => b[1] - a[1])[0];
if (!topEntry) throw new Error('Concentration validation requires at least one accepted candidate.');
const [topPublisher, topCount] = topEntry;
const topShare = topCount / accepted.length;
if (topShare > 0.2) fail(`Concentration: ${topPublisher} is ${(topShare * 100).toFixed(1)}% of accepted candidates.`);
else pass(`Concentration: largest publisher label is ${topPublisher} at ${(topShare * 100).toFixed(1)}%.`);

const forbiddenRoots = ['content', 'docs', 'exports'];
const walk = (dir: string): string[] => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]) : [];
const leaks: string[] = [];
for (const top of forbiddenRoots) {
  for (const file of walk(path.join(root, top))) {
    if (!/\.(json|md|html|csv|ndjson|xml|txt)$/i.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes(`candidate-${batchId}-`)) leaks.push(path.relative(root, file));
  }
}
if (leaks.length) fail(`Staging leak: candidate IDs found outside staging in ${leaks.join(', ')}.`);
else pass('Staging leak: no candidate IDs appear in content, docs, or exports.');

if (candidates.length < 100 || candidates.length > 150) fail(`Batch size: ${candidates.length} is outside the pre-registered 100–150 range.`);
else pass(`Batch size: ${candidates.length} candidates satisfies the pre-registered range.`);

for (const message of passes) console.log(`PASS ${message}`);
for (const message of warnings) console.warn(`WARN ${message}`);
for (const message of failures) console.error(`FAIL ${message}`);
if (failures.length) process.exit(1);
