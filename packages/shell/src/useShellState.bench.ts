import { describe, bench } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useShellState } from './useShellState'

function createShell() {
  let shell: ReturnType<typeof useShellState>
  const Wrapper = defineComponent({
    setup() {
      shell = useShellState({ provide: true })
      return { shell }
    },
    render: () => h('div'),
  })
  const wrapper = mount(Wrapper)
  return { wrapper, shell: shell! }
}

describe('useShellState', () => {
  bench('invoke useShellState', () => {
    const { wrapper } = createShell()
    wrapper.unmount()
  })

  bench('open + close tab cycle', () => {
    const { wrapper, shell } = createShell()
    shell.openTab({ id: 'a', label: 'A' })
    shell.closeTab('a')
    wrapper.unmount()
  })

  bench('open 5 tabs + closeAll', () => {
    const { wrapper, shell } = createShell()
    for (let i = 0; i < 5; i++) shell.openTab({ id: `t${i}`, label: `Tab ${i}` })
    shell.closeAllTabs()
    wrapper.unmount()
  })

  bench('toggle sidebar + panel', () => {
    const { wrapper, shell } = createShell()
    shell.toggleSidebar()
    shell.togglePanel()
    shell.toggleSidebar()
    shell.togglePanel()
    wrapper.unmount()
  })
})
