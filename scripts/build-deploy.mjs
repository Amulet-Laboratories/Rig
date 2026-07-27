#!/usr/bin/env node

/**
 * build-deploy.mjs — Assemble the deploy directory for Netlify.
 *
 * Structure:
 *   deploy/
 *     hexrig/
 *       index.html + assets/  ← Vue landing site (AmuletLabs.org/hexrig)
 *       story/                ← Histoire static build (AmuletLabs.org/hexrig/story)
 *       demos/                ← Vue demos gallery (AmuletLabs.org/hexrig/demos)
 *
 * Prerequisite: run `cd landing && pnpm build`, `cd demos && pnpm build`, and
 * `pnpm story:build` first.
 */

import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DEPLOY = resolve(ROOT, 'deploy')
const LANDING_DIST = resolve(ROOT, 'landing/dist')
const DEMOS_DIST = resolve(ROOT, 'demos/dist')
const HISTOIRE = resolve(ROOT, '.histoire/dist')

// Clean
if (existsSync(DEPLOY)) rmSync(DEPLOY, { recursive: true })
mkdirSync(DEPLOY, { recursive: true })

// Copy landing site build into hexrig/
if (existsSync(LANDING_DIST)) {
  console.log('Copying landing site build...')
  mkdirSync(resolve(DEPLOY, 'hexrig'), { recursive: true })
  cpSync(LANDING_DIST, resolve(DEPLOY, 'hexrig'), { recursive: true })
} else {
  console.error('ERROR: landing/dist not found — run `cd landing && pnpm build` first')
  process.exit(1)
}

// Copy demos gallery build into hexrig/demos/
if (existsSync(DEMOS_DIST)) {
  console.log('Copying demos gallery build...')
  mkdirSync(resolve(DEPLOY, 'hexrig', 'demos'), { recursive: true })
  cpSync(DEMOS_DIST, resolve(DEPLOY, 'hexrig', 'demos'), { recursive: true })
} else {
  console.warn('Warning: demos/dist not found — skipping (run `cd demos && pnpm build`)')
}

// Copy Histoire build into hexrig/story/
if (existsSync(HISTOIRE)) {
  console.log('Copying Histoire build...')
  mkdirSync(resolve(DEPLOY, 'hexrig', 'story'), { recursive: true })
  cpSync(HISTOIRE, resolve(DEPLOY, 'hexrig', 'story'), { recursive: true })
} else {
  console.warn('Warning: Histoire build not found at .histoire/dist/ — skipping')
}

console.log('Deploy directory ready.')
