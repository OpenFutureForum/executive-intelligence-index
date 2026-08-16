import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const review = {
  reviewer: 'Murray Newlands',
  reviewedAt: '2026-08-16T23:17:22Z',
  reviewDate: '2026-08-16',
  approvalUrl: 'https://github.com/OpenFutureForum/executive-intelligence-index/issues/18#issuecomment-5310177421'
};
const releaseVersion = '0.2.0';
const releaseId = 'release-0.2.0-governed-identities-pilot';
const includedBatchIds = [
  'BUILD-2026-08-14-001', 'BATCH-2026-001', 'BATCH-2026-002', 'BATCH-2026-003',
  'BATCH-2026-004', 'BATCH-2026-005', 'BATCH-2026-006', 'BATCH-2026-007'
];

function readArray(relative: string): Record<string, any>[] {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}
function write(relative: string, value: unknown): void {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}
function idOf(record: Record<string, any>): string {
  const key = Object.keys(record).find((name) => name === 'id' || name.endsWith('_id'));
  if (!key) throw new Error('Record has no stable ID');
  return String(record[key]);
}
function unique(values: string[]): string[] { return [...new Set(values)]; }
function approved(record: Record<string, any>, batchId?: string): Record<string, any> {
  const copy: Record<string, any> = structuredClone(record);
  copy.workflow_status = 'published';
  if ('publication_status' in copy) copy.publication_status = 'published';
  copy.human_review_status = 'approved';
  copy.reviewed_by = review.reviewer;
  copy.reviewed_at = review.reviewedAt;
  if (typeof copy.verification_status === 'string') {
    copy.verification_status = copy.verification_status
      .replaceAll('human_review_pending', 'human_approved')
      .replaceAll('human_pending', 'human_approved');
  }
  copy.revision_history = [
    ...(copy.revision_history ?? []),
    {
      changed_at: review.reviewedAt,
      changed_by: review.reviewer,
      summary: 'Approved for the governed-identities pilot release under the exact scope, exclusions, rights treatment, and limitations recorded in issue #18.',
      batch_id: batchId ?? copy.provenance?.at(-1)?.batch_id ?? null
    }
  ];
  return copy;
}
function replaceById(base: Record<string, any>[], replacements: Record<string, any>[]): Record<string, any>[] {
  const byId = new Map(base.map((record) => [idOf(record), record]));
  for (const record of replacements) byId.set(idOf(record), record);
  return [...byId.values()];
}
function sha256(value: string): string { return crypto.createHash('sha256').update(value).digest('hex'); }
function stable(value: unknown): string {
  const normalize = (item: any): any => Array.isArray(item) ? item.map(normalize) : item && typeof item === 'object'
    ? Object.fromEntries(Object.keys(item).sort().map((key) => [key, normalize(item[key])])) : item;
  return `${JSON.stringify(normalize(value), null, 2)}\n`;
}

const excludedWorkIds = new Set(['book-work-BATCH-2026-002-008']);
const excludedEditionIds = new Set([
  'book-edition-BATCH-2026-002-004',
  'book-edition-BATCH-2026-002-012',
  'book-edition-BATCH-2026-002-013'
]);
const excludedSourceIds = new Set([
  'related-source-BATCH-2026-002-001',
  'related-source-BATCH-2026-002-008',
  'source-BATCH-2026-005-005'
]);

const metadataWorks = readArray('staging/batches/BATCH-2026-002/book-works.json').filter((record) => !excludedWorkIds.has(record.book_work_id));
const deepWorks = readArray('staging/batches/BATCH-2026-003/book-works.json');
const works = replaceById(metadataWorks, deepWorks).map((record) => approved(record));

const metadataEditions = readArray('staging/batches/BATCH-2026-002/book-editions.json').filter((record) => !excludedEditionIds.has(record.book_edition_id));
const deepEditions = readArray('staging/batches/BATCH-2026-003/book-editions.json');
const editions = replaceById(metadataEditions, deepEditions).map((record) => approved(record));

const relatedSources = readArray('staging/batches/BATCH-2026-002/related-source-candidates.json').filter((record) => !excludedSourceIds.has(record.source_id));
const bookSources = readArray('staging/batches/BATCH-2026-003/sources.json');
const mediaSources = readArray('staging/batches/BATCH-2026-004/source-proposals.json').map((record) => ({
  ...record,
  speaker_ids: (record.speaker_ids ?? []).map((id: string) => id === 'person-tobin-south' ? 'person-BATCH-2026-005-tobin-south' : id)
}));
const evidenceSources = readArray('staging/batches/BATCH-2026-005/source-proposals.json').filter((record) => !excludedSourceIds.has(record.source_id)).map((record) => record.source_id === 'source-BATCH-2026-005-002' ? {
  ...record,
  original_url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence',
  canonical_url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence'
} : record);
const sources = [...relatedSources, ...bookSources, ...mediaSources, ...evidenceSources].map((record) => approved(record));

const bookStatements = readArray('staging/batches/BATCH-2026-003/source-statements.json');
const mediaStatements: Record<string, any>[] = readArray('staging/batches/BATCH-2026-004/statement-candidates.json').map((record) => ({
  ...record,
  person_id: record.person_id === 'person-tobin-south' ? 'person-BATCH-2026-005-tobin-south' : record.person_id
}));
const evidenceStatements = readArray('staging/batches/BATCH-2026-006/statements.json');
const statements = [...bookStatements, ...mediaStatements, ...evidenceStatements].map((record) => approved(record));

const bookPeople = readArray('staging/batches/BATCH-2026-002/author-person-candidates.json').map((record) => ({
  ...record,
  public_profile_eligibility: false,
  authored_book_work_ids: (record.authored_book_work_ids ?? []).filter((id: string) => !excludedWorkIds.has(id))
}));
const mediaPeople = readArray('staging/batches/BATCH-2026-004/person-candidates.json')
  .filter((record) => ['person-jim-mcdonald', 'person-jeff-steadman', 'person-amy-shillinglaw'].includes(record.person_id))
  .map((record) => ({ ...record, public_profile_eligibility: false }));
const evidencePeople = readArray('staging/batches/BATCH-2026-007/people.json').map((record) => {
  const copy = structuredClone(record);
  copy.public_profile_eligibility = false;
  for (const key of ['source_ids', 'contributed_work_ids']) copy[key] = (copy[key] ?? []).filter((id: string) => id !== 'source-BATCH-2026-005-005');
  for (const key of ['historical_roles', 'role_at_source_time']) {
    copy[key] = (copy[key] ?? []).filter((item: Record<string, any>) => item.source_id !== 'source-BATCH-2026-005-005').map((item: Record<string, any>) => ({
      ...item,
      human_review_status: item.human_review_status ? 'approved' : undefined
    }));
  }
  copy.provenance = (copy.provenance ?? []).filter((item: Record<string, any>) => item.source_url !== 'https://arxiv.org/abs/2510.25819');
  if (copy.person_id === 'person-BATCH-2026-005-tobin-south') {
    copy.source_ids = unique([...(copy.source_ids ?? []), 'source-idac-390-agentic-ai-identity']);
    copy.contributed_work_ids = unique([...(copy.contributed_work_ids ?? []), 'source-idac-390-agentic-ai-identity']);
    copy.statement_ids = unique([...(copy.statement_ids ?? []), ...mediaStatements.filter((statement) => statement.person_id === copy.person_id).map((statement) => statement.statement_id)]);
    const mediaRole = {
      person_id: copy.person_id,
      source_id: 'source-idac-390-agentic-ai-identity',
      source_title: '#390 - Identity Management for Agentic AI with Tobin South',
      source_version: 'Podcast episode published 2025-12-08',
      relationship: 'speaker',
      author_order: null,
      organization_at_source_time: 'OpenID Foundation',
      role_at_source_time: 'Co-chair, OpenID Foundation Artificial Intelligence Identity Management Community Group',
      verification_basis: 'Official publisher context and in-recording identification',
      verification_status: 'verified',
      current_role_backfilled: false,
      human_review_status: 'approved'
    };
    copy.role_at_source_time = [...(copy.role_at_source_time ?? []), mediaRole];
    copy.historical_roles = [...(copy.historical_roles ?? []), mediaRole];
  }
  return copy;
});
const people = [...bookPeople, ...mediaPeople, ...evidencePeople].map((record) => approved(record));

const researchRecords = [...people, ...works, ...editions, ...sources, ...statements];
const researchRecordIds = researchRecords.map(idOf).sort();
const reviewRecord = approved({
  review_id: 'review-governed-identities-pilot-2026-08-16',
  batch_id: 'PILOT-PROMOTION-2026-08-16',
  record_ids: researchRecordIds,
  review_type: 'named_human_pilot_promotion_review',
  reviewer_type: 'human',
  named_human_reviewer: review.reviewer,
  review_date: review.reviewDate,
  decisions: [{ decision: 'APPROVE PILOT PROMOTION', approval_url: review.approvalUrl, included_batch_ids: includedBatchIds }],
  corrections: [],
  disagreements: [],
  unresolved_issues: [],
  rights_review: {
    decision: 'approved_link_and_paraphrase_only',
    excluded_material: ['third-party full text', 'extensive quotations', 'transcripts', 'figures', 'tables', 'private information']
  },
  publication_recommendation: 'approved_for_pilot_publication_with_recorded_exclusions_and_limitations',
  workflow_status: 'publication_approved',
  machine_review_status: 'ready_for_human_review',
  human_review_status: 'approved',
  reviewed_by: review.reviewer,
  reviewed_at: review.reviewedAt,
  provenance: [{
    source_url: review.approvalUrl,
    accessed_at: review.reviewDate,
    retrieval_method: 'named human approval recorded in the repository issue tracker',
    exact_locator: 'Comment containing APPROVE PILOT PROMOTION',
    content_hash: null,
    batch_id: 'PILOT-PROMOTION-2026-08-16',
    prompt_id: 'OEII-HUMAN-REVIEW-PROMOTION',
    prompt_version: '1.0',
    notes: 'Approval is limited to the exact record IDs in this review record.'
  }],
  revision_history: []
}, 'PILOT-PROMOTION-2026-08-16');

const productionFiles: Record<string, unknown> = {
  'data/people/governed-identities-pilot.json': people,
  'data/book-works/governed-identities-pilot.json': works,
  'data/book-editions/governed-identities-pilot.json': editions,
  'data/sources/governed-identities-pilot.json': sources,
  'data/statements/governed-identities-pilot.json': statements,
  'data/reviews/governed-identities-pilot.json': reviewRecord
};
for (const [file, value] of Object.entries(productionFiles)) write(file, value);

const checksums = Object.fromEntries(Object.entries(productionFiles).map(([file, value]) => [file, sha256(stable(value))]));
const counts = {
  people: people.length,
  book_works: works.length,
  book_editions: editions.length,
  sources: sources.length,
  statements: statements.length,
  propositions: 0,
  debates: 0,
  dossiers: 0,
  trends: 0,
  reviews: 1
};
const limitations = [
  'This pilot is limited to governed identities for AI agents and is not representative of all executives, roles, industries, regions, or markets.',
  'The corpus is substantially English-language and source-concentrated.',
  'Inclusion does not imply endorsement, prevalence, adoption, consensus, or truth.',
  'Person records are data-only identity and source-time-role records; no person meets the configured public-profile threshold in this release.',
  'Candidate propositions, debates, dossiers, role comparisons, geographic generalizations, market generalizations, and trends remain unpublished.',
  'Third-party full text, extensive quotations, transcripts, figures, tables, and private information are not republished.'
];
const releaseRecord = approved({
  release_id: releaseId,
  semantic_version: releaseVersion,
  schema_version: '1.0.0',
  data_version: '1.0.0',
  content_version: '0.2.0',
  release_date: review.reviewDate,
  included_batch_ids: includedBatchIds,
  included_record_counts: counts,
  checksums,
  release_fingerprint: sha256(stable(checksums)),
  upstream_crosswalk_versions: {},
  known_limitations: limitations,
  changelog: [
    'Published the first named-human-approved pilot corpus for governed identities for AI agents.',
    'Published verified works, exact editions, canonical sources, source-located statements, and data-only resolved identity records.',
    'Retained every reviewed exclusion and withheld all higher-order propositions and synthesis.'
  ],
  approval_status: 'APPROVE PILOT PROMOTION',
  workflow_status: 'publication_approved',
  machine_review_status: 'ready_for_human_review',
  human_review_status: 'approved',
  reviewed_by: review.reviewer,
  reviewed_at: review.reviewedAt,
  provenance: [{
    source_url: review.approvalUrl,
    accessed_at: review.reviewDate,
    retrieval_method: 'named human approval recorded in the repository issue tracker',
    exact_locator: 'Comment containing approved batches, scope, exclusions, rights decision, limitations, and APPROVE PILOT PROMOTION',
    content_hash: null,
    batch_id: 'PILOT-PROMOTION-2026-08-16',
    prompt_id: 'OEII-HUMAN-REVIEW-PROMOTION',
    prompt_version: '1.0',
    notes: 'The release is valid only for the enumerated production record IDs.'
  }],
  revision_history: []
}, 'PILOT-PROMOTION-2026-08-16');
write('data/releases/release-0.2.0-governed-identities-pilot.json', releaseRecord);

write('operations/releases/0.2.0-pilot-promotion.json', {
  release_id: releaseId,
  approval: review,
  included_batch_ids: includedBatchIds,
  proposed_production_record_count: researchRecordIds.length,
  proposed_production_record_ids: researchRecordIds,
  record_counts: counts,
  exact_exclusions: {
    work_ids: [...excludedWorkIds],
    edition_ids: [...excludedEditionIds],
    source_ids: [...excludedSourceIds],
    held_media_source_ids: ['held-openid-pre-iiw-agentic-ai-2025', 'held-csa-nhi-ai-agents-rsac-2025', 'held-identiverse-agentic-ai-identity-2026'],
    entity_types: ['propositions', 'stances', 'debates', 'dossiers', 'trends', 'role comparisons', 'regional briefings']
  },
  canonicalization_notes: [
    'related-source-BATCH-2026-002-001 is superseded by source-BATCH-2026-003-001 because both use the same canonical URL and the latter carries the complete-edition analysis lineage.',
    'person-tobin-south is normalized to person-BATCH-2026-005-tobin-south; the published record combines only approved source-time relationships and excludes the held arXiv rendition.',
    'Current-role fields for Mislav Balunović and Richard Fang remain null.',
    'All person records are data-only because public_profile_eligibility is false under the configured publication threshold.'
  ],
  rights_treatment: 'Link and paraphrase only, subject to each source record. No third-party full text, extensive quotation, transcript, figure, table, or private information is published.',
  limitations
});

process.stdout.write(`Prepared ${researchRecordIds.length} approved research records for release ${releaseVersion}: ${JSON.stringify(counts)}\n`);
