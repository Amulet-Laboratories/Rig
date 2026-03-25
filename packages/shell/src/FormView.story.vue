<script setup lang="ts">
import FormView from './FormView.vue'
import { ref } from 'vue'

const pgTitle = ref('Edit Entry')
const pgSaving = ref(false)
const pgShowActions = ref(true)
const pgSaveLabel = ref('Save')
const pgCancelLabel = ref('Cancel')
</script>

<template>
  <Story title="FormView" icon="lucide:form-input" group="shell">
    <Variant title="Default">
      <div style="height: 400px; border: 1px solid var(--border)">
        <FormView title="Edit Entry" show-actions>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px">
            <label
              style="
                display: flex;
                flex-direction: column;
                gap: 4px;
                color: var(--foreground);
                font-size: 13px;
              "
            >
              Name
              <input
                type="text"
                value="Kael Thornwick"
                style="
                  padding: 6px 10px;
                  background: var(--input);
                  color: var(--foreground);
                  border: 1px solid var(--border);
                  border-radius: 4px;
                  font-size: 13px;
                "
              />
            </label>
            <label
              style="
                display: flex;
                flex-direction: column;
                gap: 4px;
                color: var(--foreground);
                font-size: 13px;
              "
            >
              Description
              <textarea
                rows="3"
                style="
                  padding: 6px 10px;
                  background: var(--input);
                  color: var(--foreground);
                  border: 1px solid var(--border);
                  border-radius: 4px;
                  font-size: 13px;
                  resize: vertical;
                "
              >
A wandering scholar of the old arcane traditions.</textarea
              >
            </label>
          </div>
        </FormView>
      </div>
    </Variant>

    <Variant title="Without Actions">
      <div style="height: 300px; border: 1px solid var(--border)">
        <FormView title="View Details">
          <div style="padding: 16px; color: var(--foreground); font-size: 13px">
            Read-only form content with no save/cancel bar.
          </div>
        </FormView>
      </div>
    </Variant>

    <Variant title="Saving">
      <div style="height: 300px; border: 1px solid var(--border)">
        <FormView title="Edit Entry" show-actions saving>
          <div style="padding: 16px; color: var(--muted-foreground); font-size: 13px">
            Form is currently saving...
          </div>
        </FormView>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 400px; border: 1px solid var(--border)">
        <FormView
          :title="pgTitle"
          :saving="pgSaving"
          :show-actions="pgShowActions"
          :save-label="pgSaveLabel"
          :cancel-label="pgCancelLabel"
        >
          <div style="padding: 16px; color: var(--foreground); font-size: 13px">
            Playground form body content.
          </div>
        </FormView>
      </div>

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
        <HstCheckbox v-model="pgSaving" title="Saving" />
        <HstCheckbox v-model="pgShowActions" title="Show Actions" />
        <HstText v-model="pgSaveLabel" title="Save Label" />
        <HstText v-model="pgCancelLabel" title="Cancel Label" />
      </template>
    </Variant>
  </Story>
</template>
