---
name: pi-extension-authoring
description: Use when creating a new local Pi extension. Do not use when editing an existing extension or doing Git-only work.
---

# Local Pi extension conventions

Use Pi documentation for normal extension APIs and TypeScript knowledge. This skill contains only local decisions and lessons.

## Repository and package baseline

- Put standalone extension repositories in `~/repos/`.
- Use Forgejo as the writable primary remote with the name `origin`.
- Use the `Distortedlogic` GitHub owner for the mirror remote with the name `github`.
- Create new extension repositories as private unless the user specifies another visibility.
- Use Git package sources in this form: `git:github.com/Distortedlogic/<repository>`.
- Use `@earendil-works/pi-coding-agent`, not the upstream package name.
- Declare every directly imported runtime package. Do not rely on a peer package's transitive dependencies.
- Do not add `@earendil-works/pi-tui` unless source code imports TUI components directly. `ctx.ui` does not require a direct TUI dependency.
- Do not add Vite or a build step for a normal Pi extension.

The Copier template at the meta-package root is the only source for every new extension repository. Resolve the package root from this skill file (`../..`) and use that directory as the Copier source. Do not copy a baseline manually or use another repository.

When you create an extension repository:

1. Set the target directory under `~/repos/`, and create it if it does not exist.
2. Confirm that the target directory contains no files or directories, including hidden entries. Stop if it is not empty.
3. Derive the package name from the final target directory name.
4. Resolve the meta-package root from this skill file (`../..`). Apply it with `copier copy <meta-package-root> <target-directory>`. Give Copier the derived package name and the short project description.
5. Initialize the target as a Git repository with the `main` branch. In the target directory, run `pre-commit install --install-hooks --hook-type pre-commit --hook-type pre-push`.
6. Add only the dependencies that the source and checks require. Run `npm install` to create `package-lock.json`.
7. Implement the extension in `src/`.
8. Replace the template-only unit and end-to-end tests with tests for the extension behavior.
9. Run all configured checks:

   ```bash
   pre-commit run --all-files
   npm run check
   PI_OFFLINE=1 npm run test:e2e
   ```

10. Create the private Forgejo repository and the private GitHub mirror. Add Forgejo as `origin` and GitHub as `github`:

    ```bash
    git remote add origin <forgejo-ssh-url>
    git remote add github git@github.com:Distortedlogic/<repository>.git
    ```

11. Commit the validated files. Push `main` to Forgejo first, and then push the same commit to GitHub:

    ```bash
    git push -u origin main
    git push github main
    ```

Put all runtime TypeScript files in `src/`. Start with only `src/index.ts`. Add another file only for a clear function, and name it for that function. Keep Pi registration in `src/index.ts`. Do not add empty modules or general `utils.ts`, `helpers.ts`, or `common.ts` files.

Install and run local package tools through npm scripts. Do not guess a CLI path in `~/3rd/pi`.

## Preload manifest

Use the generated `CONTEXT_PRELOAD.yml` as the baseline. It preloads runtime TypeScript, package metadata, and the common Pi extension references. It intentionally does not preload `README.md`, test TypeScript files, or lock files.

Add only source and Pi files needed by that extension. Do not preload lock files.

## Non-obvious Pi behavior

- Pi loads TypeScript extensions with `jiti`. A raw Node import is not a valid Pi load test.
- For active-run steering, use `pi.sendMessage(..., { deliverAs: "steer" })` and do not set `triggerTurn: false`.
- `triggerTurn: false` during streaming creates a passive custom message that Pi defers until the current turn ends.
- `message_start` with role `user` is the established reset boundary for counters that run between user messages. A custom message does not reset that counter.
- `tool_execution_start` is the established ordered counter event for tool-call nudges, including parallel tool batches.
- A `session_start` preload guard must check for that extension's own custom message. It must not skip because any unrelated context entry exists.
- `Value.Decode()` does not validate a normal TypeBox schema. Use `Value.Parse()` when parsing must validate.
- An extension handler throw reaches Pi's extension runner. An import error happens before a handler exists.
- Use `ctx.isProjectTrusted()` before reading a project-owned file.
- After session replacement or reload, captured session-bound `pi` and `ctx` objects are stale.

## Local test pattern

The template creates separate unit and end-to-end test files. Update these existing files for the requested behavior.

- Unit tests cover pure parsing, counters, ordering, reset rules, limits, and errors.
- The template end-to-end test verifies that Pi can load the extension without an LLM request.
- Behavior tests use the exported `RpcClient` with `--no-extensions` and one explicit `--extension` path.
- Add `--no-session` unless persistence is under test.
- Add `--approve` only for trusted-project behavior.
- Set `PI_OFFLINE=1`.
- Inspect RPC messages, entries, state, queues, or command results. Do not ask a model whether hidden context exists.
- A Pi RPC test must not make an LLM request when state inspection can prove the behavior.

## Secrets

Load the `bitwarden-secrets` skill for any secret or `.env` work. Do not duplicate that workflow here.

## Release sequence

For a new private extension:

1. Run the local `check` script.
2. Verify the requested behavior through Pi or a focused non-persistent check.
3. Commit with a short message.
4. Create and push `Distortedlogic/<repository>` as private.
5. Install `git:github.com/Distortedlogic/<repository>`.
6. Reload or restart Pi.

For an installed extension update:

1. Start with a clean worktree. Keep existing behavior changes out of the template update.
2. When a template update is requested, run `copier update`. If the request names a template revision, run `copier update --vcs-ref <template-ref>`.
3. Review the complete three-way diff. Resolve each Copier conflict, and review the result with `git diff`.
4. Run `pre-commit autoupdate` only when the requested update includes hook revisions. Review those revision changes with the template changes.
5. Run all configured checks:

   ```bash
   pre-commit run --all-files
   npm run check
   PI_OFFLINE=1 npm run test:e2e
   ```

6. Commit template changes separately from extension behavior changes when practical.
7. Push the validated commits to Forgejo first, and then update the GitHub mirror.
8. Run `pi install` with the same Git source.
9. Reload or restart Pi.
