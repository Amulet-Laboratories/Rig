import type { ID } from './common'

/** A node in a tree structure */
export interface TreeNode<T = unknown> {
  id: ID
  label: string
  children?: TreeNode<T>[]
  expanded?: boolean
  selected?: boolean
  data?: T
  icon?: string
  loading?: boolean
}
