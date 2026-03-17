<script setup lang="ts">
import { provideConfig, type RigConfig } from '../composables/useConfigProvider'

const props = withDefaults(
  defineProps<{
    /** Text direction — 'ltr' or 'rtl' */
    dir?: 'ltr' | 'rtl'
    /** BCP 47 locale string (e.g. 'en-US', 'ar-SA') */
    locale?: string
    /** Default prop values per component (e.g. { Button: { variant: 'primary' } }) */
    defaults?: Record<string, Record<string, unknown>>
  }>(),
  {
    dir: undefined,
    locale: undefined,
    defaults: undefined,
  },
)

defineSlots<{
  default(props: Record<string, never>): unknown
}>()

const config: Partial<RigConfig> = {}
if (props.dir) config.dir = props.dir
if (props.locale) config.locale = props.locale
if (props.defaults) config.defaults = props.defaults

provideConfig(config)
</script>

<template>
  <slot />
</template>
