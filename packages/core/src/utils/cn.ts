import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Combines clsx (conditional class composition) with tailwind-merge
 * (resolves conflicting Tailwind utilities — last wins).
 *
 * @example
 * cn('px-3 py-1.5', isActive && 'bg-primary', className)
 * cn('text-sm font-mono', { 'opacity-50': disabled })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
