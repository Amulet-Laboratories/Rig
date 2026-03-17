#!/usr/bin/env node

/**
 * build-deploy.mjs — Assemble the deploy directory for Netlify.
 *
 * Structure:
 *   deploy/
 *     index.html + assets/  ← Vue landing site (built from landing/)
 *     histoire/              ← Histoire static build
 *
 * Prerequisite: run `cd landing && pnpm build` and `pnpm story:build` first.
 */

import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DEPLOY = resolve(ROOT, 'deploy')
const LANDING_DIST = resolve(ROOT, 'landing/dist')
const HISTOIRE = resolve(ROOT, '.histoire/dist')

// Clean
if (existsSync(DEPLOY)) rmSync(DEPLOY, { recursive: true })
mkdirSync(DEPLOY, { recursive: true })

// Copy landing site build
if (existsSync(LANDING_DIST)) {
  console.log('Copying landing site build...')
  cpSync(LANDING_DIST, DEPLOY, { recursive: true })
} else {
  console.error('ERROR: landing/dist not found — run `cd landing && pnpm build` first')
  process.exit(1)
}

// Copy Histoire build
if (existsSync(HISTOIRE)) {
  console.log('Copying Histoire build...')
  mkdirSync(resolve(DEPLOY, 'histoire'), { recursive: true })
  cpSync(HISTOIRE, resolve(DEPLOY, 'histoire'), { recursive: true })
} else {
  console.warn('Warning: Histoire build not found at .histoire/dist/ — skipping')
}

console.log('Deploy directory ready.')
