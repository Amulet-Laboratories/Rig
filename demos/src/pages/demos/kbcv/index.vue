<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/kbcv.css'
import '@amulet-laboratories/rig/hex/scoped/cardinal'
import { SiteShell, SiteNav, SiteFooter, Icon, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import SchedulePage from './pages/SchedulePage.vue'
import ShowsPage from './pages/ShowsPage.vue'
import CommunityPage from './pages/CommunityPage.vue'
import SupportPage from './pages/SupportPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'shows', label: 'Shows' },
  { id: 'community', label: 'Community' },
  { id: 'support', label: 'Support' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="cardinal">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="glass"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button class="flex items-center gap-4" @click="navigateTo('home')">
            <div>
              <span class="text-xl font-black">KBCV</span>
              <span class="text-primary ml-1 text-sm font-bold">91.7 FM</span>
            </div>
            <span
              class="bg-primary hidden items-center gap-2 rounded-full px-3 py-1 text-xs font-bold sm:inline-flex"
            >
              <span
                class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white"
                aria-hidden="true"
              />
              ON AIR
            </span>
          </button>
        </template>

        <template #trailing>
          <button
            class="bg-primary text-primary-foreground hidden rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors sm:inline-flex"
            @click="navigateTo('schedule')"
          >
            Listen Live
          </button>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <SchedulePage v-else-if="currentPage === 'schedule'" @navigate="navigateTo" />
    <ShowsPage v-else-if="currentPage === 'shows'" @navigate="navigateTo" />
    <CommunityPage v-else-if="currentPage === 'community'" @navigate="navigateTo" />
    <SupportPage v-else-if="currentPage === 'support'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3" variant="inverted">
        <div>
          <p class="text-sm font-black">KBCV 91.7 FM</p>
          <p class="mt-1 text-xs opacity-85">Non-commercial community radio</p>
          <p class="mt-1 text-xs opacity-85">Broadcasting at 300 watts</p>
        </div>
        <address class="not-italic">
          <p class="text-xs font-bold uppercase tracking-wider">
            <Icon
              icon="heroicons:map-pin"
              size="sm"
              aria-hidden="true"
              class="mb-0.5 mr-1 inline"
            />
            Station
          </p>
          <p class="mt-1 text-xs opacity-85">88 Lighthouse Road</p>
          <p class="text-xs opacity-85">Briar Cove, OR 97420</p>
          <p class="mt-1 text-xs">
            <a href="tel:+15415550917" class="transition-colors hover:underline">(541) 555-0917</a>
          </p>
        </address>
        <div class="sm:text-right">
          <p class="text-xs font-bold uppercase tracking-wider">
            <Icon
              icon="heroicons:envelope"
              size="sm"
              aria-hidden="true"
              class="mb-0.5 mr-1 inline"
            />
            Studio
          </p>
          <p class="mt-1 text-xs">
            <a href="mailto:studio@kbcv.org" class="transition-colors hover:underline"
              >studio@kbcv.org</a
            >
          </p>
          <p class="mt-3 text-xs opacity-70">&copy; {{ new Date().getFullYear() }} KBCV</p>
        </div>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
