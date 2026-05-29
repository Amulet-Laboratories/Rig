import type { ID } from './common'

/** A node in a tree structure */
export interface TreeNode<T = unknown> {
  id: ID
  label: string
  children?: TreeNode<T>[]
  /**
   * @deprecated TreeView manages expansion state externally via the `expanded` prop.
   * This field is retained for data-layer convenience but is ignored by the component.
   */
  expanded?: boolean
  /**
   * @deprecated TreeView manages selection state externally via the `selected` prop.
   * This field is retained for data-layer convenience but is ignored by the component.
   */
  selected?: boolean
  data?: T
  icon?: string
  loading?: boolean
}
