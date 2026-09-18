# Goal

Make pi-env load only approved dotenv sources with correct precedence, make pi-tree produce a stable project-root tree, and make pi-steering use the required exact steering message.

## Work units

- [ ] Restrict pi-env to the active secret files and correct value precedence
  - [ ] Remove global and project `settings.json.env` loading from `collectEnvironment()` so it reads only `~/.pi/agent/.env` and a trusted project `.env`.
  - [ ] Apply global dotenv values before project dotenv values while preserving values that already exist in `process.env`.
  - [ ] Update the existing pi-env unit and end-to-end tests for global values, project overrides, untrusted projects, existing process values, cleanup, and omitted secret values in key context.

- [ ] Remove the temporary input path from pi-tree output
  - [ ] Remove the `tree --fromfile` input-file heading and prefix the rendered tree with `.` before writing `TREE.txt` or injecting context.
  - [ ] Update the existing pi-tree tests to require a stable `.` root and reject temporary path content.

- [ ] Make pi-steering emit the required message exactly
  - [ ] Replace `STEERING_MESSAGE` with `are u overcomplicating? overengineering? lost the scope? not idiomatic n native? not following the codebase conventions? deviate from the task list instructions?` and remove the appended sentence.
  - [ ] Keep the current hidden steer delivery, ten-tool-call interval, and counter reset on each user message.
  - [ ] Run the existing `check` command.
