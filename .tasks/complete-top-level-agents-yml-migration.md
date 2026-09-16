# Complete the Top-Level AGENTS.yml Migration

## Work Unit 1: Establish the Migration Scope

- [ ] Enumerate every Git repository under `~/pi-extensions`, record its default branch and remote package source, and identify any dirty working tree before edits start so unrelated concurrent work is not changed or committed.

- [ ] Search all tracked `AGENTS.yml` files, YAML fixtures, inline test YAML, templates, skills, READMEs, inventories, examples, and source loaders for `pi`, `extensions`, `pi.extensions`, and nested owned-section access, then produce the exact affected-file list for every repository.

- [ ] Define the hard-cutover contract as direct top-level owned keys such as `pi-context-preload`, `pi-modes`, and `pi-prompts`, with unrelated top-level keys preserved and no compatibility fallback for the obsolete `pi.extensions` wrapper.

- [ ] Confirm the complete repository scope, including `pi-blend`, `pi-context-compress`, `pi-context-preload`, `pi-extensions`, `pi-modes`, `pi-project-env`, `pi-prompts`, `pi-tasks`, `pi-tool-call-nudge`, `pi-tree`, and every additional repository found by the inventory.

## Work Unit 2: Correct the Authoring Template and Shared Guidance

- [ ] Update `template/AGENTS.yml` so generated extensions use direct top-level owned keys and contain no obsolete `pi` or `extensions` wrapper.

- [ ] Update `template/README.md.jinja`, `skills/pi-extension-authoring/SKILL.md`, Copier inputs, and every template example so generated documentation and instructions describe the same top-level configuration contract.

- [ ] Update the root `README.md`, `EXTENSIONS_INVENTORY.md`, and other shared convention documents so they define one authoritative top-level `AGENTS.yml` format and do not document nested extension configuration.

- [ ] Generate or inspect one representative extension from the corrected template and confirm that its files require no manual configuration-format repair.

## Work Unit 3: Migrate Every Extension Repository

- [ ] Replace obsolete wrappers in every affected package-root and project `AGENTS.yml` while preserving unrelated top-level sections, owned values, declaration order, and repository-specific configuration.

- [ ] Update every affected parser, schema adapter, source path, validation message, and configuration editor to read and write the direct top-level owned key without retaining a hidden fallback to `pi.extensions`.

- [ ] Update all package fixtures, project fixtures, temporary test configuration, presets, examples, and sample files to use the direct top-level format.

- [ ] Update every extension skill and reference document that creates or edits `AGENTS.yml`, including the mode, prompt, and context-preload authoring instructions.

- [ ] Audit all installed Distortedlogic extension sources for the same obsolete format and map each installed package back to the source repository that must be corrected and released.

## Work Unit 4: Correct Known Documentation and Runtime Debt

- [ ] Rewrite `pi-modes/README.md` to remove `pi.extensions.pi-modes`, remove manual npm, Git, and extension-directory scan documentation, and describe `SettingsManager`, configured packages, trust handling, skip rules, and source precedence accurately.

- [ ] Audit the `pi-context-preload` and `pi-prompts` READMEs for obsolete owned-section paths, stale package discovery behavior, stale lifecycle behavior, and examples that no longer match their implementations.

- [ ] Reorder the required `Configuration` argument in `collectPreload` before optional directory arguments and update all callers so tests no longer pass `undefined` placeholders for defaulted paths.

- [ ] Isolate the `pi-prompts` lifecycle unit test with a temporary agent directory, deterministic package settings, and a temporary cache so it cannot read user packages or write to the global prompt cache.

- [ ] Migrate the deprecated `pi-prompts/biome.json` recommended-rule setting to the supported Biome preset format without changing unrelated formatting or lint policy.

- [ ] Determine why declared `npm run lint` commands fail through the current command path while direct Biome checks pass, then correct the repository or harness integration so the declared check command is reliable.

- [ ] Trace the moderate `pi-context-preload` npm audit finding to its dependency path and apply only a compatible non-breaking dependency update when one is available.

## Work Unit 5: Align Existing Test Coverage

- [ ] Update existing parser and integration suites to prove direct top-level configuration loading, missing owned-section behavior, malformed source errors, structural validation, and preservation of unrelated top-level keys.

- [ ] Update existing package-source tests to prove user-package, trusted-project-package, and trusted-project-root precedence through Pi settings without manual installation-directory fixtures.

- [ ] Retain deterministic coverage for mode cycling, `pi-modes:set`, suffix insertion, prompt discovery, declared chain order, context source order, binary handling, image snapshots, trust boundaries, and lifecycle cleanup after the configuration migration.

- [ ] Add no new test suite to a repository that has none; update only existing suites unless separate approval permits a new suite.

- [ ] Search the completed test trees for obsolete wrappers, obsolete package scanner assumptions, stale choice shapes, stale generated-path contracts, and tests that pass only because they use real user state.

## Work Unit 6: Validate Every Changed Repository

- [ ] Run each repository's existing typecheck, Biome check, unit tests, and end-to-end tests, and correct every failure caused by the migration without weakening assertions or suppressing diagnostics.

- [ ] Complete a clean full install and a clean production-only install in every changed package while preserving all unrelated dependency versions and lockfile resolution.

- [ ] Import each production entry point with Node TypeScript support in an empty credential environment and confirm that no provider credential is required for extension loading.

- [ ] Run `git diff --check`, confirm that generated files and active secret files are untracked, and verify that every changed working tree contains only intended migration work.

- [ ] Repeat the repository-wide search and require zero obsolete `pi.extensions` configuration examples, zero manual scanner claims where native package settings are used, and zero unreviewed nested wrapper occurrences.

- [ ] Review npm audit output for every changed package, document any unresolved transitive issue, and do not use a forced breaking audit repair.

## Work Unit 7: Commit, Release, and Reinstall

- [ ] Commit each repository independently with a minimal accurate message so configuration, documentation, tests, and dependency changes remain attributable to the correct package.

- [ ] Push every changed default branch to its configured remote and verify that the remote contains the exact validated commit before any installation command runs.

- [ ] Remove and reinstall every changed Pi package through its remote source with `pi remove` and `pi install`, and never install an extension from a local path.

- [ ] Run `pi list` and confirm that each corrected package appears exactly once, each installed path is remote-backed, and no obsolete source entry remains.

- [ ] Reload Pi and verify direct top-level configuration, package precedence, project trust boundaries, modes, prompts, chains, context preload, widgets, suffixes, generated resources, and listener cleanup in the installed runtime.

- [ ] Report the final repository list, commit identifiers, pushed remotes, installation sources, validation results, audit status, and any explicit blocker without claiming completion for unresolved work.
