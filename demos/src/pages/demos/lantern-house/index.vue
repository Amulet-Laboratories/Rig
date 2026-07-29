<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/lantern-house.css'
import '@amulet-laboratories/rig/hex/scoped/vesper'
import { SiteShell, SiteNav, SiteFooter, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import RoomsPage from './pages/RoomsPage.vue'
import DiningPage from './pages/DiningPage.vue'
import ExplorePage from './pages/ExplorePage.vue'
import ReservePage from './pages/ReservePage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'dining', label: 'Dining' },
  { id: 'explore', label: 'Explore' },
  { id: 'reserve', label: 'Reserve' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="vesper">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="overlay"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button class="text-left transition-opacity hover:opacity-70" @click="navigateTo('home')">
            <span class="font-serif text-xl font-light tracking-wide">The Lantern House</span>
          </button>
        </template>

        <template #trailing>
          <button
            class="bg-primary text-primary-foreground hidden rounded-sm px-4 py-2 text-xs font-light uppercase transition-opacity hover:opacity-70 sm:inline-flex"
            @click="navigateTo('reserve')"
          >
            Reserve
          </button>
        </template>

        <template #toggle-icon="{ open }">
          <span class="text-primary text-xs font-light uppercase">
            {{ open ? 'Close' : 'Menu' }}
          </span>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <RoomsPage v-else-if="currentPage === 'rooms'" @navigate="navigateTo" />
    <DiningPage v-else-if="currentPage === 'dining'" @navigate="navigateTo" />
    <ExplorePage v-else-if="currentPage === 'explore'" @navigate="navigateTo" />
    <ReservePage v-else-if="currentPage === 'reserve'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3">
        <div>
          <p class="font-serif text-lg font-light">The Lantern House</p>
          <address class="mt-3 not-italic text-xs font-light leading-relaxed">
            18 Dune Road<br />Briar Cove, OR 97420<br />
            <a href="tel:+15415550144" class="transition-colors hover:underline">(541) 555-0144</a>
          </address>
        </div>
        <div>
          <p class="text-xs font-light uppercase">Quick Links</p>
          <div class="mt-2 flex flex-col gap-1">
            <button
              v-for="p in pages.filter((p) => p.id !== 'home')"
              :key="p.id"
              class="text-left text-xs font-light transition-colors hover:underline"
              @click="navigateTo(p.id)"
            >
              {{ p.label }}
            </button>
          </div>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-light uppercase">Hours</p>
          <p class="mt-2 text-xs font-light">Dining: Nightly, 5:30–10pm</p>
          <p class="text-xs font-light">Bar: 4pm–12am</p>
          <p class="mt-4 text-xs font-light">Check-in: 3:00 PM · Check-out: 11:00 AM</p>
          <p class="mt-6 text-xs">&copy; {{ new Date().getFullYear() }} The Lantern House</p>
        </div>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
