# Complete the Top-Level AGENTS.yml Migration

## Work Unit 1: Apply the Hard Cutover

- [ ] Replace every tracked `AGENTS.yml`, YAML fixture, inline test document, preset, and example that stores extension configuration under `pi.extensions` so each owned section is a direct top-level key, then remove empty `pi` and `extensions` wrappers while preserving unrelated top-level keys and owned values.

- [ ] Update every affected configuration loader and writer under `~/pi-extensions` to read and write `document[OWNED_SECTION_PATH]` directly, remove nested `pi.extensions` access, and provide no compatibility fallback for the obsolete wrapper.

- [ ] Update `template/AGENTS.yml`, `template/README.md.jinja`, `skills/pi-extension-authoring/SKILL.md`, and Copier-generated examples so every newly generated extension uses the direct top-level format.

## Work Unit 2: Update Instructions and Documentation

- [ ] Replace every `pi.extensions` path and nested-wrapper example in extension READMEs, root documentation, inventories, skills, and reference files with the direct top-level owned-section path used by the implementation.

- [ ] Rewrite the package-discovery sections of `pi-modes/README.md` to describe `SettingsManager.create(ctx.cwd, agentDir)`, `DefaultPackageManager.listConfiguredPackages()`, installed-path filtering, project trust, and user-package, project-package, and project-root precedence instead of manual directory scanning.

## Work Unit 3: Update Existing Tests

- [ ] Update existing parser, unit, and end-to-end fixtures to use direct top-level owned sections and retain assertions for structural validation, malformed YAML, missing owned sections, unrelated top-level keys, and project trust behavior.

- [ ] Update existing package-source tests to cover configured user packages, configured trusted-project packages, and the trusted project root in precedence order without creating unconfigured package directories.

- [ ] Update existing template tests to assert that generated `AGENTS.yml` content has direct top-level owned keys and contains no `pi.extensions` wrapper.

## Work Unit 4: Validate the Migration

- [ ] Search all tracked files under `~/pi-extensions` for `pi.extensions` and nested `pi` plus `extensions` configuration examples, correct every active occurrence, and leave only references that explicitly describe the removed legacy format.

- [ ] Run each changed repository's existing typecheck, Biome check, unit tests, and end-to-end tests, then correct every migration failure without adding a new test suite where none exists.

- [ ] Run a clean full install, a clean production-only install, and credential-free Node TypeScript imports of every changed package's production entry points.

- [ ] Run `git diff --check` in every changed repository and confirm that each working tree contains only the intended configuration, documentation, template, and test changes.

## Work Unit 5: Release and Reinstall

- [ ] Commit each changed repository independently with a minimal accurate message and push its default branch to the configured remote.

- [ ] Remove and reinstall every changed Pi package from its remote source with `pi remove` and `pi install`, then run `pi list` and confirm that each package appears exactly once.

- [ ] Reload Pi and verify direct top-level package and trusted-project configuration for the affected extensions without relying on the removed wrapper.
