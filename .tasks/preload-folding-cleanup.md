# Goal

Replace the hand-rolled per-language signature folding in pi-preload with the GritQL engine that is already a dependency, remove the redundant isbinaryfile package in favor of file-type, verify the changes with the existing test suite, and publish the updated extension.

## Work units

- [ ] Verify the current pi-preload implementation
  - [ ] Read pi-preload/src and map the signature-folding code path for each supported language (JavaScript, TypeScript, Python, Rust, Go)
  - [ ] Locate every isbinaryfile usage and confirm file-type covers the same binary detection decisions
  - [ ] Record the observable behaviors the existing unit and e2e tests pin (fold markers, brace handling in strings and comments, byte limits, media order)
- [ ] Remove the redundant isbinaryfile dependency
  - [ ] Replace the isbinaryfile check with file-type based detection in the selected-binary-file guard
  - [ ] Delete isbinaryfile from pi-preload/package.json and refresh the lockfile
  - [ ] Run the binary and media selection tests to confirm identical behavior
- [ ] Replace the per-language folding lexers with GritQL queries
  - [ ] Write GritQL patterns that match callable declarations and bodies for the five supported languages through @getgrit/gritql
  - [ ] Rewire signature-mode file processing to the GritQL matches and delete the per-language lexers
  - [ ] Keep full-file include mode unchanged and preserve the fold-marker output format the tests expect
- [ ] Validate and publish pi-preload
  - [ ] Update existing tests only where the engine swap changed internals and keep the current coverage level
  - [ ] Run npm run check plus the clean production install and offline extension-load checks
  - [ ] Commit, push to the remote repository, and run pi update for pi-preload
