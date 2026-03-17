#!/usr/bin/env node

/**
 * build-deploy.mjs — Assemble the deploy directory for Netlify.
 *
 * Structure:
 *   deploy/
 *     index.html          ← landing page
 *     histoire/            ← Histoire static build
 *
 * Prerequisite: run `pnpm story:build` first (outputs to .histoire/dist/).
 */

import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const DEPLOY = resolve(ROOT, 'deploy')
const LANDING = resolve(ROOT, 'landing')
const HISTOIRE = resolve(ROOT, '.histoire/dist')

// Clean
if (existsSync(DEPLOY)) rmSync(DEPLOY, { recursive: true })
mkdirSync(DEPLOY, { recursive: true })

// Copy landing page
console.log('Copying landing page...')
cpSync(LANDING, DEPLOY, { recursive: true })

// Copy Histoire build
if (existsSync(HISTOIRE)) {
  console.log('Copying Histoire build...')
  mkdirSync(resolve(DEPLOY, 'histoire'), { recursive: true })
  cpSync(HISTOIRE, resolve(DEPLOY, 'histoire'), { recursive: true })
} else {
  console.warn('Warning: Histoire build not found at .histoire/dist/ — skipping')
}

console.log('Deploy directory ready.')
