<script setup lang="ts">
import Section from './Section.vue'
import { ref } from 'vue'

const pgVariant = ref<'default' | 'alternate' | 'bordered'>('default')
const pgTitle = ref('Section Title')
const pgSubtitle = ref('Optional subtitle beneath the heading.')
const pgDecorated = ref(true)
const pgCentered = ref(true)
</script>

<template>
  <Story title="Section" icon="lucide:layout-list" group="web">
    <Variant title="Default">
      <Section title="Our Services" subtitle="Everything you need to succeed.">
        <div style="padding: 24px 0; color: var(--foreground)">Section body content goes here.</div>
      </Section>
    </Variant>

    <Variant title="Variants">
      <div style="display: flex; flex-direction: column; gap: 24px">
        <Section variant="default" title="Default Variant">
          <div style="padding: 16px 0; color: var(--foreground)">Transparent background.</div>
        </Section>
        <Section variant="alternate" title="Alternate Variant">
          <div style="padding: 16px 0; color: var(--foreground)">Card background.</div>
        </Section>
        <Section variant="bordered" title="Bordered Variant">
          <div style="padding: 16px 0; color: var(--foreground)">
            Card background with border-y.
          </div>
        </Section>
      </div>
    </Variant>

    <Variant title="No Decoration">
      <Section title="Plain Heading" :decorated="false">
        <div style="padding: 16px 0; color: var(--foreground)">
          No accent bar beneath the title.
        </div>
      </Section>
    </Variant>

    <Variant title="Left-Aligned Header">
      <Section title="Left-Aligned" subtitle="Header aligned to the start." :centered="false">
        <div style="padding: 16px 0; color: var(--foreground)">
          Content below a left-aligned header.
        </div>
      </Section>
    </Variant>

    <Variant title="Custom Header Slot">
      <Section>
        <template #header>
          <div style="display: flex; align-items: center; gap: 12px; color: var(--foreground)">
            <span style="font-size: 28px; font-weight: 700">Custom Header</span>
            <span
              style="
                padding: 2px 8px;
                font-size: 12px;
                background: var(--primary);
                color: var(--primary-foreground);
                border-radius: 4px;
              "
            >
              New
            </span>
          </div>
        </template>
        <div style="padding: 16px 0; color: var(--foreground)">
          Full control over the header area via the #header slot.
        </div>
      </Section>
    </Variant>

    <Variant title="Playground">
      <Section
        :variant="pgVariant"
        :title="pgTitle"
        :subtitle="pgSubtitle"
        :decorated="pgDecorated"
        :centered="pgCentered"
      >
        <div style="padding: 24px 0; color: var(--foreground)">
          Adjust the controls to explore Section props.
        </div>
      </Section>

      <template #controls>
        <HstSelect
          v-model="pgVariant"
          title="Variant"
          :options="['default', 'alternate', 'bordered']"
        />
        <HstText v-model="pgTitle" title="Title" />
        <HstText v-model="pgSubtitle" title="Subtitle" />
        <HstCheckbox v-model="pgDecorated" title="Decorated" />
        <HstCheckbox v-model="pgCentered" title="Centered" />
      </template>
    </Variant>
  </Story>
</template>
