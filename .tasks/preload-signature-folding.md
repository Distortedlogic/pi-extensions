# Goal

Add a `signatures` key to the `pi-preload` configuration section in `pi-preload/agents.ts` and support it across `pi-preload/src/index.ts`, so paths matched by `includes` preload full file content as today, paths matched by `signatures` preload the same source structure with callable bodies folded by a bundled GritQL pattern pack, `includes` wins whenever both keys select one path, byte accounting separates original source bytes from emitted context bytes, and every unsupported language or fold failure raises a distinct error instead of falling back to full content.

## Work units

- [ ] Add and merge the signatures configuration key
  - [ ] In `pi-preload/agents.ts`, add `signatures: Type.Optional(STRING_LIST_SCHEMA)` to `configurationSchema` and keep `additionalProperties: false` so unknown keys still fail validation.
  - [ ] In `pi-preload/src/index.ts`, add `signatures: string[]` to the `PreloadConfiguration` and `ProjectScope` types.
  - [ ] In `loadPresetConfiguration()`, read `config.signatures ?? []`, include signature patterns in the existing absolute-pattern check next to `includes` and `excludes`, and merge inherited preset signatures before own signatures.
  - [ ] In `loadConfiguration()`, read `config.signatures ?? []` and put `[...presets.flatMap((preset) => preset.signatures), ...ownSignatures]` on each returned `ProjectScope`, in the same order used for `includes`.
- [ ] Resolve full and signature selections into one candidate map
  - [ ] Add `type SelectionMode = "full" | "signatures"` and, in `collectPreload()`, run a second `globby` call per scope over `scope.signatures` with the same options as the `includes` call: `cwd: scope.projectRoot`, `gitignore: sessionScope`, `ignoreFiles` for non-session scopes, `ignore` of `AGENTS.yml`, `PRELOAD_FILE`, `TREE_FILE`, `LOCK_FILE_GLOBS` and `scope.excludes`, `onlyFiles`, `followSymbolicLinks: false`, `unique`, `objectMode`, `stats`.
  - [ ] Build the `candidates` map keyed by resolved absolute path with an added `mode` field, inserting signature matches first and full matches second so an overlapping path resolves to `"full"` without raising an error.
  - [ ] Keep `explicitFilePaths` derived only from non-dynamic `includes` patterns so a signature pattern never enables the explicit-binary image path.
- [ ] Add the language registry and the GritQL fold pattern pack
  - [ ] Add a registry module that maps file extensions to `{ language, patternFile }` entries for `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.py`, `.rs`, and `.go`, and returns `undefined` for every other extension.
  - [ ] Create `pi-preload/grit/fold-javascript.grit`, `fold-python.grit`, `fold-rust.grit`, and `fold-go.grit`, where each pattern matches only outermost callable nodes and rewrites only the body node to a language-appropriate marker (`{ /* … */ }` or `...`).
  - [ ] Keep modifiers, generics, parameters, return types, decorators, and attributes unchanged in every pattern, and leave braces inside strings and comments untouched.
- [ ] Implement the fold engine module
  - [ ] Add `pi-preload/src/fold.ts` exporting a function that takes the session cwd, an `AbortSignal`, and the signature-mode file list, copies each file into an `mkdtemp` workspace with its relative path and extension preserved, and removes the workspace in a `finally` block so project files are never modified.
  - [ ] Group the copied files by registry language and run the pinned Grit CLI once per language group with `grit apply <patternFile>` inside the workspace, passing the `AbortSignal` and treating a non-zero exit as a failure.
  - [ ] Read back each rewritten workspace file, validate that it exists and decodes as UTF-8, and return the folded text keyed by original absolute path.
  - [ ] Resolve the Grit executable from the `@getgrit/cli` install relative to the extension package and throw a direct setup error when the executable is missing or cannot run.
- [ ] Integrate folding, accounting, and failure semantics into collectPreload
  - [ ] Thread `mode` through the selected-file pass so full-mode files keep the current behavior (`fileTypeFromBuffer` image support for explicit binaries, fatal UTF-8 decode, `===== BEGIN FILE ... =====` wrapper) and signature-mode files reject binaries, pass through the fold engine, and emit one `TextContent` block each using the same wrapper and the existing dirname-then-path sort.
  - [ ] Rework byte accounting so `MAX_FILE_BYTES` guards each original input file, `MAX_FILES` counts unique files across both keys, and `MAX_TOTAL_BYTES` plus the per-block `MAX_FILE_BYTES` limit apply to emitted blocks after folding, tracking original bytes separately from emitted bytes.
  - [ ] Extend the `collectPreload()` result with emitted context bytes and original source bytes, write `PRELOAD.md` from the emitted blocks, and update the `session_start` notification to report both, for example `Context preloaded: 58 files — 91 KB context from 2.4 MB source`.
  - [ ] Raise a distinct descriptive error for an unsupported extension, a Grit parse failure, a non-zero Grit exit, a missing transformed output, and a binary signature match, and never fall back to full file content on any signature-mode failure.
- [ ] Package, test, document, and validate
  - [ ] Update `pi-preload/package.json` so `files` includes `grit`, add `@getgrit/cli` pinned to `0.1.0-alpha.1743007075` in `dependencies`, and refresh `package-lock.json`.
  - [ ] Extend `pi-preload/test/unit.test.ts` with cases for schema acceptance and rejection of `signatures`, the preset absolute-pattern rule applied to signature patterns, `extends` and preset merge order for signatures, and full-mode-wins precedence in the candidate map.
  - [ ] Extend `pi-preload/test/e2e.test.ts` with JavaScript, TypeScript, Python, Rust, and Go fixtures asserting that declarations survive while implementation-only strings disappear, arrows, methods, and constructors fold, nested callables fold once at the outermost body, braces inside strings and comments stay unchanged, project files on disk are unmodified, unsupported languages error, `includes` overrides `signatures` for the same path, and total limits are computed from folded bytes.
  - [ ] Update `pi-preload/skills/pi-preload-authoring/SKILL.md` so the documented schema, merge semantics, and examples include the `signatures` key and its full-mode precedence rule.
  - [ ] Run `npm run check` in `pi-preload` and resolve every typecheck, Biome, unit, and e2e failure.
