import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import IdeShell from './IdeShell.vue'
import type { Action, TabItem } from '@core/types'

const activities: Action[] = [
  { id: 'explorer', label: 'Explorer', icon: 'codicon:files' },
  { id: 'search', label: 'Search', icon: 'codicon:search' },
  { id: 'git', label: 'Source Control', icon: 'codicon:source-control' },
  { id: 'debug', label: 'Run & Debug', icon: 'codicon:debug-alt' },
  { id: 'extensions', label: 'Extensions', icon: 'codicon:extensions' },
]

const panelTabs: TabItem[] = [
  { id: 'problems', label: 'Problems' },
  { id: 'output', label: 'Output' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'debug-console', label: 'Debug Console' },
]

const stubs = {
  ActivityBar: { template: '<div data-rig-activity-bar><slot /></div>' },
  SideBar: { template: '<div data-rig-sidebar><slot /></div>' },
  StatusBar: { template: '<div data-rig-status-bar><slot /></div>' },
  PanelBar: { template: '<div data-rig-panel-bar><slot /></div>' },
  EditorWorkbench: {
    template: '<div data-rig-editor-workbench><slot /><slot name="empty" /></div>',
    props: ['tabs', 'activeId'],
  },
  Panel: {
    template: '<div data-rig-panel><slot /></div>',
    props: ['open', 'position', 'size'],
  },
}

describe('IdeShell mount', () => {
  bench('minimal shell', () => {
    const w = mount(IdeShell, {
      props: { activities, panelTabs },
      global: { stubs },
    })
    w.unmount()
  })

  bench('shell with slots', () => {
    const w = mount(IdeShell, {
      props: { activities, panelTabs },
      slots: {
        sidebar: '<div>File tree</div>',
        'editor-empty': '<div>Welcome</div>',
        panel: '<div>Terminal output</div>',
        statusbar: '<div>Ready</div>',
      },
      global: { stubs },
    })
    w.unmount()
  })
})
