<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Original/before text */
    original?: string
    /** Modified/after text */
    modified?: string
    /** Display mode */
    mode?: 'split' | 'unified'
    /** Language (for display) */
    language?: string
  }>(),
  {
    original: '',
    modified: '',
    mode: 'unified',
    language: 'text',
  },
)

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  oldNum?: number
  newNum?: number
}

const diff = computed<DiffLine[]>(() => {
  const origLines = props.original.split('\n')
  const modLines = props.modified.split('\n')
  const result: DiffLine[] = []
  const maxLen = Math.max(origLines.length, modLines.length)
  let oldNum = 0
  let newNum = 0

  for (let i = 0; i < maxLen; i++) {
    const origLine = origLines[i]
    const modLine = modLines[i]

    if (origLine === modLine) {
      oldNum++
      newNum++
      result.push({ type: 'unchanged', content: origLine ?? '', oldNum, newNum })
    } else {
      if (origLine !== undefined) {
        oldNum++
        result.push({ type: 'removed', content: origLine, oldNum })
      }
      if (modLine !== undefined) {
        newNum++
        result.push({ type: 'added', content: modLine, newNum })
      }
    }
  }

  return result
})
</script>

<template>
  <div
    data-rig-diff-viewer
    :data-mode="mode"
    :data-language="language"
    role="region"
    aria-label="Code diff"
    tabindex="0"
    @keydown.stop
  >
    <div data-rig-diff-viewer-header>
      <span data-rig-diff-viewer-language>{{ language }}</span>
      <div data-rig-diff-viewer-stats>
        <span data-rig-diff-viewer-added>+{{ diff.filter((l) => l.type === 'added').length }}</span>
        <span data-rig-diff-viewer-removed
          >-{{ diff.filter((l) => l.type === 'removed').length }}</span
        >
      </div>
    </div>

    <div v-if="mode === 'unified'" data-rig-diff-viewer-unified>
      <div v-for="(line, i) in diff" :key="i" data-rig-diff-viewer-line :data-type="line.type">
        <span data-rig-diff-viewer-gutter>
          <span data-rig-diff-viewer-old-num>{{ line.oldNum ?? '' }}</span>
          <span data-rig-diff-viewer-new-num>{{ line.newNum ?? '' }}</span>
          <span data-rig-diff-viewer-prefix>{{
            line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '
          }}</span>
        </span>
        <span data-rig-diff-viewer-content>{{ line.content }}</span>
      </div>
    </div>

    <div v-else data-rig-diff-viewer-split>
      <div data-rig-diff-viewer-pane>
        <div
          v-for="(line, i) in diff.filter((l) => l.type !== 'added')"
          :key="i"
          data-rig-diff-viewer-line
          :data-type="line.type"
        >
          <span data-rig-diff-viewer-gutter>{{ line.oldNum ?? '' }}</span>
          <span data-rig-diff-viewer-content>{{ line.content }}</span>
        </div>
      </div>
      <div data-rig-diff-viewer-pane>
        <div
          v-for="(line, i) in diff.filter((l) => l.type !== 'removed')"
          :key="i"
          data-rig-diff-viewer-line
          :data-type="line.type"
        >
          <span data-rig-diff-viewer-gutter>{{ line.newNum ?? '' }}</span>
          <span data-rig-diff-viewer-content>{{ line.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
