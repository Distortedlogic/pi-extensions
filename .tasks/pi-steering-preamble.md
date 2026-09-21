# Goal

Move the two existing `pi-steering` behaviors into a strict `pi-steering` `AGENTS.yml` configuration so their enabled state, exact messages, and tool-call interval can change through standard trusted configuration sources, while keeping their current Pi delivery semantics, preserving `pi-compress` whole-turn handling, and removing duplicate output instructions and hardcoded behavior values.

## Work units

- [ ] Define the `pi-steering` settings and package defaults.
  - [ ] Add `pi-steering/AGENTS.yml` with `after-user-message` defaults for the exact acknowledgement and `after-tool-calls` defaults for the current interval and reminder.
  - [ ] Generate `pi-steering/agents.ts` with strict schemas for `enabled`, non-empty `message`, and the positive integer tool-call `interval`.
  - [ ] Include `AGENTS.yml` and `agents.ts` in package files, add the exact latest-compatible `yaml` dependency, and add the required TypeBox peer and pinned development dependencies.
- [ ] Implement configuration loading and precedence.
  - [ ] Load extension, user-package, trusted project-package, and trusted project-root `AGENTS.yml` sources through `SettingsManager` and `DefaultPackageManager` in that order.
  - [ ] Parse each `pi-steering` section with source-path errors, reject unknown or invalid fields, and merge only the two known setting blocks over the package defaults.
  - [ ] Resolve settings and reset the tool-call counter on `session_start`, excluding all project sources when the project is untrusted.
- [ ] Apply the resolved settings in `pi-steering/src/index.ts`.
  - [ ] On each user `message_end`, reset the tool-call counter and send the configured visible acknowledgement with `triggerTurn: false` when enabled.
  - [ ] On each `tool_execution_end`, send the configured hidden reminder with `deliverAs: "steer"` when its enabled interval is reached.
  - [ ] Remove the hardcoded acknowledgement, reminder, and interval constants.
- [ ] Preserve `pi-compress` whole-turn handling.
  - [ ] Treat `pi-steering` custom messages as answer entries in `pi-compress/src/crop.ts`.
  - [ ] Extend the existing `pi-compress` tests to keep a user message, steering messages, tool results, and assistant responses in one removable turn.
- [ ] Remove duplicate steering instructions from `AGENTS.md`.
  - [ ] Delete the required acknowledgement output rule and fixed ten-tool-call reminder rule now supplied by `pi-steering/AGENTS.yml`.
  - [ ] Keep the substantive user-instruction, scope, and coding-convention rules unchanged.
- [ ] Validate the implementation.
  - [ ] Run schema validation and `npm run check` for `pi-steering` and `pi-compress`.
  - [ ] Use Pi RPC with a deterministic provider fixture to verify defaults, trusted overrides, untrusted-project exclusion, reload, acknowledgement delivery, counter reset, and reminder delivery.
  - [ ] Run clean full-install, production-install, and production extension-load checks for both changed extensions.
