<script setup lang="ts">
import KanbanBoard from './KanbanBoard.vue'
import { ref } from 'vue'

const lastMove = ref('')

const columns = ref([
  {
    id: 'todo',
    label: 'To Do',
    items: [
      {
        id: '1',
        title: 'Design system audit',
        description: 'Review all components',
        tags: ['design'],
      },
      { id: '2', title: 'Write tests', description: 'Add unit tests for core', tags: ['testing'] },
    ],
  },
  {
    id: 'progress',
    label: 'In Progress',
    items: [
      {
        id: '3',
        title: 'Build Histoire stories',
        description: 'Create stories for all components',
        tags: ['docs'],
      },
    ],
  },
  {
    id: 'done',
    label: 'Done',
    items: [
      { id: '4', title: 'Set up CI', tags: ['devops'] },
      { id: '5', title: 'Configure ESLint', tags: ['tooling'] },
    ],
  },
])

function onMove(payload: { itemId: string; fromColumn: string; toColumn: string; index: number }) {
  lastMove.value = `Moved ${payload.itemId} from "${payload.fromColumn}" to "${payload.toColumn}" at index ${payload.index}`
}
</script>

<template>
  <Story title="KanbanBoard" icon="lucide:kanban" group="extras">
    <Variant title="Default">
      <KanbanBoard :columns="columns" @move="onMove" />
      <div v-if="lastMove" style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        {{ lastMove }}
      </div>
      <div v-else style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        Drag a card between columns
      </div>
    </Variant>

    <Variant title="Empty Columns">
      <KanbanBoard
        :columns="[
          { id: 'backlog', label: 'Backlog', items: [] },
          { id: 'active', label: 'Active', items: [] },
          { id: 'review', label: 'Review', items: [] },
          { id: 'done', label: 'Done', items: [] },
        ]"
        @move="onMove"
      />
    </Variant>

    <Variant title="Many Cards">
      <KanbanBoard
        :columns="[
          {
            id: 'sprint',
            label: 'Current Sprint',
            items: Array.from({ length: 8 }, (_, i) => ({
              id: `s-${i}`,
              title: `Task ${i + 1}`,
              description: i % 2 === 0 ? 'Has a description' : undefined,
              tags: i % 3 === 0 ? ['priority'] : [],
            })),
          },
          {
            id: 'review',
            label: 'In Review',
            items: [
              { id: 'r-1', title: 'Review PR #42', tags: ['review'] },
              { id: 'r-2', title: 'Review PR #43', tags: ['review'] },
            ],
          },
          {
            id: 'shipped',
            label: 'Shipped',
            items: [{ id: 'd-1', title: 'v1.0 release', tags: ['milestone'] }],
          },
        ]"
        @move="onMove"
      />
    </Variant>
  </Story>
</template>
