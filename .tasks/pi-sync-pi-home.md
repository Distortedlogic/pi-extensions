# Goal

Implement and activate `pi-sync` support for reproducing the persistent non-default contents of `~/.pi`, including files installed there by extensions, while excluding disposable data and restoring `agent/.env` and `agent/auth.json` from Bitwarden without placing secret values in Git or Pi synchronization artifacts.

## Work units

- [x] Move synchronization from the agent directory to the existing `~/.pi` root.
  - [x] Calculate `piDirectory` once as `dirname(getActiveAgentDirectory())` in `commands.ts` and pass it to inventory, backup, apply, restore, and verification operations.
  - [x] Keep configuration, state, plans, journals, and backup metadata under the active agent directory.
  - [x] Change settings-specific and loaded-resource paths from `settings.json` and other agent-relative names to their `agent/**` paths.

- [x] Configure the exact persistent and denied path scopes.
  - [x] Manage `acp.json`, `web-search.json`, the three current Mermaid source files, and persistent files under `agent/agents`, `agent/context-preload`, `agent/extensions`, `agent/prompts`, `agent/skills`, and `agent/themes`.
  - [x] Manage `agent/AGENTS.md`, `agent/APPEND_SYSTEM.md`, `agent/SYSTEM.md`, `agent/keybindings.json`, `agent/models.json`, and `agent/settings.json` when present.
  - [x] Deny `.config-sync`, secrets, package caches, dependency trees, binaries, sessions, caches, temporary files, generated stores, usage data, trust data, OAuth data, and installer markers.
  - [x] Update settings comparison and package planning to use `agent/settings.json`, preserve `/lastChangelogVersion` locally, and require exact package sources.

- [ ] Make package installation precede synchronized file application.
  - [x] Reorder coordinator and journal stages so verified backup creation is followed by package execution, managed file application, and final verification.
  - [x] Select package operations by package risk instead of treating every code-execution action as a package operation.
  - [x] Keep `agent/settings.json` deferred to package execution when package actions exist and apply synchronized extension outputs after their packages install.
  - [ ] Resume interrupted operations from the recorded package or file stage without repeating completed effects.

- [ ] Restore agent secrets from their existing Bitwarden entries.
  - [ ] Extend the shared manifest with the `local-apps` BWS project identifier, explicit environment-name-to-BWS-key mappings, and the existing BWS key for the complete `auth.json` document.
  - [ ] Fetch only mapped secrets through the official `bws` CLI with `pi.exec`, using the process `BWS_ACCESS_TOKEN` as the required bootstrap credential.
  - [ ] Validate the complete secret set and `auth.json` JSON before writing `agent/.env` and `agent/auth.json` atomically with mode `0600`.
  - [ ] Restore secrets after managed file verification and before reload without exposing values in output, plans, state, journals, receipts, or errors.

- [ ] Migrate the current shared repository and baseline to Pi-root-relative paths.
  - [ ] Convert each legacy agent-relative path to `agent/<path>` and add the managed root-level ACP, web-search, and Mermaid files.
  - [ ] Replace the legacy `sync/<path>` shared layout and manifest with the reviewed `~/.pi`-mirroring layout.
  - [ ] Import baseline fingerprints only for managed paths and leave the legacy clone, state, backups, and compatibility symlink unchanged until activation succeeds.
  - [ ] Normalize the shared `agent/settings.json` package declarations to exact compatible npm versions and immutable Git commits.

- [ ] Update existing tests and activate the migrated setup.
  - [ ] Update existing file, state, transaction, package, migration, command, security, recovery, and UI tests for Pi-root paths and the new operation order.
  - [ ] Cover managed and denied scopes, package-created file precedence, deterministic BWS restoration, mode `0600`, redacted failures, migration, recovery, and no-op reconciliation.
  - [ ] Pass typecheck, Biome, all tests, clean development and production installs, and the production extension-load check without provider credentials.
  - [ ] Push and update `pi-sync`, apply the reviewed migration and reconcile, reload Pi, and verify that the next reconcile has no changes.
