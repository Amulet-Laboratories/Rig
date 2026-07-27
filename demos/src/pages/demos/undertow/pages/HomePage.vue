<script setup lang="ts">
import {
  Button,
  Badge,
  Divider,
  Hero,
  Section,
  CTABanner,
  MapPlaceholder,
} from '@amulet-laboratories/rig'
import { tapList, recurringEvents, upcomingEvents } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const featuredTaps = tapList.slice(0, 4)

const trivia = recurringEvents.find((e) => e.name === 'Trivia Night')!
const kbcv = upcomingEvents.find((e) => e.name === 'KBCV Live Remote Broadcast')!
const salal = upcomingEvents.find((e) => e.name === 'Live Music: The Salal Creek Band')!

const homeEvents = [
  { name: trivia.name, day: trivia.day, time: trivia.time },
  { name: kbcv.name, day: kbcv.date, time: kbcv.time },
  { name: salal.name, day: salal.date, time: salal.time },
]
</script>

<template>
  <!-- Hero -->
  <Hero layout="immersive" scrim class="relative overflow-hidden">
    <template #media>
      <img
        src="https://images.unsplash.com/photo-1559526642-c3f001ea68ee?auto=format&fit=crop&w=1200&q=80"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
    </template>
    <template #eyebrow>
      <span class="text-sm uppercase tracking-eyebrow-lg">
        Briar Cove Waterfront · Taproom &amp; Kitchen
      </span>
    </template>
    <template #title>
      <h1>
        Undertow<br />
        <span>Brewing Co.</span>
      </h1>
    </template>
    <template #description>
      <p class="mx-auto max-w-md text-base font-light">
        Craft beer brewed in a converted fish processing warehouse on Wharf Street. Ten taps, a full
        kitchen, and no televisions.
      </p>
    </template>
    <template #actions>
      <Button variant="default" size="lg" @click="emit('navigate', 'menu')">View Menu</Button>
      <Button variant="outline" size="lg" @click="emit('navigate', 'events')">See Events</Button>
    </template>
  </Hero>

  <!-- Featured taps -->
  <Section variant="alternate" title="What's Pouring" subtitle="Updated weekly">
    <div class="mx-auto max-w-4xl">
      <ul class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <li
          v-for="tap in featuredTaps"
          :key="tap.name"
          class="bg-secondary rounded p-5 transition-shadow hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-bold">{{ tap.name }}</h3>
              <p class="text-xs">{{ tap.style }}</p>
            </div>
            <span class="text-sm font-bold tabular-nums">{{ tap.abv }}</span>
          </div>
          <p class="mt-2 text-xs italic">{{ tap.note }}</p>
        </li>
      </ul>
      <div class="mt-8 text-center">
        <Button variant="outline" @click="emit('navigate', 'menu')"
          >Full Tap List &amp; Menu</Button
        >
      </div>
    </div>
  </Section>

  <!-- Upcoming events preview -->
  <Section title="Coming Up">
    <div class="mx-auto max-w-3xl">
      <div class="mt-10 space-y-4">
        <div
          v-for="e in homeEvents"
          :key="e.name"
          class="bg-card rounded flex items-center justify-between p-4"
        >
          <div>
            <h3 class="font-bold">{{ e.name }}</h3>
            <p class="mt-1 text-xs">{{ e.day }}</p>
          </div>
          <span class="text-sm font-bold">{{ e.time }}</span>
        </div>
      </div>
      <div class="mt-8 text-center">
        <Button variant="outline" @click="emit('navigate', 'events')">All Events</Button>
      </div>
    </div>
  </Section>

  <!-- Story teaser -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-3xl font-black uppercase">The Story</h2>
      <Divider class="mx-auto my-4 max-w-20" />
      <p class="text-sm leading-relaxed">
        Undertow Brewing opened in 2019 in a converted fish processing warehouse on Briar Cove's
        wharf. Founder Cole Marsden traded a corporate sales career in Portland for a 7-barrel
        brewhouse and a taproom with no TVs.
      </p>
      <Button variant="outline" class="mt-6" @click="emit('navigate', 'story')"
        >Read the Full Story</Button
      >
    </div>
  </Section>

  <!-- Visit CTA -->
  <CTABanner layout="centered">
    <h2 class="text-3xl font-black uppercase">Visit the Taproom</h2>
    <div class="mx-auto mt-6 max-w-md">
      <MapPlaceholder
        address="42 Wharf Street, Briar Cove, OR 97420"
        description="(541) 555-0171 · Mon–Thu 3pm–10pm · Fri–Sat 12pm–12am · Sun 12pm–8pm"
        aspect="aspect-auto"
      />
    </div>
    <p class="mt-4 text-xs font-bold uppercase tracking-wider">21+ after 9 PM</p>
    <template #action>
      <Badge variant="default"> Craft beer · Full kitchen · No TVs </Badge>
    </template>
  </CTABanner>
</template>
