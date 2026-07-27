<script setup lang="ts">
import {
  Hero,
  Section,
  StatRow,
  Card,
  Button,
  Icon,
  CTABanner,
  ServiceGrid,
} from '@amulet-laboratories/rig'
import { stationStats, shows, communityEvents } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const featuredShows = shows.slice(0, 4)
const upcomingEvents = communityEvents.slice(0, 3)
</script>

<template>
  <!-- Hero -->
  <Hero layout="centered" class="bg-primary">
    <template #eyebrow>
      <Icon icon="heroicons:signal" size="lg" aria-hidden="true" />
      <p class="mt-4 text-xs font-bold uppercase tracking-widest">
        KBCV 91.7 FM · Briar Cove, Oregon
      </p>
    </template>
    <template #title>
      <h1 class="mt-6 text-3xl font-black sm:text-5xl lg:text-6xl">
        Community Radio<br />
        Since 2008
      </h1>
    </template>
    <template #description>
      <p class="mx-auto mt-6 max-w-lg text-base leading-relaxed">
        Eighteen years of eclectic programming — jazz, local news, talk shows, experimental music.
        Run by three paid staff and a small army of volunteers.
      </p>
    </template>
    <template #actions>
      <Button variant="cta" size="lg" @click="emit('navigate', 'schedule')">Listen Live</Button>
      <Button variant="cta-ghost" size="lg" @click="emit('navigate', 'support')">Support Us</Button>
    </template>
  </Hero>

  <!-- Station Stats -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <StatRow :stats="stationStats" variant="filled-secondary" />
    </div>
  </Section>

  <!-- Featured Shows -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-center text-2xl font-bold">Featured Shows</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <ServiceGrid :items="featuredShows" layout="grid" :columns="4" class="mt-10">
        <template #item="{ item }">
          <Card class="h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div class="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <Icon
                :icon="(item as (typeof featuredShows)[number]).icon"
                size="sm"
                aria-hidden="true"
              />
            </div>
            <h3 class="text-lg font-bold">{{ item.title }}</h3>
            <p class="text-accent mt-1 text-xs font-medium">
              Hosted by {{ (item as (typeof featuredShows)[number]).host }}
            </p>
            <p class="mt-3 text-sm leading-relaxed">{{ item.description }}</p>
          </Card>
        </template>
      </ServiceGrid>
      <div class="mt-8 text-center">
        <Button variant="outline" @click="emit('navigate', 'shows')">See All Shows</Button>
      </div>
    </div>
  </Section>

  <!-- Upcoming Events -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <h2 class="text-center text-2xl font-bold">Upcoming Events</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <ServiceGrid :items="upcomingEvents" layout="list" class="mt-8">
        <template #item="{ item }">
          <Card class="flex gap-4 p-4 transition-shadow hover:shadow-md">
            <span class="text-primary min-w-14 flex-shrink-0 text-sm font-bold">{{
              (item as (typeof upcomingEvents)[number]).date
            }}</span>
            <div>
              <h3 class="font-bold">{{ item.title }}</h3>
              <p class="mt-1 text-sm">{{ item.description }}</p>
            </div>
          </Card>
        </template>
      </ServiceGrid>
      <div class="mt-8 text-center">
        <Button variant="outline" @click="emit('navigate', 'community')">All Events</Button>
      </div>
    </div>
  </Section>

  <!-- CTA Banner -->
  <CTABanner layout="centered" variant="inverted">
    <Icon icon="heroicons:heart" size="sm" aria-hidden="true" />
    <h2 class="text-2xl font-bold">Keep Community Radio Alive</h2>
    <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed">
      KBCV is listener-supported. No corporate sponsors, no algorithms. Your donation keeps
      independent voices on the air.
    </p>
    <template #action>
      <Button variant="primary" size="lg" @click="emit('navigate', 'support')">Donate Now</Button>
    </template>
  </CTABanner>
</template>
