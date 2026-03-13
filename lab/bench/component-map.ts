/**
 * Competitor component mapping.
 *
 * Maps each Rig component to its equivalents in competitor libraries.
 * Each entry provides the import path and minimal props needed to render.
 *
 * Libraries:
 *   radix  = radix-vue
 *   hui    = @headlessui/vue
 *   ant    = ant-design-vue
 *   fwb    = flowbite-vue
 */
import type { Component, DefineComponent } from 'vue'
import { defineComponent, h } from 'vue'

export interface CompetitorEntry {
  /** Short library key */
  lib: 'radix' | 'hui' | 'ant' | 'fwb'
  /** Display name */
  libName: string
  /** Component name within the library */
  componentName: string
  /** Dynamic importer returning the component */
  load: () => Promise<Component>
  /** Minimal props to mount without errors */
  props: Record<string, unknown>
  /** Slot default text content */
  slotContent?: string
}

export interface RigEntry {
  /** Rig component name */
  name: string
  /** Package */
  pkg: string
  /** Dynamic importer */
  load: () => Promise<Component>
  /** Minimal props */
  props: Record<string, unknown>
  /** Slot default text content */
  slotContent?: string
}

export interface ComponentComparison {
  rig: RigEntry
  competitors: CompetitorEntry[]
}

// Helper to extract default export from a module
function d(mod: Record<string, unknown>, name: string): Component {
  return (mod[name] ?? mod.default) as Component
}

/**
 * Master comparison map.
 * Only includes components where at least one competitor has an equivalent.
 */
export const comparisons: ComponentComparison[] = [
  // --- core primitives ---
  {
    rig: {
      name: 'Button',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Button),
      props: {},
      slotContent: 'Click me',
    },
    competitors: [
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Button',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Button') as Component),
        props: {},
        slotContent: 'Click me',
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Button',
        load: () => import('ant-design-vue').then((m) => d(m, 'Button') as Component),
        props: {},
        slotContent: 'Click me',
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbButton',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbButton') as Component),
        props: {},
        slotContent: 'Click me',
      },
    ],
  },
  {
    rig: {
      name: 'Checkbox',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Checkbox),
      props: { modelValue: false, ariaLabel: 'Checkbox' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'CheckboxRoot',
        load: () => import('radix-vue').then((m) => d(m, 'CheckboxRoot') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Checkbox',
        load: () => import('ant-design-vue').then((m) => d(m, 'Checkbox') as Component),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbCheckbox',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbCheckbox') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Switch',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Switch),
      props: { modelValue: false, ariaLabel: 'Switch' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'SwitchRoot',
        load: () => import('radix-vue').then((m) => d(m, 'SwitchRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Switch',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Switch') as Component),
        props: { modelValue: false },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Switch',
        load: () => import('ant-design-vue').then((m) => d(m, 'Switch') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Select',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Select),
      props: { modelValue: '', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], ariaLabel: 'Select' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'SelectRoot',
        load: () => import('radix-vue').then((m) => d(m, 'SelectRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Listbox',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Listbox') as Component),
        props: { modelValue: 'a' },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Select',
        load: () =>
          import('ant-design-vue').then((m) => {
            const Cfg = (m as any).ConfigProvider as Component
            const Sel = d(m, 'Select') as Component
            return defineComponent({
              name: 'AntSelectWrapped',
              render() {
                return h(Cfg, null, {
                  default: () => h(Sel, { options: [{ value: 'a', label: 'A' }] }),
                })
              },
            }) as Component
          }),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbSelect',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbSelect') as Component),
        props: { options: [{ value: 'a', label: 'A' }] },
      },
    ],
  },
  {
    rig: {
      name: 'Input',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Input),
      props: { modelValue: '', ariaLabel: 'Input' },
    },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Input',
        load: () => import('ant-design-vue').then((m) => d(m, 'Input') as Component),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbInput',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbInput') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Textarea',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Textarea),
      props: { modelValue: '', ariaLabel: 'Textarea' },
    },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Textarea',
        load: () => import('ant-design-vue').then((m) => d(m, 'Textarea') as Component),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbTextarea',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbTextarea') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Radio',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Radio),
      props: { modelValue: '', ariaLabel: 'Radio' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'RadioGroupRoot',
        load: () => import('radix-vue').then((m) => d(m, 'RadioGroupRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'RadioGroup',
        load: () => import('@headlessui/vue').then((m) => d(m, 'RadioGroup') as Component),
        props: { modelValue: '' },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Radio',
        load: () => import('ant-design-vue').then((m) => d(m, 'Radio') as Component),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbRadio',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbRadio') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Progress',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Progress),
      props: { value: 65, max: 100, ariaLabel: 'Progress' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'ProgressRoot',
        load: () => import('radix-vue').then((m) => d(m, 'ProgressRoot') as Component),
        props: { modelValue: 65 },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Progress',
        load: () => import('ant-design-vue').then((m) => d(m, 'Progress') as Component),
        props: { percent: 65 },
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbProgress',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbProgress') as Component),
        props: { progress: 65 },
      },
    ],
  },
  {
    rig: {
      name: 'Badge',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Badge),
      props: {},
      slotContent: 'Status',
    },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Badge',
        load: () => import('ant-design-vue').then((m) => d(m, 'Badge') as Component),
        props: { count: 5 },
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbBadge',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbBadge') as Component),
        props: {},
        slotContent: 'Status',
      },
    ],
  },
  {
    rig: {
      name: 'Avatar',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Avatar),
      props: { name: 'User' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'AvatarRoot',
        load: () => import('radix-vue').then((m) => d(m, 'AvatarRoot') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Avatar',
        load: () => import('ant-design-vue').then((m) => d(m, 'Avatar') as Component),
        props: {},
        slotContent: 'U',
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbAvatar',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbAvatar') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Slider',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Slider),
      props: { modelValue: 50, min: 0, max: 100, ariaLabel: 'Slider' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'SliderRoot',
        load: () => import('radix-vue').then((m) => d(m, 'SliderRoot') as Component),
        props: { modelValue: [50] },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Slider',
        load: () => import('ant-design-vue').then((m) => d(m, 'Slider') as Component),
        props: { value: 50 },
      },
    ],
  },
  {
    rig: {
      name: 'Toggle',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Toggle),
      props: { pressed: false, ariaLabel: 'Toggle' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'ToggleRoot',
        load: () => import('radix-vue').then((m) => d(m, 'Toggle') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Combobox',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Combobox),
      props: { modelValue: '', options: [{ value: 'a', label: 'A' }] },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'ComboboxRoot',
        load: () => import('radix-vue').then((m) => d(m, 'ComboboxRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Combobox',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Combobox') as Component),
        props: { modelValue: '' },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'AutoComplete',
        load: () => import('ant-design-vue').then((m) => d(m, 'AutoComplete') as Component),
        props: { options: [{ value: 'a' }] },
      },
    ],
  },
  {
    rig: {
      name: 'Label',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Label),
      props: {},
      slotContent: 'Field label',
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'Label',
        load: () => import('radix-vue').then((m) => d(m, 'Label') as Component),
        props: {},
        slotContent: 'Field label',
      },
    ],
  },
  {
    rig: {
      name: 'Divider',
      pkg: 'core',
      load: () => import('@core/index').then((m) => m.Divider),
      props: {},
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'Separator',
        load: () => import('radix-vue').then((m) => d(m, 'Separator') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Divider',
        load: () => import('ant-design-vue').then((m) => d(m, 'Divider') as Component),
        props: {},
      },
    ],
  },

  // --- layout ---
  {
    rig: {
      name: 'Accordion',
      pkg: 'layout',
      load: () => import('@layout/index').then((m) => m.Accordion),
      props: { type: 'single' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'AccordionRoot',
        load: () => import('radix-vue').then((m) => d(m, 'AccordionRoot') as Component),
        props: { type: 'single' },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Collapse',
        load: () => import('ant-design-vue').then((m) => d(m, 'Collapse') as Component),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbAccordion',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbAccordion') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Collapsible',
      pkg: 'layout',
      load: () => import('@layout/index').then((m) => m.Collapsible),
      props: { modelValue: true },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'CollapsibleRoot',
        load: () => import('radix-vue').then((m) => d(m, 'CollapsibleRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Disclosure',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Disclosure') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Modal',
      pkg: 'layout',
      load: () => import('@layout/index').then((m) => m.Modal),
      props: { modelValue: false },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'DialogRoot',
        load: () => import('radix-vue').then((m) => d(m, 'DialogRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Dialog',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Dialog') as Component),
        props: { open: false },
        slotContent: 'Dialog',
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Modal',
        load: () => import('ant-design-vue').then((m) => d(m, 'Modal') as Component),
        props: { open: false },
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbModal',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbModal') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Popover',
      pkg: 'layout',
      load: () => import('@layout/index').then((m) => m.Popover),
      props: {},
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'PopoverRoot',
        load: () => import('radix-vue').then((m) => d(m, 'PopoverRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Popover',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Popover') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Popover',
        load: () => import('ant-design-vue').then((m) => d(m, 'Popover') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'ScrollArea',
      pkg: 'layout',
      load: () => import('@layout/index').then((m) => m.ScrollArea),
      props: {},
      slotContent: 'Content',
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'ScrollAreaRoot',
        load: () => import('radix-vue').then((m) => d(m, 'ScrollAreaRoot') as Component),
        props: {},
        slotContent: 'Content',
      },
    ],
  },

  // --- nav ---
  {
    rig: {
      name: 'Tabs',
      pkg: 'nav',
      load: () => import('@nav/index').then((m) => m.Tabs),
      props: { modelValue: 'tab-1' },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'TabsRoot',
        load: () => import('radix-vue').then((m) => d(m, 'TabsRoot') as Component),
        props: { defaultValue: 'tab-1' },
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'TabGroup',
        load: () => import('@headlessui/vue').then((m) => d(m, 'TabGroup') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Tabs',
        load: () => import('ant-design-vue').then((m) => d(m, 'Tabs') as Component),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbTabs',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbTabs') as Component),
        props: {},
      },
    ],
  },

  // --- menus ---
  {
    rig: {
      name: 'ContextMenu',
      pkg: 'menus',
      load: () => import('@menus/index').then((m) => m.ContextMenu),
      props: {},
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'ContextMenuRoot',
        load: () => import('radix-vue').then((m) => d(m, 'ContextMenuRoot') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'DropdownMenu',
      pkg: 'menus',
      load: () => import('@menus/index').then((m) => m.DropdownMenu),
      props: {},
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'DropdownMenuRoot',
        load: () => import('radix-vue').then((m) => d(m, 'DropdownMenuRoot') as Component),
        props: {},
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Menu',
        load: () => import('@headlessui/vue').then((m) => d(m, 'Menu') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Dropdown',
        load: () => import('ant-design-vue').then((m) => d(m, 'Dropdown') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'Menubar',
      pkg: 'menus',
      load: () => import('@menus/index').then((m) => m.Menubar),
      props: { entries: [] },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'MenubarRoot',
        load: () => import('radix-vue').then((m) => d(m, 'MenubarRoot') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Menu',
        load: () => import('ant-design-vue').then((m) => d(m, 'Menu') as Component),
        props: { mode: 'horizontal' },
      },
    ],
  },

  // --- lists ---
  {
    rig: {
      name: 'Table',
      pkg: 'lists',
      load: () => import('@lists/index').then((m) => m.Table),
      props: { columns: [{ id: 'name', label: 'Name' }], rows: [{ name: 'Row 1' }], rowKey: 'name' },
    },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Table',
        load: () =>
          import('ant-design-vue').then((m) => {
            const Cfg = (m as any).ConfigProvider as Component
            const Tbl = d(m, 'Table') as Component
            return defineComponent({
              name: 'AntTableWrapped',
              render() {
                return h(Cfg, null, {
                  default: () =>
                    h(Tbl, {
                      columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
                      dataSource: [{ key: '1', name: 'Row 1' }],
                    }),
                })
              },
            }) as Component
          }),
        props: {},
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'FwbTable',
        load: () => import('flowbite-vue').then((m) => d(m, 'FwbTable') as Component),
        props: {},
      },
    ],
  },
  {
    rig: {
      name: 'TreeView',
      pkg: 'lists',
      load: () => import('@lists/index').then((m) => m.TreeView),
      props: { nodes: [{ id: '1', label: 'Root', children: [{ id: '2', label: 'Child' }] }] },
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'TreeRoot',
        load: () => import('radix-vue').then((m) => d(m, 'TreeRoot') as Component),
        props: { items: [] },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Tree',
        load: () =>
          import('ant-design-vue').then((m) => {
            const Cfg = (m as any).ConfigProvider as Component
            const Tree = d(m, 'Tree') as Component
            return defineComponent({
              name: 'AntTreeWrapped',
              render() {
                return h(Cfg, null, {
                  default: () =>
                    h(Tree, {
                      treeData: [{ title: 'Root', key: '1', children: [{ title: 'Child', key: '2' }] }],
                    }),
                })
              },
            }) as Component
          }),
        props: {},
      },
    ],
  },

  // --- extras ---
  {
    rig: {
      name: 'Toast',
      pkg: 'extras',
      load: () => import('@extras/index').then((m) => m.Toast),
      props: {},
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'ToastProvider',
        load: () => import('radix-vue').then((m) => d(m, 'ToastProvider') as Component),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Alert',
        load: () => import('ant-design-vue').then((m) => d(m, 'Alert') as Component),
        props: { message: 'Notification', type: 'info' },
      },
    ],
  },
  {
    rig: {
      name: 'Tooltip',
      pkg: 'extras',
      load: () => import('@extras/index').then((m) => m.Tooltip),
      props: {},
      slotContent: 'Hover me',
    },
    competitors: [
      {
        lib: 'radix',
        libName: 'Radix',
        componentName: 'TooltipRoot',
        load: () =>
          import('radix-vue').then((m) => {
            const Provider = m.TooltipProvider as Component
            const Root = m.TooltipRoot as Component
            return defineComponent({
              name: 'RadixTooltipWrapped',
              render() {
                return h(Provider, null, { default: () => h(Root) })
              },
            }) as Component
          }),
        props: {},
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Tooltip',
        load: () => import('ant-design-vue').then((m) => d(m, 'Tooltip') as Component),
        props: { title: 'Tooltip text' },
        slotContent: 'Hover me',
      },
    ],
  },
  {
    rig: {
      name: 'Skeleton',
      pkg: 'extras',
      load: () => import('@extras/index').then((m) => m.Skeleton),
      props: {},
    },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Skeleton',
        load: () => import('ant-design-vue').then((m) => d(m, 'Skeleton') as Component),
        props: { active: true },
      },
    ],
  },
]

/** Lookup comparison by Rig component name */
export function getComparison(rigName: string): ComponentComparison | undefined {
  return comparisons.find((c) => c.rig.name === rigName)
}
