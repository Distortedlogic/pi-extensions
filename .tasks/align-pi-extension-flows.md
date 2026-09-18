# Goal

Align the custom Pi extensions with one compatible Node and Pi baseline, repair the incomplete template, environment, synchronization, context, task, mode, and steering flows, and validate each changed extension through its existing tests and a clean Git URL installation without adding npm release requirements.

## Work units

- [ ] Establish the shared extension baseline in the authoring template
  - [ ] Set Node `>=22.19.0`, TypeScript 7.0.x, Node 22 type definitions, Biome 2.5.14, and `@earendil-works` Pi peer ranges of `>=0.85.1 <1` as the generated-package baseline.
  - [ ] Update `template/test/unit.test.ts` to validate the current `pi-preload.presets` and `pi-preload.includes` fields in `template/AGENTS.yml`.
  - [ ] Add a generated-project `.gitignore` that covers `.env`, `node_modules/`, `PRELOAD.md`, `TREE.txt`, and normal test artifacts.
  - [ ] Make the Forgejo review test and its `.forgejo` implementation a complete template feature, or remove both from the generic test command if review automation is not mandatory for every extension.

- [ ] Move pi-compress to the shared runtime and validation baseline
  - [ ] Update the Pi development and peer versions, TypeScript, Node type definitions, and compiler target without changing the public compression protocol.
  - [ ] Change `check` so it runs typecheck, lint, and the existing Vitest suite.
  - [ ] Run the existing compression, rewrite, branch, crop, panel, and protocol tests before publishing the compatible pi-compress commit.

- [ ] Move pi-tasks to the compatible pi-compress and Pi baseline
  - [ ] Update the bundled `pi-compress` Git dependency to the reviewed compatible commit after that commit is pushed to its remote repository.
  - [ ] Replace the exact Pi 0.84.3 peer and development versions with the shared baseline and keep Pi-provided modules out of bundled runtime dependencies.
  - [ ] Change `check` so it runs typecheck, lint, and the existing Vitest suite.

- [ ] Align the remaining extension manifests and compiler settings
  - [ ] Apply the shared Pi peer, TypeScript, Node 22 type, engine, and compiler baseline to pi-env, pi-modes, pi-preload, pi-prompts, pi-steering, pi-sync, and pi-tree.
  - [ ] Keep `node:test` as the default and retain existing Vitest suites only in repositories that already use and need them.
  - [ ] Run each repository's existing typecheck and lint checks after the manifest changes before functional work continues.

- [ ] Make pi-env follow the active secret model
  - [ ] Remove `settings.json.env` as an environment source so only `~/.pi/agent/.env` and a trusted project `.env` supply loaded values.
  - [ ] Apply global values first, project values second, and preserve values that already existed in the Pi process.
  - [ ] Add an explicit early-load limitation or move loading to an earlier supported Pi lifecycle so extension factories do not incorrectly assume that project values are available during factory execution.
  - [ ] Update the existing pi-env unit and end-to-end tests for precedence, trust, process-value preservation, and removed settings support.

- [ ] Make generated environment context accurate after reload
  - [ ] Add a generation marker to pi-env key messages and keep only the newest pi-env generation in the `context` event.
  - [ ] Refresh the hidden key list after `/reload` while preserving one immutable key snapshot during a normal resumed session.
  - [ ] Verify that removed keys leave model context and that no environment values are included in the hidden message.

- [ ] Standardize AGENTS.yml source precedence
  - [ ] Use package defaults, user packages, trusted project packages, and the trusted project root in that order for pi-modes and pi-prompts.
  - [ ] Make later named map entries override earlier entries, reject duplicates inside one source, and keep additive pi-preload arrays ordered and deduplicated.
  - [ ] Update the existing mode, prompt, and preload tests to cover the same source order and project-trust boundary.

- [ ] Correct and harden the pi-tree collection flow
  - [ ] Replace the temporary `paths.txt` heading from `tree --fromfile` with the stable project root marker `.` before writing or injecting the tree.
  - [ ] Check for the system `tree` executable before collection and return one actionable dependency error when it is unavailable.
  - [ ] Update the existing pi-tree tests to reject temporary path leakage and to cover missing-command behavior.

- [ ] Define safe preload and tree snapshot behavior
  - [ ] Keep existing context snapshots during ordinary resume, but regenerate them on an explicit `/reload`.
  - [ ] Mark snapshot generations and filter older pi-preload and pi-tree custom messages from model context after a reload.
  - [ ] Make root-level `PRELOAD.md` and `TREE.txt` persistence explicit configuration, with context-only operation as the non-dirty default.
  - [ ] Update the existing preload and tree tests for resume, reload, context filtering, and opt-in disk snapshots.

- [ ] Connect the pi-sync first-time setup flow
  - [ ] Add a `setup` subcommand that collects the shared repository path and branch, then uses the existing first-sync mode selector.
  - [ ] Validate empty and existing repositories through `inspectSetupRepository()` and reject invalid first-sync mode combinations before writing state.
  - [ ] Build and review the initial immutable plan, then persist `ConfigDocument` and `StateDocument` only after the setup inputs and plan are valid.
  - [ ] Extend the existing pi-sync tests for empty-repository publish setup, existing-repository apply or reconcile setup, cancellation, and failed validation.

- [ ] Complete the pi-sync scope-expansion flow
  - [ ] Persist an approved expansion with `approveScopeExpansion()` as a policy-only result and do not apply new paths in the approving plan.
  - [ ] Activate the pending scope with `activateScopeApprovalForPlan()` only when a later plan has a different plan ID.
  - [ ] Rebuild the later plan with the activated scope and clear the pending approval only after durable state records the result.
  - [ ] Extend the existing tests for rejection, approval, same-plan blocking, next-plan activation, and failed persistence.

- [ ] Add resumable pi-sync transaction primitives
  - [ ] Implement coordinator entry points for every incomplete journal stage by validating the stored plan, current shared commit, candidate commit, backup, and completed action IDs before continuing.
  - [ ] Make each resume step idempotent and preserve the existing lock, durable journal transitions, exact-plan checks, and machine-restore guarantees.
  - [ ] Return recovery-required results instead of repeating publication, package execution, or file mutation when a recorded side effect is already complete.
  - [ ] Extend the existing coordinator and recovery tests for interruption and resume at each journal stage.

- [ ] Connect pi-sync recovery and remove eager startup fetches
  - [ ] Make `RESUME THE RECORDED OPERATION` call the new coordinator resume flow and report the completed or next blocked stage accurately.
  - [ ] Keep rollback and stop behavior unchanged, and require explicit user selection before any recovery mutation.
  - [ ] Build startup footer state from the local journal and baseline without fetching the remote repository.
  - [ ] Fetch remote status only for explicit status or synchronization commands, and honor `PI_OFFLINE` before all optional network work.

- [ ] Make pi-tasks finalization safe and recoverable
  - [ ] Record the starting Git HEAD and require a clean worktree before `/tasks run` begins an automatic commit workflow.
  - [ ] At finalization, verify that HEAD did not change, compute the exact changed-path set, and stop for user review when concurrent or unrelated changes are detected.
  - [ ] Replace unrestricted `git add -A` with exact path staging and keep the completed task-list deletion recoverable until the commit succeeds.
  - [ ] Update the existing task tests for dirty-start rejection, changed HEAD, exact staging, commit failure, task-file restoration, and successful completion.

- [ ] Make task compression depend on the active model window
  - [ ] Replace the fixed 400,000-token threshold with a threshold derived from `ctx.getContextUsage()` and the active model context window.
  - [ ] Keep the threshold below Pi native compaction and use the same percentage policy as pi-compress ambient context bands.
  - [ ] Update the existing pi-tasks and pi-compress integration tests for small, medium, and large context windows.

- [ ] Make pi-steering send the exact required steering message
  - [ ] Set `STEERING_MESSAGE` to the required verbatim question with no appended sentence.
  - [ ] Deliver the message through the required visible or verbal channel while preserving the ten-tool-call interval and per-user-message reset.
  - [ ] Run typecheck, lint, and a targeted extension-load check without adding a new test suite unless the user approves one.

- [ ] Resolve pi-modes shortcut ownership through Pi APIs
  - [ ] Verify whether the active Pi keybinding table reserves Shift+Tab and cover the result in the existing pi-modes tests.
  - [ ] Use `registerShortcut()` when the key is available; otherwise register a native mode-cycle command and isolate the raw terminal override as an explicit TUI-only compatibility exception.
  - [ ] Preserve key-repeat suppression, widget updates, event-bus mode changes, and non-TUI input suffix transformation.

- [ ] Apply the remaining local code conventions
  - [ ] Point the pi-sync manifest at a real source entry and remove the root entry file that only forwards to `registerConfigSyncCommands()`.
  - [ ] Remove comments that only restate code while retaining comments that define security, recovery, or protocol invariants.
  - [ ] Confirm that no functional change adds a new thin wrapper, a hand-written substitute for an established package, or an unapproved test suite.

- [ ] Validate the complete Git installation flow
  - [ ] Run typecheck, lint, and all existing tests in every changed repository, including end-to-end tests where they already exist.
  - [ ] For each changed extension, run a clean dependency install and a clean production dependency install without provider credentials.
  - [ ] Push each extension repository before installation, install its exact Git URL or commit through Pi, and verify that Pi loads the production extension without local-path installation.
  - [ ] Verify the combined extension set in a clean Pi agent directory, with offline startup, a trusted test project, reload, resume, and shutdown coverage.
