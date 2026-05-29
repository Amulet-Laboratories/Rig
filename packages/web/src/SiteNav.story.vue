<script setup lang="ts">
import SiteNav from './SiteNav.vue'
import type { NavItem } from './SiteNav.vue'
import { ref } from 'vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

const currentPage = ref('home')
const pgSticky = ref(false)
const pgCurrentPage = ref('home')
const pgAriaLabel = ref('Main navigation')

function onNavigate(page: string) {
  currentPage.value = page
}
</script>

<template>
  <Story title="SiteNav" icon="lucide:navigation" group="web">
    <Variant title="Default">
      <SiteNav :pages="pages" :current-page="currentPage" @navigate="onNavigate">
        <template #brand>
          <span style="font-weight: 700; color: var(--foreground)">Acme Co</span>
        </template>
      </SiteNav>
    </Variant>

    <Variant title="Sticky">
      <SiteNav :pages="pages" :current-page="currentPage" sticky @navigate="onNavigate">
        <template #brand>
          <span style="font-weight: 700; color: var(--foreground)">Acme Co</span>
        </template>
      </SiteNav>
    </Variant>

    <Variant title="With Utility Bar">
      <SiteNav :pages="pages" :current-page="currentPage" @navigate="onNavigate">
        <template #utility-bar>
          <div
            style="
              padding: 4px 24px;
              font-size: 12px;
              text-align: center;
              background: var(--primary);
              color: var(--primary-foreground);
            "
          >
            Free shipping on orders over $50
          </div>
        </template>
        <template #brand>
          <span style="font-weight: 700; color: var(--foreground)">Acme Co</span>
        </template>
      </SiteNav>
    </Variant>

    <Variant title="With Trailing Action">
      <SiteNav :pages="pages" :current-page="currentPage" @navigate="onNavigate">
        <template #brand>
          <span style="font-weight: 700; color: var(--foreground)">Acme Co</span>
        </template>
        <template #trailing>
          <button
            style="
              padding: 6px 14px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            "
          >
            Sign Up
          </button>
        </template>
      </SiteNav>
    </Variant>

    <Variant title="Playground">
      <SiteNav
        :pages="pages"
        :current-page="pgCurrentPage"
        :sticky="pgSticky"
        :aria-label="pgAriaLabel"
        @navigate="pgCurrentPage = $event"
      >
        <template #brand>
          <span style="font-weight: 700; color: var(--foreground)">Acme Co</span>
        </template>
      </SiteNav>

      <template #controls>
        <HstSelect v-model="pgCurrentPage" title="Current Page" :options="pages.map((p) => p.id)" />
        <HstCheckbox v-model="pgSticky" title="Sticky" />
        <HstText v-model="pgAriaLabel" title="Aria Label" />
      </template>
    </Variant>
  </Story>
</template>
