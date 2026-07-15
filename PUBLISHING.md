# Publishing

Releases are triggered by pushing a `v*` tag. The `Release` workflow gates on
lint → typecheck → tests → builds → check-exports → clean-tree, then publishes
`rig`, `hex`, and `rig-nuxt` to npm.

Authentication is **trusted publishing (OIDC)** — there is no npm token
anywhere: no `NPM_TOKEN` secret, no `NODE_AUTH_TOKEN`, nothing to rotate or
expire. Each run mints a short-lived credential scoped to this workflow.

## One-time setup on npmjs.com

Required **once per package**, for all three. Until this exists, every publish
fails with an opaque `E404`.

For each of `@amulet-laboratories/rig`, `@amulet-laboratories/hex`,
`@amulet-laboratories/rig-nuxt`:

1. npmjs.com → the package → **Settings** → **Trusted Publisher** → GitHub Actions
2. Fill in **exactly**:

   | Field                | Value                 |
   | -------------------- | --------------------- |
   | Organization or user | `Amulet-Laboratories` |
   | Repository           | `Rig`                 |
   | Workflow filename    | `release.yml`         |
   | Environment          | _(leave blank)_       |

3. Save.

> **The workflow filename field is filename-only.** `.github/workflows/release.yml`
> is wrong and is a common cause of the E404. So is naming a mirror repo, or
> filling in an Environment the workflow doesn't declare.

## Releasing

```bash
# versions live in package.json / hex/package.json / nuxt/package.json
git tag v0.6.0 && git push origin v0.6.0
```

Publishes are idempotent — a version already on npm is skipped, so re-running a
tag that partially published is safe:

```bash
gh run rerun <run-id> --repo Amulet-Laboratories/Rig
```

## Why `pnpm pack` + `npm publish <tarball>`

Neither tool can do this alone:

- **pnpm** rewrites `workspace:*` deps to real versions when packing. npm does
  not — `npm pack` ships a literal `"@amulet-laboratories/rig": "workspace:*"`,
  which is an invalid spec in a published manifest.
- **npm** has trusted publishing. pnpm 10.x has **no OIDC code whatsoever**
  (there is no `ACTIONS_ID_TOKEN_REQUEST` or `NPM_ID_TOKEN` anywhere in it), so
  `id-token: write` alone does nothing for `pnpm publish`.

Packing with pnpm and uploading the tarball with npm gets both properties. It
also skips re-running `prepublishOnly`, which otherwise rebuilds the library a
second time after the Build step.

The workflow upgrades npm (`npm install -g npm@latest`) because trusted
publishing needs **npm >= 11.5.1**, and Node 22.23.1 bundles npm 10.9.8 — which
has no OIDC support and fails as the same opaque E404.

## Every package MUST declare `repository`

Trusted publishing signs a sigstore provenance statement automatically, and npm
**rejects the upload** unless `package.json`'s `repository.url` matches the repo
the provenance was built from. A package with no `repository` field fails with:

```
E422 Unprocessable Entity — Error verifying sigstore provenance bundle:
Failed to validate repository information: package.json: "repository.url" is "",
expected to match "https://github.com/Amulet-Laboratories/Rig" from provenance
```

This is exactly how the first OIDC release half-landed: `rig` and `hex` declared
`repository` and published; `rig-nuxt` did not and was rejected _after_
authenticating successfully. Any new publishable package needs:

```jsonc
"repository": {
  "type": "git",
  "url": "https://github.com/Amulet-Laboratories/rig",
  "directory": "hex"   // workspace path; omit for the root package
}
```

Tokens never required this — provenance is what makes it mandatory. It is also
what you gain: every release now carries a SLSA attestation proving it was built
from this repo by this workflow (`npm view <pkg> dist.attestations`).

## Debugging a failed publish

The status code tells you which half broke:

| Code            | Meaning                                                                      | Look at                                        |
| --------------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| `E404` on `PUT` | **Auth** — npm reports a bad OIDC chain as "not found", not as an auth error | Trusted Publisher config (below)               |
| `E422`          | **Auth worked**, the payload was rejected                                    | Usually `repository.url` vs provenance (above) |

For `E404`, check in order:

1. Does the package have a Trusted Publisher configured at all?
2. Is the workflow filename `release.yml` (not a path)?
3. Do org/repo match this repository exactly?
4. Is `id-token: write` still in the job's `permissions`?
5. Did `npm --version` print >= 11.5.1? (the workflow asserts this)
6. Is the tag pointing at a commit that actually **contains** this workflow?
   Actions runs the workflow from the triggering ref — re-running an old tag
   replays the old workflow, however current `main` is.

## Moving to pnpm 11 later

pnpm >= 11.1.3 can do OIDC natively, which would collapse pack+publish back into
a single `pnpm publish`. It is a real migration, not a version bump: pnpm 11
stops reading `pnpm.overrides` and `pnpm.auditConfig` from `package.json`, and
this repo relies on both (see commits `20eef48`, `c5eda39`). Do it deliberately.
