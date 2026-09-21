# Goal

Make `pi-steering` behavior declarative through strict `pi-steering` sections in package and trusted-project `AGENTS.yml` files, with package defaults for the current per-user acknowledgement and ten-tool-call reminder, deterministic source precedence and reload behavior, safe native transcript or steer delivery, preserved `pi-compress` turn grouping, and no duplicate output mechanics in `AGENTS.md` or hardcoded rule values in TypeScript.

## Work units

- [ ] Define the `pi-steering` configuration contract and package defaults.
  - [ ] Add `pi-steering/AGENTS.yml` with named default rules for the exact per-user acknowledgement and the current ten-tool-call reminder.
  - [ ] Define strict schemas for a disabled rule and for an enabled rule with `trigger`, `interval`, `reset-on-user-message`, `delivery`, and non-empty `message` fields.
  - [ ] Generate `pi-steering/agents.ts` with the repository schema workflow and include `AGENTS.yml` and `agents.ts` in the published package files.
  - [ ] Add an exact latest-compatible `yaml` runtime dependency and the required TypeBox peer and pinned development dependencies.
- [ ] Implement trusted configuration discovery and resolution.
  - [ ] Load `AGENTS.yml` from the extension package, user-scoped configured packages, trusted project-scoped packages, and the trusted project root through `SettingsManager` and `DefaultPackageManager`.
  - [ ] Parse and validate each `pi-steering` section with source-path errors and reject unknown keys, invalid rule IDs, incomplete enabled rules, empty messages, and intervals below one.
  - [ ] Resolve rules by source precedence with complete last-definition replacement per rule ID and support `{ enabled: false }` as the only abbreviated rule form.
  - [ ] Reload the resolved rules and reset all counters on `session_start` without reading project sources when the project is untrusted.
- [ ] Execute the resolved rules through Pi's native event and message APIs.
  - [ ] Maintain one counter per enabled rule and reset only counters whose rules set `reset-on-user-message: true` after a completed user message.
  - [ ] Evaluate `user-message` rules on user `message_end` events and `tool-call` rules on `tool_execution_end` events in stable rule-ID order.
  - [ ] Deliver `transcript` rules as visible `pi-steering` custom messages with `triggerTurn: false` and deliver `steer` rules as hidden `pi-steering` messages with `deliverAs: "steer"`.
  - [ ] Store the schema version, rule ID, trigger, and delivery in message details while keeping the configured message as the session content.
  - [ ] Remove the hardcoded preamble text, reminder text, fixed interval, and single shared counter from `pi-steering/src/index.ts`.
- [ ] Preserve `pi-compress` whole-turn behavior for configured steering messages.
  - [ ] Treat `pi-steering` custom messages as answer entries in `pi-compress/src/crop.ts` so transcript and hidden steering entries do not split a user turn.
  - [ ] Extend the existing `pi-compress` tests to prove that a user message, steering entries, tool results, and the assistant response remain one removable turn.
- [ ] Remove duplicate steering mechanics from `AGENTS.md`.
  - [ ] Delete the rule that requires the model to repeat the per-user acknowledgement.
  - [ ] Delete the duplicated fixed ten-tool-call reminder text and interval now supplied by `pi-steering/AGENTS.yml`.
  - [ ] Keep the substantive user-instruction, scope, and coding-convention rules unchanged.
- [ ] Validate configuration, runtime delivery, and production loading.
  - [ ] Run the schema generation check and `npm run check` for `pi-steering` and `pi-compress`.
  - [ ] Use Pi RPC without provider credentials to verify package defaults, trusted project replacement, disabled rules, untrusted-project exclusion, `/reload`, counter reset, transcript delivery, and steer delivery.
  - [ ] Complete clean full-install, production-install, and production extension-load checks for both changed extensions.
