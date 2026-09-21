# Goal

Create the `pi-agents-yaml` utility package and migrate every Pi extension that reads `AGENTS.yml` to its shared, validated discovery and resolution APIs, with `pi-preload` and `pi-tree` consuming one canonical file selection so recursive extends, presets, includes, signatures, excludes, trust boundaries, generated outputs, and dependency packaging behave consistently without duplicate selectors.

## Work units

- [ ] Define the shared `pi-agents-yaml` contracts from the current consumers before moving implementation code.
  - [ ] Inventory the `AGENTS.yml` loading, source discovery, validation, precedence, extends, preset, and file-selection behavior in `pi-preload`, `pi-tree`, `pi-prompts`, `pi-modes`, `pi-tasks`, and the meta schema generator.
  - [ ] Define public types for YAML documents, validated sections, ordered configuration sources, resolved graph nodes, selected files, selected contexts, and resolution fingerprints.
  - [ ] Define `pi-preload` as the canonical file-selection section for this migration and remove file-selection ownership from `pi-tree` instead of introducing a second configuration format.
  - [ ] Record the existing tested `pi-preload` ordering and merge rules as the compatibility contract that the extraction must preserve.

- [ ] Create the standalone `pi-agents-yaml` repository as a normal ESM utility package.
  - [ ] Configure package exports for the public loader, source-discovery, graph-resolution, schema-fragment, and file-selection APIs without a Pi extension manifest or extension entry point.
  - [ ] Add Node scripts for `tsc --noEmit`, `biome check .`, and the repository test suite, using the repository conventions for `check`, `test`, and `format`.
  - [ ] Resolve and pin the latest compatible exact versions of `yaml`, `globby`, TypeBox, Node types, TypeScript, Biome, and any required Pi peer packages, then commit the lock file.
  - [ ] Export shared TypeBox schema fragments for `extends`, `presets`, `includes`, `signatures`, and `excludes` while leaving extension-specific schemas with their owning extensions.

- [ ] Implement the strict YAML document and section-loading layer in `pi-agents-yaml`.
  - [ ] Parse `AGENTS.yml` with the established `yaml` package, reject malformed documents, duplicate keys, and non-mapping roots, and retain the source path in every loaded document.
  - [ ] Validate only the requested top-level section with a caller-supplied TypeBox schema so unrelated extension sections remain independent.
  - [ ] Standardize parse, read, and validation errors so each error names the source path and requested section.
  - [ ] Support `AbortSignal` in asynchronous file reads and keep caches local to one resolution call so reloads cannot reuse stale process-global data.
  - [ ] Cover valid sections, absent sections, unrelated sections, malformed YAML, duplicate keys, schema failures, and cancellation in the package tests.

- [ ] Implement common trusted source discovery and precedence in `pi-agents-yaml`.
  - [ ] Use Pi's native `SettingsManager` and `DefaultPackageManager` APIs to discover the owning package, configured user packages, trusted project packages, and the trusted project root.
  - [ ] Preserve the established order of owning package, user packages, project packages, and project root while removing duplicate physical roots by canonical path.
  - [ ] Exclude the current project package from installed-package sources so the same `AGENTS.yml` file cannot load twice.
  - [ ] Prevent all project-root and project-package reads when the project is untrusted while continuing to allow installed user-package sources.
  - [ ] Add source-discovery tests for trust, precedence, duplicate package roots, missing files, and project-package exclusion.

- [ ] Extract recursive configuration graph and preset resolution from `pi-preload` into `pi-agents-yaml`.
  - [ ] Resolve every `extends` path relative to the `AGENTS.yml` file that declares it and load each extended root's own canonical section.
  - [ ] Scan explicitly extended roots independently so a parent repository's `.gitignore` cannot hide a selected child repository.
  - [ ] Detect cycles and duplicate roots with canonical real paths and report the complete offending source path without following file symlinks.
  - [ ] Move the common preload presets and common generated-file and lock-file exclusions into `pi-agents-yaml` so both consumers use one packaged copy.
  - [ ] Preserve deterministic depth-first ordering, preset merge order, root-local exclusions, and context source roots from the existing preload behavior.
  - [ ] Add graph tests for nested extends, sibling repositories, parent ignore rules, duplicate references, preset composition, and cycles.

- [ ] Implement the canonical file-selection result in `pi-agents-yaml` and publish the dependency commit.
  - [ ] Evaluate includes, signatures, and excludes with `globby` relative to each resolved root, with dotfiles enabled, Git ignores enabled per root, regular files only, and symbolic-link following disabled.
  - [ ] Remove the independent `pi-tree` fallback to `**/*`; select broad patterns only when the canonical configuration or a named preset explicitly contains them.
  - [ ] Return immutable selected records with absolute path, normalized display path, source root, declaring configuration path, and `full` or `signature` mode.
  - [ ] Deduplicate by canonical file path, make full selection win over signature selection, and sort the final result deterministically without allowing consumers to recalculate paths.
  - [ ] Compute a stable fingerprint from the resolved configuration files, preset inputs, graph order, selected records, and selection modes.
  - [ ] Build a meta-repository fixture with selected, excluded, ignored, signature-only, and unselected sentinel files and verify the exact result set.
  - [ ] Pass package typecheck, lint, tests, clean full install, and clean production install, then push the repository and record the immutable commit used by consumers.

- [ ] Migrate `pi-preload` to the remote `pi-agents-yaml` package without changing preload rendering behavior.
  - [ ] Add `pi-agents-yaml` as an exact remote dependency, update the lock file, and import its section loader, graph resolver, presets, and canonical file selection directly.
  - [ ] Delete the moved YAML, extends, preset, glob-selection, default-exclusion, path-normalization, and source-discovery implementations from `pi-preload`.
  - [ ] Keep dynamic context execution, media loading, signature folding, byte limits, block rendering, and `PRELOAD.md` writing in `pi-preload` and feed them only the shared resolved result.
  - [ ] Store the shared fingerprint in hidden preload message details and replace custom-type-only cache checks with fingerprint-aware handling that reports stale resumed context explicitly.
  - [ ] Update the existing preload unit and end-to-end tests to consume the package contract and prove that output order, folding, contexts, limits, trust, and reload behavior remain valid.
  - [ ] Remove dependencies and packaged preset files that became unused, then pass the full `pi-preload` validation matrix.

- [ ] Migrate `pi-tree` to render only the canonical `pi-agents-yaml` file selection.
  - [ ] Add the exact remote dependency and replace `pi-tree/src/selection.ts` with direct use of the shared resolved selection used by `pi-preload`.
  - [ ] Delete local YAML parsing, recursive extends traversal, include and exclude globbing, default exclusions, and fallback selection behavior from `pi-tree`.
  - [ ] Build tree input only from selected display paths and their required parent directory rows so the renderer cannot discover an unselected file.
  - [ ] Include both full-selected and signature-selected files while excluding dynamic context blocks because they are not filesystem entries.
  - [ ] Store the shared fingerprint in hidden tree message details and regenerate `TREE.txt` before deciding whether an existing session context snapshot is current.
  - [ ] Update the existing tree tests with the shared meta-repository fixture and assert that rendered file leaves equal the preload-selected file paths and omit every unselected sentinel.
  - [ ] Remove unused `yaml` and `globby` dependencies, update the lock file, and pass the full `pi-tree` validation matrix.

- [ ] Migrate `pi-prompts` to the common YAML source and section APIs.
  - [ ] Replace local package-root discovery, package-name reads, YAML parsing, and section validation with `discoverAgentsSources()` and `loadAgentsSection()` from `pi-agents-yaml`.
  - [ ] Keep Markdown prompt-directory loading, prompt duplicate checks, chain resolution, editor cycling, and follow-up delivery in `pi-prompts`.
  - [ ] Preserve user-package, trusted project-package, and trusted project-root ordering through the ordered source records returned by the package.
  - [ ] Update the existing unit and integration tests for trusted and untrusted discovery, source precedence, duplicate names, missing chain members, and reload cleanup.
  - [ ] Remove superseded dependencies, update the lock file, and pass the full `pi-prompts` validation matrix.

- [ ] Migrate `pi-modes` to the common YAML source and section APIs.
  - [ ] Replace local source-path discovery, YAML reads, parse errors, and strict section validation with the shared package APIs.
  - [ ] Keep mode merge precedence, editor suffix behavior, terminal input handling, event handling, and cleanup in `pi-modes`.
  - [ ] Update the existing mode tests to prove exact schema validation, trusted source selection, precedence, reload replacement, and production extension loading.
  - [ ] Remove superseded dependencies, update the lock file, and pass the full `pi-modes` validation matrix.

- [ ] Migrate `pi-tasks` package-local prompt loading to `pi-agents-yaml`.
  - [ ] Replace the direct synchronous `read-yaml-file` call in `src/run/prompt.ts` with the shared asynchronous section loader through ESM top-level `await` and a strict TypeBox schema for the required prompt body.
  - [ ] Preserve `EXECUTE_TASK_PROMPT`, `feedPrompt()`, prompt sanitization, and current task execution behavior while making missing or invalid package configuration fail with the common scoped error.
  - [ ] Remove `read-yaml-file` when no longer used, update the lock file, and update the existing prompt and task tests for successful and invalid configuration loading.
  - [ ] Pass the complete `pi-tasks` typecheck, lint, unit, end-to-end, clean install, production install, and extension-load checks.

- [ ] Align generated schemas, package manifests, and tracked `AGENTS.yml` configuration with the shared ownership model.
  - [ ] Update the meta schema generator and extension schema modules to compose the shared `pi-agents-yaml` schema fragments instead of redeclaring the same fields.
  - [ ] Remove duplicated `pi-tree` selection sections from tracked project configuration and keep one canonical `pi-preload` extends and file-selection graph.
  - [ ] Keep the extension template on the canonical selection section and verify that generated repositories need no separate `pi-tree` block for tree inclusion.
  - [ ] Update package `files`, exports, peer dependencies, production dependencies, and lock files so presets and runtime modules are present in packed production artifacts.
  - [ ] Run the meta schema generation check and verify that the generated schema accepts the canonical configuration and rejects removed duplicate selection fields where applicable.

- [ ] Validate and roll out the complete dependency chain without local package installation shortcuts.
  - [ ] Re-run the shared meta-repository fixture through real `pi-preload` and `pi-tree` extension loads and compare `PRELOAD.md` file markers with `TREE.txt` file leaves.
  - [ ] Verify nested extends, root-local ignores, presets, signatures, exclusions, trust boundaries, stale-fingerprint reporting, and absence of unselected sentinel files in the packed production installations.
  - [ ] Run typecheck, Biome, all existing tests, clean full install, clean production install, and provider-free production extension-load checks for every changed repository.
  - [ ] If the utility API changed during consumer integration, push the corrected `pi-agents-yaml` commit and repin every consumer to that exact remote commit before final validation.
  - [ ] Commit and push all changed consumer repositories in dependency order after validation, then run `pi update` for every changed Pi extension as the final rollout action.
