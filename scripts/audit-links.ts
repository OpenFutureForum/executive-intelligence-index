import { loadCanonical } from './lib/records.js';

const urls = [...new Set(loadCanonical().flatMap(({ record }) => [record.canonical_url, record.original_url].filter((value): value is string => typeof value === 'string')))];
const failures: string[] = [];
for (const url of urls) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (response.status >= 400 && response.status !== 405) failures.push(`${url}: HTTP ${response.status}`);
  } catch (error) { failures.push(`${url}: ${String(error)}`); }
}
if (failures.length) { for (const failure of failures) process.stderr.write(`ERROR ${failure}\n`); process.exit(1); }
process.stdout.write(`PASS external links: ${urls.length} canonical or original URL(s) checked\n`);
