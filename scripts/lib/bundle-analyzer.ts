/**
 * Bundle size analyzer — installs a package into a temp directory,
 * runs a Vite build, and measures the resulting output size.
 */

import { mkdtempSync, writeFileSync, rmSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

interface BundleSizeResult {
  rawBytes: number
  gzipBytes: number
  rawKb: string
  gzipKb: string
}

/**
 * Measure the bundle size of an npm package by building a minimal
 * Vite project that imports its main export.
 *
 * Skips packages with no npm presence (e.g. shadcn-ui).
 */
export async function measureBundleSize(npmPackage: string): Promise<BundleSizeResult | null> {
  if (!npmPackage) return null

  const tmp = mkdtempSync(join(tmpdir(), 'rig-bundle-'))

  try {
    // Create a minimal package.json
    writeFileSync(
      join(tmp, 'package.json'),
      JSON.stringify({
        name: 'bundle-test',
        private: true,
        type: 'module',
        dependencies: { [npmPackage]: 'latest' },
        devDependencies: { vite: 'latest' },
      }),
    )

    // Entry file that imports the package
    writeFileSync(join(tmp, 'index.js'), `export * from '${npmPackage}'\n`)

    // Vite config for lib build
    writeFileSync(
      join(tmp, 'vite.config.js'),
      `
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    lib: {
      entry: './index.js',
      formats: ['es'],
      fileName: 'out',
    },
    outDir: 'dist',
    minify: 'esbuild',
    reportCompressedSize: false,
  },
})
`,
    )

    // Install + build
    console.log(`    [bundle] installing ${npmPackage}...`)
    execSync('pnpm install --no-frozen-lockfile', { cwd: tmp, stdio: 'pipe', timeout: 60_000 })

    console.log(`    [bundle] building...`)
    execSync('npx vite build', { cwd: tmp, stdio: 'pipe', timeout: 60_000 })

    // Measure output
    const distDir = join(tmp, 'dist')
    const files = readdirSync(distDir).filter((f) => f.endsWith('.js') || f.endsWith('.mjs'))
    let totalBytes = 0
    for (const file of files) {
      totalBytes += statSync(join(distDir, file)).size
    }

    // Gzip estimate via node:zlib
    const { gzipSync } = await import('node:zlib')
    const { readFileSync } = await import('node:fs')
    let gzipBytes = 0
    for (const file of files) {
      const content = readFileSync(join(distDir, file))
      gzipBytes += gzipSync(content).byteLength
    }

    return {
      rawBytes: totalBytes,
      gzipBytes,
      rawKb: (totalBytes / 1024).toFixed(1),
      gzipKb: (gzipBytes / 1024).toFixed(1),
    }
  } catch (e) {
    console.warn(`    [bundle] failed for ${npmPackage}:`, (e as Error).message)
    return null
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}
