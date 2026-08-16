import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('repository architecture', () => {
  it('contains policy, schema, workflow, and publishing foundations', () => {
    for (const file of ['METHODOLOGY.md','EDITORIAL-INDEPENDENCE.md','SOURCE-SELECTION.md','ATTRIBUTION-STANDARD.md','COPYRIGHT.md','PRIVACY-AND-CONFIDENTIALITY.md','schema/person.schema.json','.github/workflows/pages.yml','operations/prompts/PROMPT-CATALOG.yml']) expect(fs.existsSync(file), file).toBe(true);
  });
  it('keeps production data directories free of synthetic IDs', () => {
    const text = fs.readdirSync('data', { recursive: true }).filter((name) => String(name).endsWith('.json')).map((name) => fs.readFileSync(`data/${name}`, 'utf8')).join('\n');
    expect(text).not.toContain('fix-person-');
  });
});
