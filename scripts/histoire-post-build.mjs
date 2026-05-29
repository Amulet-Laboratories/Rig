/**
 * Post-build script for Histoire.
 * Injects a client-side redirect so `/` auto-selects the Introduction story
 * instead of showing the generic home screen.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const INDEX = resolve(import.meta.dirname, '..', '.histoire', 'dist', 'index.html')

const REDIRECT_SCRIPT =
  '<script>if(location.pathname==="/")location.replace("/story/stories-introduction-story-vue")</script>'

const html = readFileSync(INDEX, 'utf-8')
writeFileSync(INDEX, html.replace('</head>', `${REDIRECT_SCRIPT}\n</head>`))

console.log('  Injected auto-select redirect into .histoire/dist/index.html')
