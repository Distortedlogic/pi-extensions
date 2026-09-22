# Goal

Implement separate, validated `pi-preload` and `pi-tree` AGENTS.yml sections with defaults suited to each extension: preload content remains explicitly selected and token-safe, an explicitly present empty tree section selects the full Git-filtered project tree, and both extensions share only generic YAML, graph, and file-selection utilities without cross-section fallback.

## Work units

- [ ] Define independent section contracts and caller-controlled selection defaults in `pi-agents-yaml`
  - [ ] Keep the strict `PiPreloadConfigurationSchema` fields `contexts`, `excludes`, `extends`, `includes`, `presets`, and `signatures`, and add a strict `PiTreeConfigurationSchema` that permits only `excludes`, `extends`, and `includes`.
  - [ ] Change shared file selection to accept caller-supplied default includes and excludes instead of always applying `DEFAULT_PRELOAD_EXCLUDES`.
  - [ ] Remove the hard-coded `pi-preload` branch from generic graph resolution while preserving stable ordering, canonical cycle detection, repository-relative extends, and cancellation.
  - [ ] Define section absence as disabled, prohibit fallback to another section, and report an explicit error when an extends target lacks the requested section.

- [ ] Lock the shared behavior with focused `pi-agents-yaml` tests
  - [ ] Add fixtures containing different `pi-preload` and `pi-tree` values and prove that each requested section resolves without reading the other.
  - [ ] Cover empty-section defaults, explicit include replacement, exclude precedence, repository-local `.gitignore`, ignored extended repositories, stable deduplication, symbolic-link rejection, and extends cycles.
  - [ ] Verify that preload and tree callers can supply different default include and exclude sets through the same public selector.

- [ ] Apply token-safe defaults only to `pi-preload`
  - [ ] Keep default includes, signatures, contexts, presets, and extends empty so an empty `pi-preload` section injects no content.
  - [ ] Extend preload defaults to exclude `.git`, `AGENTS.yml`, `.tasks/**`, `PRELOAD.md`, `TREE.txt`, and the existing dependency lock-file patterns.
  - [ ] Keep `pi-extension` and `dioxus-rust` opt-in and preserve per-node preset expansion, context rendering, signature folding, binary handling, content ordering, and byte limits.
  - [ ] Update existing `pi-preload` tests to prove the new defaults without widening any configured project selection.

- [ ] Make `pi-tree` consume only `pi-tree` with path-oriented defaults
  - [ ] Update `pi-tree/src/selection.ts` to request `pi-tree` with `PiTreeConfigurationSchema` and never inspect `pi-preload`.
  - [ ] Use `**/*` only when a present `pi-tree` section omits `includes`, and make an explicit `includes` list replace that default.
  - [ ] Default tree excludes to `.git`, `AGENTS.yml`, `.tasks/**`, `.pi/readcache/**`, `.pi/tmp/**`, `PRELOAD.md`, and `TREE.txt` without excluding lock files, tests, manifests, or tracked configuration names.
  - [ ] Preserve repository-local `.gitignore`, safe path projection, deterministic ordering, the single 16 KiB tree allocation, temporary cleanup, and one hidden tree message per session.
  - [ ] Update existing `pi-tree` tests to cover absent, empty, narrowed, excluded, and extended `pi-tree` sections and to prove that preload-only fields are rejected.

- [ ] Migrate current AGENTS.yml files to explicit tree configuration
  - [ ] Add `pi-tree: {}` to extension and application repositories that should expose their complete tracked structure, and retain scoped `pi-tree.includes` where the current tree is intentionally narrow.
  - [ ] Add the missing `pi-tree` section to `self-system/self-hosting/AGENTS.yml` and keep the root `self-system` tree extends explicit for both child roots.
  - [ ] Give the `pi-extensions` meta repository explicit local tree includes plus the same child repository extends, while each child extension resolves its own tree section.
  - [ ] Remove repeated preload `.tasks` exclusions after the preload default supplies them, without changing project-specific exclusions such as `operations/snapshots`.
  - [ ] Update `template/AGENTS.yml`, checked AGENTS.yml schemas, and the existing authoring skill to describe both independent sections and their different empty-section behavior.

- [ ] Validate and release the coordinated package changes
  - [ ] Run typecheck, Biome, and all existing tests in `pi-agents-yaml`, `pi-preload`, and `pi-tree`.
  - [ ] Run clean development installs, clean production installs, package dry runs, and credential-free production extension-load checks for both extensions.
  - [ ] Verify fresh trusted sessions in the meta repository and `self-system` produce scoped preload content and complete bounded trees with no generated, task, cache, or secret paths.
  - [ ] Push `pi-agents-yaml` first, update dependent locks to its reviewed revision, then commit and push `pi-preload`, `pi-tree`, and configuration repositories without unrelated changes.
  - [ ] Run `pi update --extensions` and confirm the installed extensions load the pushed revisions.
