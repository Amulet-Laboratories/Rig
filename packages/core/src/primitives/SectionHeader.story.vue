<script setup lang="ts">
import SectionHeader from './SectionHeader.vue'
</script>

<template>
  <Story title="SectionHeader" icon="lucide:heading" group="core">
    <Variant title="Sizes">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <SectionHeader size="xs">Extra Small (default)</SectionHeader>
        <SectionHeader size="sm">Small</SectionHeader>
        <SectionHeader size="md">Medium</SectionHeader>
        <SectionHeader size="lg">Large</SectionHeader>
      </div>
    </Variant>

    <Variant title="Muted vs Not">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <SectionHeader>Muted (default)</SectionHeader>
        <SectionHeader :muted="false">Not Muted</SectionHeader>
      </div>
    </Variant>

    <Variant title="Custom Element">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <SectionHeader as="h2" size="sm" :muted="false">Page Title (h2)</SectionHeader>
        <SectionHeader as="h4">Section Label (h4)</SectionHeader>
        <SectionHeader as="span">Inline Label (span)</SectionHeader>
      </div>
    </Variant>
  </Story>
</template>
