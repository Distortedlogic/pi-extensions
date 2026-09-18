# Goal

Correct the remaining concrete runtime defects in pi-env, pi-tree, pi-steering, and pi-sync without duplicating the existing extension-convention or completed AGENTS.yml migration work.

## Work units

- [ ] Restrict pi-env to the active secret files and correct value precedence
  - [ ] Remove global and project `settings.json.env` loading from `collectEnvironment()` so it reads only `~/.pi/agent/.env` and a trusted project `.env`.
  - [ ] Apply global dotenv values before project dotenv values while preserving values that already exist in `process.env`.
  - [ ] Update the existing pi-env unit and end-to-end tests for global values, project overrides, untrusted projects, existing process values, cleanup, and omitted secret values in key context.

- [ ] Remove the temporary input path from pi-tree output
  - [ ] Normalize the first line returned by `tree --fromfile` to `.` before enforcing the output limit, writing `TREE.txt`, or injecting context.
  - [ ] Preserve directory ordering, depth reduction, output bounds, abort handling, and temporary-directory cleanup.
  - [ ] Update the existing pi-tree tests to require a stable `.` root and reject temporary path content.

- [ ] Make pi-steering emit the required message exactly
  - [ ] Replace `STEERING_MESSAGE` with `are u overcomplicating? overengineering? lost the scope? not idiomatic n native? not following the codebase conventions? deviate from the task list instructions?` and remove the appended sentence.
  - [ ] Emit the exact message visibly at each ten-tool-call boundary while preserving the counter reset on each user message.
  - [ ] Pass the existing typecheck, Biome check, empty test command, and credential-free extension-load check without adding a test file.

- [ ] Connect the pi-sync first-time setup flow
  - [ ] Register a `setup` subcommand that collects the shared repository path and branch and passes the selected first-sync mode to `prepareFirstSync()`.
  - [ ] Use `inspectSetupRepository()` to validate the repository and reject publish to a non-empty repository or apply and reconcile from an empty repository.
  - [ ] Persist the validated `ConfigDocument` and initial `StateDocument`, then send the generated first-sync plan through the existing review and confirmed execution path.
  - [ ] Update the existing pi-sync setup and command tests for publish, apply, reconcile, cancellation, invalid repository state, and failed persistence.

- [ ] Complete the pi-sync scope-expansion approval flow
  - [ ] On confirmation of a policy-only scope plan, call `approveScopeExpansion()`, save the updated local configuration, and apply no new managed path in that plan.
  - [ ] Before a later plan resolves effective paths, call `activateScopeApprovalForPlan()` and persist the activated policy when its plan ID differs from the approving plan ID.
  - [ ] Update the existing policy and command tests for rejection, approval, same-plan blocking, next-plan activation, and persistence failure.

- [ ] Implement resumable pi-sync transactions from durable journal stages
  - [ ] Add a coordinator resume entry point that loads and validates the stored plan, incomplete journal, current state, reviewed shared commit, candidate commit, published commit, and verified backup data available for the recorded stage.
  - [ ] Continue from `prepared`, `candidate_created`, `shared_published`, `backup_verified`, `machine_files_applied`, `packages_applied`, `final_verified`, or `state_committed` without repeating a journaled side effect.
  - [ ] Preserve the existing transaction lock, exact-plan authorization, ordered journal transitions, completed action IDs, machine verification, and restore behavior.
  - [ ] Update the existing coordinator and recovery tests with an interruption and successful resume case for each incomplete stage.

- [ ] Connect the pi-sync recovery command to transaction resume
  - [ ] Make the `resume` recovery choice call the coordinator resume entry point instead of only reporting the next step.
  - [ ] Keep rollback and stop behavior unchanged and require an explicit recovery choice before any mutation.
  - [ ] Report completion or a recovery-required error with the durable stage and next safe action.
  - [ ] Update the existing command and two-machine tests for resume completion, resume validation failure, rollback, stop, and cancellation.
