import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const DIRECTORY_SCHEMA: Record<string, string> = {
  people: 'person', 'organization-references': 'organization-reference', 'book-works': 'book-work',
  'book-editions': 'book-edition', sources: 'source', statements: 'statement', propositions: 'proposition',
  stances: 'stance', topics: 'topic', debates: 'debate', dossiers: 'dossier', trends: 'trend-snapshot',
  protocols: 'research-protocol', batches: 'research-batch', reviews: 'review', corrections: 'correction', releases: 'release'
};

export interface LoadedRecord { directory: string; file: string; schema: string; record: Record<string, any>; }

export function readJson(file: string): any { return JSON.parse(fs.readFileSync(file, 'utf8')); }
export function writeJson(file: string, value: unknown): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}
export function listFiles(directory: string, extension?: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full, extension) : (!extension || entry.name.endsWith(extension) ? [full] : []);
  }).sort();
}
export function loadCanonical(root = process.cwd()): LoadedRecord[] {
  return Object.entries(DIRECTORY_SCHEMA).flatMap(([directory, schema]) =>
    listFiles(path.join(root, 'data', directory), '.json').flatMap((file) => {
      const value = readJson(file);
      return (Array.isArray(value) ? value : [value]).map((record) => ({ directory, schema, file, record }));
    })
  );
}
export function recordId(record: Record<string, any>): string {
  const key = Object.keys(record).find((name) => name === 'id' || name.endsWith('_id'));
  return key ? String(record[key]) : '';
}
export function published(records: LoadedRecord[]): LoadedRecord[] {
  return records.filter(({ record }) => {
    const publishedState = record.workflow_status === 'published' || record.publication_status === 'published';
    const namedHuman = typeof record.reviewed_by === 'string' && !/^(ai|agent|codex)\b/i.test(record.reviewed_by);
    return publishedState && record.human_review_status === 'approved' && namedHuman && typeof record.reviewed_at === 'string';
  });
}
export function sha256(data: string | Buffer): string { return crypto.createHash('sha256').update(data).digest('hex'); }
export function stable(value: unknown): string {
  const normalize = (item: any): any => Array.isArray(item) ? item.map(normalize) : item && typeof item === 'object'
    ? Object.fromEntries(Object.keys(item).sort().map((key) => [key, normalize(item[key])])) : item;
  return `${JSON.stringify(normalize(value), null, 2)}\n`;
}
export function fail(errors: string[]): never {
  for (const error of errors) process.stderr.write(`ERROR ${error}\n`);
  process.stderr.write(`${errors.length} validation error(s)\n`);
  process.exit(1);
}
