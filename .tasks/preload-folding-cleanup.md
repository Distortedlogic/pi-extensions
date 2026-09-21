# Goal

Replace the hand-rolled per-language signature folding in pi-preload with GritQL queries through the existing @getgrit/gritql dependency, remove the redundant isbinaryfile package in favor of file-type, validate with the existing test suite, and publish the updated extension.

## Work units

- [ ] Remove the redundant isbinaryfile dependency
  - [ ] Replace the isbinaryfile check with file-type based detection in the explicit binary-file selection guard
  - [ ] Delete isbinaryfile from pi-preload/package.json and refresh the lockfile
- [ ] Replace the per-language folding lexers with GritQL queries
  - [ ] Write GritQL patterns that match callable declarations and bodies for JavaScript, TypeScript, Python, Rust, and Go
  - [ ] Rewire signature-mode file processing to the GritQL matches and delete the per-language lexer code, preserving the existing fold-marker output format
- [ ] Validate and publish pi-preload
  - [ ] Update the existing folding and binary-detection tests where internals changed
  - [ ] Run npm run check plus the clean production install and offline extension-load checks
  - [ ] Commit, push to the remote repository, and run pi update for pi-preload
