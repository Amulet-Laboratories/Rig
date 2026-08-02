import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SplitEditorArea from './SplitEditorArea.vue'
import { usePaneState } from '@shell/usePaneState'
import type { PaneId, PaneState } from '@shell/usePaneState'
import type { TabItem } from '@core/types'

const tab = (id: string, label = id): TabItem => ({ id, label })

/**
 * SplitEditorArea injects pane state rather than owning it, so every case needs
 * a host that provides it. The host hands the live state back so a test can
 * open panes and assert on the layout that results.
 *
 * Note `openPane` vs `openTabInPane`: only the former creates a pane group.
 * `openTabInPane` is a no-op against a pane that is not open yet.
 */
function mountWithPanes(open: (panes: PaneState) => void, slots: Record<string, unknown> = {}) {
  let panes!: PaneState

  const Host = defineComponent({
    setup(_, { expose }) {
      panes = usePaneState({ provide: true })
      open(panes)
      expose({ panes })
      return () => h(SplitEditorArea, null, slots)
    },
  })

  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, panes }
}

const paneIds = (w: ReturnType<typeof mountWithPanes>['wrapper']) =>
  w.findAll('[data-rig-pane-group]').map((p) => p.attributes('data-pane-id'))

describe('SplitEditorArea', () => {
  it('renders with data-rig-split-editor-area', () => {
    const { wrapper } = mountWithPanes((p) => p.openTabInPane('tl', tab('a')))
    expect(wrapper.find('[data-rig-split-editor-area]').exists()).toBe(true)
    wrapper.unmount()
  })

  describe('layout configurations', () => {
    it('tl only renders a single pane group and no SplitView', () => {
      const { wrapper } = mountWithPanes((p) => p.openTabInPane('tl', tab('a')))
      expect(paneIds(wrapper)).toEqual(['tl'])
      expect(wrapper.find('[data-rig-split-view]').exists()).toBe(false)
      wrapper.unmount()
    })

    it('tl + tr splits horizontally', () => {
      const { wrapper } = mountWithPanes((p) => {
        p.openTabInPane('tl', tab('a'))
        p.openPane('tr', tab('b'))
      })
      expect(paneIds(wrapper).sort()).toEqual(['tl', 'tr'])
      wrapper.unmount()
    })

    it('tl + bl splits vertically', () => {
      const { wrapper } = mountWithPanes((p) => {
        p.openTabInPane('tl', tab('a'))
        p.openPane('bl', tab('c'))
      })
      expect(paneIds(wrapper).sort()).toEqual(['bl', 'tl'])
      wrapper.unmount()
    })

    it('all four panes render as a 2x2 grid', () => {
      const { wrapper } = mountWithPanes((p) => {
        p.openTabInPane('tl', tab('a'))
        p.openPane('tr', tab('b'))
        p.openPane('bl', tab('c'))
        p.openPane('br', tab('d'))
      })
      expect(paneIds(wrapper).sort()).toEqual(['bl', 'br', 'tl', 'tr'])
      wrapper.unmount()
    })
  })

  describe('focus', () => {
    it('marks the focused pane with data-focused', async () => {
      const { wrapper, panes } = mountWithPanes((p) => {
        p.openTabInPane('tl', tab('a'))
        p.openPane('tr', tab('b'))
      })

      panes.focusPane('tr')
      await nextTick()

      const focused = wrapper
        .findAll('[data-rig-pane-group]')
        .filter((p) => p.attributes('data-focused') !== undefined)
        .map((p) => p.attributes('data-pane-id'))
      expect(focused).toEqual(['tr'])
      wrapper.unmount()
    })

    it('emits pane-focus when a pane is clicked', async () => {
      const { wrapper } = mountWithPanes((p) => {
        p.openTabInPane('tl', tab('a'))
        p.openPane('tr', tab('b'))
      })

      const tr = wrapper
        .findAll('[data-rig-pane-group]')
        .find((p) => p.attributes('data-pane-id') === 'tr')!
      await tr.trigger('click')

      const emitted = wrapper.findComponent(SplitEditorArea).emitted('pane-focus')
      expect(emitted).toBeTruthy()
      expect(emitted![0]).toEqual(['tr'])
      wrapper.unmount()
    })
  })

  describe('slots', () => {
    it('passes paneId and activeTab to the default slot', () => {
      const { wrapper } = mountWithPanes((p) => p.openTabInPane('tl', tab('a', 'Alpha')), {
        default: (s: { paneId: PaneId; activeTab?: TabItem }) =>
          h('div', { 'data-slot-content': '' }, `${s.paneId}:${s.activeTab?.label ?? '-'}`),
      })
      expect(wrapper.find('[data-slot-content]').text()).toBe('tl:Alpha')
      wrapper.unmount()
    })

    it('renders the empty slot for a pane with no tabs', () => {
      // tl is always present; opening nothing leaves it empty.
      const { wrapper } = mountWithPanes(() => {}, {
        empty: (s: { paneId: PaneId }) => h('div', { 'data-empty': '' }, s.paneId),
      })
      expect(wrapper.find('[data-empty]').text()).toBe('tl')
      wrapper.unmount()
    })
  })
})
