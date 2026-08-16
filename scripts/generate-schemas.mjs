import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const schemaDir = path.join(root, 'schema');
fs.mkdirSync(schemaDir, { recursive: true });

const scalar = { type: ['string', 'null'] };
const string = { type: 'string', minLength: 1 };
const number = { type: ['number', 'null'] };
const integer = { type: ['integer', 'null'] };
const boolean = { type: ['boolean', 'null'] };
const array = { type: 'array', items: {} };
const strings = { type: 'array', items: { type: 'string' }, uniqueItems: true };
const object = { type: 'object' };
const date = { type: ['string', 'null'], format: 'date' };
const dateTime = { type: ['string', 'null'], format: 'date-time' };

const reviewProps = {
  workflow_status: { $ref: 'common.schema.json#/$defs/workflowStatus' },
  machine_review_status: { $ref: 'common.schema.json#/$defs/machineReviewStatus' },
  human_review_status: { $ref: 'common.schema.json#/$defs/humanReviewStatus' },
  reviewed_by: scalar,
  reviewed_at: dateTime,
  provenance: { type: 'array', minItems: 1, items: { $ref: 'common.schema.json#/$defs/provenance' } },
  revision_history: { type: 'array', items: { $ref: 'common.schema.json#/$defs/revision' } }
};

const specs = {
  person: {
    id: 'person_id', required: ['person_id', 'canonical_name', 'display_name', 'public_profile_eligibility', 'verification_status', 'provenance'],
    props: { person_id: string, canonical_name: string, display_name: string, alternate_names: strings, name_disambiguation_note: scalar, external_identifiers: object, current_role: scalar, current_organization_reference: scalar, current_role_source: scalar, current_role_verified_at: date, current_role_freshness_status: scalar, historical_roles: array, role_at_source_time: array, professional_geographies: strings, operating_markets: strings, languages: strings, expertise_topics: strings, authored_book_work_ids: strings, contributed_work_ids: strings, source_ids: strings, statement_ids: strings, proposition_relationships: array, relationship_to_off: scalar, disclosure: scalar, public_profile_eligibility: { type: 'boolean' }, verification_status: string, person_depth: scalar, ...reviewProps }
  },
  'organization-reference': {
    id: 'local_reference_id', required: ['local_reference_id', 'organization_name', 'match_status', 'provenance'],
    props: { local_reference_id: string, canonical_cxo_ecosystem_id: scalar, organization_name: string, organization_aliases: strings, match_status: string, match_confidence: number, upstream_release: scalar, upstream_commit: scalar, upstream_fingerprint: scalar, verification_source: scalar, unresolved_reason: scalar, last_synced_at: dateTime, ...reviewProps }
  },
  'book-work': {
    id: 'book_work_id', required: ['book_work_id', 'title', 'authors', 'analysis_depth', 'analysis_basis', 'provenance'],
    props: { book_work_id: string, title: string, subtitle: scalar, alternate_titles: strings, authors: strings, contributors: strings, original_language: scalar, first_publication_date: date, work_type: string, topics: strings, central_subjects: strings, inclusion_rationale: scalar, analysis_depth: { $ref: 'common.schema.json#/$defs/bookDepth' }, analysis_basis: string, central_thesis: scalar, principal_propositions: strings, frameworks: array, evidence_base: scalar, executive_role_implications: object, strongest_documented_arguments: strings, limitations: strings, counterpoints: strings, later_author_interview_source_ids: strings, related_book_work_ids: strings, related_report_ids: strings, changes_in_later_statements: strings, edition_ids: strings, related_source_ids: strings, related_statement_ids: strings, related_proposition_ids: strings, related_dossier_ids: strings, rights_notes: scalar, review_status: scalar, publication_status: scalar, ...reviewProps }
  },
  'book-edition': {
    id: 'book_edition_id', required: ['book_edition_id', 'book_work_id', 'edition_title', 'language', 'source_used_for_analysis', 'access_basis', 'access_date', 'verification_status', 'provenance'],
    props: { book_edition_id: string, book_work_id: string, edition_title: string, publisher: scalar, imprint: scalar, publication_date: date, publication_country: scalar, language: string, translation_of: scalar, translator: scalar, format: scalar, 'ISBN-10': scalar, 'ISBN-13': scalar, audiobook_identifier: scalar, audiobook_narrator: scalar, edition_statement: scalar, pagination: integer, electronic_location_system: scalar, source_used_for_analysis: { type: 'boolean' }, access_basis: string, access_date: date, metadata_sources: strings, full_text_available_for_research: boolean, publication_permission: scalar, verification_status: string, ...reviewProps }
  },
  source: {
    id: 'source_id', required: ['source_id', 'canonical_title', 'source_type', 'original_url', 'canonical_url', 'rights_status', 'ownership_status', 'analysis_basis', 'accessed_at', 'verification_status', 'provenance'],
    props: { source_id: string, canonical_title: string, alternate_titles: strings, source_type: { $ref: 'common.schema.json#/$defs/sourceType' }, series_or_parent_source: scalar, publisher: scalar, channel: scalar, speaker_ids: strings, author_ids: strings, institutional_author: scalar, organization_references: strings, recorded_at: date, event_date: date, published_at: date, updated_at: date, duration_seconds: integer, language: scalar, translated_title: scalar, translation_method: scalar, geography_of_speaker: strings, geography_of_organization: strings, geography_discussed: strings, study_geography: strings, original_url: { type: 'string', format: 'uri' }, canonical_url: { type: 'string', format: 'uri' }, archived_url: scalar, embed_url: scalar, doi: scalar, canonical_identity_status: string, repost_status: scalar, original_source_id: scalar, rights_status: { $ref: 'common.schema.json#/$defs/rightsStatus' }, ownership_status: { $ref: 'common.schema.json#/$defs/ownershipStatus' }, relationship_to_off: scalar, transcript_status: scalar, transcript_source: scalar, transcript_republication_permission: scalar, chapter_markers: array, analysis_basis: string, topics: strings, executive_roles: strings, original_abstract: scalar, inclusion_rationale: scalar, source_quality_dimensions: object, methodology_quality: object, study_design: scalar, sample: object, population: scalar, date_range: object, funding: scalar, sponsor: scalar, peer_review_status: scalar, findings: array, limitations: strings, correction_ids: strings, retraction_status: scalar, content_hash: scalar, accessed_at: date, verification_status: string, source_depth: scalar, publication_status: scalar, ...reviewProps }
  },
  statement: {
    id: 'statement_id', required: ['statement_id', 'source_id', 'statement_type', 'neutral_paraphrase', 'exact_locator', 'locator_type', 'source_date', 'topic_ids', 'evidence_character', 'factual_verification_status', 'statement_scope', 'extraction_method', 'provenance'],
    props: { statement_id: string, source_id: string, person_id: scalar, institutional_author: scalar, book_edition_id: scalar, speaker_role_at_source_time: scalar, organization_at_source_time: scalar, statement_type: { $ref: 'common.schema.json#/$defs/statementType' }, neutral_paraphrase: string, direct_quote: scalar, direct_quote_rights_note: scalar, exact_locator: string, locator_type: string, source_date: date, topic_ids: { ...strings, minItems: 1 }, executive_role_context: strings, industry_context: strings, geographic_context: strings, evidence_character: string, factual_verification_status: string, statement_scope: string, uncertainty: scalar, extraction_method: string, machine_extraction_confidence: number, independent_agent_review_status: string, publication_status: scalar, ...reviewProps },
    allOf: [{ anyOf: [{ required: ['person_id'] }, { required: ['institutional_author'] }] }, { if: { properties: { locator_type: { const: 'page' } } }, then: { required: ['book_edition_id'] } }]
  },
  proposition: {
    id: 'proposition_id', required: ['proposition_id', 'neutral_formulation', 'definition', 'scope', 'topic_ids', 'proposition_status', 'provenance'],
    props: { proposition_id: string, neutral_formulation: string, aliases: strings, definition: string, scope: string, time_period: scalar, topic_ids: { ...strings, minItems: 1 }, relevant_role_ids: strings, relevant_geographies: strings, supporting_statement_ids: strings, challenging_statement_ids: strings, qualifying_statement_ids: strings, refining_statement_ids: strings, superseding_statement_ids: strings, evidence_source_ids: strings, proposition_status: string, ambiguity_notes: scalar, source_diversity_metrics: object, ownership_concentration_warning: boolean, publication_status: scalar, ...reviewProps }
  },
  stance: {
    id: 'stance_id', required: ['stance_id', 'proposition_id', 'statement_id', 'relationship_type', 'scope_match', 'confidence', 'rationale', 'review_status', 'provenance'],
    props: { stance_id: string, proposition_id: string, statement_id: string, relationship_type: { $ref: 'common.schema.json#/$defs/stanceType' }, scope_match: string, confidence: number, rationale: string, review_status: string, ...reviewProps }
  },
  topic: {
    id: 'topic_id', required: ['topic_id', 'preferred_label', 'definition', 'publication_thresholds', 'review_status', 'provenance'],
    props: { topic_id: string, preferred_label: string, aliases: strings, definition: string, parent_topic_id: scalar, related_topic_ids: strings, exclusions: strings, examples: strings, applicable_roles: strings, publication_thresholds: object, review_status: string, publication_status: scalar, ...reviewProps }
  },
  debate: {
    id: 'debate_id', required: ['debate_id', 'neutral_question', 'scope', 'topic_ids', 'proposition_ids', 'statement_ids', 'evidence_limitations', 'publication_status', 'provenance'],
    props: { debate_id: string, neutral_question: string, scope: string, time_period: scalar, topic_ids: strings, relevant_role_ids: strings, proposition_ids: strings, statement_ids: strings, areas_of_documented_alignment: strings, areas_of_documented_disagreement: strings, unresolved_scope_differences: strings, evidence_limitations: strings, source_diversity: object, role_coverage: object, geographic_coverage: object, ownership_concentration: object, publication_status: string, review_history: array, ...reviewProps }
  },
  dossier: {
    id: 'dossier_id', required: ['dossier_id', 'title', 'research_question', 'scope', 'pre_registered_protocol_id', 'methodology_limitations', 'provenance'],
    props: { dossier_id: string, title: string, research_question: string, scope: string, time_period: scalar, pre_registered_protocol_id: string, source_ids: strings, statement_ids: strings, proposition_ids: strings, person_ids: strings, organization_references: strings, role_coverage: object, geographic_coverage: object, language_coverage: object, source_type_coverage: object, foundational_works: strings, evidence_matrix: array, key_propositions: strings, divergent_positions: strings, evidence_assessment: scalar, changes_over_time: scalar, unanswered_questions: strings, OFF_research_opportunities: strings, methodology_limitations: strings, ownership_concentration: object, reviewer: scalar, publication_date: date, publication_status: scalar, ...reviewProps }
  },
  'trend-snapshot': {
    id: 'trend_snapshot_id', required: ['trend_snapshot_id', 'topic_or_proposition_id', 'start_date', 'end_date', 'frozen_corpus_release', 'eligible_source_count', 'raw_component_values', 'weights', 'normalized_values', 'score', 'limitations', 'provenance'],
    props: { trend_snapshot_id: string, topic_or_proposition_id: string, start_date: date, end_date: date, frozen_corpus_release: string, eligible_source_count: integer, new_source_count: integer, independent_person_count: integer, independent_organization_count: integer, role_spread: integer, geographic_spread: integer, language_spread: integer, source_type_spread: integer, new_supporting_statements: integer, new_challenging_statements: integer, raw_component_values: object, weights: object, normalized_values: object, score: number, limitations: strings, review_status: string, publication_status: scalar, ...reviewProps }
  },
  'research-protocol': {
    id: 'protocol_id', required: ['protocol_id', 'research_question', 'scope', 'time_period', 'inclusion_criteria', 'exclusion_criteria', 'planned_search_queries', 'created_at', 'created_by', 'prompt_id', 'prompt_version', 'provenance'],
    props: { protocol_id: string, research_question: string, scope: string, time_period: string, target_roles: strings, target_geographies: strings, target_languages: strings, included_source_types: strings, excluded_source_types: strings, inclusion_criteria: strings, exclusion_criteria: strings, source_priority: strings, diversity_objectives: strings, expected_limitations: strings, planned_search_queries: strings, planned_batch_size: integer, created_at: dateTime, created_by: string, prompt_id: string, prompt_version: string, ...reviewProps }
  },
  'research-batch': {
    id: 'batch_id', required: ['batch_id', 'protocol_id', 'prompt_id', 'prompt_version', 'branch', 'execution_started_at', 'agent_or_researcher', 'model_disclosure', 'tools_used', 'sources_considered', 'accepted_count', 'rejected_count', 'held_count', 'validation_commands', 'validation_results', 'limitations', 'next_action', 'provenance'],
    props: { batch_id: string, protocol_id: string, prompt_id: string, prompt_version: string, branch: string, pull_request: scalar, execution_started_at: dateTime, execution_completed_at: dateTime, agent_or_researcher: string, model_disclosure: string, tools_used: strings, sources_considered: array, accepted_count: integer, rejected_count: integer, held_count: integer, output_files: strings, validation_commands: strings, validation_results: array, limitations: strings, next_action: string, ...reviewProps }
  },
  review: {
    id: 'review_id', required: ['review_id', 'batch_id', 'record_ids', 'review_type', 'reviewer_type', 'review_date', 'decisions', 'publication_recommendation', 'provenance'],
    props: { review_id: string, batch_id: string, record_ids: strings, review_type: string, reviewer_type: string, named_human_reviewer: scalar, review_date: date, decisions: array, corrections: array, disagreements: array, unresolved_issues: array, rights_review: object, publication_recommendation: string, ...reviewProps }
  },
  correction: {
    id: 'correction_id', required: ['correction_id', 'affected_record_ids', 'submitted_at', 'correction_type', 'evidence', 'decision', 'decision_reason', 'provenance'],
    props: { correction_id: string, affected_record_ids: strings, submitted_by: scalar, submitted_at: dateTime, correction_type: string, evidence: array, decision: string, decision_reason: string, corrected_at: dateTime, previous_value: object, new_value: object, public_note: scalar, reviewer: scalar, ...reviewProps }
  },
  release: {
    id: 'release_id', required: ['release_id', 'semantic_version', 'schema_version', 'data_version', 'content_version', 'release_date', 'included_batch_ids', 'included_record_counts', 'checksums', 'release_fingerprint', 'known_limitations', 'changelog', 'approval_status', 'provenance'],
    props: { release_id: string, semantic_version: string, schema_version: string, data_version: string, content_version: string, release_date: date, included_batch_ids: strings, included_record_counts: object, checksums: object, release_fingerprint: string, upstream_crosswalk_versions: object, known_limitations: strings, changelog: strings, approval_status: string, ...reviewProps }
  }
};

const common = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://openfutureforum.github.io/executive-intelligence-index/schema/common.schema.json',
  $defs: {
    workflowStatus: { enum: ['candidate','protocol_approved','metadata_verified','source_access_verified','content_reviewed','statements_extracted','propositions_mapped','independently_checked','publication_recommended','publication_approved','published','revised','withdrawn'] },
    machineReviewStatus: { enum: ['not_started','machine_drafted','machine_checked','second_agent_checked','issues_found','ready_for_human_review'] },
    humanReviewStatus: { enum: ['not_reviewed','pending','changes_requested','approved','rejected'] },
    bookDepth: { enum: ['catalogued','reviewed','deeply_analyzed'] },
    sourceType: { enum: ['book','audiobook','video','podcast_episode','keynote','panel','interview','conference_talk','essay','newsletter','public_letter','research_report','academic_paper','working_paper','executive_survey','earnings_commentary','event_recording','OFF_research','OFF_interview','OFF_video','public_policy_document','other_approved'] },
    statementType: { enum: ['factual_assertion','empirical_finding','recommendation','prediction','opinion','warning','definition','reported_experience','case_study','strategic_framework','interpretation','counterargument','methodological_claim','company_reported_outcome','policy_position'] },
    stanceType: { enum: ['supports','challenges','qualifies','narrows','broadens','refines','supersedes','provides_example','provides_evidence','disputes_evidence','unrelated_after_review'] },
    rightsStatus: { enum: ['unknown','metadata_only','link_and_paraphrase','openly_licensed','public_domain','permission_documented','OFF_owned','restricted','disputed'] },
    ownershipStatus: { enum: ['third_party','OFF_owned','co_published','unknown'] },
    provenance: { type: 'object', additionalProperties: false, required: ['source_url','accessed_at','retrieval_method','batch_id','prompt_id','prompt_version'], properties: { source_url: { type: 'string', format: 'uri' }, accessed_at: { type: 'string', format: 'date' }, retrieval_method: string, exact_locator: scalar, content_hash: scalar, batch_id: string, prompt_id: string, prompt_version: string, notes: scalar } },
    revision: { type: 'object', additionalProperties: false, required: ['changed_at','changed_by','summary'], properties: { changed_at: { type: 'string', format: 'date-time' }, changed_by: string, summary: string, batch_id: scalar } }
  }
};
fs.writeFileSync(path.join(schemaDir, 'common.schema.json'), `${JSON.stringify(common, null, 2)}\n`);

for (const [name, spec] of Object.entries(specs)) {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `https://openfutureforum.github.io/executive-intelligence-index/schema/${name}.schema.json`,
    title: name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' '),
    type: 'object', additionalProperties: false, required: spec.required, properties: spec.props,
    ...(spec.allOf ? { allOf: spec.allOf } : {})
  };
  fs.writeFileSync(path.join(schemaDir, `${name}.schema.json`), `${JSON.stringify(schema, null, 2)}\n`);
}

const index = { schema_version: '1.0.0', generated_at: '2026-08-14', schemas: Object.keys(specs).map((name) => ({ entity: name, file: `${name}.schema.json`, id: specs[name].id })) };
fs.writeFileSync(path.join(schemaDir, 'schema-index.json'), `${JSON.stringify(index, null, 2)}\n`);
