<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/aldric-pace.css'
import '@amulet-laboratories/rig/hex/scoped/harbor'
import { SiteShell, SiteNav, SiteFooter, Icon, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import PracticesPage from './pages/PracticesPage.vue'
import AttorneysPage from './pages/AttorneysPage.vue'
import ResourcesPage from './pages/ResourcesPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Our Firm' },
  { id: 'practices', label: 'Practice Areas' },
  { id: 'attorneys', label: 'Attorneys' },
  { id: 'resources', label: 'Resources' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="harbor">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="split"
        sticky
        @navigate="navigateTo"
      >
        <template #utility-bar>
          <div class="mx-auto flex max-w-5xl items-center justify-center gap-4 sm:justify-start">
            <a
              href="tel:+15415550148"
              class="flex items-center gap-1 transition-colors hover:underline"
              ><Icon icon="heroicons:phone" size="sm" aria-hidden="true" />(541) 555-0148</a
            >
            <a
              href="mailto:intake@aldricpace.com"
              class="flex items-center gap-1 transition-colors hover:underline"
              ><Icon
                icon="heroicons:envelope"
                size="sm"
                aria-hidden="true"
              />intake@aldricpace.com</a
            >
          </div>
        </template>

        <template #brand>
          <button class="text-left transition-opacity hover:opacity-70" @click="navigateTo('home')">
            <span class="font-serif text-lg">Aldric, Pace & Wynn</span>
            <span class="ml-2 text-xs">LLP</span>
          </button>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <AboutPage v-else-if="currentPage === 'about'" @navigate="navigateTo" />
    <PracticesPage v-else-if="currentPage === 'practices'" @navigate="navigateTo" />
    <AttorneysPage v-else-if="currentPage === 'attorneys'" @navigate="navigateTo" />
    <ResourcesPage v-else-if="currentPage === 'resources'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3">
        <div>
          <p class="font-serif text-sm">Aldric, Pace & Wynn LLP</p>
          <p class="mt-1 text-xs">Est. 1996</p>
          <address class="mt-3 not-italic text-xs leading-relaxed">
            240 Harbor Street, Suite 300<br />Briar Cove, Oregon 97420<br />
            <a href="tel:+15415550148" class="transition-colors hover:underline">(541) 555-0148</a>
          </address>
        </div>
        <div>
          <p class="text-xs font-medium uppercase tracking-wider">Practice Areas</p>
          <ul class="mt-2 space-y-1 text-xs">
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('practices')">
                Real Estate Law
              </button>
            </li>
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('practices')">
                Estate Planning
              </button>
            </li>
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('practices')">
                Business Formation
              </button>
            </li>
          </ul>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-medium uppercase tracking-wider">Hours</p>
          <p class="mt-2 text-xs">Monday–Friday, 8:30 AM – 5:00 PM</p>
          <p class="mt-4 text-xs leading-relaxed">
            This site does not constitute legal advice. No attorney-client relationship is formed by
            use of this site.
          </p>
          <p class="mt-3 text-xs">&copy; {{ new Date().getFullYear() }} Aldric, Pace & Wynn LLP</p>
        </div>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
