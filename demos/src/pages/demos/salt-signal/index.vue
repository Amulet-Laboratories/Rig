<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/salt-signal.css'
import '@amulet-laboratories/rig/hex/scoped/ochre'
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
import ShopPage from './pages/ShopPage.vue'
import StoryPage from './pages/StoryPage.vue'
import VisitPage from './pages/VisitPage.vue'
import ContactPage from './pages/ContactPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'story', label: 'Our Story' },
  { id: 'visit', label: 'Visit' },
  { id: 'contact', label: 'Contact' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="ochre">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="tabs"
        sticky
        @navigate="navigateTo"
      >
        <template #link="{ page }">
          <Icon v-if="page.id === 'home'" icon="heroicons:home" size="sm" aria-hidden="true" />
          <Icon
            v-else-if="page.id === 'shop'"
            icon="heroicons:shopping-bag"
            size="sm"
            aria-hidden="true"
          />
          <Icon
            v-else-if="page.id === 'story'"
            icon="heroicons:book-open"
            size="sm"
            aria-hidden="true"
          />
          <Icon
            v-else-if="page.id === 'visit'"
            icon="heroicons:map-pin"
            size="sm"
            aria-hidden="true"
          />
          <Icon
            v-else-if="page.id === 'contact'"
            icon="heroicons:envelope"
            size="sm"
            aria-hidden="true"
          />
          <span>{{ page.label }}</span>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <ShopPage v-else-if="currentPage === 'shop'" @navigate="navigateTo" />
    <StoryPage v-else-if="currentPage === 'story'" @navigate="navigateTo" />
    <VisitPage v-else-if="currentPage === 'visit'" @navigate="navigateTo" />
    <ContactPage v-else-if="currentPage === 'contact'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3" variant="card">
        <div>
          <p class="text-sm font-bold">Salt &amp; Signal</p>
          <p class="mt-1 text-xs">General Goods &middot; Briar Cove, Oregon</p>
          <address class="mt-3 not-italic text-xs leading-relaxed">
            45 Main Street<br />Briar Cove, OR 97420<br />
            <a href="tel:+15415550165" class="transition-colors hover:underline">(541) 555-0165</a>
          </address>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider">Pages</p>
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
          <p class="mt-2 text-xs">Tue–Sat: 10am–6pm</p>
          <p class="text-xs">Sun: 11am–4pm &middot; Mon: Closed</p>
          <p class="mt-6 text-xs">&copy; {{ new Date().getFullYear() }} Salt &amp; Signal</p>
        </div>

        <template #post-footer>
          <div class="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row">
            <p class="text-xs font-medium">New arrivals &amp; maker stories:</p>
            <NewsletterForm
              placeholder="Your email"
              button-text="Join"
              success-message="You're on the list."
            />
          </div>
        </template>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
