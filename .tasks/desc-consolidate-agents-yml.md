# Consolidate extension config into AGENTS.yml

Goal: one project config file at `<cwd>/AGENTS.yml` holds the settings of `pi-modes`, `pi-context-preload`, and `pi-prompts`.

Contract:

- Top-level keys: `modes`, `preload`, `prompts`. All are optional.
- An extension reads only its own key and ignores the other top-level keys.
- Inside a known key, unknown sub-keys are rejected.
- Value shapes are identical to the legacy files.
- `AGENTS.yml` wins over a legacy file. When both exist, warn once and use `AGENTS.yml`.
- The project-trust gate applies to the project file.

Example:

```yaml
modes:
  exec: ""
  brief: "Give a brief answer."
preload:
  extends:
    - "pi-extension"
  files:
    - "index.ts"
  contexts:
    - "dioxus"
prompts:
  - "./prompts"
```

## Work unit 1: pi-context-preload loader

- [ ] In `pi-context-preload/index.ts`, add a lookup for `<cwd>/AGENTS.yml` in `collectPreload`: when the file exists, parse it with the existing `read-yaml-file` dependency and use its `preload` value as the configuration; when it is absent, fall back to `CONTEXT_PRELOAD.yml` with the current behavior.
- [ ] Validate the `preload` value with the existing `PRELOAD_CONFIG` TypeBox schema, and make the error messages name `AGENTS.yml` and the `preload` key; keep preset `extends` handling, size limits, and the project-trust gate unchanged.
- [ ] When both `AGENTS.yml` and `CONTEXT_PRELOAD.yml` exist, use `AGENTS.yml` and surface one deprecation warning through `ctx.ui.notify`.
- [ ] Add `AGENTS.yml` to the ignore lists in `collectFilesystemTree` and in the selected-file `globby` call so the config file never enters the tree block or the preload blocks.
- [ ] Update `test/unit.test.ts` and `test/e2e.test.ts` to cover AGENTS.yml as the primary file, legacy fallback, both-present precedence, an invalid `preload` value, and a file that contains only other keys.
- [ ] Run `npm run check` in `pi-context-preload` until it is clean.

## Work unit 2: pi-modes loader

- [ ] In `pi-modes/index.ts`, after the package mode files load, read project modes from the `modes` key of `<cwd>/AGENTS.yml` when present; otherwise keep reading `<cwd>/.pi/AGENT_MODES.yml`.
- [ ] Keep precedence as package files first, legacy project file second, `AGENTS.yml` last so it wins on name conflicts; when both project files exist, parse both in that order and notify once that the legacy file is deprecated.
- [ ] Validate the `modes` value with the existing `mapAsMap` rules (non-empty string names, string values), with error messages that name `AGENTS.yml` and the `modes` key, and keep the project-trust gate for both project files.
- [ ] Do not add a test suite, because `pi-modes` has none; verify manually by loading the extension locally and confirming Shift+Tab cycling with modes from `AGENTS.yml`, fallback from `.pi/AGENT_MODES.yml`, and no error for untrusted projects.

## Work unit 3: pi-prompts hook

- [ ] In `pi-prompts/src/index.ts`, add a `resources_discover` handler that returns the `prompts` list from `<cwd>/AGENTS.yml` as `promptPaths` so Pi loads them as native prompt templates.
- [ ] Guard the handler with `ctx.isProjectTrusted()`, parse only the `prompts` key, validate it as a list of non-empty strings, and ignore the file when the key is absent.
- [ ] Update `test/unit.test.ts` and `test/e2e.test.ts` for prompt path discovery, absent key, invalid value, and the trust gate.
- [ ] Run `npm run check` in `pi-prompts` until it is clean.

## Work unit 4: Docs and skills

- [ ] Update `pi-context-preload/README.md` to document the `preload` key in `AGENTS.yml`, the fallback, and the deprecation of standalone `CONTEXT_PRELOAD.yml`.
- [ ] Update `pi-modes/README.md` to document the `modes` key, the new project file location, and the precedence order.
- [ ] Update `pi-prompts/README.md` to document the `prompts` key.
- [ ] Update `skills/context-preload-authoring/SKILL.md` in `pi-context-preload` and `skills/add-pi-mode/SKILL.md` in `pi-modes` so their procedures reference `AGENTS.yml`.

## Work unit 5: Template repo

- [ ] In `/home/entropybender/pi-extensions`, replace `template/CONTEXT_PRELOAD.yml` with `template/AGENTS.yml` that holds the same content under a `preload` key, and update `copier.yml`, `skills/pi-extension-authoring/SKILL.md`, and any other template file that references the old filename.
- [ ] Render the template once into a scratch directory and confirm the emitted project contains a valid `AGENTS.yml`.

## Work unit 6: Migrate projects

- [ ] For each project with a `CONTEXT_PRELOAD.yml`, move its content under the `preload` key of a new `AGENTS.yml`, delete the old file, and run `/reload`.
- [ ] For each project with a `.pi/AGENT_MODES.yml`, move its content under the `modes` key of that project's `AGENTS.yml`, delete the old file, and run `/reload`.
- [ ] Migrate the extension repos' own project files (`pi-prompts/CONTEXT_PRELOAD.yml`, `pi-modes/CONTEXT_PRELOAD.yml`); keep `pi-modes/AGENT_MODES.yml` unchanged because it is a package-owned file declared under `pi.modes`.
- [ ] In each migrated project, confirm preload still injects context with the file-count notification, the mode widget cycles, and prompt templates load.

## Work unit 7: Remove fallbacks

- [ ] After all known projects are migrated, remove the `CONTEXT_PRELOAD.yml` fallback from `pi-context-preload` and the `.pi/AGENT_MODES.yml` fallback from `pi-modes`, and replace each with a warning when a legacy file exists.
- [ ] Publish the final versions and update the three READMEs to remove the fallback documentation.
