# Goal

Move the visible acknowledgement after each user message and the hidden periodic reminder into strict `pi-steering` configuration, while correcting the tool-call counter boundaries, preserving `pi-compress` whole-turn handling, and removing the duplicate prompt instructions from their actual active source.

## Work units

- [ ] Define strict `pi-steering` settings and package defaults.
  - [ ] Extend the existing `pi-steering/AGENTS.yml` without removing its `pi-preload` section; add `after-user-message` defaults for the exact acknowledgement and `after-tool-calls` defaults for the exact reminder and interval `10`.
  - [ ] Keep the acknowledgement text exactly `I will do what the user instructed without reinterpreting the users words, without overriding the users instructions, and without insubordinating, the way the user wants, not the way I want.` and the reminder text exactly `are u overcomplicating? overengineering? lost the scope? not idiomatic n native? not following the codebase conventions? deviate from the task list instructions?`.
  - [ ] Add `pi-steering/agents.ts` with strict schemas for `enabled`, a non-empty `message`, and a positive integer `interval`, with unknown fields rejected.
  - [ ] Update `pi-steering/package.json` and its lock file to package `AGENTS.yml` and `agents.ts`; pin `pi-agents-yaml` to `github:Distortedlogic/pi-agents-yaml#0f8e32f56dd2457a7b55b5469ac4fcf38c5e5c9d`; add `typebox` as peer dependency `*` and development dependency `1.3.34`.
- [ ] Load and merge standard trusted configuration sources.
  - [ ] Use `discoverAgentsSources` and `loadAgentsSection` from `pi-agents-yaml` instead of direct `SettingsManager`, `DefaultPackageManager`, or a new YAML loader.
  - [ ] Apply sources in their native order: extension defaults, user packages, trusted project packages, then the trusted project root; exclude all project sources when the project is untrusted.
  - [ ] Merge only the two known setting blocks over the package defaults, report invalid configuration with its source path, and reload the resolved settings on `session_start`.
- [ ] Apply the configured delivery and corrected counter lifecycle in `pi-steering/src/index.ts`.
  - [ ] Reset the counter on `session_start` and on each `message_start` event with a user-role message.
  - [ ] On each user `message_end`, send the configured visible acknowledgement with `triggerTurn: false` when it is enabled.
  - [ ] On `tool_execution_end`, reset the counter and return when `event.result.terminate` is `true`.
  - [ ] For each other completed tool call, increment the counter; when the configured interval is reached, reset it to zero and send the configured hidden `pi-steering` message with `deliverAs: "steer"` when enabled.
  - [ ] Remove the hardcoded acknowledgement, reminder, and interval values after the package defaults supply them.
- [ ] Preserve `pi-compress` whole-turn handling.
  - [ ] Treat `pi-steering` custom messages as answer entries in `pi-compress/src/crop.ts` so acknowledgement and reminder messages stay with their user turn.
  - [ ] Extend the existing `pi-compress` tests to keep a user message, steering messages, tool results, and assistant responses in one removable turn.
- [ ] Remove duplicate prompt instructions from the verified active source.
  - [ ] Treat the currently injected developer addendum as the active duplicate-instruction source. Identify its writable backing configuration before editing it; do not infer a filesystem path.
  - [ ] Remove only the matching acknowledgement and fixed ten-tool reminder rules after the extension defaults are validated.
  - [ ] If no writable backing configuration is available, record this item as blocked external configuration work instead of substituting a repository file.
  - [ ] Keep `./AGENTS.md` unchanged because its current repository content does not contain those duplicate rules; keep all substantive user-instruction, scope, and coding-convention rules unchanged.
- [ ] Validate the combined behavior and packages.
  - [ ] Exercise the registered public Pi event handlers deterministically for default acknowledgement delivery, repeated interval delivery, a tenth normal completion, a terminating tenth completion, a user message after a partial interval, and a session reset, without adding a new test suite.
  - [ ] Use Pi RPC with a deterministic provider fixture to verify trusted precedence, untrusted-project exclusion, reload, enabled and disabled behavior, visible acknowledgement delivery, and hidden reminder delivery.
  - [ ] Validate `pi-steering/agents.ts` at runtime through `loadAgentsSection`, including valid defaults and overrides plus rejection of unknown fields, empty messages, and non-positive or non-integer intervals; do not use the permissive legacy `.pi/schemas/AGENTS.schema.json` as evidence for this section.
  - [ ] Run `npm run check` for `pi-steering` and `pi-compress`.
  - [ ] Run clean full installs, clean production installs, and production extension-load checks without provider credentials for both changed extensions.
  - [ ] Push the changed extension repositories, then run `pi update` for them.
