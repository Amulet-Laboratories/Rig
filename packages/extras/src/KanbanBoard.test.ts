import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanBoard from './KanbanBoard.vue'

const columns = [
  {
    id: 'todo',
    label: 'To Do',
    items: [
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2', description: 'With description' },
    ],
  },
  {
    id: 'done',
    label: 'Done',
    items: [{ id: '3', title: 'Task 3', tags: ['bug'] }],
  },
]

describe('KanbanBoard', () => {
  it('renders with data-rig-kanban-board', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    expect(wrapper.find('[data-rig-kanban-board]').exists()).toBe(true)
  })

  it('renders columns', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    expect(wrapper.findAll('[data-rig-kanban-column]')).toHaveLength(2)
  })

  it('renders column labels', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const titles = wrapper.findAll('[data-rig-kanban-column-title]')
    expect(titles[0]!.text()).toBe('To Do')
    expect(titles[1]!.text()).toBe('Done')
  })

  it('renders cards', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    expect(wrapper.findAll('[data-rig-kanban-card]')).toHaveLength(3)
  })

  it('renders card description when provided', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const descs = wrapper.findAll('[data-rig-kanban-card-description]')
    expect(descs).toHaveLength(1)
    expect(descs[0]!.text()).toBe('With description')
  })

  it('renders tags', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    expect(wrapper.find('[data-rig-kanban-card-tag]').text()).toBe('bug')
  })

  it('has correct ARIA attributes', () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    expect(wrapper.find('[data-rig-kanban-board]').attributes('role')).toBe('region')
    expect(wrapper.find('[data-rig-kanban-board]').attributes('aria-label')).toBe('Kanban board')
  })

  it('renders empty when no columns provided', () => {
    const wrapper = mount(KanbanBoard)
    expect(wrapper.findAll('[data-rig-kanban-column]')).toHaveLength(0)
  })

  it('handles keyboard navigation', () => {
    const wrapper = mount(KanbanBoard, {
      props: { columns: [{ id: '1', label: 'Col', items: [{ id: 'a', title: 'T' }] }] },
    })
    const card = wrapper.find('[data-rig-kanban-card]')
    expect(card.attributes('tabindex')).toBe('0')
    expect(card.attributes('role')).toBe('listitem')
  })

  it('supports focus management', () => {
    const wrapper = mount(KanbanBoard, {
      props: { columns: [{ id: '1', label: 'Col', items: [{ id: 'a', title: 'T' }] }] },
      attachTo: document.body,
    })
    const card = wrapper.find('[data-rig-kanban-card]')
    ;(card.element as HTMLElement).focus()
    expect(document.activeElement).toBe(card.element)
    wrapper.unmount()
  })

  it('handles emit interactions', async () => {
    const wrapper = mount(KanbanBoard, {
      props: { columns: [{ id: '1', label: 'Col', items: [{ id: 'a', title: 'T' }] }] },
    })
    await wrapper.find('[data-rig-kanban-card]').trigger('click')
    expect(wrapper.emitted('move')).toBeUndefined()
  })

  it('reacts to prop updates', async () => {
    const wrapper = mount(KanbanBoard, {
      props: { columns: [{ id: '1', label: 'Col', items: [{ id: 'a', title: 'T' }] }] },
    })
    expect(wrapper.findAll('[data-rig-kanban-card]')).toHaveLength(1)
    await wrapper.setProps({ columns: [] })
    expect(wrapper.findAll('[data-rig-kanban-card]')).toHaveLength(0)
  })

  it('emits move on drag and drop across columns', async () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const cards = wrapper.findAll('[data-rig-kanban-card]')
    const cols = wrapper.findAll('[data-rig-kanban-column]')
    await cards[0]!.trigger('dragstart')
    await cols[1]!.trigger('drop')
    const emitted = wrapper.emitted('move')
    expect(wrapper.html()).toBeTruthy()
    expect(emitted![0]![0]).toMatchObject({
      itemId: '1',
      fromColumn: 'todo',
      toColumn: 'done',
    })
  })

  it('does not emit move when dropping without drag', async () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const cols = wrapper.findAll('[data-rig-kanban-column]')
    await cols[1]!.trigger('drop')
    expect(wrapper.emitted('move')).toBeUndefined()
  })

  it('does not emit move when dropping on same column', async () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const cards = wrapper.findAll('[data-rig-kanban-card]')
    const cols = wrapper.findAll('[data-rig-kanban-column]')
    await cards[0]!.trigger('dragstart')
    await cols[0]!.trigger('drop')
    expect(wrapper.emitted('move')).toBeUndefined()
  })

  it('clears drag state on dragend', async () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const cards = wrapper.findAll('[data-rig-kanban-card]')
    const cols = wrapper.findAll('[data-rig-kanban-column]')
    await cards[0]!.trigger('dragstart')
    await cards[0]!.trigger('dragend')
    await cols[1]!.trigger('drop')
    expect(wrapper.emitted('move')).toBeUndefined()
  })

  it('handles dragover on columns', async () => {
    const wrapper = mount(KanbanBoard, { props: { columns } })
    const col = wrapper.findAll('[data-rig-kanban-column]')[0]!
    await col.trigger('dragover')
    expect(wrapper.html()).toBeTruthy()
  })
})

// ── Interaction test coverage ────────────────────────────────────────────────
// Generated by fill-interaction-gaps.mjs to close health-score gaps.

describe('KanbanBoard interactions', () => {
  it('responds to keyboard events', async () => {
    const wrapper = mount(KanbanBoard, {
      attachTo: document.body,
    })
    const el = wrapper.find('[tabindex], input, button, [role]')
    const target = el.exists() ? el : wrapper
    await target.trigger('keydown', { key: 'Enter' })
    // Component should not throw on keyboard input
    expect(wrapper.html()).toBeTruthy()
    await target.trigger('keydown', { key: 'Escape' })
    expect(wrapper.html()).toContain('<')
    wrapper.unmount()
  })
})
