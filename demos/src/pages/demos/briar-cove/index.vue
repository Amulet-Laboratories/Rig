<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/briar-cove.css'
import '@amulet-laboratories/rig/hex/scoped/iris'
import {
  Alert,
  SiteShell,
  SiteNav,
  SiteFooter,
  Icon,
  useHashRouter,
} from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import ServicesPage from './pages/ServicesPage.vue'
import GovernmentPage from './pages/GovernmentPage.vue'
import MeetingsPage from './pages/MeetingsPage.vue'
import NoticesPage from './pages/NoticesPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'government', label: 'Government' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'notices', label: 'Notices' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="iris">
    <template #header>
      <!-- Coastal flood watch — public-safety alert via Rig Alert primitive -->
      <Alert variant="warning" title="Coastal Flood Watch">
        <template #icon>
          <Icon icon="heroicons:exclamation-triangle" size="sm" aria-hidden="true" />
        </template>
        In effect through April 2. Monitor local conditions and avoid low-lying beach areas.
      </Alert>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="glass"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button
            class="flex items-center gap-3 text-left transition-opacity hover:opacity-70"
            @click="navigateTo('home')"
          >
            <div class="bg-primary flex h-8 w-8 items-center justify-center rounded">
              <span class="text-xs font-bold text-white">BC</span>
            </div>
            <span class="text-primary text-lg font-bold">City of Briar Cove</span>
          </button>
        </template>

        <template #trailing>
          <a
            href="tel:+15415550100"
            class="text-primary hidden items-center gap-1.5 pr-4 text-xs font-medium transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
            (541) 555-0100
          </a>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <ServicesPage v-else-if="currentPage === 'services'" @navigate="navigateTo" />
    <GovernmentPage v-else-if="currentPage === 'government'" @navigate="navigateTo" />
    <MeetingsPage v-else-if="currentPage === 'meetings'" @navigate="navigateTo" />
    <NoticesPage v-else-if="currentPage === 'notices'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3">
        <div>
          <div class="flex items-center gap-2">
            <div class="bg-white/20 flex h-6 w-6 items-center justify-center rounded">
              <span class="text-xs font-bold text-white">BC</span>
            </div>
            <span class="text-sm font-bold text-white">City of Briar Cove</span>
          </div>
          <address class="mt-3 not-italic text-xs leading-relaxed">
            City Hall: 100 Main Street<br />Briar Cove, OR 97420<br />
            <a href="tel:+15415550100" class="transition-colors hover:underline">(541) 555-0100</a
            ><br />
            Monday–Friday, 8:00 AM – 5:00 PM
          </address>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider">Quick Links</p>
          <ul class="mt-2 space-y-1 text-xs">
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('services')">
                Services
              </button>
            </li>
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('government')">
                Government
              </button>
            </li>
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('meetings')">
                Meetings
              </button>
            </li>
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('notices')">
                Notices
              </button>
            </li>
            <li>
              <button class="transition-colors hover:underline" @click="navigateTo('contact')">
                Contact
              </button>
            </li>
          </ul>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-bold uppercase tracking-wider">Emergency</p>
          <p class="mt-2 text-sm font-bold">911</p>
          <p class="mt-1 text-xs">
            Non-emergency:
            <a href="tel:+15415550911" class="transition-colors hover:underline">(541) 555-0911</a>
          </p>
          <button
            class="mt-4 inline-block text-xs underline transition-opacity hover:opacity-70"
            @click="navigateTo('contact')"
          >
            Accessibility Statement
          </button>
          <p class="mt-2 text-xs">&copy; {{ new Date().getFullYear() }} City of Briar Cove</p>
        </div>
      </SiteFooter>
    </template>

    <!-- Mobile emergency bar -->
    <div
      class="bg-background border-border fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t px-4 py-3 sm:hidden"
    >
      <a
        href="tel:911"
        class="bg-destructive flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        911 Emergency
      </a>
      <a
        href="tel:+15415550100"
        class="bg-primary text-white border-primary flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        City Hall
      </a>
    </div>
  </SiteShell>
  <DemoAttribution />
</template>
