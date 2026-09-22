# Goal

Implement separately validated `pi-preload` and `pi-tree` AGENTS.yml configuration with extension-specific defaults and no cross-section fallback: missing or empty preload configuration selects no content, missing or empty tree configuration selects the full Git-filtered project tree, `AGENTS.yml` stays outside both generated contexts to prevent configuration feedback, extended repositories receive safe stable tree prefixes, and both extensions preserve their existing bounded output behavior through shared generic YAML, graph, and file-selection utilities.

## Work units

- [ ] Define independent section contracts and exact default semantics in `pi-agents-yaml`
  - [ ] Keep `PiPreloadConfigurationSchema` strict with `contexts`, `excludes`, `extends`, `includes`, `presets`, and `signatures`, and add a strict `PiTreeConfigurationSchema` with only `excludes`, `extends`, and `includes`.
  - [ ] Define a missing section as that extension's default configuration: missing or empty `pi-preload` selects no content, missing or empty `pi-tree` uses `includes: ["**/*"]`, `pi-tree.includes: []` selects no paths, and any explicit tree includes replace the default glob.
  - [ ] Change shared file selection to accept caller-supplied default includes and excludes, merge configured excludes after defaults, and keep excludes authoritative over all selected paths.
  - [ ] Add a caller-supplied per-node section resolver to generic graph resolution so `pi-preload` can expand presets before resolving each node's extends while `pi-tree` uses the parsed tree value unchanged.
  - [ ] Apply the requested extension's defaults when an explicit extends target lacks that section, while prohibiting fallback to the other extension's section.

- [ ] Lock generic graph and selection behavior with focused `pi-agents-yaml` tests
  - [ ] Add fixtures with different `pi-preload` and `pi-tree` sections and prove that each resolver reads only its requested section.
  - [ ] Cover missing, empty, explicit-empty, explicit-include, and excluded selections for both caller-provided default sets.
  - [ ] Verify per-node preload preset expansion, repository-relative extends, repository-local `.gitignore`, parent-ignored child repositories, exclude precedence, stable ordering, duplicate suppression, symbolic-link rejection, cancellation, and cycle errors.
  - [ ] Verify that an explicit extends target without the requested section uses the requested extension's defaults without disappearing or falling back to the other section.

- [ ] Apply token-safe defaults and per-node presets only to `pi-preload`
  - [ ] Keep default includes, signatures, contexts, presets, and extends empty so preload never discovers content implicitly.
  - [ ] Set preload defaults to exclude `.git`, `AGENTS.yml`, `.tasks/**`, `PRELOAD.md`, `TREE.txt`, and the existing dependency lock-file patterns, keeping agent configuration outside model-selected preload content.
  - [ ] Pass the preload preset resolver into generic graph resolution so `pi-extension` and `dioxus-rust` remain opt-in and expand independently in every configured root.
  - [ ] Preserve context rendering, signature folding, repository mapping, binary handling, content ordering, file and total byte limits, `PRELOAD.md` output, and one hidden preload message per session.
  - [ ] Update existing `pi-preload` tests to prove the defaults and per-node preset behavior without widening any configured project selection.

- [ ] Make `pi-tree` consume only `pi-tree` and produce one safe combined tree
  - [ ] Update `pi-tree/src/selection.ts` to request `pi-tree` with `PiTreeConfigurationSchema`, tree-specific defaults, and no preset resolver.
  - [ ] Set tree defaults to include `**/*` and exclude `.git`, `AGENTS.yml`, `.tasks/**`, `.pi/readcache/**`, `.pi/tmp/**`, `PRELOAD.md`, and `TREE.txt`, keeping agent configuration outside the generated tree while retaining other lock files, tests, manifests, and tracked configuration names.
  - [ ] Keep session-root paths relative to the session root, map extended roots inside it to their canonical root-relative prefixes, and map external or sibling roots to stable `external/<directory-name>` prefixes with collision errors.
  - [ ] Reject every virtual path containing `..`, merge duplicate virtual paths, and sort the complete path set before rendering.
  - [ ] Preserve the trusted-project gate, one global 16 KiB depth-bounded `tree --fromfile` render, deadline, temporary cleanup, only `<cwd>/TREE.txt` output, and one hidden tree message per session.
  - [ ] Update existing `pi-tree` tests for absent, empty, explicit-empty, narrowed, excluded, parent-ignored extended, external-prefix, prefix-collision, duplicate-path, ordering, symlink, cycle, and global-limit behavior.

- [ ] Migrate current AGENTS.yml files that need nondefault tree behavior without widening large projects
  - [ ] Leave the small TypeScript extension repositories without `pi-tree` sections so they use the missing-section default for complete Git-filtered trees.
  - [ ] Add scoped `pi-tree` sections to `pi-blend`, `analytical-theism`, `knowledge-rag`, and the Gabb project by copying their current preload includes instead of selecting all assets, corpora, artifacts, or research paths.
  - [ ] Keep the scoped `self-system/self-ai` tree section, add a scoped tree section to `self-system/self-hosting` from its current preload selection, and give the `self-system` root explicit local includes plus tree extends for both children.
  - [ ] Give the `pi-extensions` root tree section its current child extends and explicit local includes for package metadata, Copier resources, the template, prompts, skills, and the tracked task plans.
  - [ ] Remove repeated preload `.tasks` exclusions only after the preload default is active, while retaining project-specific exclusions such as `operations/snapshots` in the corresponding section.

- [ ] Update generated configuration resources and the extension template
  - [ ] Keep explicit preload globs in `template/AGENTS.yml` and omit `pi-tree` so generated projects exercise the missing-section default for complete Git-filtered trees.
  - [ ] Update the checked AGENTS.yml schemas to reject preload-only fields under `pi-tree` and represent missing, empty, and explicit section forms.
  - [ ] Update the existing AGENTS.yml authoring skill with missing-section defaults, include replacement, exclude precedence, local Git-ignore behavior, the `AGENTS.yml` feedback boundary, and the external tree-prefix rule.
  - [ ] Add existing-suite validation that generated project configuration may omit `pi-tree` and still resolves the public tree defaults.

- [ ] Validate, publish, and activate the merged implementation
  - [ ] Run typecheck, Biome, and all existing tests in `pi-agents-yaml`, `pi-preload`, and `pi-tree`.
  - [ ] Run clean full installs, clean production installs, package dry runs, and credential-free production extension-load checks for both extensions.
  - [ ] Verify fresh trusted sessions in `pi-extensions`, `self-system`, and one large application produce the configured preload content and one bounded tree without Git-ignored, default-excluded, or configured-excluded paths.
  - [ ] Push `pi-agents-yaml` first, update dependent locks to its reviewed revision, then commit and push `pi-preload`, `pi-tree`, and each configuration repository without unrelated changes.
  - [ ] Run `pi update --extensions` and confirm the installed `pi-preload` and `pi-tree` load the pushed revisions.
