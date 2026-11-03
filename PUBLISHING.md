# Publishing a Release

Releases are **manual** — there is no CI workflow that publishes to npm or
creates GitHub Releases automatically. `.github/workflows/ci.yml` only lints,
type-checks, builds, and tests on pull requests.

## Prerequisites

* You're on `main`, up to date with `origin/main`, with a clean working tree.
* `package.json`'s `"version"` is already set to the version you intend to release.
* You're logged in to npm with publish access: `npm login`

## Steps

1. **Verify quality gates pass:**
   ```bash
   npm run lint
   npm test
   ```

2. **Tag the release commit** (do this *before* publishing, so the tag always
   matches exactly what gets published):
   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

3. **Generate type declarations** (required — `types/` is gitignored and not
   checked in, but `package.json`'s `types`/`exports.types` fields point to
   `types/*.d.ts`):
   ```bash
   npm run build:types
   ```
   No other build step is needed: `main`/`module`/`exports` point straight at
   `src/` (no bundling), and `dist/` (from `npm run build`) is excluded by
   `.npmignore` anyway.

4. **Publish to npm:**
   ```bash
   npm publish
   ```

5. **Create the matching GitHub Release:**
   ```bash
   gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
   ```

6. **Bump to the next in-development version** so the working tree no longer
   matches a published tag:
   * Edit `"version"` in `package.json` to the next planned version (e.g. `X.Y.(Z+1)`).
   * Commit and push:
     ```bash
     git add package.json
     git commit -m "start X.Y.(Z+1) development"
     git push
     ```

## Notes

* npm versions and git tags have drifted before (e.g. `13.2.6`/`13.2.7` were
  published to npm but never tagged in git) — always double check
  `npm view gameinputjs version` against `git tag` before starting a new
  release to catch any mismatch.
