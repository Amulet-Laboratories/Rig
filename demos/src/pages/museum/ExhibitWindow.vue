<script setup lang="ts">
/* The exhibit — one window, rendered identically in every era.
 *
 * This file contains no era-specific markup, no conditionals on era id, and no
 * `style=`. Everything that distinguishes a 1984 window from a 1995 one arrives
 * through [data-hex-era] and the Hex material tokens. That is the claim the
 * museum exists to test, so the moment this component needs to know which era
 * it is in, the claim has failed and the fix belongs in Hex.
 *
 * What you browse is the museum's own collection notes.
 */
import { ref, computed } from 'vue'
import {
  TitleBar,
  Menubar,
  StatusBar,
  ScrollArea,
  List,
  Button,
  Checkbox,
  Input,
  Slider,
  Progress,
  RadioGroup,
  Divider,
} from '@amulet-laboratories/rig'
import type { MenubarEntry, ListItem } from '@amulet-laboratories/rig'
import type { Era } from './eras'

const props = defineProps<{ era: Era }>()

const menus: MenubarEntry[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New Folder', keybinding: 'Ctrl+N' },
      { id: 'open', label: 'Open', keybinding: 'Ctrl+O' },
      { id: 'sep1', separator: true },
      { id: 'props', label: 'Properties…' },
      { id: 'close', label: 'Close', keybinding: 'Alt+F4' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', keybinding: 'Ctrl+Z', disabled: true },
      { id: 'cut', label: 'Cut', keybinding: 'Ctrl+X' },
      { id: 'copy', label: 'Copy', keybinding: 'Ctrl+C' },
      { id: 'paste', label: 'Paste', keybinding: 'Ctrl+V', disabled: true },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'icons', label: 'Large Icons' },
      { id: 'list', label: 'List' },
      { id: 'details', label: 'Details' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [{ id: 'about', label: 'About this Museum…' }],
  },
]

/* The collection, as files. Deliberately more rows than fit — the scrollbar is
 * the single most era-defining element on screen and it needs somewhere to go. */
const files: ListItem[] = [
  { id: 'readme', label: 'README.TXT', description: '2 KB' },
  { id: 'bevel', label: 'BEVEL.DOC', description: '14 KB' },
  { id: 'dither', label: 'DITHER.BMP', description: '62 KB' },
  { id: 'chicago', label: 'CHICAGO.FON', description: '48 KB' },
  { id: 'sysfont', label: 'SYSFONT.FON', description: '31 KB' },
  { id: 'scrollbar', label: 'SCROLLBR.DLL', description: '108 KB' },
  { id: 'titlebar', label: 'TITLEBAR.DLL', description: '76 KB' },
  { id: 'palette', label: 'PALETTE.PAL', description: '1 KB' },
  { id: 'cursors', label: 'CURSORS.ANI', description: '9 KB' },
  { id: 'chimes', label: 'CHIMES.WAV', description: '220 KB' },
  { id: 'notes', label: 'NOTES.WRI', description: '17 KB' },
  { id: 'colophon', label: 'COLOPHON.TXT', description: '4 KB' },
  { id: 'marching', label: 'MARCHING.ANT', description: '3 KB' },
  { id: 'emboss', label: 'EMBOSS.STY', description: '6 KB' },
  { id: 'stripes', label: 'STRIPES.PAT', description: '2 KB' },
  { id: 'knockout', label: 'KNOCKOUT.PAT', description: '2 KB' },
  { id: 'inverted', label: 'INVERTED.STY', description: '5 KB' },
  { id: 'segments', label: 'SEGMENTS.BAR', description: '8 KB' },
  { id: 'steppers', label: 'STEPPERS.DLL', description: '41 KB' },
  { id: 'grooves', label: 'GROOVES.STY', description: '3 KB' },
  { id: 'checker', label: 'CHECKER.PAT', description: '1 KB' },
  { id: 'tooltip', label: 'TOOLTIP.HLP', description: '12 KB' },
]

const selected = ref<string>('readme')
const showHidden = ref(true)
const readOnly = ref(false)
const filter = ref('*.*')
const zoom = ref(50)
const sortBy = ref('name')

const statusItems = computed(() => [
  { id: 'count', content: `${files.length} object(s)`, priority: 1, align: 'left' as const },
  { id: 'size', content: '592 KB', priority: 2, align: 'left' as const },
  { id: 'era', content: String(props.era.year), priority: 1, align: 'right' as const },
])
</script>

<template>
  <div data-museum-window>
    <TitleBar :title="`Collection — ${era.name}`">
      <template #leading>
        <Button aria-label="Window menu" data-museum-control>&#9776;</Button>
      </template>
      <template #trailing>
        <Button aria-label="Minimize" data-museum-control>&#95;</Button>
        <Button aria-label="Maximize" data-museum-control>&#9633;</Button>
        <Button aria-label="Close" data-museum-control>&#10005;</Button>
      </template>
    </TitleBar>

    <Menubar :items="menus" />

    <div data-museum-body>
      <ScrollArea
        steppers
        :stepper-placement="era.steppers ?? 'split'"
        :step="24"
        aria-label="Collection files"
      >
        <List :items="files" :selected="selected" aria-label="Files" @select="selected = $event" />
      </ScrollArea>

      <div data-museum-inspector>
        <Input v-model="filter" aria-label="Filter" />

        <Checkbox v-model="showHidden">Show hidden files</Checkbox>
        <Checkbox v-model="readOnly" disabled>Read only</Checkbox>

        <Divider />

        <RadioGroup
          v-model="sortBy"
          label="Sort by"
          :options="[
            { value: 'name', label: 'Name' },
            { value: 'size', label: 'Size' },
            { value: 'date', label: 'Date' },
          ]"
        />

        <Divider />

        <Slider v-model="zoom" :min="0" :max="100" aria-label="Icon size" />
        <Progress :value="62" aria-label="Disk used" />

        <div data-museum-actions>
          <Button>OK</Button>
          <Button>Cancel</Button>
          <Button disabled>Apply</Button>
        </div>
      </div>
    </div>

    <StatusBar :items="statusItems" />
  </div>
</template>
