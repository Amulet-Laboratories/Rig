/**
 * competitor-map.ts
 *
 * Maps each Rig component to its equivalents in competitor Vue libraries.
 * Used by generate-cross-comparison.test.ts to run head-to-head benchmarks.
 *
 * Each entry specifies:
 *   - rigComponent: Rig's component name (matching comparison.json)
 *   - rigPackage: which Rig package it belongs to
 *   - rigPath: import path relative to packages/
 *   - rigProps: minimal props needed to mount
 *   - competitors: array of competitor mounting configs
 *
 * Competitor libraries:
 *   - reka-ui  (headless Vue 3 primitives, successor to radix-vue)
 *   - @headlessui/vue  (headless Vue 3, limited but polished set)
 *   - ant-design-vue   (full Vue 3 UI library, 100+ components)
 *   - flowbite-vue      (Tailwind-based Vue 3 components)
 */

export type CompetitorEntry = {
  lib: string
  libName: string
  componentName: string
  component: unknown
  props?: Record<string, unknown>
  slots?: Record<string, unknown>
}

export type ComponentMapEntry = {
  rigComponent: string
  rigPackage: string
  rigComponentRef: unknown
  rigProps?: Record<string, unknown>
  competitors: CompetitorEntry[]
}

// ── Rig imports ──────────────────────────────────────────────────────────────
import RigButton from '../packages/core/src/primitives/Button.vue'
import RigCheckbox from '../packages/core/src/primitives/Checkbox.vue'
import RigSwitch from '../packages/core/src/primitives/Switch.vue'
import RigSelect from '../packages/core/src/primitives/Select.vue'
import RigInput from '../packages/core/src/primitives/Input.vue'
import RigTextarea from '../packages/core/src/primitives/Textarea.vue'
import RigRadio from '../packages/core/src/primitives/Radio.vue'
import RigProgress from '../packages/core/src/primitives/Progress.vue'
import RigBadge from '../packages/core/src/primitives/Badge.vue'
import RigAvatar from '../packages/core/src/primitives/Avatar.vue'
import RigSlider from '../packages/core/src/primitives/Slider.vue'
import RigToggle from '../packages/core/src/primitives/Toggle.vue'
import RigCombobox from '../packages/core/src/primitives/Combobox.vue'
import RigLabel from '../packages/core/src/primitives/Label.vue'
import RigDivider from '../packages/core/src/primitives/Divider.vue'
import RigIconButton from '../packages/core/src/primitives/IconButton.vue'
import RigRadioGroup from '../packages/core/src/primitives/RadioGroup.vue'
import RigToggleGroup from '../packages/core/src/primitives/ToggleGroup.vue'
import RigCard from '../packages/core/src/primitives/Card.vue'
import RigTagInput from '../packages/core/src/primitives/TagInput.vue'
import RigSkeleton from '../packages/extras/src/Skeleton.vue'
import RigToast from '../packages/extras/src/Toast.vue'
import RigTooltip from '../packages/extras/src/Tooltip.vue'
import RigEmptyState from '../packages/extras/src/EmptyState.vue'
import RigAccordion from '../packages/layout/src/Accordion.vue'
import RigCollapsible from '../packages/layout/src/Collapsible.vue'
import RigModal from '../packages/layout/src/Modal.vue'
import RigPopover from '../packages/layout/src/Popover.vue'
import RigScrollArea from '../packages/layout/src/ScrollArea.vue'
import RigTable from '../packages/lists/src/Table.vue'
import RigTreeView from '../packages/lists/src/TreeView.vue'
import RigList from '../packages/lists/src/List.vue'
import RigContextMenu from '../packages/menus/src/ContextMenu.vue'
import RigDropdownMenu from '../packages/menus/src/DropdownMenu.vue'
import RigMenubar from '../packages/menus/src/Menubar.vue'
import RigTabs from '../packages/nav/src/Tabs.vue'
import RigBreadcrumbs from '../packages/nav/src/Breadcrumbs.vue'
import RigStepper from '../packages/nav/src/Stepper.vue'
import RigDatePicker from '../packages/nav/src/DatePicker.vue'
import RigTimeline from '../packages/nav/src/Timeline.vue'

// ── Reka UI imports ──────────────────────────────────────────────────────────
import {
  AccordionRoot as RekaAccordion,
  AvatarRoot as RekaAvatar,
  CheckboxRoot as RekaCheckbox,
  CollapsibleRoot as RekaCollapsible,
  ComboboxRoot as RekaCombobox,
  ContextMenuRoot as RekaContextMenu,
  DialogRoot as RekaModal,
  DropdownMenuRoot as RekaDropdownMenu,
  Label as RekaLabel,
  MenubarRoot as RekaMenubar,
  PopoverRoot as RekaPopover,
  ProgressRoot as RekaProgress,
  RadioGroupRoot as RekaRadioGroup,
  ScrollAreaRoot as RekaScrollArea,
  SelectRoot as RekaSelect,
  SliderRoot as RekaSlider,
  SwitchRoot as RekaSwitch,
  TabsRoot as RekaTabs,
  TagsInputRoot as RekaTagsInput,
  ToastRoot as RekaToast,
  ToggleGroupRoot as RekaToggleGroup,
  TooltipRoot as RekaTooltip,
  TreeRoot as RekaTree,
  DatePickerRoot as RekaDatePicker,
  StepperRoot as RekaStepper,
} from 'reka-ui'

// ── Headless UI imports ──────────────────────────────────────────────────────
import {
  Dialog as HuiDialog,
  Disclosure as HuiDisclosure,
  Listbox as HuiListbox,
  Combobox as HuiCombobox,
  Menu as HuiMenu,
  Popover as HuiPopover,
  RadioGroup as HuiRadioGroup,
  Switch as HuiSwitch,
  TabGroup as HuiTabs,
} from '@headlessui/vue'

// ── Ant Design Vue imports ───────────────────────────────────────────────────
import {
  Button as AntButton,
  Checkbox as AntCheckbox,
  Switch as AntSwitch,
  Select as AntSelect,
  Input as AntInput,
  Textarea as AntTextarea,
  Radio as AntRadio,
  Progress as AntProgress,
  Badge as AntBadge,
  Avatar as AntAvatar,
  Slider as AntSlider,
  AutoComplete as AntAutoComplete,
  Divider as AntDivider,
  Collapse as AntAccordion,
  Modal as AntModal,
  Popover as AntPopover,
  Table as AntTable,
  Tree as AntTree,
  Dropdown as AntDropdown,
  Menu as AntMenubar,
  Tabs as AntTabs,
  Skeleton as AntSkeleton,
  Tooltip as AntTooltip,
  Card as AntCard,
  List as AntList,
  Empty as AntEmpty,
  Breadcrumb as AntBreadcrumb,
  Steps as AntSteps,
  DatePicker as AntDatePicker,
  Timeline as AntTimeline,
  RadioGroup as AntRadioGroup,
} from 'ant-design-vue'

// ── Flowbite Vue imports ─────────────────────────────────────────────────────
// Flowbite requires document (injects CSS) — works in jsdom/vitest
import { FwbAccordion } from 'flowbite-vue'
import { FwbAvatar } from 'flowbite-vue'
import { FwbBadge } from 'flowbite-vue'
import { FwbButton } from 'flowbite-vue'
import { FwbCheckbox } from 'flowbite-vue'
import { FwbInput } from 'flowbite-vue'
import { FwbModal } from 'flowbite-vue'
import { FwbProgress } from 'flowbite-vue'
import { FwbRadio } from 'flowbite-vue'
import { FwbSelect } from 'flowbite-vue'
import { FwbTable } from 'flowbite-vue'
import { FwbTabs } from 'flowbite-vue'
import { FwbTextarea } from 'flowbite-vue'
import { FwbToast } from 'flowbite-vue'
import { FwbToggle } from 'flowbite-vue'
import { FwbTooltip } from 'flowbite-vue'
import { FwbRange } from 'flowbite-vue'
import { FwbCard } from 'flowbite-vue'
import { FwbListGroup } from 'flowbite-vue'
import { FwbBreadcrumb } from 'flowbite-vue'
import { FwbTimeline } from 'flowbite-vue'

// ── Component Map ────────────────────────────────────────────────────────────

export const COMPONENT_MAP: ComponentMapEntry[] = [
  // ── Core Primitives ────────────────────────────────────────────────────────
  {
    rigComponent: 'Button',
    rigPackage: 'core',
    rigComponentRef: RigButton,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Button', component: AntButton },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Button', component: FwbButton },
    ],
  },
  {
    rigComponent: 'Checkbox',
    rigPackage: 'core',
    rigComponentRef: RigCheckbox,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'CheckboxRoot', component: RekaCheckbox },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Checkbox', component: AntCheckbox },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Checkbox', component: FwbCheckbox },
    ],
  },
  {
    rigComponent: 'Switch',
    rigPackage: 'core',
    rigComponentRef: RigSwitch,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'SwitchRoot', component: RekaSwitch },
      { lib: 'hui', libName: 'Headless UI', componentName: 'Switch', component: HuiSwitch },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Switch', component: AntSwitch },
    ],
  },
  {
    rigComponent: 'Select',
    rigPackage: 'core',
    rigComponentRef: RigSelect,
    rigProps: { options: [{ label: 'A', value: 'a' }] },
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'SelectRoot', component: RekaSelect },
      { lib: 'hui', libName: 'Headless UI', componentName: 'Listbox', component: HuiListbox },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Select', component: AntSelect },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Select', component: FwbSelect },
    ],
  },
  {
    rigComponent: 'Input',
    rigPackage: 'core',
    rigComponentRef: RigInput,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Input', component: AntInput },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Input', component: FwbInput },
    ],
  },
  {
    rigComponent: 'Textarea',
    rigPackage: 'core',
    rigComponentRef: RigTextarea,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Textarea', component: AntTextarea },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Textarea', component: FwbTextarea },
    ],
  },
  {
    rigComponent: 'Radio',
    rigPackage: 'core',
    rigComponentRef: RigRadio,
    rigProps: { value: 'a', name: 'test-radio' },
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Radio', component: AntRadio, props: { value: 'a' } },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Radio', component: FwbRadio, props: { value: 'a', name: 'test' } },
    ],
  },
  {
    rigComponent: 'RadioGroup',
    rigPackage: 'core',
    rigComponentRef: RigRadioGroup,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'RadioGroupRoot',
        component: RekaRadioGroup,
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'RadioGroup',
        component: HuiRadioGroup,
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'RadioGroup',
        component: AntRadioGroup,
      },
    ],
  },
  {
    rigComponent: 'Progress',
    rigPackage: 'core',
    rigComponentRef: RigProgress,
    rigProps: { value: 65 },
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'ProgressRoot',
        component: RekaProgress,
        props: { modelValue: 65 },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Progress',
        component: AntProgress,
        props: { percent: 65 },
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'Progress',
        component: FwbProgress,
        props: { progress: 65 },
      },
    ],
  },
  {
    rigComponent: 'Badge',
    rigPackage: 'core',
    rigComponentRef: RigBadge,
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Badge',
        component: AntBadge,
        props: { count: 5 },
      },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Badge', component: FwbBadge },
    ],
  },
  {
    rigComponent: 'Avatar',
    rigPackage: 'core',
    rigComponentRef: RigAvatar,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'AvatarRoot', component: RekaAvatar },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Avatar', component: AntAvatar },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Avatar', component: FwbAvatar },
    ],
  },
  {
    rigComponent: 'Slider',
    rigPackage: 'core',
    rigComponentRef: RigSlider,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'SliderRoot',
        component: RekaSlider,
        props: { defaultValue: [50] },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Slider',
        component: AntSlider,
        props: { value: 50 },
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'Range',
        component: FwbRange,
      },
    ],
  },
  {
    rigComponent: 'Toggle',
    rigPackage: 'core',
    rigComponentRef: RigToggle,
    competitors: [
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Toggle', component: FwbToggle },
    ],
  },
  {
    rigComponent: 'ToggleGroup',
    rigPackage: 'core',
    rigComponentRef: RigToggleGroup,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'ToggleGroupRoot',
        component: RekaToggleGroup,
        props: { type: 'single' },
      },
    ],
  },
  {
    rigComponent: 'Combobox',
    rigPackage: 'core',
    rigComponentRef: RigCombobox,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'ComboboxRoot', component: RekaCombobox },
      { lib: 'hui', libName: 'Headless UI', componentName: 'Combobox', component: HuiCombobox },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'AutoComplete',
        component: AntAutoComplete,
      },
    ],
  },
  {
    rigComponent: 'Label',
    rigPackage: 'core',
    rigComponentRef: RigLabel,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'Label', component: RekaLabel },
    ],
  },
  {
    rigComponent: 'Divider',
    rigPackage: 'core',
    rigComponentRef: RigDivider,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Divider', component: AntDivider },
    ],
  },
  {
    rigComponent: 'IconButton',
    rigPackage: 'core',
    rigComponentRef: RigIconButton,
    rigProps: { ariaLabel: 'Test action' },
    competitors: [],
  },
  {
    rigComponent: 'Card',
    rigPackage: 'core',
    rigComponentRef: RigCard,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Card', component: AntCard },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Card', component: FwbCard },
    ],
  },
  {
    rigComponent: 'TagInput',
    rigPackage: 'core',
    rigComponentRef: RigTagInput,
    rigProps: { modelValue: ['tag1', 'tag2'] },
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'TagsInputRoot',
        component: RekaTagsInput,
        props: { modelValue: ['tag1', 'tag2'] },
      },
    ],
  },

  // ── Layout ─────────────────────────────────────────────────────────────────
  {
    rigComponent: 'Accordion',
    rigPackage: 'layout',
    rigComponentRef: RigAccordion,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'AccordionRoot',
        component: RekaAccordion,
        props: { type: 'single' },
      },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Collapse', component: AntAccordion },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Accordion', component: FwbAccordion },
    ],
  },
  {
    rigComponent: 'Collapsible',
    rigPackage: 'layout',
    rigComponentRef: RigCollapsible,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'CollapsibleRoot',
        component: RekaCollapsible,
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Disclosure',
        component: HuiDisclosure,
      },
    ],
  },
  {
    rigComponent: 'Modal',
    rigPackage: 'layout',
    rigComponentRef: RigModal,
    rigProps: { open: false },
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'DialogRoot',
        component: RekaModal,
        props: { open: false },
      },
      {
        lib: 'hui',
        libName: 'Headless UI',
        componentName: 'Dialog',
        component: HuiDialog,
        props: { open: false },
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Modal',
        component: AntModal,
        props: { open: false },
      },
      {
        lib: 'fwb',
        libName: 'Flowbite',
        componentName: 'Modal',
        component: FwbModal,
      },
    ],
  },
  {
    rigComponent: 'Popover',
    rigPackage: 'layout',
    rigComponentRef: RigPopover,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'PopoverRoot',
        component: RekaPopover,
      },
      { lib: 'hui', libName: 'Headless UI', componentName: 'Popover', component: HuiPopover },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Popover', component: AntPopover },
    ],
  },
  {
    rigComponent: 'ScrollArea',
    rigPackage: 'layout',
    rigComponentRef: RigScrollArea,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'ScrollAreaRoot',
        component: RekaScrollArea,
      },
    ],
  },

  // ── Lists ──────────────────────────────────────────────────────────────────
  {
    rigComponent: 'Table',
    rigPackage: 'lists',
    rigComponentRef: RigTable,
    rigProps: { columns: [{ key: 'name', label: 'Name' }], rows: [{ name: 'Test' }] },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Table',
        component: AntTable,
        props: {
          columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
          dataSource: [{ key: '1', name: 'Test' }],
        },
      },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Table', component: FwbTable },
    ],
  },
  {
    rigComponent: 'TreeView',
    rigPackage: 'lists',
    rigComponentRef: RigTreeView,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'TreeRoot', component: RekaTree },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Tree',
        component: AntTree,
        props: {
          treeData: [{ title: 'Root', key: '0', children: [{ title: 'Child', key: '0-0' }] }],
        },
      },
    ],
  },
  {
    rigComponent: 'List',
    rigPackage: 'lists',
    rigComponentRef: RigList,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'List', component: AntList },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'ListGroup', component: FwbListGroup },
    ],
  },

  // ── Menus ──────────────────────────────────────────────────────────────────
  {
    rigComponent: 'ContextMenu',
    rigPackage: 'menus',
    rigComponentRef: RigContextMenu,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'ContextMenuRoot',
        component: RekaContextMenu,
      },
    ],
  },
  {
    rigComponent: 'DropdownMenu',
    rigPackage: 'menus',
    rigComponentRef: RigDropdownMenu,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'DropdownMenuRoot',
        component: RekaDropdownMenu,
      },
      { lib: 'hui', libName: 'Headless UI', componentName: 'Menu', component: HuiMenu },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Dropdown', component: AntDropdown },
    ],
  },
  {
    rigComponent: 'Menubar',
    rigPackage: 'menus',
    rigComponentRef: RigMenubar,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'MenubarRoot',
        component: RekaMenubar,
      },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Menu', component: AntMenubar },
    ],
  },

  // ── Extras ─────────────────────────────────────────────────────────────────
  {
    rigComponent: 'Skeleton',
    rigPackage: 'extras',
    rigComponentRef: RigSkeleton,
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Skeleton',
        component: AntSkeleton,
      },
    ],
  },
  {
    rigComponent: 'Toast',
    rigPackage: 'extras',
    rigComponentRef: RigToast,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'ToastRoot', component: RekaToast },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Toast', component: FwbToast },
    ],
  },
  {
    rigComponent: 'Tooltip',
    rigPackage: 'extras',
    rigComponentRef: RigTooltip,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'TooltipRoot',
        component: RekaTooltip,
      },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Tooltip', component: AntTooltip },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Tooltip', component: FwbTooltip },
    ],
  },
  {
    rigComponent: 'EmptyState',
    rigPackage: 'extras',
    rigComponentRef: RigEmptyState,
    competitors: [
      { lib: 'ant', libName: 'Ant Design', componentName: 'Empty', component: AntEmpty },
    ],
  },

  // ── Nav ────────────────────────────────────────────────────────────────────
  {
    rigComponent: 'Tabs',
    rigPackage: 'nav',
    rigComponentRef: RigTabs,
    competitors: [
      { lib: 'reka', libName: 'Reka UI', componentName: 'TabsRoot', component: RekaTabs },
      { lib: 'hui', libName: 'Headless UI', componentName: 'TabGroup', component: HuiTabs },
      { lib: 'ant', libName: 'Ant Design', componentName: 'Tabs', component: AntTabs },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Tabs', component: FwbTabs },
    ],
  },
  {
    rigComponent: 'Breadcrumbs',
    rigPackage: 'nav',
    rigComponentRef: RigBreadcrumbs,
    rigProps: { items: [{ label: 'Home', href: '/' }, { label: 'Page' }] },
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Breadcrumb',
        component: AntBreadcrumb,
      },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Breadcrumb', component: FwbBreadcrumb },
    ],
  },
  {
    rigComponent: 'Stepper',
    rigPackage: 'nav',
    rigComponentRef: RigStepper,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'StepperRoot',
        component: RekaStepper,
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Steps',
        component: AntSteps,
      },
    ],
  },
  {
    rigComponent: 'DatePicker',
    rigPackage: 'nav',
    rigComponentRef: RigDatePicker,
    competitors: [
      {
        lib: 'reka',
        libName: 'Reka UI',
        componentName: 'DatePickerRoot',
        component: RekaDatePicker,
      },
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'DatePicker',
        component: AntDatePicker,
      },
    ],
  },
  {
    rigComponent: 'Timeline',
    rigPackage: 'nav',
    rigComponentRef: RigTimeline,
    competitors: [
      {
        lib: 'ant',
        libName: 'Ant Design',
        componentName: 'Timeline',
        component: AntTimeline,
      },
      { lib: 'fwb', libName: 'Flowbite', componentName: 'Timeline', component: FwbTimeline },
    ],
  },
]

// ── Convenience lookups ──────────────────────────────────────────────────────

/** Components that have at least one competitor mapping */
export const COMPARABLE_COMPONENTS = COMPONENT_MAP.filter((c) => c.competitors.length > 0)

/** Components unique to Rig (no competitor equivalent) */
export const RIG_EXCLUSIVE = COMPONENT_MAP.filter((c) => c.competitors.length === 0)

/** All unique competitor libraries present in the map */
export const COMPETITOR_LIBS = [
  { id: 'reka', name: 'Reka UI', npm: 'reka-ui' },
  { id: 'hui', name: 'Headless UI', npm: '@headlessui/vue' },
  { id: 'ant', name: 'Ant Design', npm: 'ant-design-vue' },
  { id: 'fwb', name: 'Flowbite', npm: 'flowbite-vue' },
] as const
