# Pi Extensions Inventory

This workspace contains independent custom Pi extension repositories. Use this map to keep changes consistent. Read the target repository's local instructions, `README.md`, `AGENTS.yml`, and package manifest before editing it.

## Shared rules

- The root repository is a meta package for the Copier template, authoring skill, and shared policy. It does not register a runtime extension.
- Each child repository has its own Git history. Make and commit changes in the repository that owns the file.
- Forgejo is the writable `origin`. GitHub is the `github` mirror. Push to Forgejo first.
- Push an extension before installation. Install it from its remote Git source. Do not install it from a local path.
- Use the root Copier template and the `pi-extension-authoring` skill for a new extension repository.
- Keep the established entry-point layout, formatter, TypeScript version, test runner, lock file, and Pi API version of the target repository.
- Runtime extensions are TypeScript ES modules declared in `package.json` under `pi.extensions`. Package skills are declared under `pi.skills`.
- Use public Pi APIs and native Pi or TUI components. Use an existing package instead of custom persistent code when one covers the need.
- Keep Pi framework packages in `peerDependencies`. Put non-Pi runtime packages in `dependencies`. Follow an established package exception when its manifest requires one.
- Start session resources from `session_start` or on demand. Clean them up in `session_shutdown`.
- Honor project trust checks. Never expose secret values in context, logs, tracked files, or tool output.
- Use the existing test suite. Do not add a test suite to a repository that has none.
- Run the target repository's configured checks. Run its existing end-to-end checks when behavior needs them. Run `npm pack --dry-run` for distribution changes.
- Reload or restart Pi after installation. Use `/reload` after changes to loaded resources or `AGENTS.yml`.

## `AGENTS.yml` contract

The shared top-level keys have separate owners:

- `preload`: `pi-context-preload`
- `modes`: `pi-modes`
- `prompts`: `pi-prompts`

Preserve unrelated keys when one map changes. Preserve declaration order for modes, prompts, and prompt chains. Extension repositories normally extend the `pi-extension` preload preset and select only useful source and manifest files. Do not preload tests, generated files, dependencies, large artifacts, or secrets.

Use `context-preload-authoring` for changes to a `preload` object. Use `add-pi-mode` when a mode is added.

## Repository map

| Repository | Agent-relevant role and boundary |
|---|---|
| `pi-config-sync` | Synchronizes approved Pi configuration. Preserve exact-plan approval, revalidation, recovery, and permanent secret, environment, session, Git, and installed-package exclusions. Shared repository data is not agent instruction. |
| `pi-context-compress` | Provides append-only context range compression and session-tree operations. Preserve original history, range revalidation, review, and its public API and event protocol. |
| `pi-context-preload` | Owns `preload`, the `pi-extension` preset, package-owned dynamic contexts, and preload authoring skills. Project configuration can select executable contexts but cannot provide executable context loaders or templates. |
| `pi-modes` | Owns `modes`. Other extensions select a mode through `pi.events.emit("pi-modes:set", { name })`. |
| `pi-project-env` | Loads global and trusted project environment data at `session_start`. The project file is `<cwd>/.env`; there is no parent search. Only variable names can enter hidden context. |
| `pi-prompts` | Owns ordered native prompts and chains under `prompts`. Preserve unique names, source order, declaration order, and same-source chain references. |
| `pi-tasks` | Runs `.tasks/*.md` lists through `/tasks` and the `task` completion tool. It selects the `execute-task` mode and bundles the `pi-context-compress` continuation contract. Complete a task only after its work and checks pass. |
| `pi-tool-call-nudge` | Sends a hidden scope and simplicity check every ten completed tool calls. Treat it as a course correction, not a new task. |
| `pi-workstream` | Runs a separate checkpoint and batch workflow with plans in `.pi/tasks/`. Do not merge its plan format or state with `pi-tasks` `.tasks/` lists. Do not register competing `/workstream` or `/todos` commands. |
| `pi-blend` | Blender MCP project, not an installable Pi package. Keep the official locked MCP stack; do not add a custom bridge. |
| `pi-just-answer` | Empty repository with no installable resource. |
| `pi-queue` | Empty repository with no installable resource. |

## Required interactions

- Install `pi-context-preload` before a repository that extends its `pi-extension` preset.
- Preserve the shared `AGENTS.yml` key boundaries between preload, modes, and prompts.
- Preserve `pi-tasks` integration with `pi-modes` and `pi-context-compress`.
- Keep `pi-workstream` separate from `pi-tasks`.
- Never let `pi-config-sync` move data owned by `pi-project-env` or other secret stores.
- Do not assume one Pi dependency version across this workspace. Check the target package manifest before API or dependency changes.

## Change flow

1. Work in the owning repository and keep the change in scope.
2. Preserve public names, event channels, persisted formats, trust checks, security boundaries, and recovery behavior unless the task changes them.
3. Update existing tests and user documentation when behavior changes.
4. Run configured checks and inspect package contents when distribution changes.
5. Commit only intended files, push to `origin`, and install from the remote source when needed.
