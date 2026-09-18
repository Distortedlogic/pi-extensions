# Goal

Correct the remaining concrete runtime defects in pi-env, pi-tree, and pi-steering without duplicating the existing extension-convention or completed AGENTS.yml migration work.

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
