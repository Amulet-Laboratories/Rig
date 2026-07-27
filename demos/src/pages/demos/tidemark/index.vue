<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import { ref } from 'vue'
import '@/assets/fonts/tidemark.css'
import '@amulet-laboratories/hex/scoped/cypress'
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
import ListingsPage from './pages/ListingsPage.vue'
import AboutPage from './pages/AboutPage.vue'
import NeighborhoodsPage from './pages/NeighborhoodsPage.vue'
import MarketPage from './pages/MarketPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'listings', label: 'Listings' },
  { id: 'about', label: 'About' },
  { id: 'neighborhoods', label: 'Areas' },
  { id: 'market', label: 'Market' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })

const pendingFilter = ref('')
const pendingPropertyId = ref('')
const contactContext = ref('')

const handleNavigation = (page: string) => {
  if (page.startsWith('listings:property:')) {
    pendingPropertyId.value = page.split(':')[2] ?? ''
    pendingFilter.value = ''
    navigateTo('listings')
  } else if (page.startsWith('listings:')) {
    pendingFilter.value = page.split(':')[1] ?? ''
    pendingPropertyId.value = ''
    navigateTo('listings')
  } else if (page.startsWith('contact:')) {
    contactContext.value = page.substring('contact:'.length)
    navigateTo('contact')
  } else {
    pendingFilter.value = ''
    pendingPropertyId.value = ''
    contactContext.value = ''
    navigateTo(page)
  }
}
</script>

<template>
  <SiteShell data-hex-theme="cypress">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="pill"
        sticky
        @navigate="handleNavigation"
      >
        <template #brand>
          <button
            class="cursor-pointer text-left transition-opacity hover:opacity-70"
            @click="handleNavigation('home')"
          >
            <span class="text-primary text-lg font-bold"> Tidemark Realty </span>
          </button>
        </template>

        <template #trailing>
          <a
            href="tel:+15415550188"
            class="text-primary hidden items-center gap-1.5 pr-4 text-xs font-medium transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
            (541) 555-0188
          </a>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="handleNavigation" />
    <ListingsPage
      v-else-if="currentPage === 'listings'"
      :initial-filter="pendingFilter"
      :initial-property-id="pendingPropertyId"
      @navigate="handleNavigation"
    />
    <AboutPage v-else-if="currentPage === 'about'" @navigate="handleNavigation" />
    <NeighborhoodsPage v-else-if="currentPage === 'neighborhoods'" @navigate="handleNavigation" />
    <MarketPage v-else-if="currentPage === 'market'" @navigate="handleNavigation" />
    <ContactPage
      v-else-if="currentPage === 'contact'"
      :context="contactContext"
      @navigate="handleNavigation"
    />

    <template #footer>
      <SiteFooter :columns="3" variant="inverted">
        <address class="not-italic">
          <span class="text-base font-bold">Tidemark Realty</span>
          <p class="mt-2 text-xs leading-relaxed">
            <span class="inline-flex items-center gap-1">
              <Icon icon="heroicons:map-pin" size="sm" aria-hidden="true" />
              120 Harbor Street, Suite 200 </span
            ><br />Briar Cove, OR 97420
          </p>
          <p class="mt-1 text-xs">
            <a href="tel:+15415550188" class="transition-colors hover:underline">(541) 555-0188</a>
          </p>
          <p class="mt-1 text-xs">Mon–Fri 9am–5pm · Sat 10am–3pm</p>
        </address>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider">Neighborhoods</p>
          <ul class="mt-3 space-y-1 text-xs">
            <li>
              <button
                class="cursor-pointer transition-colors hover:underline"
                @click="handleNavigation('listings:Old Harbor')"
              >
                Old Harbor
              </button>
            </li>
            <li>
              <button
                class="cursor-pointer transition-colors hover:underline"
                @click="handleNavigation('listings:Ridgeline')"
              >
                Ridgeline
              </button>
            </li>
            <li>
              <button
                class="cursor-pointer transition-colors hover:underline"
                @click="handleNavigation('listings:Salal Creek')"
              >
                Salal Creek
              </button>
            </li>
            <li>
              <button
                class="cursor-pointer transition-colors hover:underline"
                @click="handleNavigation('listings:Dune Quarter')"
              >
                Dune Quarter
              </button>
            </li>
          </ul>
        </div>
        <div class="sm:text-right">
          <p class="text-xs font-bold uppercase tracking-wider">Legal</p>
          <p class="mt-3 text-xs leading-relaxed">
            Oregon Real Estate Agency Licensed Broker.<br />
            All information deemed reliable but not guaranteed.
          </p>
          <p class="mt-6 text-xs">&copy; {{ new Date().getFullYear() }} Tidemark Realty</p>
        </div>
        <template #post-footer>
          <!-- Newsletter signup -->
          <NewsletterForm
            label="Get new listings in your inbox:"
            placeholder="your@email.com"
            button-text="Subscribe"
          />
        </template>
      </SiteFooter>
    </template>

    <!-- Sticky mobile contact bar -->
    <div
      class="bg-background border-border fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t px-4 py-3 sm:hidden"
    >
      <a
        href="tel:+15415550188"
        class="bg-primary text-primary-foreground flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
        Call
      </a>
      <button
        class="border-border cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-md border py-2.5 text-sm font-medium transition-colors hover:bg-card"
        @click="handleNavigation('contact')"
      >
        <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
        Message
      </button>
    </div>
  </SiteShell>
  <DemoAttribution />
</template>
