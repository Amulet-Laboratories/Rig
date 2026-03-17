import { inject, provide, computed, type InjectionKey, type Ref } from 'vue'

/**
 * Global configuration for all Rig components in a subtree.
 *
 * Provides:
 * - `dir` — text direction ('ltr' | 'rtl')
 * - `locale` — BCP 47 locale string (e.g. 'en-US', 'ar-SA')
 * - `defaults` — default prop values keyed by component name
 *
 * Components read from the nearest ancestor ConfigProvider via `useConfig()`.
 * Multiple ConfigProviders can nest — inner values override outer ones.
 */

export interface RigConfig {
  /** Text direction */
  dir: 'ltr' | 'rtl'
  /** BCP 47 locale string */
  locale: string
  /** Default prop values per component (e.g. { Button: { variant: 'primary' } }) */
  defaults: Record<string, Record<string, unknown>>
}

export const RigConfigKey: InjectionKey<Ref<RigConfig>> = Symbol('rig-config')

const DEFAULT_CONFIG: RigConfig = {
  dir: 'ltr',
  locale: 'en-US',
  defaults: {},
}

/**
 * Provide Rig configuration to all descendant components.
 *
 * @param config — partial config; unset values inherit from parent or use defaults
 */
export function provideConfig(config: Partial<RigConfig>) {
  const parent = inject(RigConfigKey, undefined)

  const merged = computed<RigConfig>(() => {
    const parentVal = parent?.value ?? DEFAULT_CONFIG
    return {
      dir: config.dir ?? parentVal.dir,
      locale: config.locale ?? parentVal.locale,
      defaults: {
        ...parentVal.defaults,
        ...config.defaults,
      },
    }
  })

  provide(RigConfigKey, merged)
  return merged
}

/**
 * Read the nearest Rig configuration.
 *
 * Safe to call without a ConfigProvider ancestor — returns sensible defaults.
 */
export function useConfig(): Ref<RigConfig> {
  return inject(
    RigConfigKey,
    computed(() => DEFAULT_CONFIG),
  )
}

/**
 * Read default prop values for a specific component.
 *
 * @param componentName — PascalCase component name (e.g. 'Button')
 */
export function useComponentDefaults<T extends Record<string, unknown>>(
  componentName: string,
): Ref<Partial<T>> {
  const config = useConfig()
  return computed(() => (config.value.defaults[componentName] ?? {}) as Partial<T>)
}
