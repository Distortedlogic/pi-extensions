# Goal

Implement and deploy a minimal extension of `pi-sync` that synchronizes the persistent non-default contents of `~/.pi`, including files installed there by other extensions, excludes disposable or reproducible data, restores `agent/.env` and `agent/auth.json` from mapped Bitwarden Secrets Manager keys without exposing values, migrates the current legacy configuration, and applies packages before synchronized files so a fresh machine can reproduce the current Pi setup safely and idempotently.

## Work units

- [ ] Change `pi-sync` to manage `~/.pi` as its single machine root.
  - [ ] Keep `getActiveAgentDirectory()` for local state and calculate the Pi root once with `dirname(agentDirectory)` at the command boundary.
  - [ ] Pass the Pi root to inventory, planning, backup, apply, restore, and verification while keeping `.config-sync` under the agent directory.
  - [ ] Update all special path checks from agent-relative names such as `settings.json` to Pi-root-relative names such as `agent/settings.json`.
  - [ ] Update loaded-resource detection for managed root files and `agent/**` resources.

- [ ] Define the exact persistent-file scope and exclusions.
  - [ ] Add the audited persistent files and globs for `acp.json`, `web-search.json`, Mermaid configuration, and managed `agent/**` configuration and resources.
  - [ ] Include persistent extension-installed files under `agent/agents`, `agent/context-preload`, `agent/extensions`, `agent/prompts`, `agent/skills`, and JSON theme files.
  - [ ] Permanently deny secrets, package caches, dependency trees, sessions, caches, temporary files, generated databases, usage data, trust data, installer markers, and platform binaries.
  - [ ] Keep `agent/extension-data/**` excluded unless a specific stable configuration path is approved.

- [ ] Adapt settings and package planning to the Pi-root-relative layout.
  - [ ] Read and plan package declarations from `agent/settings.json` while preserving the active agent directory as the package command destination.
  - [ ] Preserve `/lastChangelogVersion` as a machine-only setting and synchronize the remaining reviewed settings.
  - [ ] Resolve every shared npm package to an exact compatible version and every shared Git package to an immutable commit before publication.
  - [ ] Validate that each retained package source has a valid Pi manifest and remove invalid package declarations.

- [ ] Apply package changes before synchronized files.
  - [ ] Reorder coordinator and journal stages so package installation completes after backup creation and before managed file application.
  - [ ] Update package execution to select only actions with package risk instead of all code-execution actions.
  - [ ] Keep `agent/settings.json` deferred to package execution when package actions exist, then apply all other reviewed files over package-created outputs.
  - [ ] Make recovery resume from the durable package-applied stage when later file application or verification stops.

- [ ] Restore agent secrets from Bitwarden without adding them to normal file inventory.
  - [ ] Extend the shared manifest with the `local-apps` BWS project identifier, exact environment-key mappings, and one key for the complete `auth.json` document.
  - [ ] Map the current global environment keys to exact same-name BWS keys and map `agent/auth.json` to `PI_AGENT_AUTH_JSON`.
  - [ ] Use the official `bws` CLI through `pi.exec` with argument arrays, require the bootstrap `BWS_ACCESS_TOKEN`, and reject missing or duplicate key matches.
  - [ ] Materialize the complete `.env` and validated `auth.json` atomically with mode `0600` after normal file verification and before Pi reload.
  - [ ] Redact all secret values from errors, notices, plans, state, journals, and receipts.

- [ ] Convert the legacy synchronized layout and baseline.
  - [ ] Prefix legacy agent-relative paths with `agent/` and retain root-level persistent files at their paths relative to `~/.pi`.
  - [ ] Convert the shared repository from `sync/<path>` to the new root-mirroring layout with a reviewed candidate commit.
  - [ ] Rebuild the baseline only from approved managed paths and omit denied runtime, package-cache, and secret paths.
  - [ ] Keep the legacy clone, state, backups, and compatibility symlink unchanged until the new reconcile and restore checks pass.

- [ ] Update existing tests for the new root, scope, order, migration, and secret restoration.
  - [ ] Update file, state, plan, transaction, package-execution, migration, command, security, recovery, and UI tests without adding a new test suite.
  - [ ] Test Pi-root path safety, exact managed and denied scopes, and final file precedence over package-created files.
  - [ ] Test deterministic BWS fixtures for complete key matching, missing and duplicate keys, JSON validation, atomic mode-`0600` writes, and redacted failures.
  - [ ] Test legacy path conversion, interrupted apply recovery, and a second reconcile with no planned changes.

- [ ] Validate, release, and activate the completed setup.
  - [ ] Pass typecheck, Biome, all tests, a clean development install, a clean production install, and a production extension-load check without provider credentials.
  - [ ] Review the package contents and confirm that Git, state, journals, plans, and receipts contain no secret values or denied runtime files.
  - [ ] Push the changed extension, update it from the remote source, and run the reviewed migration and reconcile on the current machine.
  - [ ] Restore Bitwarden-backed secrets, reload Pi, verify required files and permissions, and confirm that the next reconcile is a no-op.
