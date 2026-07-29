<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/undertow.css'
import '@amulet-laboratories/rig/hex/scoped/copper'
import { SiteShell, SiteNav, SiteFooter, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import MenuPage from './pages/MenuPage.vue'
import EventsPage from './pages/EventsPage.vue'
import StoryPage from './pages/StoryPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'events', label: 'Events' },
  { id: 'story', label: 'Our Story' },
  { id: 'contact', label: 'Visit' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="copper">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="overlay"
        sticky
        @navigate="navigateTo"
      >
        <template #utility-bar>
          <div data-rig-accent class="h-1" aria-hidden="true" />
          <div
            class="bg-card text-primary flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
          >
            Happy Hour Mon&ndash;Fri 3&ndash;6 PM &middot; $2 Off All Pints
          </div>
        </template>

        <template #brand>
          <button class="text-2xl font-black uppercase tracking-tight" @click="navigateTo('home')">
            Undertow
          </button>
        </template>

        <template #toggle-icon="{ open }">
          <span class="text-primary text-xs font-bold uppercase tracking-wider">
            {{ open ? 'Close' : 'Menu' }}
          </span>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <MenuPage v-else-if="currentPage === 'menu'" />
    <EventsPage v-else-if="currentPage === 'events'" />
    <StoryPage v-else-if="currentPage === 'story'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3" variant="card">
        <template #pre-footer>
          <div data-rig-accent class="h-1" aria-hidden="true" />
        </template>

        <div>
          <span class="text-xl font-black uppercase tracking-tight"> Undertow </span>
          <address class="mt-3 text-xs not-italic leading-relaxed">
            42 Wharf Street<br />Briar Cove, OR 97420<br />
            <a href="tel:+15415550171" class="transition-colors hover:underline">(541) 555-0171</a>
          </address>
        </div>
        <div class="flex flex-col items-center gap-2 sm:items-start">
          <button
            v-for="p in pages"
            :key="p.id"
            class="text-xs font-bold uppercase tracking-wider transition-colors"
            @click="navigateTo(p.id)"
          >
            {{ p.label }}
          </button>
        </div>
        <div class="text-center sm:text-right">
          <p class="text-xs font-bold uppercase tracking-wider">Taproom Hours</p>
          <p class="mt-2 text-xs">Mon–Thu: 3pm–10pm</p>
          <p class="text-xs">Fri–Sat: 12pm–12am · Sun: 12pm–8pm</p>
          <p class="mt-1 text-xs font-bold">21+ after 9 PM</p>
        </div>

        <template #post-footer>
          <p>© {{ new Date().getFullYear() }} Undertow Brewing Co.</p>
        </template>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
