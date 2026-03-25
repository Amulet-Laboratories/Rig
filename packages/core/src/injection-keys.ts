import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { ID, TabItem, Action } from './types'

// --- Global State ---

export interface GlobalState {
  openEditors: Ref<TabItem[]>
  activeEditorId: Ref<ID | null>
  sidebarVisible: Ref<boolean>
  panelVisible: Ref<boolean>
  sizes: Ref<{ sideWidth: number; panelHeight: number }>
  openEditor: (tab: TabItem) => void
  closeEditor: (id: ID) => void
  setActiveEditor: (id: ID | null) => void
  toggleSidebar: () => void
  togglePanel: () => void
}

export const GlobalStateKey: InjectionKey<GlobalState> = Symbol('rig-global-state')

// --- Command Registry ---

export interface Command extends Action {
  category?: string
}

export interface CommandRegistry {
  register: (cmd: Command) => void
  unregister: (id: ID) => void
  execute: (id: ID) => void
  list: () => Command[]
  search: (query: string) => Command[]
}

export const CommandRegistryKey: InjectionKey<CommandRegistry> = Symbol('rig-command-registry')

// --- Theme ---

export interface ThemeController {
  theme: Ref<string>
  setTheme: (name: string) => void
  availableThemes: ComputedRef<string[]>
}

export const ThemeKey: InjectionKey<ThemeController> = Symbol('rig-theme')

// --- Drag & Drop ---

export interface DragDropController {
  isDragging: Ref<boolean>
  dragData: Ref<unknown>
  startDrag: (data: unknown) => void
  endDrag: () => void
}

export const DragDropKey: InjectionKey<DragDropController> = Symbol('rig-drag-drop')

// --- Tooltip ---

/** Structurally compatible with Floating UI's VirtualElement. */
export interface TooltipVirtualEl {
  getBoundingClientRect(): DOMRect
}

export interface TooltipState {
  visible: Ref<boolean>
  content: Ref<string>
  referenceEl: Ref<HTMLElement | TooltipVirtualEl | null>
  placement: Ref<'top' | 'bottom' | 'left' | 'right'>
  show: (
    target: HTMLElement,
    content: string,
    placement?: 'top' | 'bottom' | 'left' | 'right',
  ) => void
  /** Show tooltip at a fixed viewport point (e.g. cursor position). */
  showAtPoint: (
    x: number,
    y: number,
    content: string,
    placement?: 'top' | 'bottom' | 'left' | 'right',
  ) => void
  hide: () => void
}

export const TooltipKey: InjectionKey<TooltipState> = Symbol('rig-tooltip')

// --- Announce ---

export interface AnnounceState {
  message: Ref<string>
  announce: (text: string) => void
}

export const AnnounceKey: InjectionKey<AnnounceState> = Symbol('rig-announce')
