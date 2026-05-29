import { inject, provide, shallowReactive } from 'vue'
import type { ID } from '../types'
import { CommandRegistryKey, type Command, type CommandRegistry } from '../injection-keys'

function createCommandRegistry(): CommandRegistry {
  const commands = shallowReactive(new Map<ID, Command>())

  function register(cmd: Command) {
    commands.set(cmd.id, cmd)
  }

  function unregister(id: ID) {
    commands.delete(id)
  }

  function execute(id: ID) {
    const cmd = commands.get(id)
    if (cmd?.handler && !cmd.disabled) {
      cmd.handler()
    }
  }

  function list(): Command[] {
    return Array.from(commands.values())
  }

  function search(query: string): Command[] {
    if (!query) return list()
    const lower = query.toLowerCase()
    return list().filter((cmd) => {
      const haystack = `${cmd.label} ${cmd.category ?? ''}`.toLowerCase()
      return fuzzyMatch(lower, haystack)
    })
  }

  return { register, unregister, execute, list, search }
}

function fuzzyMatch(query: string, target: string): boolean {
  let qi = 0
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) qi++
  }
  return qi === query.length
}

/**
 * Access the command registry.
 *
 * When called with `{ provide: true }`, creates and provides the registry.
 * Otherwise injects the existing registry, falling back to a standalone instance.
 */
export function useCommandRegistry(options?: { provide?: boolean }): CommandRegistry {
  if (options?.provide) {
    const registry = createCommandRegistry()
    provide(CommandRegistryKey, registry)
    return registry
  }

  const injected = inject(CommandRegistryKey, null)
  if (injected) return injected

  return createCommandRegistry()
}
