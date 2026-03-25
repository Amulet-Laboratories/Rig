<script setup lang="ts">
/**
 * SiteNav — responsive horizontal navigation for marketing sites.
 *
 * Renders a nav bar with brand, links (desktop), trailing actions, and
 * a mobile hamburger toggle. All visual styling comes from Hex via
 * [data-rig-site-nav] selectors.
 *
 * Accessibility:
 *   - Mobile menu has a focus trap (Tab cycles through links)
 *   - Escape key closes the mobile menu
 *   - Focus auto-moves to first link on open, back to toggle on close
 *
 * Slots:
 *   #utility-bar          — content above the nav bar (phone/email bar, alert)
 *   #brand                — logo / brand text (left side)
 *   #link({ page, active })         — override individual nav link rendering
 *   #trailing             — content after nav links (cart icon, CTA button)
 *   #toggle-icon({ open })          — override the hamburger/close icon SVG
 *   #mobile-link({ page, active })  — override individual mobile link rendering
 */
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

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
  /** Visual layout variant — styled via Hex CSS. */
  variant?: 'pill' | 'glass' | 'theater' | 'split' | 'drawer' | 'overlay' | 'tabs'
}>()

const emit = defineEmits<{
  navigate: [page: string]
}>()

const mobileOpen = ref(false)
const mobileMenuRef = ref<HTMLElement | null>(null)
const toggleRef = ref<HTMLElement | null>(null)

function handleNav(page: string) {
  emit('navigate', page)
  mobileOpen.value = false
}

/* ── Focus trap ────────────────────────────────────────────── */

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
    return
  }

  if (e.key === 'Tab' && mobileOpen.value && mobileMenuRef.value) {
    const focusable = mobileMenuRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    if (focusable.length === 0) return

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

// Move focus into menu on open, back to toggle on close.
watch(mobileOpen, (open) => {
  if (open) {
    nextTick(() => {
      const firstLink = mobileMenuRef.value?.querySelector<HTMLElement>('a[href], button')
      firstLink?.focus()
    })
  } else {
    nextTick(() => toggleRef.value?.focus())
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <nav
    data-rig-site-nav
    :data-sticky="sticky || undefined"
    :data-variant="variant || undefined"
    :data-mobile-open="mobileOpen || undefined"
    :aria-label="ariaLabel ?? 'Main navigation'"
  >
    <slot name="utility-bar" />

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
              @click.prevent="handleNav(page.id)"
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
            ref="toggleRef"
            data-rig-site-nav-toggle
            :aria-expanded="mobileOpen"
            aria-controls="rig-mobile-nav"
            aria-label="Toggle menu"
            @click="mobileOpen = !mobileOpen"
          >
            <slot name="toggle-icon" :open="mobileOpen">
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
                  v-if="!mobileOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </slot>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="mobileOpen"
      id="rig-mobile-nav"
      ref="mobileMenuRef"
      role="dialog"
      aria-label="Navigation menu"
      data-rig-site-nav-mobile
    >
      <template v-for="page in pages" :key="page.id">
        <a
          v-if="page.href"
          :href="page.href"
          data-rig-site-nav-mobile-link
          :data-active="page.id === currentPage || undefined"
          @click.prevent="handleNav(page.id)"
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
