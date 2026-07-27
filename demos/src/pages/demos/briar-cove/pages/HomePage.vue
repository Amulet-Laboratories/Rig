<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Button,
  Card,
  Badge,
  Icon,
  Input,
  Hero,
  Section,
  StatRow,
  ServiceGrid,
} from '@amulet-laboratories/rig'
import { cityStats, quickServices, notices, upcomingMeetings } from '../data'
import type { CityService } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const searchQuery = ref('')
const filteredServices = computed(() => {
  if (!searchQuery.value) return quickServices
  const q = searchQuery.value.toLowerCase()
  return quickServices.filter(
    (s) => s.title.toLowerCase().includes(q) || (s.description?.toLowerCase().includes(q) ?? false),
  )
})

const latestNotices = notices.slice(0, 3)
const nextMeeting = upcomingMeetings[0]

const noticeVariant: Record<string, string> = {
  Advisory: 'warning',
  Meeting: 'info',
  Report: 'muted',
  Event: 'success',
}

const iconNames: Record<string, string> = {
  banknote: 'heroicons:banknotes',
  building: 'heroicons:building-office',
  flag: 'heroicons:flag',
  calendar: 'heroicons:calendar-days',
  briefcase: 'heroicons:briefcase',
  tree: 'heroicons:sparkles',
  check: 'heroicons:check-circle',
  phone: 'heroicons:phone',
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Hero -->
    <Hero layout="immersive" scrim>
      <template #media>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover"
        />
      </template>
      <template #title>
        <h1 class="font-serif text-3xl font-bold sm:text-4xl">Welcome to Briar Cove</h1>
      </template>
      <template #description>
        <p class="mx-auto max-w-xl text-base leading-relaxed">
          A small coastal city on the southern Oregon shore. Pay a utility bill, pull a building
          permit, or find out when the next council meeting is — all in one place.
        </p>
        <div
          class="text-muted-foreground mx-auto mt-4 flex max-w-sm items-center justify-center gap-4 text-xs font-medium"
        >
          <span>Pop. 8,400</span>
          <span class="text-primary" aria-hidden="true">&middot;</span>
          <span>Est. 1887</span>
          <span class="text-primary" aria-hidden="true">&middot;</span>
          <span>Oregon Coast</span>
        </div>
      </template>
      <template #actions>
        <div class="mx-auto w-full max-w-md">
          <label for="bc-search" class="sr-only">Search city services</label>
          <Input
            id="bc-search"
            v-model="searchQuery"
            placeholder="Search services, permits, meetings..."
          />
        </div>
      </template>
    </Hero>

    <!-- City Stats -->
    <StatRow :stats="cityStats" variant="filled" />

    <!-- Quick Services -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h2 class="text-center font-serif text-2xl font-bold">Quick Services</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true" />
        <ServiceGrid :items="filteredServices" layout="grid" :columns="4" class="mt-10">
          <template #item="{ item }">
            <Card
              interactive
              tabindex="0"
              role="button"
              :aria-label="item.title"
              class="p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
              @click="emit('navigate', 'services')"
            >
              <div
                class="bg-primary/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
              >
                <Icon
                  :icon="iconNames[(item as CityService).icon] ?? iconNames.check"
                  size="sm"
                  aria-hidden="true"
                  class="text-primary"
                />
              </div>
              <p class="text-sm font-semibold">{{ item.title }}</p>
              <p
                v-if="item.description"
                class="text-muted-foreground mt-1.5 text-xs leading-relaxed"
              >
                {{ item.description }}
              </p>
            </Card>
          </template>
        </ServiceGrid>
        <div v-if="filteredServices.length === 0" class="mt-8 text-center">
          <p class="text-sm">No services match "{{ searchQuery }}"</p>
          <Button variant="secondary" size="sm" class="mt-2" @click="searchQuery = ''"
            >Clear Search</Button
          >
        </div>
      </div>
    </Section>

    <!-- Next Meeting + Latest Notices side by side -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <!-- Next Meeting -->
          <div v-if="nextMeeting" class="lg:col-span-2">
            <h2 class="font-serif text-xl font-bold">Next Meeting</h2>
            <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />
            <Card class="mt-6 p-5">
              <Badge size="sm" class="bg-secondary text-primary"> Next Up </Badge>
              <h3 class="mt-3 font-semibold">{{ nextMeeting.body }}</h3>
              <p class="mt-1 text-sm">{{ nextMeeting.date }} · {{ nextMeeting.time }}</p>
              <p class="text-muted-foreground text-xs">{{ nextMeeting.location }}</p>
              <div class="mt-4 flex gap-2">
                <Button variant="primary" size="sm" @click="emit('navigate', 'meetings')">
                  View Agenda
                </Button>
                <Button variant="secondary" size="sm" @click="emit('navigate', 'meetings')">
                  All Meetings
                </Button>
              </div>
            </Card>
            <p class="text-muted-foreground mt-4 text-xs">
              All meetings are open to the public. Agendas posted 72 hours in advance.
            </p>
          </div>

          <!-- Latest Notices -->
          <div class="lg:col-span-3">
            <div class="flex items-end justify-between">
              <div>
                <h2 class="font-serif text-xl font-bold">Latest Notices</h2>
                <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />
              </div>
              <Button variant="secondary" size="sm" @click="emit('navigate', 'notices')">
                View All
              </Button>
            </div>
            <div class="mt-6 space-y-3">
              <Card v-for="n in latestNotices" :key="n.title" class="p-4">
                <div class="flex items-start gap-3">
                  <Badge size="sm" class="flex-shrink-0" :variant="noticeVariant[n.type]">
                    {{ n.type }}
                  </Badge>
                  <div>
                    <h3 class="text-sm font-semibold">{{ n.title }}</h3>
                    <p class="text-muted-foreground mt-0.5 text-xs">{{ n.date }}</p>
                    <p class="mt-1 text-xs leading-relaxed">{{ n.summary }}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <!-- CTA row -->
    <Section>
      <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        <Card
          interactive
          class="p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
          @click="emit('navigate', 'government')"
        >
          <p class="text-primary font-serif text-lg font-bold">Government</p>
          <p class="mt-2 text-xs">Meet your Mayor and City Council. View committees and staff.</p>
        </Card>
        <Card
          interactive
          class="p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
          @click="emit('navigate', 'services')"
        >
          <p class="text-primary font-serif text-lg font-bold">How Do I...</p>
          <p class="mt-2 text-xs">Pay a bill, get a permit, report an issue, or find answers.</p>
        </Card>
        <Card
          interactive
          class="p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
          @click="emit('navigate', 'contact')"
        >
          <p class="text-primary font-serif text-lg font-bold">Contact Us</p>
          <p class="mt-2 text-xs">
            City Hall hours, department directory, and online contact form.
          </p>
        </Card>
      </div>
    </Section>
  </div>
</template>
