import fs from 'node:fs';
import path from 'node:path';

export const ENTITY_DIRS = [
  'people', 'organization-references', 'book-works', 'book-editions', 'sources',
  'statements', 'propositions', 'stances', 'topics', 'roles', 'geographies',
  'languages', 'debates', 'dossiers', 'trends', 'protocols', 'batches', 'reviews',
  'corrections', 'releases'
] as const;

export type RecordMap = Record<string, unknown>;

export function readJsonFiles(directory: string): RecordMap[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .flatMap((file) => {
      const value = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
      return Array.isArray(value) ? value : [value];
    });
}

export function loadCatalog(root = process.cwd()): Record<string, RecordMap[]> {
  return Object.fromEntries(ENTITY_DIRS.map((name) => [name, readJsonFiles(path.join(root, 'data', name))]));
}

export function publicRecords(records: RecordMap[]): RecordMap[] {
  return records.filter((record) => {
    const publishedState = record.publication_status === 'published' || record.workflow_status === 'published';
    const namedHuman = typeof record.reviewed_by === 'string' && !/^(ai|agent|codex)\b/i.test(record.reviewed_by);
    return publishedState && record.human_review_status === 'approved' && namedHuman && typeof record.reviewed_at === 'string';
  });
}

export function publicPersonProfiles(records: RecordMap[]): RecordMap[] {
  return publicRecords(records).filter((record) => record.public_profile_eligibility === true);
}

export function sourceRoute(record: RecordMap): string {
  return `/executive-intelligence-index/sources/${idOf(record)}/`;
}

export function countPublicResearch(catalog: Record<string, RecordMap[]>) {
  const keys = ['people', 'book-works', 'sources', 'statements', 'propositions', 'debates', 'dossiers'];
  return Object.fromEntries(keys.map((key) => [key, publicRecords(catalog[key] ?? []).length]));
}

export function labelOf(record: RecordMap): string {
  for (const key of ['canonical_name', 'title', 'canonical_title', 'edition_title', 'neutral_formulation', 'preferred_label', 'neutral_question']) {
    if (typeof record[key] === 'string') return record[key] as string;
  }
  return String(record.id ?? record.person_id ?? record.source_id ?? 'Untitled record');
}

export function idOf(record: RecordMap): string {
  const key = Object.keys(record).find((name) => name === 'id' || name.endsWith('_id'));
  return key ? String(record[key]) : '';
}
