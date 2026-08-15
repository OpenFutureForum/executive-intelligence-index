export function publicationIssues(record: Record<string, any>, file = 'record'): string[] {
  const errors: string[] = [];
  const isPublic = record.workflow_status === 'published' || record.publication_status === 'published';
  if (isPublic) {
    if (record.human_review_status !== 'approved') errors.push(`${file}: public record lacks human approval`);
    if (!record.reviewed_by || !record.reviewed_at) errors.push(`${file}: public record lacks named reviewer and date`);
    if (record.rights_status === 'unknown' || record.rights_status === 'disputed') errors.push(`${file}: public record has unresolved rights`);
  }
  if (record.human_review_status === 'approved' && (!record.reviewed_by || /^ai|agent|codex/i.test(record.reviewed_by))) errors.push(`${file}: invalid human approval attribution`);
  return errors;
}
