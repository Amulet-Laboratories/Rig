import type { ID } from './common'

/** An option in a Select dropdown */
export interface SelectOption {
  id: ID
  label: string
  disabled?: boolean
}
