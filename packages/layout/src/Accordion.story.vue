<script setup lang="ts">
import Accordion from './Accordion.vue'
import { ref } from 'vue'

const singleValue = ref('')
const multiValue = ref<string[]>([])
</script>

<template>
  <Story title="Accordion" icon="lucide:chevrons-down-up" group="layout">
    <Variant title="Single">
      <Accordion v-slot="{ isOpen, toggle, headerId, panelId }" v-model="singleValue">
        <div v-for="item in ['intro', 'details', 'faq']" :key="item">
          <h3>
            <button
              :id="headerId(item)"
              data-rig-accordion-trigger
              :aria-expanded="isOpen(item)"
              :aria-controls="panelId(item)"
              style="
                width: 100%;
                text-align: left;
                padding: 8px;
                background: var(--muted);
                border: 1px solid var(--border);
                color: var(--foreground);
                cursor: pointer;
              "
              @click="toggle(item)"
            >
              {{ item.charAt(0).toUpperCase() + item.slice(1) }}
              <span style="float: right">{{ isOpen(item) ? '&#8722;' : '+' }}</span>
            </button>
          </h3>
          <div
            v-if="isOpen(item)"
            :id="panelId(item)"
            :aria-labelledby="headerId(item)"
            role="region"
            style="
              padding: 8px;
              border: 1px solid var(--border);
              border-top: none;
              color: var(--muted-foreground);
            "
          >
            Content for {{ item }}.
          </div>
        </div>
      </Accordion>
    </Variant>

    <Variant title="Multiple">
      <Accordion
        v-slot="{ isOpen, toggle, headerId, panelId }"
        v-model="multiValue"
        type="multiple"
      >
        <div v-for="item in ['section-a', 'section-b', 'section-c']" :key="item">
          <h3>
            <button
              :id="headerId(item)"
              data-rig-accordion-trigger
              :aria-expanded="isOpen(item)"
              :aria-controls="panelId(item)"
              style="
                width: 100%;
                text-align: left;
                padding: 8px;
                background: var(--muted);
                border: 1px solid var(--border);
                color: var(--foreground);
                cursor: pointer;
              "
              @click="toggle(item)"
            >
              {{ item }}
            </button>
          </h3>
          <div
            v-if="isOpen(item)"
            :id="panelId(item)"
            :aria-labelledby="headerId(item)"
            role="region"
            style="
              padding: 8px;
              border: 1px solid var(--border);
              border-top: none;
              color: var(--muted-foreground);
            "
          >
            Content for {{ item }}.
          </div>
        </div>
      </Accordion>
    </Variant>

    <Variant title="Non-collapsible">
      <div style="margin-bottom: 8px; font-size: 12px; color: var(--muted-foreground)">
        Once opened, the active item cannot be collapsed.
      </div>
      <Accordion
        v-slot="{ isOpen, toggle, headerId, panelId }"
        model-value="always-open"
        :collapsible="false"
      >
        <div v-for="item in ['always-open', 'second', 'third']" :key="item">
          <h3>
            <button
              :id="headerId(item)"
              data-rig-accordion-trigger
              :aria-expanded="isOpen(item)"
              :aria-controls="panelId(item)"
              style="
                width: 100%;
                text-align: left;
                padding: 8px;
                background: var(--muted);
                border: 1px solid var(--border);
                color: var(--foreground);
                cursor: pointer;
              "
              @click="toggle(item)"
            >
              {{ item }}
            </button>
          </h3>
          <div
            v-if="isOpen(item)"
            :id="panelId(item)"
            :aria-labelledby="headerId(item)"
            role="region"
            style="
              padding: 8px;
              border: 1px solid var(--border);
              border-top: none;
              color: var(--muted-foreground);
            "
          >
            Content for {{ item }}.
          </div>
        </div>
      </Accordion>
    </Variant>

    <Variant title="Disabled">
      <Accordion
        v-slot="{ isOpen, toggle, disabled: isDisabled, headerId, panelId }"
        model-value=""
        disabled
      >
        <div v-for="item in ['locked-a', 'locked-b']" :key="item">
          <h3>
            <button
              :id="headerId(item)"
              data-rig-accordion-trigger
              :aria-expanded="isOpen(item)"
              :aria-controls="panelId(item)"
              :aria-disabled="isDisabled"
              :disabled="isDisabled"
              style="
                width: 100%;
                text-align: left;
                padding: 8px;
                background: var(--muted);
                border: 1px solid var(--border);
                color: var(--muted-foreground);
                cursor: not-allowed;
                opacity: 0.5;
              "
              @click="toggle(item)"
            >
              {{ item }} (disabled)
            </button>
          </h3>
        </div>
      </Accordion>
    </Variant>
  </Story>
</template>
