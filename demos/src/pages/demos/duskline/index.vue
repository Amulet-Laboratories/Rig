<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/duskline.css'
import '@amulet-laboratories/rig/hex/scoped/lagoon'
import { SiteShell, SiteNav, SiteFooter, Icon, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import ServicesPage from './pages/ServicesPage.vue'
import CredentialsPage from './pages/CredentialsPage.vue'
import ProcessPage from './pages/ProcessPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="lagoon">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="glass"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button
            class="cursor-pointer text-sm font-medium uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
            @click="navigateTo('home')"
          >
            Duskline
          </button>
        </template>

        <template #trailing>
          <a
            href="tel:+15415550177"
            class="hidden items-center gap-1.5 pr-4 text-xs text-primary uppercase tracking-eyebrow transition-opacity hover:opacity-70 sm:inline-flex"
          >
            (541) 555-0177
          </a>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <ServicesPage v-else-if="currentPage === 'services'" @navigate="navigateTo" />
    <CredentialsPage v-else-if="currentPage === 'credentials'" @navigate="navigateTo" />
    <ProcessPage v-else-if="currentPage === 'process'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="1">
        <div class="text-center">
          <div class="mx-auto mb-6 h-px w-16 bg-background opacity-30" aria-hidden="true" />
          <p
            class="flex items-center justify-center gap-2 font-mono text-xs text-background tracking-wide"
          >
            <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
            <a href="tel:+15415550177" class="transition-opacity hover:opacity-70"
              >(541) 555-0177</a
            >
          </p>
          <p class="mt-2 text-xs font-medium uppercase tracking-eyebrow text-background opacity-70">
            Licensed · Bonded · Insured
          </p>
          <p class="mt-3 text-xs text-background opacity-50">
            &copy; {{ new Date().getFullYear() }} Duskline Investigations
          </p>
        </div>
      </SiteFooter>
    </template>

    <!-- Mobile CTA bar -->
    <div
      class="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t border-border bg-background px-4 py-3 sm:hidden"
    >
      <a
        href="tel:+15415550177"
        class="flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary py-2.5 text-xs font-medium text-primary-foreground uppercase tracking-wider transition-opacity hover:opacity-90"
      >
        <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
        Call (541) 555-0177
      </a>
    </div>
  </SiteShell>
  <DemoAttribution />
</template>
