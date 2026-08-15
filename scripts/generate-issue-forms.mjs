import fs from 'node:fs';
import path from 'node:path';

const forms = [
  ['source-nomination','Source nomination','source', ['Canonical source URL','Why this source belongs','Facts or statements it supports','Access and rights basis','Conflicts or OFF relationship']],
  ['book-nomination','Book nomination','book', ['Book title and author','Verified edition identifiers','Metadata sources','Inclusion rationale','Analysis access basis']],
  ['person-correction','Person correction','correction', ['Person record or page','Field to correct','Proposed correction','Primary evidence','Role date or effective date']],
  ['current-role-correction','Current-role correction','correction', ['Person record','Proposed current role','Official verification URL','Verified date','Historical role impact']],
  ['bibliographic-correction','Bibliographic correction','correction', ['Work or edition ID','Field to correct','Proposed value','Bibliographic source','Edition-specific notes']],
  ['statement-correction','Statement correction','correction', ['Statement ID','Proposed correction','Canonical source URL','Exact locator','Attribution or scope issue']],
  ['rights-concern','Rights concern','rights', ['Affected record or URL','Rights holder or relationship','Material at issue','Reason for concern','Requested review action']],
  ['privacy-concern','Privacy concern','privacy', ['Affected record or URL','Material at issue','Why it may be private or confidential','Requested review action','Safe contact method if needed']],
  ['taxonomy-proposal','Taxonomy proposal','taxonomy', ['Proposed preferred label','Definition and exclusions','Parent topic','Aliases and examples','Evidence of durable distinction']],
  ['dossier-proposal','Dossier proposal','research', ['Research question','Scope and time period','Candidate evidence types','Diversity objectives','Expected limitations']],
  ['research-batch-proposal','Research batch proposal','research', ['Research question','Scope and time period','Inclusion criteria','Exclusion criteria','Planned search queries']],
  ['data-issue','Data issue','data', ['Record ID or export','Observed problem','Expected behavior or value','Evidence','Affected release']],
  ['translation-correction','Translation correction','translation', ['Record ID','Language','Current text','Proposed translation','Translator basis or source']],
  ['conflict-disclosure','Sponsorship or conflict disclosure','disclosure', ['Affected person, source, or dossier','Relationship','Relevant dates','Potential effect','Proposed disclosure text']]
];
const dir = path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE'); fs.mkdirSync(dir, { recursive: true });
const quote = (value) => JSON.stringify(value);
for (const [slug, name, label, fields] of forms) {
  const body = fields.map((field, index) => `  - type: textarea\n    id: field_${index + 1}\n    attributes:\n      label: ${quote(field)}\n    validations:\n      required: true`).join('\n');
  const text = `name: ${quote(name)}\ndescription: ${quote(`Submit one evidence-backed ${name.toLowerCase()} for editorial review.`)}\ntitle: ${quote(`${name}: `)}\nlabels: [${label}]\nbody:\n  - type: markdown\n    attributes:\n      value: ${quote('Submission does not guarantee inclusion. Do not include private source material, personal contact details, or copyrighted full text.')}\n${body}\n  - type: checkboxes\n    id: confirmation\n    attributes:\n      label: Submission confirmation\n      options:\n        - label: I have provided public evidence and disclosed relevant relationships.\n          required: true\n`;
  fs.writeFileSync(path.join(dir, `${slug}.yml`), text);
}
