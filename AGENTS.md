# Pi Extension Meta

## Conventions

- This directory contains all custom Pi extension repositories.
- To install an extension, first push it to its remote repository. Then install it from the remote repository.
- Do not install extensions from a local path.
- do not do edits to `~/.pi` to modify extension behaviors.

## Testing

Use Node as the default test platform in all repositories under `~/pi-extensions`.

- Use `node:test`, `node:assert/strict`, `tsc --noEmit`, and `biome check .`.
- Keep existing test suites. Do not add a suite where none exists without user approval.
- Test public functions directly. Use real temporary directories for file tests and remove them after each test.
- Use only public Pi APIs for registration and integration tests. Use deterministic providers or fixtures. Never call real model APIs.
- Keep end-to-end tests small. Use `pi --mode rpc --no-session` when a real Pi process is necessary.
- Do not add Vite, Jest, avoidable `memfs`, copied private Pi internals, a full fake Pi runtime, or third-party Pi harness packages. Keep Vitest only for an existing justified need.
- Where tests exist, make `check` run typecheck, lint, and test; make `test` run unit tests and then end-to-end tests.
- Put runtime packages in `dependencies`, Pi-provided modules in `peerDependencies`, and development tools in `devDependencies`. Commit `package-lock.json` when reproducible resolution is needed.
- Before completion, pass typecheck, lint, tests, a clean full install, a clean production install, and a production extension-load check without provider credentials.
- Do not use permanent `legacy-peer-deps` or `npm audit fix --force` repairs.
