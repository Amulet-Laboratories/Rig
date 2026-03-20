// composables/useConfirm.ts
// Reactive in-app confirmation dialog — module-level singleton so stores
// can call requestConfirm() without needing a component context.

import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  destructive?: boolean
}

export interface ConfirmRequest {
  title: string
  message: string
  confirmLabel: string
  destructive: boolean
  resolve: (value: boolean) => void
}

/** Singleton pending state — shared across all callers. */
const pending = ref<ConfirmRequest | null>(null)

/** Trigger an in-app confirmation dialog. Resolves to true (confirmed) or false (cancelled). */
export async function requestConfirm(options: string | ConfirmOptions): Promise<boolean> {
  const opts = typeof options === 'string' ? { message: options } : options
  return new Promise<boolean>((resolve) => {
    pending.value = {
      title: opts.title ?? 'Confirm',
      message: opts.message,
      confirmLabel: opts.confirmLabel ?? 'Confirm',
      destructive: opts.destructive ?? false,
      resolve,
    }
  })
}

/** Used by ConfirmDialog to access pending state and settle the promise. */
export function useConfirm() {
  function confirm(): void {
    if (pending.value) {
      pending.value.resolve(true)
      pending.value = null
    }
  }

  function cancel(): void {
    if (pending.value) {
      pending.value.resolve(false)
      pending.value = null
    }
  }

  return { pending, confirm, cancel }
}
