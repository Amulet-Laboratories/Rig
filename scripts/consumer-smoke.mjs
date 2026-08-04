#!/usr/bin/env node
/**
 * Consumer smoke test — install Rig the way a stranger would, and use it.
 *
 * `demos/`, `landing/`, `stories/` and `e2e/` all exercise Rig from *inside*
 * this repo, where every dependency is already present and every stylesheet is
 * already wired. That is precisely why none of them caught any of this:
 *
 *   · A fresh install 500'd on the first page render, because `d3` — declared
 *     an *optional* peer — was statically imported through the root barrel.
 *   · Component structure lives in `rig/styles`, which the README's install
 *     section never mentioned, so nav and breadcrumbs rendered as `display:
 *     block` runs of inline text.
 *   · `cobalt`, the first theme the README names, ships no rules at all for
 *     SiteNav or SiteFooter.
 *
 * Rig is public on npm. Every outside user met all three on their first
 * afternoon, and nobody inside the estate could see any of it, because
 * QuizSort happens to declare d3, dompurify and markdown-it itself.
 *
 * This packs the real tarball, installs it into a throwaway app, renders one
 * page with the components a new user reaches for first, and fails on:
 *   1. any error during install, build or render
 *   2. a missing peer that the README does not tell you to install
 *   3. structural CSS that never arrives
 *
 * Usage:  node scripts/consumer-smoke.mjs [--keep]
 */

import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const REPO = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const KEEP = process.argv.includes('--keep')

const run = (cmd, args, cwd, env = {}) => {
  try {
    return execFileSync(cmd, args, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, ...env },
      maxBuffer: 64 * 1024 * 1024,
    })
  } catch (err) {
    // A missing peer surfaces here as a resolve error during the consumer's
    // build, long before anything renders. Report it as the diagnosis rather
    // than as a stack trace from a temp directory.
    const output = `${err.stdout ?? ''}${err.stderr ?? ''}${err.message ?? ''}`
    // Vite rewrites an unmet optional peer to a stub whose name carries the
    // package, so the failure reads "X is not exported by
    // __vite-optional-peer-dep:<pkg>:..." rather than "cannot find <pkg>".
    // Matching only the obvious phrasings missed the exact defect this exists for.
    const missing =
      output.match(/__vite-optional-peer-dep:([^:]+):/)?.slice(1) ??
      output
        .match(
          /(?:Cannot find package|Failed to resolve (?:import|module)|Rollup failed to resolve import) ["']?([^"'\s]+)/,
        )
        ?.slice(1)
    if (missing) throw new SmokeFailure(missingPeerMessage(missing[0]))
    throw new SmokeFailure(`\`${cmd} ${args.join(' ')}\` failed:\n${output.slice(-4000)}`)
  }
}

class SmokeFailure extends Error {}

const missingPeerMessage = (pkg) =>
  `a consumer following the README cannot build: "${pkg}" could not be resolved.\n` +
  `  It is not among the peers the README's install section tells them to add.\n` +
  `  Either keep it out of the root barrel (see @spatial), make the import\n` +
  `  genuinely lazy, or promote it to a real dependency — but "optional" has to\n` +
  `  mean optional.`

const fail = (msg) => {
  console.error(`\n✗ ${msg}`)
  process.exitCode = 1
}

console.log('› packing the real tarball')
const packOut = run('npm', ['pack', '--json', '--silent'], REPO)
const tarball = join(REPO, JSON.parse(packOut)[0].filename)

const dir = mkdtempSync(join(tmpdir(), 'rig-consumer-'))
console.log(`› consumer app at ${dir}`)
mkdirSync(join(dir, 'pages'), { recursive: true })

// Exactly the peers the README's install section tells you to add — no more.
// If Rig needs something else, that is the bug this test exists to catch.
writeFileSync(
  join(dir, 'package.json'),
  JSON.stringify(
    {
      name: 'rig-consumer-smoke',
      private: true,
      type: 'module',
      dependencies: {
        '@amulet-laboratories/rig': `file:${tarball}`,
        '@floating-ui/vue': '^1.0.0',
        nuxt: '^3.21.0',
        vue: '^3.5.0',
      },
    },
    null,
    2,
  ),
)

writeFileSync(
  join(dir, 'pnpm-workspace.yaml'),
  'ignoredBuiltDependencies:\n  - esbuild\n  - vue-demi\n',
)
writeFileSync(
  join(dir, 'nuxt.config.ts'),
  `export default defineNuxtConfig({ compatibilityDate: '2025-01-01' })\n`,
)

// The documented styling path: structure, then a theme.
writeFileSync(
  join(dir, 'app.vue'),
  `<script setup lang="ts">
import '@amulet-laboratories/rig/styles'
import '@amulet-laboratories/rig/hex/cobalt'
</script>
<template><NuxtPage /></template>
`,
)

// The components a new user reaches for first: page chrome and a button.
writeFileSync(
  join(dir, 'pages/index.vue'),
  `<script setup lang="ts">
import { SiteNav, SiteFooter, Breadcrumbs, Button } from '@amulet-laboratories/rig'
const links = [{ id: 'home', label: 'Home', href: '/' }, { id: 'docs', label: 'Docs', href: '/docs' }]
</script>
<template>
  <div>
    <SiteNav :links="links" brand="Smoke" />
    <main>
      <Breadcrumbs :items="[{ id: '/', label: 'Home', href: '/' }, { id: 'x', label: 'Here' }]" />
      <Button>A button</Button>
    </main>
    <SiteFooter :columns="1" />
  </div>
</template>
`,
)

try {
  console.log('› installing (only the peers the README names)')
  run('pnpm', ['install', '--no-frozen-lockfile', '--ignore-scripts'], dir)

  console.log('› building')
  run('node', [join(dir, 'node_modules/nuxt/bin/nuxt.mjs'), 'build'], dir)

  console.log('› rendering')
  // `nuxt build` alone would miss a missing peer that only resolves at request
  // time, which is exactly how the d3 defect behaved.
  const server = join(dir, '.output/server/index.mjs')
  const { spawn } = await import('node:child_process')
  const proc = spawn('node', [server], {
    cwd: dir,
    env: { ...process.env, PORT: '3399' },
    stdio: 'pipe',
  })
  let stderr = ''
  proc.stderr.on('data', (d) => (stderr += d))

  let html = ''
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500))
    try {
      const res = await fetch('http://localhost:3399/')
      html = await res.text()
      if (res.status !== 200)
        fail(`the first page render returned HTTP ${res.status}\n${html.slice(0, 400)}`)
      break
    } catch {
      /* not up yet */
    }
  }
  proc.kill()

  if (!html) fail('the consumer app never served a page')

  if (/Cannot find package/.test(html) || /Cannot find package/.test(stderr)) {
    const m = (html + stderr).match(/Cannot find package '([^']+)'/)
    fail(
      `a missing package broke the first render: ${m?.[1] ?? 'unknown'}\n` +
        `  It is not in the peers the README tells a consumer to install.\n` +
        `  Either make the import genuinely lazy, keep it out of the root barrel,\n` +
        `  or promote it to a real dependency.`,
    )
  }

  // Structure must actually arrive. Checking the CSS the app was served rather
  // than the DOM keeps this dependency-free — no browser needed in CI.
  const cssDir = join(dir, '.output/public/_nuxt')
  const css = readdirSync(cssDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(cssDir, f), 'utf8'))
    .join('\n')

  for (const sel of ['data-rig-site-nav', 'data-rig-site-footer', 'data-rig-breadcrumbs']) {
    if (!css.includes(sel)) {
      fail(
        `no CSS reached the consumer for [${sel}].\n` +
          `  The documented install path must produce styled components, or say plainly that it does not.`,
      )
    }
  }

  if (!process.exitCode)
    console.log('\n✓ a stranger can install Rig, build with it, and see it styled')
} catch (err) {
  if (err instanceof SmokeFailure) fail(err.message)
  else throw err
} finally {
  rmSync(tarball, { force: true })
  if (KEEP) console.log(`\n(kept ${dir})`)
  else rmSync(dir, { recursive: true, force: true })
}
