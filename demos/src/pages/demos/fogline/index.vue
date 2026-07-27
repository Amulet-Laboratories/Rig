<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import { Icon } from '@iconify/vue'
import '@/assets/fonts/fogline.css'
import '@amulet-laboratories/hex/scoped/hearth'
import { SiteShell, SiteNav, SiteFooter, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import CoffeePage from './pages/CoffeePage.vue'
import StoryPage from './pages/StoryPage.vue'
import WholesalePage from './pages/WholesalePage.vue'
import VisitPage from './pages/VisitPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'story', label: 'Our Story' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'visit', label: 'Visit' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="hearth">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="tabs"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button
            class="flex items-center gap-2 font-serif text-lg font-bold tracking-tight"
            @click="navigateTo('home')"
          >
            <Icon icon="heroicons:moon" class="h-5 w-5" aria-hidden="true" />
            Fogline
          </button>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <CoffeePage v-else-if="currentPage === 'coffee'" @navigate="navigateTo" />
    <StoryPage v-else-if="currentPage === 'story'" @navigate="navigateTo" />
    <WholesalePage v-else-if="currentPage === 'wholesale'" @navigate="navigateTo" />
    <VisitPage v-else-if="currentPage === 'visit'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3">
        <div>
          <p class="text-sm font-bold font-serif">Fogline Coffee Roasters</p>
          <p class="mt-1 text-xs">Small-batch &middot; Direct trade &middot; Briar Cove, OR</p>
          <address class="mt-3 not-italic text-xs leading-relaxed">
            18 Harbor Road<br />Briar Cove, OR 97420<br />
            <a href="tel:+15415550188" class="transition-colors hover:underline">(541) 555-0188</a>
          </address>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider">Explore</p>
          <ul class="mt-2 space-y-1 text-xs">
            <li v-for="p in pages.filter((p) => p.id !== 'home')" :key="p.id">
              <button class="transition-colors hover:underline" @click="navigateTo(p.id)">
                {{ p.label }}
              </button>
            </li>
          </ul>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-bold uppercase tracking-wider">Tasting Bar Hours</p>
          <p class="mt-2 text-xs">Wed&ndash;Fri: 7am&ndash;2pm</p>
          <p class="text-xs">Sat&ndash;Sun: 8am&ndash;4pm</p>
          <p class="text-xs">Mon&ndash;Tue: Closed</p>
          <p class="mt-6 text-xs">&copy; {{ new Date().getFullYear() }} Fogline Coffee Roasters</p>
        </div>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
