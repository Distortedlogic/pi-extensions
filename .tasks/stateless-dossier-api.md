# Goal

Implement a path-free dossier API with durable short dossier IDs supplied on every dossier-scoped call, remove hidden dossier selection, preserve dossier-scoped typed record catalogs, replace kind-specific partial-update tools with one exact-match semantic editor, keep evidence execution in dedicated tools, support facts, open questions, hypotheses, theories, and Mermaid diagrams, migrate existing dossiers manually without compatibility code, and publish only after targeted behavior, clean-install, and production-load checks pass.

## Work units

- [ ] Define the durable dossier-ID and agent-document contracts
  - [ ] Add a `DossierIdSchema` that accepts only `D` followed by a positive decimal integer.
  - [ ] Add private `dossier_id` metadata to stored scope records without adding it to `ScopeValue` or rendered scope content.
  - [ ] Replace the numbered dossier catalog schema with a direct `Record<DossierId, Topic>` result schema.
  - [ ] Change the diagram handle prefix from `D` to `M` so dossier IDs and Mermaid entry handles cannot be confused.
  - [ ] Add path-free `DOSSIER_NOT_FOUND` and use existing `INVALID_INPUT` and `INTEGRITY_ERROR` categories for invalid IDs, duplicate IDs, and semantic-edit failures.

- [ ] Implement private dossier-ID discovery and allocation
  - [ ] Parse and validate one private dossier ID from every stored scope during collection inspection.
  - [ ] Reject missing, malformed, or duplicate dossier IDs without exposing internal storage names.
  - [ ] Build an exact private map from dossier ID to internal descriptor for each scoped operation.
  - [ ] Allocate the next dossier ID from the highest valid stored numeric suffix while holding the collection mutation queue.
  - [ ] Persist the allocated ID during dossier creation and retain it through topic changes.

- [ ] Remove hidden current-dossier selection
  - [ ] Remove `dossier_select`, numbered list entries, current-selection fields, and branch-local selection entries.
  - [ ] Remove `selectedDirectory`, selection restoration, and selection updates after creation or scope rename.
  - [ ] Make `dossier_list` a side-effect-free read that returns the direct ID-to-topic map.
  - [ ] Require `id` on overview, full view, read, evidence, add, edit, evidence mutation, and delete calls.
  - [ ] Resolve each supplied ID independently without requiring a prior list call or semantic fallback.

- [ ] Scope typed record catalogs by dossier ID
  - [ ] Replace the single session entry catalog with catalogs keyed by durable dossier ID.
  - [ ] Keep `S`, `F`, `Q`, `H`, `T`, and `M` handles isolated within their owning dossier catalog.
  - [ ] Require overview or full view for a dossier before accepting one of its record handles.
  - [ ] Reject a handle when its stored kind or subject no longer matches the catalog entry.
  - [ ] Ensure switching between dossier IDs does not establish or alter hidden current-dossier state.

- [ ] Define the canonical path-free editable document
  - [ ] Serialize each record’s semantic value as deterministic formatted JSON with one final newline.
  - [ ] Exclude dossier IDs, record kinds, internal descriptors, names, extensions, slugs, and paths from the editable document.
  - [ ] Return editable documents from single-record reads and full-view records while keeping overview entries concise.
  - [ ] Parse edited JSON and validate it against the schema for the record’s existing kind.
  - [ ] Keep private storage metadata outside the editable document and unchanged by semantic edits.

- [ ] Replace kind-specific update tools with one exact-match editor
  - [ ] Add `dossier_edit` with `id`, `entry`, and a list of exact `oldText` and `newText` replacements.
  - [ ] Apply all replacements against the same current canonical document and require each old text to match exactly once.
  - [ ] Reject overlapping replacements, malformed JSON, kind changes, evidence changes, empty edits, and semantic no-ops.
  - [ ] Normalize and validate the complete resulting semantic value after applying only the requested replacements.
  - [ ] Atomically publish the updated record, move private storage only when its semantic subject changes, and commit the exact affected paths.
  - [ ] Remove `dossier_update_scope`, all kind-specific update tools, public `changes` wrappers, and unused public partial-change schemas.

- [ ] Separate evidence execution from generic editing
  - [ ] Add `dossier_set_evidence` for complete static or runnable evidence replacement on fact entries.
  - [ ] Execute runnable evidence before storage and preserve the existing timeout and observation-size limits.
  - [ ] Add `dossier_accept_evidence` to rerun saved runnable evidence and replace only its stored observation.
  - [ ] Keep `dossier_check_evidence` read-only and return stored-versus-current comparison data.
  - [ ] Reject evidence tools for non-fact handles and reject generic edits that alter fact evidence.

- [ ] Minimize tool inputs and results
  - [ ] Use `id` only for dossier identity and `entry` only for record handles.
  - [ ] Return the allocated dossier ID only from creation and avoid repeating caller-supplied IDs in other results.
  - [ ] Return only the updated semantic document after an edit.
  - [ ] Return only the deleted semantic subject after deletion.
  - [ ] Update namespace guidance and recovery text to describe exact ID use without selection or storage details.

- [ ] Update open-question, diagram, and freshness workflows
  - [ ] Keep open-question values limited to `question`, `context`, and `next_step`.
  - [ ] Keep diagram values limited to `title`, `purpose`, and canonical Mermaid source.
  - [ ] Update `dossier-fresh` to use explicit dossier IDs and `dossier_edit` exact replacements.
  - [ ] Make freshness store unresolved evidence gaps as deduplicated open questions and remove answered questions only after durable results are stored.
  - [ ] Make freshness validate each diagram against refreshed facts, hypotheses, and theory without direct storage access.

- [ ] Enforce the path-free information boundary
  - [ ] Audit every tool description, prompt guideline, structured result, text result, warning, error, and skill instruction for storage details.
  - [ ] Keep internal descriptors private and prevent path fields from entering JSON results or model-facing text.
  - [ ] Preserve existing folder protection and `dossier_request_access` behavior without redesigning it in this change.
  - [ ] Ensure normal agents can discover only dossier IDs, topics, record handles, kinds, subjects, statuses, and semantic documents.

- [ ] Migrate every existing dossier manually
  - [ ] Use approved direct dossier access and enumerate all existing dossiers under the known project roots.
  - [ ] Assign project-local dossier IDs in normalized-topic order and add private IDs to scope envelopes.
  - [ ] Validate ID syntax, uniqueness, scope parsing, and every record kind with the new local implementation.
  - [ ] Commit only migrated dossier records in each affected project and do not add automatic migration or legacy fallback code.

- [ ] Verify behavior and publish
  - [ ] Exercise list, create, overview, full view, read, add, edit, evidence, and delete flows through public Pi APIs with deterministic data.
  - [ ] Verify direct ID use without prior list or selection, topic changes that retain IDs, duplicate-ID rejection, cross-dossier handle rejection, and exact-edit conflict failures.
  - [ ] Verify generic edits preserve untouched semantic fields and cannot alter private metadata or fact evidence.
  - [ ] Verify facts, open questions, hypotheses, theories, and diagrams all round-trip through add, read, edit, full view, and delete.
  - [ ] Run typecheck, lint, targeted checks, a clean full install, a clean production install, and a production extension-load check without provider credentials.
  - [ ] Push the extension, update the installed remote package, and confirm all migrated dossiers load without integrity warnings.
