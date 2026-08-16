import { describe, expect, it } from 'vitest';
import { syntheticRecords } from '../fixtures/synthetic/all-entities';

describe('provenance fixtures', () => {
  it('gives every major entity a batch and prompt lineage', () => {
    for (const record of Object.values(syntheticRecords)) {
      expect(record.provenance).toBeInstanceOf(Array);
      expect((record.provenance as any[])[0]).toMatchObject({ batch_id: 'fix-batch-001', prompt_id: 'FIXTURE-PROMPT', prompt_version: '1.0' });
    }
  });
});
