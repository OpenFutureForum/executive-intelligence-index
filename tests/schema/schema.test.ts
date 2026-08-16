import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { syntheticRecords } from '../fixtures/synthetic/all-entities';

describe('canonical schemas', () => {
  const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
  for (const file of fs.readdirSync('schema').filter((name) => name.endsWith('.schema.json'))) ajv.addSchema(JSON.parse(fs.readFileSync(path.join('schema', file), 'utf8')));
  it('provides all 17 required entity schemas', () => expect(Object.keys(syntheticRecords)).toHaveLength(17));
  for (const [name, fixture] of Object.entries(syntheticRecords)) it(`validates the reserved ${name} fixture`, () => {
    const validate = ajv.getSchema(`https://openfutureforum.github.io/executive-intelligence-index/schema/${name}.schema.json`);
    expect(validate, `schema ${name}`).toBeDefined();
    expect(validate!(fixture), JSON.stringify(validate!.errors)).toBe(true);
  });
});
