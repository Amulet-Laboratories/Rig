<script setup lang="ts">
import { Button } from '@core/primitives'
import { Modal } from '@layout/index'
import { useConfirm } from '@core/composables/useConfirm'

const { pending, confirm, cancel } = useConfirm()
</script>

<template>
  <Modal :open="!!pending" persistent aria-label="Confirm action" @update:open="cancel">
    <div
      data-rig-confirm-dialog
      role="alertdialog"
      aria-modal="true"
      :aria-describedby="pending ? 'rig-confirm-desc' : undefined"
    >
      <h2 data-rig-confirm-dialog-title>
        {{ pending?.title ?? 'Confirm' }}
      </h2>
      <p id="rig-confirm-desc" data-rig-confirm-dialog-message>
        {{ pending?.message }}
      </p>
      <div data-rig-confirm-dialog-actions>
        <Button variant="ghost" size="sm" @click="cancel">Cancel</Button>
        <Button
          :variant="pending?.destructive ? 'destructive' : 'primary'"
          size="sm"
          @click="confirm"
          >{{ pending?.confirmLabel ?? 'Confirm' }}</Button
        >
      </div>
    </div>
  </Modal>
</template>
