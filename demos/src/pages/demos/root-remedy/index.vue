<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/root-remedy.css'
import '@amulet-laboratories/rig/hex/scoped/juniper'
import {
  SiteShell,
  SiteNav,
  SiteFooter,
  Icon,
  NewsletterForm,
  useHashRouter,
} from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import MenuPage from './pages/MenuPage.vue'
import AboutPage from './pages/AboutPage.vue'
import WellnessPage from './pages/WellnessPage.vue'
import VisitPage from './pages/VisitPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'visit', label: 'Visit' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="juniper">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="split"
        sticky
        @navigate="navigateTo"
      >
        <template #brand>
          <button class="flex items-center gap-2" @click="navigateTo('home')">
            <Icon icon="heroicons:sun" size="sm" aria-hidden="true" class="text-primary" />
            <span class="font-serif text-sm font-bold">Root &amp; Remedy</span>
          </button>
        </template>
        <template #trailing>
          <a
            href="tel:+15415550192"
            class="text-muted-foreground hidden items-center gap-1.5 text-xs transition-colors hover:text-foreground sm:flex"
          >
            <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
            (541) 555-0192
          </a>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <MenuPage v-else-if="currentPage === 'menu'" @navigate="navigateTo" />
    <AboutPage v-else-if="currentPage === 'about'" @navigate="navigateTo" />
    <WellnessPage v-else-if="currentPage === 'wellness'" @navigate="navigateTo" />
    <VisitPage v-else-if="currentPage === 'visit'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3" variant="inverted">
        <div>
          <p class="font-serif text-sm font-bold">Root &amp; Remedy</p>
          <p class="mt-1 text-xs">Medical Cannabis Dispensary</p>
          <address class="mt-3 not-italic text-xs leading-relaxed">
            128 Harbor Road<br />Briar Cove, OR 97420<br />
            <a href="tel:+15415550192" class="transition-colors hover:underline">(541) 555-0192</a>
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
          <p class="text-xs font-bold uppercase tracking-wider">Hours</p>
          <p class="mt-2 text-xs">Mon&ndash;Sat: 10am&ndash;7pm</p>
          <p class="text-xs">Sun: 11am&ndash;5pm</p>
          <p class="text-muted-foreground mt-3 text-xs">OLCC Licensed &middot; 21+ Recreational</p>
          <p class="text-muted-foreground text-xs">18+ with OMMP Card</p>
          <p class="mt-4 text-xs">&copy; {{ new Date().getFullYear() }} Root &amp; Remedy</p>
        </div>

        <template #post-footer>
          <NewsletterForm
            placeholder="Your email"
            button-text="Subscribe"
            success-message="Welcome to the Root &amp; Remedy community."
          />
        </template>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
