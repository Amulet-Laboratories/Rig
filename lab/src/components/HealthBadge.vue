<script setup lang="ts">
import type { Grade } from '../types'
import { GRADE_COLORS, GRADE_BG } from '../types'

const props = defineProps<{
  grade: Grade
  score: number
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeMap = { sm: '1.5rem', md: '2.5rem', lg: '3.5rem' }
const fontMap = { sm: '0.75rem', md: '1.25rem', lg: '2rem' }
</script>

<template>
  <div
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeMap[props.size ?? 'md'],
      height: sizeMap[props.size ?? 'md'],
      borderRadius: '0.375rem',
      fontWeight: 700,
      fontSize: fontMap[props.size ?? 'md'],
      lineHeight: 1,
      color: GRADE_COLORS[props.grade],
      background: GRADE_BG[props.grade],
      border: `1px solid ${GRADE_COLORS[props.grade]}33`,
      flexShrink: 0,
    }"
    :title="`Grade ${props.grade} (${props.score}/100)`"
  >
    {{ props.grade }}
  </div>
</template>
