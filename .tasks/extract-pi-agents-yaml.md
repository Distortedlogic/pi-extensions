# Goal

Create and adopt `pi-agents-yaml` as the single shared implementation for reading, validating, discovering, resolving, and selecting from `AGENTS.yml` across the current Pi extensions, with `pi-preload` and `pi-tree` consuming the same recursive file selection while each extension preserves only its own runtime behavior.

## Work units

- [x] Create the standalone `pi-agents-yaml` ESM utility package.
  - [x] Create a separate repository with no Pi extension entry point and export public document, section, source-discovery, graph-resolution, and file-selection modules.
  - [x] Add the repository-standard `typecheck`, `lint`, `test`, `format`, and `check` scripts using Node test, TypeScript, and Biome.
  - [x] Use `yaml` for parsing, `globby` for file selection, TypeBox for validation, and Pi's native package APIs for source discovery; pin exact latest-compatible dependencies and commit the lock file.
  - [x] Export the canonical `pi-preload` configuration schema and public types for loaded sections, source roots, graph nodes, and selected files while `loadAgentsSection()` accepts each other consumer's own TypeBox schema.

- [x] Implement strict `AGENTS.yml` document loading and ordered source discovery.
  - [x] Implement `parseAgentsYaml()` and `loadAgentsSection()` with the `yaml` package, caller-supplied TypeBox schemas, and errors that name the source file and requested section.
  - [x] Reject malformed YAML, duplicate keys, non-mapping document roots, and invalid requested sections while allowing unrelated top-level extension sections.
  - [x] Implement `discoverAgentsSources()` with Pi's `SettingsManager` and `DefaultPackageManager` for the owning package, user packages, trusted project packages, and trusted project root.
  - [x] Preserve source precedence, remove duplicate physical roots, exclude the current project package from installed sources, and read no project-owned configuration before trust is established.
  - [x] Cover parsing, section validation, trust, source precedence, duplicate roots, absent sections, and cancellation in the package tests.

- [x] Extract recursive extends and preset resolution from `pi-preload` into `pi-agents-yaml`.
  - [x] Implement `resolveAgentsGraph()` so each `extends` path is relative to its declaring file and each extended root loads its own canonical `pi-preload` section.
  - [x] Resolve explicitly extended repositories independently from the parent repository's Git ignore rules.
  - [x] Use canonical paths to deduplicate roots and reject recursive extends cycles with an error that identifies the source path.
  - [x] Move the shared preload presets and generated-file and lock-file exclusions into the utility package.
  - [x] Preserve the existing preload graph order, preset merge order, root-local exclusions, and context roots in focused graph tests.

- [x] Implement and publish the canonical file-selection API.
  - [x] Implement `resolveFileSelection()` with `globby` for full includes, signature includes, and excludes relative to each resolved root, without following symbolic links.
  - [x] Return immutable records containing the canonical absolute path, normalized display path, source root, declaring configuration path, and `full` or `signature` mode.
  - [x] Deduplicate canonical files, make full selection override signature selection, and sort the result deterministically.
  - [x] Select broad patterns only when the canonical configuration or a named preset contains them; do not add an implicit `**/*` fallback.
  - [x] Test a meta repository with nested extends, a parent ignore rule, full and signature files, exclusions, duplicate references, and unselected sentinel files.
  - [x] Pass package checks and clean full and production installs, then push the reviewed utility commit for remote dependency use.

- [x] Migrate `pi-preload` to `pi-agents-yaml`.
  - [x] Pin `pi-agents-yaml` to the reviewed remote commit and update `package-lock.json`.
  - [x] Replace local YAML loading, extends traversal, preset resolution, default exclusions, and glob selection with direct utility-package calls.
  - [x] Keep context rendering, media loading, signature folding, byte limits, hidden context injection, and `PRELOAD.md` output in `pi-preload`.
  - [x] Delete moved implementations and remove dependencies and packaged presets that are no longer used.
  - [x] Update the existing unit and end-to-end tests to cover the same preload behavior through the shared package APIs.

- [x] Migrate `pi-tree` to the exact shared file selection.
  - [x] Pin the same reviewed `pi-agents-yaml` commit and update `package-lock.json`.
  - [x] Delete the YAML parsing, recursive traversal, default exclusions, fallback includes, and glob selection from `pi-tree/src/selection.ts`.
  - [x] Build `TREE.txt` only from the shared selected display paths and their required parent directory rows.
  - [x] Include both full-selected and signature-selected files and exclude preload context blocks because they are not files.
  - [x] Update the existing tree tests to assert that tree file leaves equal preload-selected file paths and that no unselected sentinel appears.
  - [x] Remove unused `yaml` and `globby` dependencies and update the lock file.

- [x] Migrate `pi-prompts` to the shared document and source APIs.
  - [x] Replace package-root discovery, package-name filtering, YAML parsing, and section validation with `discoverAgentsSources()` and `loadAgentsSection()`.
  - [x] Keep Markdown prompt loading, duplicate-name checks, chain resolution, editor cycling, and follow-up delivery in `pi-prompts`.
  - [x] Preserve user-package, trusted project-package, and project-root precedence through the ordered shared source records.
  - [x] Update the existing unit and integration tests for trusted sources, source precedence, duplicate names, missing chain members, and reload cleanup.
  - [x] Remove superseded dependencies and update the lock file.

- [ ] Migrate `pi-modes` to the shared document and source APIs.
  - [x] Replace local source discovery, YAML reads, parse errors, and section validation with `pi-agents-yaml` calls.
  - [x] Keep mode precedence, editor suffix handling, terminal input handling, events, and cleanup in `pi-modes`.
  - [ ] Update the existing mode tests for validation, trust, source precedence, reload, and production loading.
  - [ ] Remove superseded dependencies and update the lock file.

- [ ] Migrate `pi-tasks` package-local prompt configuration to the shared loader.
  - [ ] Replace the `read-yaml-file` call in `pi-tasks/src/run/prompt.ts` with top-level `await` on `loadAgentsSection()` and a strict schema for the required prompt body.
  - [ ] Preserve `EXECUTE_TASK_PROMPT`, `feedPrompt()`, sanitization, and task execution behavior.
  - [ ] Update the existing prompt and task tests for valid and invalid configuration loading.
  - [ ] Remove `read-yaml-file` and update the lock file.

- [ ] Align generated schemas and tracked configuration with shared selection ownership.
  - [ ] Make the generated `pi-preload` section schema use the canonical configuration schema exported by `pi-agents-yaml` while retaining the existing extension-owned schemas for prompts and modes.
  - [ ] Remove tracked `pi-tree` selection configuration and keep one canonical `pi-preload` extends, preset, include, signature, and exclude graph.
  - [ ] Keep `template/AGENTS.yml` on the canonical selection section so generated repositories require no separate tree-selection block.
  - [ ] Regenerate the checked-in schemas and pass the meta repository schema check.

- [ ] Validate and deploy the dependency chain.
  - [ ] Run the shared meta-repository fixture through production loads of `pi-preload` and `pi-tree` and compare `PRELOAD.md` file markers with `TREE.txt` file leaves.
  - [ ] Run typecheck, Biome, existing tests, clean full install, and clean production install in every changed repository, plus provider-free extension-load checks in each changed extension repository.
  - [ ] Confirm every consumer uses the same exact remote `pi-agents-yaml` commit and no consumer uses a local path dependency.
  - [ ] Commit and push the changed consumer repositories in dependency order, then run `pi update` for each changed Pi extension as the final action.
