# Goal

Add a `signatures` key to the `pi-preload` configuration section in `pi-preload/agents.ts` and support it across `pi-preload/src/index.ts`, so paths matched by `includes` preload full file content as today, paths matched by `signatures` preload the same source structure with callable bodies folded by a bundled GritQL pattern pack, `includes` wins whenever both keys select one path, byte accounting separates original source bytes from emitted context bytes, and every unsupported language or fold failure raises a distinct error instead of falling back to full content.

## Work units

- [ ] Add and merge the signatures configuration key
  - [ ] In `pi-preload/agents.ts`, add `signatures: Type.Optional(STRING_LIST_SCHEMA)` to `configurationSchema`, keeping `additionalProperties: false`.
  - [ ] In `pi-preload/src/index.ts`, add `signatures: string[]` to the `PreloadConfiguration` and `ProjectScope` types.
  - [ ] In `loadPresetConfiguration()`, read `config.signatures ?? []`, include signature patterns in the absolute-pattern check beside `includes` and `excludes`, and merge inherited preset signatures before own signatures.
  - [ ] In `loadConfiguration()`, read `config.signatures ?? []` and set each returned `ProjectScope.signatures` to `[...presets.flatMap((preset) => preset.signatures), ...ownSignatures]`.
- [ ] Resolve signature selections into the candidate map
  - [ ] Add `type SelectionMode = "full" | "signatures"` and, in `collectPreload()`, run a second `globby` call per scope over `scope.signatures` with the same options as the `includes` call: `cwd: scope.projectRoot`, `gitignore: sessionScope`, `ignoreFiles` for non-session scopes, `ignore` of `AGENTS.yml`, `PRELOAD_FILE`, `TREE_FILE`, `LOCK_FILE_GLOBS` and `scope.excludes`, `onlyFiles`, `followSymbolicLinks: false`, `unique`, `objectMode`, `stats`.
  - [ ] Build the `candidates` map keyed by resolved absolute path with an added `mode` field, inserting signature matches before full matches so an overlapping path resolves to `"full"` without raising an error.
- [ ] Add the language registry and the GritQL fold pattern pack
  - [ ] Add `pi-preload/src/languages.ts` mapping file extensions to `{ language, patternFile }` for `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.py`, `.rs`, and `.go`, returning `undefined` for any other extension.
  - [ ] Create `pi-preload/grit/fold-javascript.grit`, `fold-python.grit`, `fold-rust.grit`, and `fold-go.grit`, each starting with its target language declaration (`language js(typescript,jsx)`, `language python`, `language rust`, `language go`), because GritQL otherwise assumes JavaScript.
  - [ ] In each pattern, rewrite only the callable body node to `{ /* … */ }` or `...`, leaving modifiers, generics, parameters, return types, decorators, and attributes unchanged.
  - [ ] Restrict each pattern to outermost callables with a `where` clause asserting the match is `not within` another callable of the same language, so a nested closure never folds separately from the body that already replaced it.
- [ ] Implement the in-process fold engine module
  - [ ] In `pi-preload/package.json`, add `grit` to `files` and `@getgrit/gritql` pinned to `0.0.3` to `dependencies`, then install so `package-lock.json` records the NAPI binding and its platform package.
  - [ ] Read `node_modules/@getgrit/gritql/__generated__/index.d.ts` and write the engine against its exported rewrite entry point, with no subprocess, temporary workspace, or on-disk mutation.
  - [ ] Add `pi-preload/src/fold.ts` exporting a function that takes the session cwd, an `AbortSignal`, and the signature-mode files with their decoded text and registry entry, applies the matching pattern per language in process, and returns folded text keyed by original absolute path.
  - [ ] Throw a distinct error for a pattern that fails to compile, a rewrite the binding rejects, and folded output that is empty or fails UTF-8 validation.
- [ ] Integrate folding and byte accounting into collectPreload
  - [ ] Thread `mode` through the selected-file pass so full-mode files keep the current behavior (`fileTypeFromBuffer` image support for explicit binaries, fatal UTF-8 decode, `===== BEGIN FILE ... =====` wrapper) and signature-mode files throw a distinct error for a binary match and for an extension the registry does not support, otherwise pass through the fold engine and emit one `TextContent` block each using the same wrapper and the existing dirname-then-path sort.
  - [ ] Apply `MAX_FILE_BYTES` to each original input file, `MAX_FILES` to the unique selected files, and `MAX_TOTAL_BYTES` plus the per-block `MAX_FILE_BYTES` limit to emitted blocks after folding, tracking original bytes separately from emitted bytes.
  - [ ] Extend the `collectPreload()` result with emitted context bytes and original source bytes, write `PRELOAD.md` from the emitted blocks, and update the `session_start` notification to report both, for example `Context preloaded: 58 files — 91 KB context from 2.4 MB source`.
- [ ] Test, document, and validate
  - [ ] Extend `pi-preload/test/unit.test.ts` with cases for schema acceptance and rejection of `signatures`, the preset absolute-pattern rule applied to signature patterns, preset and `extends` merge order for signatures, and full-mode-wins precedence in the candidate map.
  - [ ] Extend `pi-preload/test/e2e.test.ts` with JavaScript, TypeScript, Python, Rust, and Go fixtures asserting that declarations survive while implementation-only strings disappear, that arrows, methods, and constructors fold, that nested callables fold once at the outermost body, and that braces inside strings and comments stay unchanged.
  - [ ] Extend `pi-preload/test/e2e.test.ts` with cases asserting that project files on disk are unmodified, that an unsupported language errors, that `includes` overrides `signatures` for the same path, and that total limits are computed from folded bytes.
  - [ ] Update `pi-preload/skills/pi-preload-authoring/SKILL.md` so the documented schema, merge semantics, and examples include the `signatures` key and its full-mode precedence rule.
  - [ ] Run `npm run check` in `pi-preload` and resolve every typecheck, Biome, unit, and e2e failure.
