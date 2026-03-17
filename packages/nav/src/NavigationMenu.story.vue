<script setup lang="ts">
import NavigationMenu from './NavigationMenu.vue'

const itemsWithChildren = [
  {
    id: 'products',
    label: 'Products',
    children: [
      { id: 'analytics', label: 'Analytics', href: '#analytics' },
      { id: 'automation', label: 'Automation', href: '#automation' },
      { id: 'integrations', label: 'Integrations', href: '#integrations' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    children: [
      { id: 'docs', label: 'Documentation', href: '#docs' },
      { id: 'guides', label: 'Guides', href: '#guides' },
    ],
  },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
  { id: 'about', label: 'About', href: '#about' },
]

const linksOnly = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'docs', label: 'Docs', href: '#docs' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]
</script>

<template>
  <Story title="Nav/NavigationMenu" icon="lucide:navigation" group="nav">
    <Variant title="Default">
      <NavigationMenu :items="itemsWithChildren" @select="() => {}" />
    </Variant>

    <Variant title="Links Only">
      <NavigationMenu :items="linksOnly" @select="() => {}" />
    </Variant>
  </Story>
</template>
