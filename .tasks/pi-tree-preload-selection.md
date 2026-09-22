# Goal

Refactor AGENTS.yml file selection so `pi-preload` and `pi-tree` keep separate public configuration sections while both use the same generic defaults, preset infrastructure, graph resolution, and file-selection behavior from `pi-agents-yaml`, with no implicit cross-section fallback and no change to either extension's output responsibilities.

## Work units

- [ ] Generalize the shared selection contracts in `pi-agents-yaml`
  - [ ] Add a strict generic file-selection schema for `excludes`, `extends`, `includes`, `presets`, and `signatures`, then compose separate strict `pi-preload` and `pi-tree` schemas so preload-only fields such as `contexts` cannot enter tree configuration.
  - [ ] Replace preload-named preset helpers with schema-driven preset resolution that accepts the selected section and its allowed preset sources instead of checking for `sectionName === "pi-preload"`.
  - [ ] Keep common exclude rules and selection-only presets in `pi-agents-yaml`, while allowing an extension to add section-specific presets without duplicating the common catalog.
  - [ ] Export the generic schemas, preset resolution, graph resolution, and file-selection APIs through `pi-agents-yaml/src/index.ts`.

- [ ] Prove the shared resolver behavior in `pi-agents-yaml`
  - [ ] Update `pi-agents-yaml/test/agents.test.ts` to cover independent `pi-preload` and `pi-tree` sections with different includes, excludes, presets, signatures, and extends graphs.
  - [ ] Verify that each resolver reads only its requested section and that a missing section does not fall back to the other extension's section.
  - [ ] Verify that common defaults and selection-only presets produce the same behavior for both sections, including stable ordering, deduplication, full-mode precedence, ignore handling, symlink handling, and cycle rejection.

- [ ] Migrate `pi-preload` to the generic shared pipeline
  - [ ] Update `pi-preload/src/index.ts` to resolve only `pi-preload` through the generic schema and shared preset catalog, while retaining preload-specific context presets and context rendering.
  - [ ] Keep content loading, signature folding, media handling, byte limits, and `PRELOAD.md` generation inside `pi-preload` rather than moving output behavior into the shared package.
  - [ ] Update existing `pi-preload` tests and package contents so shared presets and preload-specific presets resolve in development and from the packed package.

- [ ] Make `pi-tree` resolve its own configuration section
  - [ ] Update `pi-tree/src/selection.ts` to load `pi-tree` with the strict tree schema and the same common defaults and selection-only presets used by `pi-preload`.
  - [ ] Keep path-to-directory projection, tree rendering, output limits, and `TREE.txt` generation inside `pi-tree`.
  - [ ] Update `pi-tree/test/unit.test.ts` and `pi-tree/test/e2e.test.ts` to prove independent tree selection, shared preset behavior, recursive tree extends, ignored `pi-preload` values, and no fallback when `pi-tree` is absent.

- [ ] Migrate repository configuration to the separate public sections
  - [ ] Change `pi-tree/AGENTS.yml` and relevant template or meta-repository configuration from tree selection under `pi-preload` to explicit `pi-tree` configuration.
  - [ ] Preserve independent `pi-preload` and `pi-tree` entries in project configurations such as `self-system/AGENTS.yml`, and remove duplicated values only when the shared defaults or shared presets now supply them.
  - [ ] Update the checked AGENTS.yml JSON schemas and the `agents-yml-authoring` skill so both section contracts and their common preset behavior are explicit and validated.

- [ ] Validate and release the coordinated package changes
  - [ ] Run typecheck, Biome, and the existing tests in `pi-agents-yaml`, `pi-preload`, and `pi-tree`, including focused tests that compare common defaults while confirming section isolation.
  - [ ] Run clean development installs, clean production installs, package dry runs, and offline Pi extension-load checks for both extensions.
  - [ ] Push `pi-agents-yaml` first, update the dependent lock files to that reviewed revision, then commit and push `pi-preload` and `pi-tree` with minimal accurate messages.
  - [ ] Run `pi update --extensions` and confirm that the installed `pi-preload` and `pi-tree` packages load the pushed revisions.
