import type { ID } from './common'

/** An item in a flat list */
export interface ListItem<T = unknown> {
  id: ID
  label: string
  description?: string
  icon?: string
  data?: T
  disabled?: boolean
}
