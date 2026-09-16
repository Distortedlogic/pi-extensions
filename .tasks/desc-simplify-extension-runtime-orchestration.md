# Simplify Extension Runtime Orchestration

## WU-01: Use Native Pi Package Discovery

- [ ] Replace the physical npm, Git, and extension-directory scans in `pi-modes/index.ts` with `SettingsManager.create(ctx.cwd, agentDir)` and `DefaultPackageManager.listConfiguredPackages()`, resolve each defined `installedPath` to its root `AGENTS.yml`, preserve user-before-project source order, include project package sources only for a trusted project, include the extension package’s own `AGENTS.yml` explicitly, and keep the trusted project root `AGENTS.yml` last.

- [ ] Replace the equivalent physical package scan in `pi-prompts/src/index.ts` with the same direct use of `SettingsManager` and `DefaultPackageManager`, retain `PACKAGE_AGENTS_PATH` for direct development loads, skip entries without an installed path or root `AGENTS.yml`, and remove all npm-root, Git-root, extension-root, manifest-glob, path-normalization, and stale-directory discovery code.

- [ ] Remove scanner-only imports from both extensions, including `globSync`, package-manifest `dirname` conversion, and `normalize`, and do not add a shared helper package or another package-discovery abstraction.

- [ ] Move `typebox` from `dependencies` to `peerDependencies` with the Pi-provided version contract in `pi-context-preload`, `pi-modes`, and `pi-prompts`, update each existing lockfile, and leave only extension-owned runtime libraries in `dependencies`.

## WU-02: Simplify Context Configuration Loading

- [ ] Remove the outer `cachedConfiguration` state from `pi-context-preload/index.ts`, load project configuration into a local `session_start` constant, make `collectPreload` require a `Configuration`, and remove its optional-configuration early return.

- [ ] Replace `configurationSourceError`, `readYamlSource`, `validateConfiguration`, and `readConfiguration` with one source-aware preset loader that reads YAML, validates it with `Value.Parse(configurationSchema, value)`, and reports the source path for parse and validation failures.

- [ ] Simplify `loadProjectConfiguration` to read the known `resolve(cwd, "AGENTS.yml")` path directly, treat `ENOENT` as missing configuration, perform the direct `pi-context-preload` lookup inline, and remove the exact-file `globby` search, configuration metadata checks, configuration size checks, `getOwnedConfiguration`, and its one-use object helper.

- [ ] Refactor recursive preset resolution to accept an already-validated `Configuration` instead of a fake root configuration path and optional configuration value, load files only for inherited presets, and retain cycle detection, absolute inherited-pattern validation, merge order, and shared structural validation.

## WU-03: Simplify Context Collection and Rendering

- [ ] Validate each final merged context name once, construct its conventional `facts.ts` and `index.md.njk` paths directly, and remove `isPathInside`, `resolveContextSourcePaths`, duplicate name validation, and the context-file `stat` preflight.

- [ ] Fold `contextSourceError` and the one-use `renderContextSource` function into the context-loading flow while preserving operation-specific import, execution, and render errors, undefined-facts skipping, strict Nunjucks rendering, empty-output rejection, and deterministic context order.

- [ ] Replace the two-pass binary-selection pipeline with one concurrent file read per candidate, run binary detection against the loaded buffer, skip implicit binaries, allow explicitly selected images, reject other explicitly selected binaries, decode text once, and calculate actual total bytes after all reads without a shared mutable concurrent counter.

- [ ] Replace directory-first candidate sorting with one lexical relative-path sort while preserving ignore rules, explicit exclusions, per-file limits, total limits, image blocks, text headings, and context-before-file output order.

- [ ] Remove `PRELOAD.md` generation, including `PRELOAD_FILE`, `serializePreloadBlocks`, the runtime `writeFile` call, image-to-Markdown serialization, generated snapshot exclusions that no longer serve another feature, and all return or test behavior used only by that artifact.

- [ ] Remove duplicate context-preload error reporting by retaining status cleanup in `finally` and allowing one thrown extension error instead of notifying the same failure and rethrowing it.

## WU-04: Simplify Mode Loading and State

- [ ] Replace the side-effecting `loadModes` function with one loader that reads, parses, directly extracts, and validates a `pi-modes` section and returns `Configuration | undefined`, then merge returned entries in the session handler and let invalid configuration propagate through Pi’s extension error path.

- [ ] Remove `isObject`, `sourceError`, `getOwnedConfiguration`, the `optional` parameter, custom `ENOENT` reporting, map mutation from inside the loader, and UI or console error swallowing from `pi-modes/index.ts`.

- [ ] Make the no-suffix `exec` mode an unconditional built-in first mode, append configured modes after it, hide the widget whenever the selected suffix is empty, remove the configured `none: ""` entry, and preserve Shift+Tab cycling, `pi-modes:set`, suffix insertion, and listener cleanup.

## WU-05: Simplify Prompt Loading and Choice State

- [ ] Replace separate `promptSources` and `promptChainMaps` state with one session result that contains validated sources, declared chains, generated prompt paths, and the declared-name-to-generated-command-name mapping.

- [ ] Generate prompt files once after session configuration is loaded and validated, cache only the resulting paths for `resources_discover`, and remove repeated hashing, directory preparation, and writes from each discovery event.

- [ ] Change prompt generation to return an explicit declared-name-to-command-name mapping, use that mapping to resolve chain members, and remove numeric-prefix reverse parsing through `declaredPromptName`.

- [ ] Replace the prompt-choice union helpers with one choice shape containing `kind`, `name`, and `commandNames`, update cycling, widget text, draft handling, and chain arming to use that shape directly, and remove `choiceName` and `firstCommandName` without changing the `input`, `before_agent_start`, and `agent_start` chain lifecycle.

- [ ] Inline the direct top-level `pi-prompts` object check in `parsePromptsYaml`, remove `getOwnedConfiguration` and its one-use object helper, and retain structural validation, duplicate prompt detection, undeclared chain-member detection, source order, and source-scoped errors.

## WU-06: Reduce Context-Preload Test Orchestration

- [ ] Remove the unit-test `cachedConfigurations` map, the aliased collection wrapper, and the tests named `collectPreload uses cached configuration and ignores unrelated top-level keys`, `collectPreload returns undefined when AGENTS.yml is absent`, `collectPreload returns undefined when AGENTS.yml has no owned key`, and `collectPreload does not reread AGENTS.yml after configuration is cached`, because those tests inject configuration and do not exercise project configuration loading.

- [ ] Update remaining collection tests to pass `Configuration` directly, remove `PRELOAD.md` snapshot helpers and assertions, remove the repeated second collection from the generated-and-ignored-files test, and retain direct assertions for selected text blocks, image blocks, exclusions, ordering, and byte limits.

- [ ] Replace the regular-convention-entry-file matrix with one missing-context-source error case, reduce source-scoped context failures to one case for import, invalid export, execution, and render, and keep unsafe-name, unselected-context, undefined-facts, inheritance, schema, binary, image, and size-limit coverage.

- [ ] Consolidate the Dioxus package-selection scenarios into one table-driven test, remove historical baseline-byte comparisons while retaining explicit maximum budgets, and remove the package-manifest and reference-file existence test that does not validate the produced package.

- [ ] Reduce context-preload process-level tests to valid trusted loading, invalid owned configuration, and untrusted project behavior, remove the full temporary Cargo-workspace E2E and redundant missing, malformed, unknown-field, generated-snapshot, and Dioxus integration process starts, and keep direct schema or deterministic unit coverage for removed process cases.

## WU-07: Reduce Prompt Test Orchestration

- [ ] Rewrite the prompt package-source E2E fixture as a Pi-configured local package instead of placing an unconfigured directory under `agentDir/npm/node_modules`, so the test exercises `DefaultPackageManager.listConfiguredPackages()` rather than stale physical-directory discovery.

- [ ] Consolidate invalid prompt bodies, empty chains, non-string chain members, and unknown prompt fields into one table-driven structural-validation test while keeping separate malformed YAML, undeclared chain-member, duplicate-name, valid parsing, and prompt-file generation tests.

- [ ] Remove the stand-alone tests named `selects the first prompt on the first cycle`, `Alt+P changes the editor without sending a message`, `writes exact editor text for empty and non-empty drafts`, `writes the prompt widget for selections and clears it for no prompt`, and `toggles a single prompt through the no-prompt state` because complete cycle and draft-preservation cases already cover those behaviors.

- [ ] Merge the two numbered-prompt no-chain tests into one case, remove the obsolete tests named `does not arm an undeclared numbered-path chain` and `does not infer chains after a failed preflight`, and retain explicit declared-chain ordering, changed-first-command, extension-input, dynamic-catalogue, empty-catalogue, and draft-preservation behavior.

- [ ] Consolidate session-start, input, and shutdown reset assertions into the smallest set that proves state and widget cleanup, then shrink `createHarness` and its helper interfaces to only the public Pi methods and recorded effects used by the retained high-value cases.

- [ ] Remove the separate `loads in Pi` smoke test, reduce the remaining E2E to configured package prompts, trusted and untrusted project prompts, native prompt discovery, and declared chain follow-up order, and remove source-corruption cache checks, exhaustive prompt metadata checks, full-catalogue cycling, and duplicate widget wording assertions.

## WU-08: Remove Remaining Root and Package Bloat

- [ ] Remove the root `package-lock.json` because the private root package has no dependencies, development dependencies, or executable scripts, and confirm that no root schema generator, merged schema, extension dependency, Git SHA dependency, TypeBox dependency, YAML dependency, or schema-check command remains.

- [ ] Remove imports, constants, types, test helpers, and package dependencies made unreachable by the simplifications, use Biome’s existing formatting instead of manual formatting rules, and do not modify READMEs, skills, or unrelated agent-context files.

## WU-09: Verify and Commit Independently

- [ ] Run the existing `pi-context-preload` typecheck, Biome check, unit tests, and E2E tests, then run a clean full install, a clean production-only install, and production imports of `agents.ts` and `index.ts` without provider credentials.

- [ ] Load `pi-modes/agents.ts` and `pi-modes/index.ts` with Node TypeScript support after both clean full and production-only installs, verify direct package and project mode loading manually through the existing public extension behavior, and do not add a permanent test suite without explicit approval.

- [ ] Run the existing `pi-prompts` typecheck, Biome check, unit tests, and E2E tests, then run a clean full install, a clean production-only install, and production imports of `agents.ts` and `src/index.ts` without provider credentials.

- [ ] Verify that configured package `AGENTS.yml` sources follow Pi settings instead of filesystem leftovers, project-owned package and root configuration is excluded when untrusted, direct package keys remain the only accepted configuration shape, unrelated top-level keys remain valid, and no removed scanner, wrapper path, generated preload artifact, or root orchestration reference remains in executable code or retained fixtures.

- [ ] Commit the verified changes separately in `pi-context-preload`, `pi-modes`, `pi-prompts`, and the root repository with minimal accurate messages, stage only files changed for this task, and do not install or push the extensions unless the user separately requests an active installation or remote update.
