# Consolidate extension config into AGENTS.yml

Goal: one project config file at `<cwd>/AGENTS.yml` holds the settings of `pi-modes`, `pi-context-preload`, and `pi-prompts`.

Contract:

- Top-level keys: `modes`, `preload`, `prompts`. All are optional.
- An extension reads only its own key and ignores the other top-level keys.
- Inside a known key, unknown sub-keys are rejected.
- Value shapes are identical to the legacy files.
- When `AGENTS.yml` is absent, the legacy file is read with current behavior. When both exist, `AGENTS.yml` wins.
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

- [ ] In `/home/entropybender/.pi/agent/git/github.com/Distortedlogic/pi-context-preload/index.ts`, change `collectPreload` to resolve `<cwd>/AGENTS.yml` first: parse it with the existing `read-yaml-file` call and use its `preload` value, validated by the existing `PRELOAD_CONFIG` TypeBox schema, with error messages that name `AGENTS.yml` and the `preload` key; when `AGENTS.yml` is absent, keep the current `CONTEXT_PRELOAD.yml` path unchanged.
- [ ] In the same file, add `AGENTS.yml` to the ignore list in `collectFilesystemTree` and to the `ignore` array of the file-selection `globby` call so it never enters the tree block or the preload blocks.
- [ ] In `pi-context-preload/test/unit.test.ts` and `test/e2e.test.ts`, extend the existing cases to cover preload from `AGENTS.yml`, fallback to `CONTEXT_PRELOAD.yml`, and an invalid `preload` value.

## Work unit 2: pi-modes loader

- [ ] In `/home/entropybender/.pi/agent/git/github.com/Distortedlogic/pi-modes/index.ts`, keep loading package mode files first, then read project modes from the `modes` key of `<cwd>/AGENTS.yml` when that file exists and from `<cwd>/.pi/AGENT_MODES.yml` only when it does not; keep the existing `mapAsMap` validation (non-empty string names, string values), the last-wins precedence, and the project-trust gate, with error messages that name `AGENTS.yml` and the `modes` key.

## Work unit 3: pi-prompts hook

- [ ] In `/home/entropybender/.pi/agent/git/github.com/Distortedlogic/pi-prompts/src/index.ts`, add `yaml` as a dependency (same package `pi-modes` uses) and register a `resources_discover` handler that, when `ctx.isProjectTrusted()` and `<cwd>/AGENTS.yml` exists, parses it, validates the `prompts` key as a list of non-empty strings, and returns them as `promptPaths`; an absent key returns nothing.
- [ ] In `pi-prompts/test/unit.test.ts` and `test/e2e.test.ts`, extend the existing cases to cover prompt path discovery from `AGENTS.yml`, an absent `prompts` key, an invalid value, and an untrusted project.

## Work unit 4: template repo

- [ ] In `/home/entropybender/pi-extensions`, replace `template/CONTEXT_PRELOAD.yml` with `template/AGENTS.yml` holding the same content under a `preload` key, and update the old filename references in `template/README.md.jinja` and `skills/pi-extension-authoring/SKILL.md`.

## Work unit 5: Migrate extension repos

- [ ] In `/home/entropybender/.pi/agent/git/github.com/Distortedlogic/pi-context-preload`, move the root `CONTEXT_PRELOAD.yml` content into an `AGENTS.yml` under the `preload` key, delete the old file, and commit.
- [ ] In `/home/entropybender/.pi/agent/git/github.com/Distortedlogic/pi-prompts`, move the root `CONTEXT_PRELOAD.yml` content into an `AGENTS.yml` under the `preload` key, delete the old file, and commit.
- [ ] In `/home/entropybender/.pi/agent/git/github.com/Distortedlogic/pi-modes`, move the root `CONTEXT_PRELOAD.yml` content into an `AGENTS.yml` under the `preload` key, delete the old file, and commit; keep the root `AGENT_MODES.yml` unchanged because it is a package-owned file declared under `pi.modes`.

## Work unit 6: Docs and skills

- [ ] Update `pi-context-preload/README.md`, `pi-modes/README.md`, `pi-prompts/README.md`, `pi-context-preload/skills/context-preload-authoring/SKILL.md`, and `pi-modes/skills/add-pi-mode/SKILL.md` to document the `AGENTS.yml` location, the per-extension key, and the legacy-file fallback for each extension, and commit each repo.
