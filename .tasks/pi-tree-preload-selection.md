# Goal

Implement separate, validated `pi-preload` and `pi-tree` AGENTS.yml sections with extension-specific defaults and no cross-section fallback: preload content remains explicitly selected and token-safe, a present empty tree section selects the full Git-filtered project tree, extended repositories receive safe stable tree prefixes, and both extensions preserve their existing bounded output behavior through shared generic YAML, graph, and file-selection utilities.

## Work units

- [ ] Define independent section contracts and exact default semantics in `pi-agents-yaml`
  - [ ] Keep `PiPreloadConfigurationSchema` strict with `contexts`, `excludes`, `extends`, `includes`, `presets`, and `signatures`, and add a strict `PiTreeConfigurationSchema` with only `excludes`, `extends`, and `includes`.
  - [ ] Define a missing section as disabled, `pi-preload: {}` as no selected content, `pi-tree: {}` as `includes: ["**/*"]`, `pi-tree.includes: []` as no selected paths, and any explicit tree includes as a replacement for the default glob.
  - [ ] Change shared file selection to accept caller-supplied default includes and excludes, merge configured excludes after defaults, and keep excludes authoritative over all selected paths.
  - [ ] Add a caller-supplied per-node section resolver to generic graph resolution so `pi-preload` can expand presets before resolving each node's extends while `pi-tree` uses the parsed tree value unchanged.
  - [ ] Require every explicit extends target to contain the requested section and report its declaring AGENTS.yml path when that section is absent.

- [ ] Lock generic graph and selection behavior with focused `pi-agents-yaml` tests
  - [ ] Add fixtures with different `pi-preload` and `pi-tree` sections and prove that each resolver reads only its requested section.
  - [ ] Cover missing, empty, explicit-empty, explicit-include, and excluded selections for both caller-provided default sets.
  - [ ] Verify per-node preload preset expansion, repository-relative extends, repository-local `.gitignore`, parent-ignored child repositories, exclude precedence, stable ordering, duplicate suppression, symbolic-link rejection, cancellation, and cycle errors.
  - [ ] Verify that an explicit extends target without the requested section fails instead of silently disappearing or falling back to the other section.

- [ ] Apply token-safe defaults and per-node presets only to `pi-preload`
  - [ ] Keep default includes, signatures, contexts, presets, and extends empty so preload never discovers content implicitly.
  - [ ] Set preload defaults to exclude `.git`, `AGENTS.yml`, `.tasks/**`, `PRELOAD.md`, `TREE.txt`, and the existing dependency lock-file patterns.
  - [ ] Pass the preload preset resolver into generic graph resolution so `pi-extension` and `dioxus-rust` remain opt-in and expand independently in every configured root.
  - [ ] Preserve context rendering, signature folding, repository mapping, binary handling, content ordering, file and total byte limits, `PRELOAD.md` output, and one hidden preload message per session.
  - [ ] Update existing `pi-preload` tests to prove the defaults and per-node preset behavior without widening any configured project selection.

- [ ] Make `pi-tree` consume only `pi-tree` and produce one safe combined tree
  - [ ] Update `pi-tree/src/selection.ts` to request `pi-tree` with `PiTreeConfigurationSchema`, tree-specific defaults, and no preset resolver.
  - [ ] Set tree defaults to include `**/*` and exclude `.git`, `AGENTS.yml`, `.tasks/**`, `.pi/readcache/**`, `.pi/tmp/**`, `PRELOAD.md`, and `TREE.txt` while retaining lock files, tests, manifests, and tracked configuration names.
  - [ ] Keep session-root paths relative to the session root, map extended roots inside it to their canonical root-relative prefixes, and map external or sibling roots to stable `external/<directory-name>` prefixes with collision errors.
  - [ ] Reject every virtual path containing `..`, merge duplicate virtual paths, and sort the complete path set before rendering.
  - [ ] Preserve the trusted-project gate, one global 16 KiB depth-bounded `tree --fromfile` render, deadline, temporary cleanup, only `<cwd>/TREE.txt` output, and one hidden tree message per session.
  - [ ] Update existing `pi-tree` tests for absent, empty, explicit-empty, narrowed, excluded, parent-ignored extended, external-prefix, prefix-collision, duplicate-path, ordering, symlink, cycle, and global-limit behavior.

- [ ] Migrate every current AGENTS.yml to explicit tree configuration without widening large projects
  - [ ] Add `pi-tree: {}` to the small TypeScript extension repositories `pi-agents-yaml`, `pi-compress`, `pi-cron`, `pi-env`, `pi-modes`, `pi-preload`, `pi-prompts`, `pi-steering`, `pi-sync`, `pi-tasks`, and `pi-tree`.
  - [ ] Keep `pi-blend`, `analytical-theism`, `knowledge-rag`, and the Gabb project scoped by copying their current preload includes into independent tree includes instead of selecting all assets, corpora, artifacts, or research paths.
  - [ ] Keep the scoped `self-system/self-ai` tree section, add a scoped tree section to `self-system/self-hosting` from its current preload selection, and give the `self-system` root explicit local includes plus tree extends for both children.
  - [ ] Give the `pi-extensions` root tree section its current child extends and explicit local includes for package metadata, Copier resources, the template, prompts, skills, and the tracked task plans.
  - [ ] Remove repeated preload `.tasks` exclusions only after the preload default is active, while retaining project-specific exclusions such as `operations/snapshots` in the corresponding section.

- [ ] Update generated configuration resources and the extension template
  - [ ] Add independent top-level `pi-preload` and `pi-tree` sections to `template/AGENTS.yml`, with explicit preload globs and an empty tree section for complete tracked structure.
  - [ ] Update the checked AGENTS.yml schemas to reject preload-only fields under `pi-tree` and represent both sections' empty and explicit forms.
  - [ ] Update the existing AGENTS.yml authoring skill with the separate defaults, extends requirements, include replacement rule, exclude precedence, local Git-ignore behavior, and external tree-prefix rule.
  - [ ] Add existing-suite validation that generated project configuration contains both direct sections and parses through their public schemas.

- [ ] Validate, publish, and activate the merged implementation
  - [ ] Run typecheck, Biome, and all existing tests in `pi-agents-yaml`, `pi-preload`, and `pi-tree`.
  - [ ] Run clean full installs, clean production installs, package dry runs, and credential-free production extension-load checks for both extensions.
  - [ ] Verify fresh trusted sessions in `pi-extensions`, `self-system`, and one large application produce the configured preload content and one bounded tree without Git-ignored, default-excluded, or configured-excluded paths.
  - [ ] Push `pi-agents-yaml` first, update dependent locks to its reviewed revision, then commit and push `pi-preload`, `pi-tree`, and each configuration repository without unrelated changes.
  - [ ] Run `pi update --extensions` and confirm the installed `pi-preload` and `pi-tree` load the pushed revisions.
