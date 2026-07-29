#!/usr/bin/env node
/**
 * `rig` — the command line entry point for @amulet-laboratories/rig.
 *
 * Subcommands are separate modules so the CLI stays cheap to start: only the
 * one being run is imported.
 */
const COMMANDS = {
  'build-theme': {
    describe: "compile a site's design-system bundle to public/theme.css",
    load: () => import('./build-theme.mjs'),
  },
}

const [command, ...rest] = process.argv.slice(2)

if (!command || command === '--help' || command === '-h') {
  console.log('Usage: rig <command> [options]\n\nCommands:')
  for (const [name, { describe }] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(14)} ${describe}`)
  }
  console.log('\nRun `rig <command> --help` for command options.')
  process.exit(command ? 0 : 1)
}

const entry = COMMANDS[command]
if (!entry) {
  console.error(`rig: unknown command "${command}"`)
  console.error(`Known commands: ${Object.keys(COMMANDS).join(', ')}`)
  process.exit(1)
}

// Subcommand modules read process.argv themselves; drop the command word so
// they see only their own flags.
process.argv = [process.argv[0], process.argv[1], ...rest]
await entry.load()
