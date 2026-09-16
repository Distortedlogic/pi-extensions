# Simplify Extension Runtime Orchestration

## WU-01: Replace Package Directory Scans

- [ ] In `pi-modes/index.ts`, replace manual npm, Git, and extension-directory scanning with `SettingsManager.create(ctx.cwd, agentDir)` and `DefaultPackageManager.listConfiguredPackages()`, load the extension’s own `AGENTS.yml` first, then installed user package `AGENTS.yml` files, installed trusted-project package `AGENTS.yml` files, and the trusted project root `AGENTS.yml`, and skip entries without an installed path or root `AGENTS.yml`.

- [ ] In `pi-prompts/src/index.ts`, replace the equivalent directory and `package.json` scan with the same `SettingsManager` and `DefaultPackageManager` flow, retain `PACKAGE_AGENTS_PATH` for direct extension loads, and preserve user-package, project-package, and project-root source precedence.

- [ ] Remove scanner-only imports and code from both extensions, including `globSync`, package-root arrays, manifest-path conversion, recursive package searches, `dirname` used only for manifest conversion, and `normalize`.

- [ ] Rewrite the prompt package-source E2E fixture to configure its local fixture package through Pi settings instead of placing an unconfigured directory under `agentDir/npm/node_modules`.

## WU-02: Correct Runtime Dependencies

- [ ] Move `typebox` from `dependencies` to `peerDependencies` in `pi-context-preload`, `pi-modes`, and `pi-prompts`, use the Pi-provided peer contract, and update each existing lockfile without changing other dependency versions.

## WU-03: Simplify Context Configuration Loading

- [ ] Remove the outer `cachedConfiguration` variable from `pi-context-preload/index.ts`, keep the loaded configuration local to `session_start`, make `collectPreload` require `Configuration`, and remove its optional-configuration early return.

- [ ] Replace `configurationSourceError`, `readYamlSource`, `validateConfiguration`, and `readConfiguration` with one source-aware YAML loader that validates with `Value.Parse(configurationSchema, value)` and preserves source-scoped parse and validation errors.

- [ ] Change `loadProjectConfiguration` to use the exact `resolve(cwd, "AGENTS.yml")` path, perform the direct `pi-context-preload` lookup inline, preserve missing-file and configured size-limit behavior, and remove the exact-file `globby` search, `getOwnedConfiguration`, and its one-use object helper.

- [ ] Refactor preset resolution to accept an already-validated root `Configuration`, load files only for inherited presets, and preserve cycle detection, inherited absolute-pattern validation, source order, and schema validation.

## WU-04: Simplify Context Collection

- [ ] Validate each merged context name once, construct its `facts.ts` and `index.md.njk` paths directly, and remove `isPathInside`, `resolveContextSourcePaths`, duplicate context-name validation, and the separate context-file stat preflight while preserving source-scoped failures.

- [ ] Fold `contextSourceError` and the one-use `renderContextSource` function into the context-loading flow while preserving import, execution, render, undefined-facts, strict-template, empty-output, and context-order behavior.

- [ ] Replace the two-pass binary pipeline with one file read per candidate, run binary detection against the loaded buffer, preserve implicit-binary skipping and explicit image handling, and compute actual selected bytes after concurrent reads without a shared mutable byte counter.

- [ ] Report a context-preload startup failure once through Pi’s extension error path while retaining status cleanup in `finally`.

## WU-05: Simplify Mode Loading

- [ ] Replace the side-effecting `loadModes` function with one loader that reads, parses, directly extracts, and validates `pi-modes` configuration and returns `Configuration | undefined`, then merge returned entries in the session handler.

- [ ] Remove `isObject`, `sourceError`, `getOwnedConfiguration`, the loader’s `optional` argument, map mutation inside the loader, and UI or console error swallowing while preserving source order, mode cycling, `pi-modes:set`, suffix insertion, and listener cleanup.

## WU-06: Simplify Prompt Loading and Choice State

- [ ] Replace separate `promptSources` and `promptChainMaps` state with one session result containing validated sources, chains, generated prompt paths, and declared-name-to-command-name mappings.

- [ ] Generate prompt files once after session configuration is loaded, cache the generated paths for `resources_discover`, and remove repeated prompt-file generation from each discovery event.

- [ ] Return an explicit declared-name-to-command-name mapping from prompt generation, use it for chain members, and remove numeric-prefix reverse parsing through `declaredPromptName`.

- [ ] Replace the prompt-choice helper model with one shape containing `kind`, `name`, and `commandNames`, update prompt cycling and chain arming to use it, and remove `choiceName` and `firstCommandName` without changing the `input`, `before_agent_start`, and `agent_start` lifecycle.

- [ ] Inline the direct `pi-prompts` object lookup in `parsePromptsYaml`, remove `getOwnedConfiguration` and its one-use object helper, and preserve structural validation, duplicate-name detection, undeclared chain-member detection, and source-scoped errors.

## WU-07: Remove Low-Value Context Tests

- [ ] Remove the unit-test `cachedConfigurations` map, the aliased collection wrapper, and the four tests that claim to cover cached configuration, missing `AGENTS.yml`, a missing owned key, and no reread after caching even though they inject configuration instead of exercising project loading.

- [ ] Pass `Configuration` directly to the remaining collection unit tests, remove the repeated second collection from the generated-and-ignored-files case, and retain direct coverage of selected blocks, exclusions, inheritance, context order, schema failures, binary handling, images, unsafe names, and byte limits.

- [ ] Replace the regular-context-entry-file matrix with one missing-source case, reduce source-scoped context failures to one import, invalid-export, execution, and render case, and remove historical Dioxus baseline comparisons while retaining explicit byte budgets.

- [ ] Remove the package-manifest and reference-file existence test and the full temporary Cargo-workspace E2E, consolidate Dioxus metadata scenarios into a table-driven unit test, and retain deterministic metadata and template behavior coverage.

- [ ] Keep process-level context tests for valid trusted loading, invalid owned configuration, and untrusted project behavior, and remove separate process cases already covered by direct schema or unit tests.

## WU-08: Remove Low-Value Prompt Tests

- [ ] Consolidate invalid prompt bodies, empty chains, non-string chain members, and unknown prompt fields into one table-driven validation test while retaining separate malformed YAML, undeclared chain-member, duplicate-name, valid parsing, and prompt-generation tests.

- [ ] Remove the stand-alone tests for first selection, no-message shortcut behavior, empty and non-empty editor writes, widget writes, and single-prompt toggling because retained cycle and draft-preservation cases cover those results.

- [ ] Merge the numbered-prompt no-chain cases, remove the obsolete undeclared-numbered-chain and failed-preflight regression cases, and retain declared-chain ordering, changed-command, extension-input, dynamic-catalogue, empty-catalogue, and draft-preservation coverage.

- [ ] Consolidate lifecycle reset assertions and reduce `createHarness` and its helper types to the Pi methods and recorded effects used by the retained tests.

- [ ] Remove the separate Pi load smoke test and reduce the remaining prompt E2E to configured package prompts, trusted and untrusted project prompts, native prompt discovery, and declared chain follow-up order.

## WU-09: Remove Root Package Residue

- [ ] Remove the root `package-lock.json`, which has no dependency graph after removal of the root schema implementation.

- [ ] Remove imports, constants, types, test helpers, and package dependencies made unreachable by the preceding changes.

## WU-10: Verify the Implementations

- [ ] Run the existing `pi-context-preload` typecheck, Biome check, unit tests, and E2E tests, then complete a clean full install, clean production-only install, and production imports of `agents.ts` and `index.ts` without provider credentials.

- [ ] Complete clean full and production-only installs for `pi-modes`, then load `agents.ts` and `index.ts` with Node TypeScript support without provider credentials.

- [ ] Run the existing `pi-prompts` typecheck, Biome check, unit tests, and E2E tests, then complete a clean full install, clean production-only install, and production imports of `agents.ts` and `src/index.ts` without provider credentials.
