<script setup lang="ts">
/**
 * SiteNav — responsive horizontal navigation for marketing sites.
 *
 * Renders a nav bar with brand, links (desktop), trailing actions, and
 * a mobile hamburger toggle. All visual styling comes from Hex via
 * [data-rig-site-nav] selectors.
 *
 * Slots:
 *   #utility-bar    — content above the nav bar (phone/email bar, alert)
 *   #brand          — logo / brand text (left side)
 *   #link           — scoped: override individual nav link rendering
 *   #trailing       — content after nav links (cart icon, CTA button)
 *   #toggle-icon    — override the hamburger icon SVG
 *   #mobile-link    — scoped: override individual mobile link rendering
 */
import { ref, useSlots } from 'vue'

export interface NavItem {
  id: string
  label: string
  href?: string
}

defineProps<{
  /** Navigation items. */
  pages: NavItem[]
  /** Currently active page id. */
  currentPage?: string
  /** Stick nav to viewport top. */
  sticky?: boolean
  /** Accessible label for the nav landmark. */
  ariaLabel?: string
}>()

const emit = defineEmits<{
  navigate: [page: string]
}>()

const slots = useSlots()
const mobileOpen = ref(false)

function handleNav(page: string) {
  emit('navigate', page)
  mobileOpen.value = false
}
</script>

<template>
  <nav
    data-rig-site-nav
    :data-sticky="sticky || undefined"
    :aria-label="ariaLabel ?? 'Main navigation'"
  >
    <div v-if="slots['utility-bar']" data-rig-site-nav-utility>
      <slot name="utility-bar" />
    </div>

    <div data-rig-site-nav-bar>
      <div data-rig-site-nav-container>
        <div data-rig-site-nav-brand>
          <slot name="brand" />
        </div>

        <div data-rig-site-nav-links>
          <template v-for="page in pages" :key="page.id">
            <a
              v-if="page.href"
              :href="page.href"
              data-rig-site-nav-link
              :data-active="page.id === currentPage || undefined"
              @click="handleNav(page.id)"
            >
              <slot name="link" :page="page" :active="page.id === currentPage">
                {{ page.label }}
              </slot>
            </a>
            <button
              v-else
              data-rig-site-nav-link
              :data-active="page.id === currentPage || undefined"
              @click="handleNav(page.id)"
            >
              <slot name="link" :page="page" :active="page.id === currentPage">
                {{ page.label }}
              </slot>
            </button>
          </template>
        </div>

        <div data-rig-site-nav-actions>
          <slot name="trailing" />

          <button
            data-rig-site-nav-toggle
            :aria-expanded="mobileOpen"
            aria-controls="rig-mobile-nav"
            aria-label="Toggle menu"
            @click="mobileOpen = !mobileOpen"
          >
            <slot name="toggle-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </slot>
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileOpen" id="rig-mobile-nav" data-rig-site-nav-mobile>
      <template v-for="page in pages" :key="page.id">
        <a
          v-if="page.href"
          :href="page.href"
          data-rig-site-nav-mobile-link
          :data-active="page.id === currentPage || undefined"
          @click="handleNav(page.id)"
        >
          <slot name="mobile-link" :page="page" :active="page.id === currentPage">
            {{ page.label }}
          </slot>
        </a>
        <button
          v-else
          data-rig-site-nav-mobile-link
          :data-active="page.id === currentPage || undefined"
          @click="handleNav(page.id)"
        >
          <slot name="mobile-link" :page="page" :active="page.id === currentPage">
            {{ page.label }}
          </slot>
        </button>
      </template>
    </div>
  </nav>
</template>
