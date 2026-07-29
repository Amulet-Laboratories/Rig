<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/briar-cove-lib.css'
import '@amulet-laboratories/rig/hex/scoped/sienna'
import { SiteShell, SiteNav, SiteFooter, Icon, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import CatalogPage from './pages/CatalogPage.vue'
import EventsPage from './pages/EventsPage.vue'
import KidsPage from './pages/KidsPage.vue'
import DigitalPage from './pages/DigitalPage.vue'
import RoomsPage from './pages/RoomsPage.vue'
import CardPage from './pages/CardPage.vue'
import AboutPage from './pages/AboutPage.vue'
import StaffPicksPage from './pages/StaffPicksPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'events', label: 'Events' },
  { id: 'kids', label: 'Kids & Youth' },
  { id: 'digital', label: 'Digital' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'picks', label: 'Staff Picks' },
  { id: 'card', label: 'Get a Card' },
  { id: 'about', label: 'About' },
]

const hours = [
  { day: 'Monday – Thursday', time: '10:00 AM – 8:00 PM' },
  { day: 'Friday', time: '10:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 5:00 PM' },
  { day: 'Sunday', time: '1:00 PM – 5:00 PM' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="sienna">
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
            class="font-serif text-xl font-bold transition-opacity hover:opacity-70"
            @click="navigateTo('home')"
          >
            Briar Cove Public Library
          </button>
        </template>

        <template #trailing>
          <button
            class="bg-primary text-primary-foreground hidden items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-colors sm:inline-flex"
            @click="navigateTo('card')"
          >
            <Icon icon="heroicons:credit-card" size="sm" aria-hidden="true" />
            Get a Card
          </button>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <CatalogPage v-else-if="currentPage === 'catalog'" />
    <EventsPage v-else-if="currentPage === 'events'" @navigate="navigateTo" />
    <KidsPage v-else-if="currentPage === 'kids'" @navigate="navigateTo" />
    <DigitalPage v-else-if="currentPage === 'digital'" />
    <RoomsPage v-else-if="currentPage === 'rooms'" />
    <StaffPicksPage v-else-if="currentPage === 'picks'" @navigate="navigateTo" />
    <CardPage v-else-if="currentPage === 'card'" @navigate="navigateTo" />
    <AboutPage v-else-if="currentPage === 'about'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3" variant="card">
        <div>
          <p class="text-sm font-bold">Briar Cove Public Library</p>
          <address class="mt-2 not-italic text-xs leading-relaxed">
            215 Main Street, Briar Cove, OR 97420<br />
            <a href="tel:+15415550142" class="transition-colors hover:underline">(541) 555-0142</a>
          </address>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider">Quick Links</p>
          <div class="mt-2 flex flex-col gap-1">
            <button
              class="text-left text-xs transition-colors hover:underline"
              @click="navigateTo('card')"
            >
              Get a Library Card
            </button>
            <button
              class="text-left text-xs transition-colors hover:underline"
              @click="navigateTo('events')"
            >
              Events &amp; Programs
            </button>
            <button
              class="text-left text-xs transition-colors hover:underline"
              @click="navigateTo('digital')"
            >
              Digital Resources
            </button>
            <button
              class="text-left text-xs transition-colors hover:underline"
              @click="navigateTo('about')"
            >
              About the Library
            </button>
          </div>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-bold uppercase tracking-wider">Hours</p>
          <dl class="mt-2 space-y-1 text-xs">
            <div v-for="h in hours" :key="h.day" class="flex sm:justify-end gap-2">
              <dt class="font-medium">{{ h.day }}:</dt>
              <dd>{{ h.time }}</dd>
            </div>
          </dl>
          <p class="mt-4 text-xs">
            &copy; {{ new Date().getFullYear() }} Briar Cove Public Library
          </p>
        </div>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
