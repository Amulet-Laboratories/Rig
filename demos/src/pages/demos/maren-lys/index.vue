<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/maren-lys.css'
import '@amulet-laboratories/rig/hex/scoped/orchid'
import { SiteShell, SiteNav, SiteFooter, Icon, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import WorkPage from './pages/WorkPage.vue'
import AboutPage from './pages/AboutPage.vue'
import NewsPage from './pages/NewsPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'news', label: 'News' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="orchid">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="theater"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button
            class="font-smallcaps text-sm transition-opacity hover:opacity-70"
            @click="navigateTo('home')"
          >
            maren lys
          </button>
        </template>

        <template #trailing>
          <button
            class="text-accent hidden text-xs uppercase transition-opacity hover:opacity-70 sm:inline-flex"
            @click="navigateTo('contact')"
          >
            Inquire
          </button>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <WorkPage v-else-if="currentPage === 'work'" @navigate="navigateTo" />
    <AboutPage v-else-if="currentPage === 'about'" @navigate="navigateTo" />
    <NewsPage v-else-if="currentPage === 'news'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" />

    <template #footer>
      <SiteFooter :columns="3" variant="card">
        <div>
          <h2 class="text-2xl font-normal italic">Contact</h2>
        </div>
        <div class="text-sm">
          <p class="text-xs uppercase">Sales</p>
          <address class="mt-2 not-italic">
            <a
              href="https://brinegallery.com"
              class="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
              >Brine Gallery</a
            >, Portland, OR
          </address>
        </div>
        <div class="text-sm">
          <p class="text-xs uppercase">Studio</p>
          <address class="mt-2 not-italic">
            <p class="flex items-center gap-1.5">
              <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
              <a
                href="mailto:hello@marenlys.com"
                class="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
                >hello@marenlys.com</a
              >
            </p>
            <p class="mt-1 text-xs">Dune Quarter, Briar Cove, Oregon</p>
            <p class="text-muted-foreground mt-0.5 text-xs">Visits by appointment</p>
          </address>
        </div>
        <template #post-footer>
          <div class="mx-auto max-w-5xl">
            <div class="bg-border mt-12 h-px w-full" aria-hidden="true" />
            <p class="mt-6 text-center text-xs">
              &copy; {{ new Date().getFullYear() }} Maren Lys · Briar Cove, Oregon
            </p>
          </div>
        </template>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
