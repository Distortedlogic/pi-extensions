# Implement pi-tree and pi-preload Ignore Policies

## Work Unit 1: Establish the Traversal Contract

- [ ] Inventory the tracked `pi-tree`, current `pi-preload`, obsolete `pi-context-preload`, meta-workspace, remote, Pi settings, installed-package, schema, fixture, test, documentation, and skill surfaces before editing, and record which preload context and file-processing features depend on the prohibited `AGENTS.yml` configuration so those impacts are handled without changing unrelated behavior.

- [ ] Select and pin an existing maintained Node traversal package that can apply inherited Git-style rules while pruning ignored directories before entry, or use its public extension points only where needed, and prove with a focused fixture that rule order is bundled defaults, CWD root file, and root-to-leaf nested files with directory-relative scope, later negation, sibling isolation, no traversal above CWD, and no Git-based hiding of untracked child repositories.

## Work Unit 2: Complete the pi-preload Hard Rename

- [ ] Rename every active and tracked `pi-context-preload` package, repository, directory, remote, metadata field, source identifier, runtime custom type, error, schema, fixture, test, document, skill, package source, and installed-state reference to `pi-preload`, with no alias, fallback reader, compatibility package, old custom type, or old package source left behind.

- [ ] Remove the old preload-owned `AGENTS.yml` schema, parser, preset selection, and configuration reader, account for each dependent context feature before retaining or removing it, and keep existing file decoding, image handling, size limits, ordering, trust checks, and other unrelated preload behavior unchanged unless a change is necessary for the new ignore-file interface.

## Work Unit 3: Implement the Shared Ignore-Policy Semantics

- [ ] Give `pi-tree` a packaged default policy asset and `pi-preload` a packaged default policy asset at paths that are physically separate from project-root activation files even when Pi runs in either development repository, include the assets in each published package, and preserve the order in which bundled rules load before project rules.

- [ ] For each extension, check only `<ctx.cwd>/.treeignore` or `<ctx.cwd>/.preloadignore` during `session_start`, return without collection when that exact root marker is absent, do not let a nested marker activate the extension, and keep the two activation decisions independent.

- [ ] Build each active collection from `ctx.cwd` with traversal-time policy evaluation so the bundled defaults apply first, the CWD marker applies second, and each matching nested ignore file applies only to its directory and descendants; allow later rules to override earlier normal defaults, prevent child rules from affecting siblings, and do not use Git-aware filtering that can hide nested extension repositories.

## Work Unit 4: Correct pi-tree

- [ ] Remove `TreeConfig`, the `AGENTS.yml` tree loader, include-glob configuration, and post-scan ignore filtering from `pi-tree`, then feed only paths admitted by the hierarchical `.treeignore` traversal into the existing bounded tree renderer so ignored or inaccessible subtrees are never scanned and collection cannot leave `ctx.cwd`.

- [ ] Change the tree snapshot path and preload label from root `TREE.txt` to `<ctx.cwd>/.pi/TREE.md`, create the project-level `.pi` directory when needed, update self-output exclusions through the bundled policy, and remove obsolete tracked root snapshots and references without creating per-child-repository outputs.

## Work Unit 5: Correct pi-preload

- [ ] Replace configured include globs and Git-aware candidate discovery with the hierarchical `.preloadignore` traversal rooted at `ctx.cwd`, pass the admitted regular files through the existing preload processing pipeline, and retain current limits and supported content behavior while ensuring ignored directories are pruned before access.

- [ ] Change the preload snapshot path from root `PRELOAD.md` to `<ctx.cwd>/.pi/PRELOAD.md`, create the project-level `.pi` directory when needed, update self-output exclusions through the bundled policy, and remove obsolete tracked root snapshots and references without creating per-child-repository outputs.

## Work Unit 6: Migrate Workspace Policy Files and Documentation

- [ ] Remove tree and preload behavior sections from all `AGENTS.yml` files, schemas, generated fixtures, and examples without adding `pi-tree` or `pi-preload` replacement keys, while preserving agent instructions and unrelated extension configuration.

- [ ] Add or update the root `.treeignore` and `.preloadignore` files for the `pi-extensions` workspace and matching files in child extension repositories so the workspace activates each collector once and each child can refine only its own subtree, with bundled defaults kept separate from every project file.

- [ ] Update package READMEs, the extension inventory, authoring skills, examples, workflows, package manifests, lockfiles, and repository metadata to describe activation, nested policy inheritance, CWD boundaries, and `.pi` snapshot paths using only the final `pi-tree` and `pi-preload` names.

## Work Unit 7: Update Existing Tests

- [ ] Update the existing `pi-tree` Node tests to cover absent and root activation markers, nested-marker non-activation, bundled-root-nested precedence, negation, sibling isolation, traversal pruning before an inaccessible directory, exact CWD boundaries, reachable untracked nested repositories, meta-workspace collection, and one `.pi/TREE.md` output without adding a new test suite.

- [ ] Update the existing `pi-preload` Node tests to cover absent and root activation markers, independent activation from `pi-tree`, nested-marker non-activation, bundled-root-nested precedence, negation, sibling isolation, traversal pruning, exact CWD boundaries, reachable untracked nested repositories, retained content limits and processing, and one `.pi/PRELOAD.md` output without adding a new test suite.

- [ ] Update rename and integration assertions so package loading, custom messages, errors, fixtures, skills, metadata, settings samples, and snapshots use only `pi-preload`, and add a repository-wide negative assertion that no active or tracked `pi-context-preload` identifier remains.

## Work Unit 8: Validate Development Packages

- [ ] Run `npm run check` in `pi-tree` and `pi-preload`, then run each repository’s existing typecheck, Biome, unit, review, and end-to-end commands as applicable and correct all failures without adding unrelated behavior.

- [ ] For both repositories, run a clean full install, a clean production-only install, and a credential-free production extension-load check that confirms the packaged default ignore asset is present and resolvable outside the development checkout.

- [ ] Exercise the real `pi-extensions` workspace from its root and from one child repository to confirm marker-based activation, nested policy isolation, no scan of the home `.local` tree, reachable child repositories, and snapshots only at the active CWD’s `.pi/TREE.md` and `.pi/PRELOAD.md`, then run `git diff --check` and review each repository diff for scope.

## Work Unit 9: Release and Cut Over Active State

- [ ] Commit `pi-tree` and `pi-preload` independently with minimal accurate messages, rename and update their configured remote repositories and source metadata as required, push the corrected commits to their remotes, and do not install either extension from a local path.

- [ ] After the pushed commits are available, replace the active `git:github.com/Distortedlogic/pi-context-preload` setting with the final remote `pi-preload` source, replace the stale installed `pi-tree` source with the pushed corrected source, remove obsolete installed checkouts and duplicate package entries through Pi package management, and reinstall both extensions from their remotes.

- [ ] Reload Pi and verify all four root-marker combinations, bundled and nested overrides in the meta workspace, child-repository direct startup, `.pi` snapshot locations, absence of home-directory traversal, corrected runtime identifiers, and exact absence of `pi-context-preload` from tracked files, remotes, active settings, installed package state, and runtime output.

## Work Unit 10: Finalize the Meta-Repository

- [ ] Update only the intended meta-repository inventory, policy, task, and package-reference files after the extension commits and active cutover are complete, preserve unrelated working-tree changes, run the meta-repository checks, commit with a minimal accurate message, and push the configured remote.
