<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Primary address line */
    address?: string
    /** Secondary description line (neighborhood, cross streets, etc.) */
    description?: string
    /** Aspect ratio CSS class (e.g. 'aspect-[16/7]', 'aspect-[16/10]') */
    aspect?: string
  }>(),
  {
    address: '',
    description: '',
    aspect: 'aspect-[16/9]',
  },
)

defineSlots<{
  /** Replace the default pin icon */
  icon(props: Record<string, never>): unknown
  /** Replace the default address text */
  default(props: Record<string, never>): unknown
}>()
</script>

<template>
  <div data-rig-map-placeholder :class="props.aspect">
    <slot name="icon">
      <svg
        data-rig-map-pin
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    </slot>
    <slot>
      <p v-if="props.address" data-rig-map-address>{{ props.address }}</p>
      <p v-if="props.description" data-rig-map-description>{{ props.description }}</p>
    </slot>
  </div>
</template>
