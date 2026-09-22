# Goal

Make `pi-agents-yaml` the authoritative AGENTS.yml configuration system so extensions consume complete, typed, defaulted, and recursively resolved section values instead of implementing configuration behavior themselves.

## Work units

- [x] Make `pi-agents-yaml` own the complete public contracts for both sections
  - [x] Keep `PiPreloadConfigurationSchema` strict with `contexts`, `excludes`, `extends`, `includes`, `presets`, and `signatures`, and add a strict `PiTreeConfigurationSchema` with only `excludes`, `extends`, and `includes`.
  - [x] Encode complete section defaults in `pi-agents-yaml`: missing or empty `pi-preload` selects no content, missing or empty `pi-tree` uses `includes: ["**/*"]`, `pi-tree.includes: []` selects no paths, and explicit tree includes replace the default glob.
  - [x] Set package-owned preload excludes to `.git`, `.git/**`, `**/AGENTS.yml`, `**/.tasks`, `**/.tasks/**`, `PRELOAD.md`, `TREE.txt`, and the existing dependency lock-file patterns.
  - [x] Set package-owned tree excludes to `.git`, `.git/**`, `**/AGENTS.yml`, `**/.tasks`, `**/.tasks/**`, `**/.pi/readcache/**`, `**/.pi/tmp/**`, `PRELOAD.md`, and `TREE.txt` while retaining other lock files, tests, manifests, and tracked configuration names.
  - [x] Move the `pi-extension` and `dioxus-rust` preset definitions into the `pi-agents-yaml` package so its preload resolver owns preset loading and validation.

- [x] Provide resolved section APIs instead of consumer-side configuration orchestration
  - [x] Add public `resolvePiPreloadGraph` and `resolvePiTreeGraph` functions that load their named sections, apply package-owned defaults for missing sections and fields, and return typed resolved graph nodes.
  - [x] Keep shared canonical path resolution, ordering, cycle detection, cancellation, and repository-relative extends inside the existing generic graph implementation.
  - [x] Make `resolvePiPreloadGraph` expand and validate presets on every node before following that node's extends, and make `resolvePiTreeGraph` reject preload-only fields without reading preload configuration.
  - [x] Apply the requested section's defaults when an explicit extends target lacks that section, with no fallback to another section.
  - [x] Make shared file selection consume the already-defaulted graph values, merge configured excludes after package defaults, and keep excludes authoritative over all selected paths.

- [x] Lock package-owned defaults and resolved APIs with focused `pi-agents-yaml` tests
  - [x] Add fixtures with different `pi-preload` and `pi-tree` sections and prove that each public resolver reads only its owned section.
  - [x] Cover missing sections, empty sections, omitted fields, explicit empty includes, explicit includes, package defaults, and configured excludes for both resolvers.
  - [x] Verify package-owned per-node preload preset expansion, repository-relative extends, repository-local `.gitignore`, parent-ignored child repositories, exclude precedence, stable ordering, duplicate suppression, symbolic-link rejection, cancellation, and cycle errors.
  - [x] Verify that an explicit extends target without the requested section receives that section's package defaults without disappearing or falling back to another section.
  - [x] Verify that root and nested AGENTS.yml files and `.tasks` directories cannot enter either resolved selection.

- [ ] Reduce `pi-preload` to a resolved-configuration consumer
  - [x] Replace direct section loading, schema selection, preset-directory ownership, and graph assembly in `pi-preload/src/index.ts` with `resolvePiPreloadGraph` from `pi-agents-yaml`.
  - [x] Consume the resolved preload nodes for context rendering and file selection without applying additional configuration defaults in `pi-preload`.
  - [x] Preserve signature folding, repository mapping, binary handling, content ordering, file and total byte limits, `PRELOAD.md` output, and one hidden preload message per session.
  - [ ] Update existing `pi-preload` tests to prove identical configured output and package-owned missing-section behavior.
  - [ ] Remove migrated preset files and unused configuration imports from `pi-preload`, and include the preset files in the published `pi-agents-yaml` package.

- [ ] Reduce `pi-tree` to a resolved-configuration consumer and produce one safe combined tree
  - [ ] Replace direct schema and graph assembly in `pi-tree/src/selection.ts` with `resolvePiTreeGraph` from `pi-agents-yaml`.
  - [ ] Consume package-defaulted tree nodes without applying additional includes, excludes, or cross-section fallback in `pi-tree`.
  - [ ] Keep session-root paths relative to the session root, map extended roots inside it to their canonical root-relative prefixes, and map external or sibling roots to stable `external/<directory-name>` prefixes with collision errors.
  - [ ] Reject every virtual path containing `..`, merge duplicate virtual paths, and sort the complete path set before rendering.
  - [ ] Preserve the trusted-project gate, one global 16 KiB depth-bounded `tree --fromfile` render, deadline, temporary cleanup, only `<cwd>/TREE.txt` output, and one hidden tree message per session.
  - [ ] Update existing `pi-tree` tests for package-defaulted absent, empty, explicit-empty, narrowed, excluded, parent-ignored extended, external-prefix, prefix-collision, duplicate-path, ordering, symlink, cycle, and global-limit behavior.

- [ ] Migrate current AGENTS.yml files that need nondefault tree behavior without widening large projects
  - [ ] Leave the small TypeScript extension repositories without `pi-tree` sections so they use the missing-section default for complete Git-filtered trees.
  - [ ] Add scoped `pi-tree` sections to `pi-blend`, `analytical-theism`, `knowledge-rag`, and the Gabb project by copying their current preload includes instead of selecting all assets, corpora, artifacts, or research paths.
  - [ ] Keep the scoped `self-system/self-ai` tree section, add a scoped tree section to `self-system/self-hosting` from its current preload selection, and give the `self-system` root explicit local includes plus tree extends for both children.
  - [ ] Give the `pi-extensions` root tree section its current child extends and explicit local includes for package metadata, Copier resources, the template, prompts, and skills while leaving all task plans excluded.
  - [ ] Remove repeated preload `.tasks` exclusions only after the preload default is active, while retaining project-specific exclusions such as `operations/snapshots` in the corresponding section.

- [ ] Update generated configuration resources and the extension template
  - [ ] Keep explicit preload globs in `template/AGENTS.yml` and omit `pi-tree` so generated projects exercise the missing-section default for complete Git-filtered trees.
  - [ ] Generate the checked AGENTS.yml schemas from the authoritative `pi-agents-yaml` section schemas so they reject preload-only fields under `pi-tree` and represent missing, empty, and explicit section forms.
  - [ ] Update the existing AGENTS.yml authoring skill to describe the package-owned defaults, include replacement, exclude precedence, local Git-ignore behavior, the AGENTS.yml feedback boundary, the `.tasks` future-work boundary, and the external tree-prefix rule.
  - [ ] Add existing-suite validation that generated project configuration may omit `pi-tree` and still resolves the public tree defaults.

- [ ] Validate, publish, and activate the merged implementation
  - [ ] Run typecheck, Biome, and all existing tests in `pi-agents-yaml`, `pi-preload`, and `pi-tree`.
  - [ ] Run clean full installs, clean production installs, package dry runs, and credential-free production extension-load checks for both extensions.
  - [ ] Verify fresh trusted sessions in `pi-extensions`, `self-system`, and one large application produce the configured preload content and one bounded tree without Git-ignored, default-excluded, or configured-excluded paths.
  - [ ] Push `pi-agents-yaml` first, update dependent locks to its reviewed revision, then commit and push `pi-preload`, `pi-tree`, and each configuration repository without unrelated changes.
  - [ ] Run `pi update --extensions` and confirm the installed `pi-preload` and `pi-tree` load the pushed revisions.
