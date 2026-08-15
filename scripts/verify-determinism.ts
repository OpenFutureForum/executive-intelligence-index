import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { listFiles, sha256 } from './lib/records.js';

function fingerprint(directory: string): string {
  const parts = listFiles(directory).map((file) => `${path.relative(directory, file)}:${sha256(fs.readFileSync(file))}`);
  return sha256(`${parts.join('\n')}\n`);
}
if (!fs.existsSync('docs')) throw new Error('Run npm run build before determinism verification.');
const before = fingerprint('docs');
execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
const after = fingerprint('docs');
if (before !== after) { process.stderr.write(`ERROR nondeterministic docs build: ${before} != ${after}\n`); process.exit(1); }
process.stdout.write(`PASS deterministic docs build: ${after}\n`);
