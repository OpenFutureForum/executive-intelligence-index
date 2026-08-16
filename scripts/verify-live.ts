export {};
const base = process.env.BASE_URL;
if (!base) {
  process.stdout.write('SKIP live verification: BASE_URL is not set because no deployment occurred.\n');
  process.exit(0);
}
const paths = ['/', '/methodology/', '/data/', '/robots.txt', '/sitemap-index.xml', '/data/release-manifest.json'];
const failures: string[] = [];
for (const item of paths) {
  const response = await fetch(new URL(item.replace(/^\//, ''), base.endsWith('/') ? base : `${base}/`));
  if (!response.ok) failures.push(`${item}: HTTP ${response.status}`);
}
if (failures.length) { for (const failure of failures) process.stderr.write(`ERROR ${failure}\n`); process.exit(1); }
process.stdout.write(`PASS live verification: ${paths.length} endpoints at ${base}\n`);
