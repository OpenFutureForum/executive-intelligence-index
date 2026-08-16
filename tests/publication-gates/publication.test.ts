import { describe, expect, it } from 'vitest';
import { publicationIssues } from '../../scripts/lib/publication';

describe('publication gates', () => {
  it('rejects agent-assigned human approval', () => {
    expect(publicationIssues({ workflow_status: 'published', human_review_status: 'approved', reviewed_by: 'Codex agent', reviewed_at: '2026-08-14T12:00:00Z', rights_status: 'link_and_paraphrase' })).toContain('record: invalid human approval attribution');
  });
  it('rejects public records without named human approval', () => {
    expect(publicationIssues({ workflow_status: 'published', human_review_status: 'pending', reviewed_by: null, reviewed_at: null, rights_status: 'link_and_paraphrase' }).length).toBeGreaterThan(0);
  });
  it('allows non-public machine drafts to await review', () => {
    expect(publicationIssues({ workflow_status: 'candidate', human_review_status: 'pending', reviewed_by: null, reviewed_at: null })).toEqual([]);
  });
});
