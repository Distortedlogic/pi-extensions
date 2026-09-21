# Goal

Make `pi-steering` behavior declarative through strict `pi-steering` sections in package and trusted-project `AGENTS.yml` files, with package defaults for the current per-user acknowledgement and ten-tool-call reminder, deterministic source precedence and reload behavior, native transcript or steer delivery, preserved `pi-compress` turn grouping, and no duplicate output mechanics in `AGENTS.md` or hardcoded rule values in TypeScript.

## Work units

- [ ] Define the steering rule configuration and package defaults.
  - [ ] Add `pi-steering/AGENTS.yml` with named rules for the exact per-user acknowledgement and current ten-tool-call reminder.
  - [ ] Generate `pi-steering/agents.ts` with strict disabled-rule and enabled-rule schemas covering `trigger`, `interval`, `reset-on-user-message`, `delivery`, and non-empty `message` values.
  - [ ] Include `AGENTS.yml` and `agents.ts` in package files, add the exact latest-compatible `yaml` dependency, and add the required TypeBox peer and pinned development dependencies.
- [ ] Implement configuration discovery and resolution.
  - [ ] Load extension, user-package, trusted project-package, and trusted project-root `AGENTS.yml` sources through `SettingsManager` and `DefaultPackageManager` in that precedence order.
  - [ ] Parse each `pi-steering` section with source-path errors and reject unknown fields, invalid rule IDs, invalid intervals, empty messages, and incomplete enabled rules.
  - [ ] Replace rules by complete rule ID at each higher-precedence source and accept `{ enabled: false }` as the disabled form.
  - [ ] Resolve rules and reset counters on `session_start`, excluding all project sources when the project is untrusted.
- [ ] Execute resolved rules through Pi events.
  - [ ] Maintain one counter per enabled rule, reset configured counters on user `message_end`, and evaluate matching `user-message` and `tool-call` triggers.
  - [ ] Send `transcript` rules as visible `pi-steering` messages with `triggerTurn: false` and `steer` rules as hidden messages with `deliverAs: "steer"`.
  - [ ] Remove the hardcoded messages, interval, and shared counter from `pi-steering/src/index.ts`.
- [ ] Preserve `pi-compress` whole-turn handling.
  - [ ] Treat `pi-steering` custom messages as answer entries in `pi-compress/src/crop.ts`.
  - [ ] Extend the existing `pi-compress` tests to keep a user message, steering messages, tool results, and assistant responses in one removable turn.
- [ ] Remove duplicate steering instructions from `AGENTS.md`.
  - [ ] Delete the required per-user acknowledgement output rule and the fixed ten-tool-call reminder rule now supplied by `pi-steering/AGENTS.yml`.
  - [ ] Keep the substantive user-instruction, scope, and coding-convention rules unchanged.
- [ ] Validate the implementation.
  - [ ] Run schema validation and `npm run check` for `pi-steering` and `pi-compress`.
  - [ ] Use Pi RPC with a deterministic provider fixture to verify source precedence, trust exclusion, disabled rules, reload, counter reset, transcript delivery, and steer delivery.
  - [ ] Run clean full-install, production-install, and production extension-load checks for both changed extensions.
