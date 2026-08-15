import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';
import { writeJson } from './lib/records.js';

const [kind, id, subtype] = process.argv.slice(2);
const root = process.cwd();
function branch(): string { return execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim(); }
function requireWorkingBranch(): void { if (!branch() || branch() === 'main') throw new Error('Scaffolding must run on a dedicated non-main branch.'); }
function write(file: string, value: string): void { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); }
function yml(file: string, value: unknown): void { write(file, YAML.stringify(value)); }
requireWorkingBranch();
if (!id) throw new Error('Provide a stable ID.');
if (kind === 'batch') {
  const dir = path.join(root, 'staging', 'batches', id); fs.mkdirSync(path.join(dir, 'accepted-records'), { recursive: true });
  yml(path.join(dir, 'protocol.yml'), { protocol_id: `protocol-${id}`, research_question: 'REQUIRED', scope: 'REQUIRED', time_period: 'REQUIRED', inclusion_criteria: [], exclusion_criteria: [], planned_search_queries: [], created_at: new Date().toISOString(), created_by: 'REQUIRED', prompt_id: 'OEII-MASTER-BUILD', prompt_version: '2.0' });
  yml(path.join(dir, 'manifest.yml'), { batch_id: id, protocol_id: `protocol-${id}`, prompt_id: 'OEII-MASTER-BUILD', prompt_version: '2.0', branch: branch(), execution_date: '2026-08-14', model_disclosure: 'AI-assisted; human review pending', tools_used: [], research_question: 'REQUIRED', pre_registered_inclusion_criteria: [], pre_registered_exclusion_criteria: [], search_queries: [], sources_considered: [], sources_accepted: [], sources_rejected: [], records_created: [], records_modified: [], unresolved_questions: [], rights_concerns: [], validation_commands: [], validation_outcomes: [], human_review_status: 'pending', limitations: [], next_recommended_action: 'Complete protocol before discovery.' });
  yml(path.join(dir, 'search-log.yml'), { queries: [] }); writeJson(path.join(dir, 'candidate-sources.json'), []); writeJson(path.join(dir, 'rejected-sources.json'), []); writeJson(path.join(dir, 'hold-queue.json'), []);
  write(path.join(dir, 'review-queue.csv'), 'record_id,record_type,source_url,exact_locator,confidence,rights_status,reviewer_decision\n');
  for (const file of ['source-concentration.md','rights-review.md','limitations.md','validation-results.md']) write(path.join(dir, file), `# ${file.replace('.md','').replaceAll('-',' ')}\n\nPending.\n`);
  write(path.join(dir, 'accepted-records', 'README.md'), '# Accepted records\n\nRecords remain staged here until validation and named human publication approval.\n');
  process.stdout.write(`Created ${path.relative(root, dir)} on ${branch()}\n`);
} else if (kind === 'protocol') {
  yml(path.join(root, 'staging', 'batches', id, 'protocol.yml'), { protocol_id: id, research_question: 'REQUIRED', scope: 'REQUIRED', time_period: 'REQUIRED', target_roles: [], target_geographies: [], target_languages: [], included_source_types: [], excluded_source_types: [], inclusion_criteria: [], exclusion_criteria: [], source_priority: [], diversity_objectives: [], expected_limitations: [], planned_search_queries: [], planned_batch_size: 0, created_at: new Date().toISOString(), created_by: 'REQUIRED', prompt_id: 'REQUIRED', prompt_version: 'REQUIRED', status: 'draft_not_canonical' });
} else if (kind === 'record') {
  if (!subtype) throw new Error('Provide a record entity directory as the third argument.');
  writeJson(path.join(root, 'staging', 'statement-review', `${id}.json`), { record_id: id, entity_type: subtype, workflow_status: 'candidate', machine_review_status: 'machine_drafted', human_review_status: 'pending', reviewed_by: null, reviewed_at: null, fields: {}, provenance: [], unresolved_questions: ['Complete required schema fields and provenance.'] });
} else if (kind === 'source' || kind === 'statement' || kind === 'proposition') {
  const directory = kind === 'source' ? 'identity-review' : `${kind}-review`;
  writeJson(path.join(root, 'staging', directory, `${id}.json`), { [`${kind}_id`]: id, entity_type: kind, workflow_status: 'candidate', machine_review_status: 'machine_drafted', human_review_status: 'pending', reviewed_by: null, reviewed_at: null, provenance: [], unresolved_questions: ['Complete required schema fields, exact source identity, access basis, rights, and provenance.'] });
} else if (kind === 'book') {
  writeJson(path.join(root, 'staging', 'identity-review', `${id}-work.json`), { book_work_id: `${id}-work`, workflow_status: 'candidate', machine_review_status: 'machine_drafted', human_review_status: 'pending', analysis_depth: 'catalogued', provenance: [], unresolved_questions: ['Verify work identity and authorship.'] });
  writeJson(path.join(root, 'staging', 'identity-review', `${id}-edition.json`), { book_edition_id: `${id}-edition`, book_work_id: `${id}-work`, workflow_status: 'candidate', machine_review_status: 'machine_drafted', human_review_status: 'pending', provenance: [], unresolved_questions: ['Verify edition metadata and lawful access basis.'] });
} else throw new Error('Use: scaffold.ts batch|protocol|record|source|book|statement|proposition ID [ENTITY]');
