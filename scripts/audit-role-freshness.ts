import { loadCanonical } from './lib/records.js';

const today = new Date();
const stale: string[] = [];
for (const { file, record } of loadCanonical().filter((item) => item.schema === 'person')) {
  if (!record.current_role) continue;
  if (!record.current_role_verified_at) stale.push(`${file}: current role lacks verification date`);
  else if ((today.getTime() - new Date(record.current_role_verified_at).getTime()) / 86400000 > 180) stale.push(`${file}: current role verification is older than 180 days`);
}
if (stale.length) { for (const warning of stale) process.stderr.write(`ERROR ${warning}\n`); process.exit(1); }
process.stdout.write('PASS role freshness: all current-role records are within the 180-day threshold\n');
