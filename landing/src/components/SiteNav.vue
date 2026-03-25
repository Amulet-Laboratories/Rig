<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollTo } from '@/composables/useScrollTo'

const scrolled = ref(false)
const mobileOpen = ref(false)
const activeSection = ref<string | null>(null)
const scrollTo = useScrollTo()

let observer: IntersectionObserver | null = null

function onScroll() {
  scrolled.value = window.scrollY > 40
  if (mobileOpen.value) mobileOpen.value = false
}

function navigateTo(id: string) {
  mobileOpen.value = false
  scrollTo(id)
}

function isActive(id: string) {
  return activeSection.value === id
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )

  for (const id of ['packages', 'themes', 'composables']) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
    :class="scrolled ? 'bg-bg/90 backdrop-blur-xl border-b border-border-subtle' : 'bg-transparent'"
    aria-label="Primary"
  >
    <div class="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
      <div class="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-text">
        <span
          class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[13px] font-bold tracking-wider text-bg"
          aria-hidden="true"
        >
          R
        </span>
        <span>Rig <span class="font-normal text-text-muted">+ Hex</span></span>
      </div>

      <div class="hidden items-center gap-7 text-sm sm:flex">
        <button
          class="transition hover:text-text"
          :class="isActive('packages') ? 'text-primary' : 'text-text-muted'"
          @click="navigateTo('packages')"
        >
          Components
        </button>
        <button
          class="transition hover:text-text"
          :class="isActive('themes') ? 'text-primary' : 'text-text-muted'"
          @click="navigateTo('themes')"
        >
          Themes
        </button>
        <button
          class="transition hover:text-text"
          :class="isActive('composables') ? 'text-primary' : 'text-text-muted'"
          @click="navigateTo('composables')"
        >
          Composables
        </button>
        <a href="/hexrig/story/" class="text-text-muted transition hover:text-text"> Playground </a>
        <a
          href="https://github.com/Amulet-Laboratories/Rig"
          target="_blank"
          rel="noopener"
          class="text-text-muted transition hover:text-text"
        >
          GitHub
        </a>
        <button
          class="rounded-[5px] bg-primary px-4 py-[7px] text-[13px] font-medium text-bg transition hover:bg-primary-hover"
          @click="navigateTo('get-started')"
        >
          Get Started
        </button>
      </div>

      <button
        class="flex flex-col gap-1.5 sm:hidden"
        :aria-expanded="mobileOpen"
        aria-label="Toggle navigation"
        @click="mobileOpen = !mobileOpen"
      >
        <span
          class="block h-0.5 w-5 bg-text-muted transition"
          :class="mobileOpen ? 'translate-y-2 rotate-45' : ''"
        />
        <span
          class="block h-0.5 w-5 bg-text-muted transition"
          :class="mobileOpen ? 'opacity-0' : ''"
        />
        <span
          class="block h-0.5 w-5 bg-text-muted transition"
          :class="mobileOpen ? '-translate-y-2 -rotate-45' : ''"
        />
      </button>
    </div>

    <div
      v-if="mobileOpen"
      class="flex flex-col gap-4 border-t border-border-subtle bg-bg/95 px-6 py-6 backdrop-blur-xl sm:hidden"
    >
      <button
        class="text-left"
        :class="isActive('packages') ? 'text-primary' : 'text-text-muted'"
        @click="navigateTo('packages')"
      >
        Components
      </button>
      <button
        class="text-left"
        :class="isActive('themes') ? 'text-primary' : 'text-text-muted'"
        @click="navigateTo('themes')"
      >
        Themes
      </button>
      <button
        class="text-left"
        :class="isActive('composables') ? 'text-primary' : 'text-text-muted'"
        @click="navigateTo('composables')"
      >
        Composables
      </button>
      <a href="/hexrig/story/" class="text-text-muted" @click="mobileOpen = false">Playground</a>
      <a
        href="https://github.com/Amulet-Laboratories/Rig"
        target="_blank"
        rel="noopener"
        class="text-text-muted"
        >GitHub</a
      >
      <button
        class="mt-2 rounded-[5px] bg-primary px-4 py-2 text-sm font-medium text-bg"
        @click="navigateTo('get-started')"
      >
        Get Started
      </button>
    </div>
  </nav>
</template>
