<script setup lang="ts">
import DemoAttribution from '@/components/DemoAttribution.vue'
import '@/assets/fonts/compass.css'
import '@amulet-laboratories/rig/hex/scoped/clover'
import { SiteShell, SiteNav, SiteFooter, Icon, useHashRouter } from '@amulet-laboratories/rig'
import type { NavItem } from '@amulet-laboratories/rig'
import HomePage from './pages/HomePage.vue'
import ServicesPage from './pages/ServicesPage.vue'
import TeamPage from './pages/TeamPage.vue'
import AppointmentPage from './pages/AppointmentPage.vue'
import EmergencyPage from './pages/EmergencyPage.vue'
import ResourcesPage from './pages/ResourcesPage.vue'
import AboutPage from './pages/AboutPage.vue'
import NewPatientsPage from './pages/NewPatientsPage.vue'

const pages: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
  { id: 'appointment', label: 'Appointment' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'resources', label: 'Resources' },
  { id: 'about', label: 'About' },
  { id: 'new-patients', label: 'New Patients' },
]

const hours = [
  { day: 'Monday – Friday', time: '7:30 AM – 6:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 2:00 PM' },
  { day: 'Sunday', time: 'Closed (Emergency Line Available)' },
]

const { currentPage, navigateTo } = useHashRouter({ pages })
</script>

<template>
  <SiteShell data-hex-theme="clover">
    <template #header>
      <SiteNav
        :pages="pages"
        :current-page="currentPage"
        variant="pill"
        sticky
        @navigate="navigateTo"
      >
        <template #utility-bar>
          <div
            class="bg-destructive flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-destructive-foreground"
          >
            <Icon icon="heroicons:exclamation-triangle" size="sm" aria-hidden="true" />
            <span>Emergency?</span>
            <span class="font-normal"
              >Call
              <a href="tel:+15415550199" class="underline transition-opacity hover:opacity-70"
                >(541) 555-0199</a
              >
              — Walk-ins accepted during business hours</span
            >
          </div>
        </template>

        <template #brand>
          <button class="text-left transition-opacity hover:opacity-70" @click="navigateTo('home')">
            <span class="text-xl font-bold">Compass</span>
            <span class="ml-1 text-sm">Animal Hospital</span>
          </button>
        </template>
      </SiteNav>
    </template>

    <HomePage v-if="currentPage === 'home'" @navigate="navigateTo" />
    <ServicesPage v-else-if="currentPage === 'services'" @navigate="navigateTo" />
    <TeamPage v-else-if="currentPage === 'team'" @navigate="navigateTo" />
    <AppointmentPage v-else-if="currentPage === 'appointment'" />
    <EmergencyPage v-else-if="currentPage === 'emergency'" />
    <ResourcesPage v-else-if="currentPage === 'resources'" @navigate="navigateTo" />
    <AboutPage v-else-if="currentPage === 'about'" @navigate="navigateTo" />
    <NewPatientsPage v-else-if="currentPage === 'new-patients'" @navigate="navigateTo" />

    <template #footer>
      <SiteFooter :columns="3" variant="inverted">
        <div>
          <p class="text-sm font-bold">Compass Animal Hospital</p>
          <address class="mt-2 not-italic text-xs leading-relaxed">
            340 Harbor View Drive<br />Briar Cove, OR 97420<br /><a
              href="tel:+15415550199"
              class="transition-colors hover:underline"
              >(541) 555-0199</a
            >
          </address>
        </div>
        <div>
          <p class="text-sm font-bold">Quick Links</p>
          <div class="mt-2 flex flex-col gap-1">
            <button
              v-for="p in pages"
              :key="p.id"
              class="text-left text-xs transition-colors hover:underline"
              @click="navigateTo(p.id)"
            >
              {{ p.label }}
            </button>
          </div>
        </div>
        <div>
          <p class="text-sm font-bold">Hours</p>
          <dl class="mt-2 space-y-1">
            <div v-for="h in hours" :key="h.day" class="flex justify-between text-xs">
              <dt>{{ h.day }}</dt>
              <dd>{{ h.time }}</dd>
            </div>
          </dl>
        </div>

        <template #post-footer>
          <div class="bg-destructive rounded-lg p-4 text-center">
            <p class="text-sm font-bold text-destructive-foreground">
              Pet emergency? Call
              <a href="tel:+15415550199" class="underline transition-opacity hover:opacity-70"
                >(541) 555-0199</a
              >
              — Walk-ins during business hours
            </p>
          </div>
          <p class="mt-4 text-center text-xs">
            &copy; {{ new Date().getFullYear() }} Compass Animal Hospital
          </p>
        </template>
      </SiteFooter>
    </template>
  </SiteShell>
  <DemoAttribution />
</template>
