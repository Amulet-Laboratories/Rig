<script setup lang="ts">
import {
  Hero,
  Section,
  StatRow,
  CTABanner,
  Testimonial,
  Card,
  Button,
  Input,
  Badge,
  Icon,
} from '@amulet-laboratories/rig'
import type { WebStatItem } from '@amulet-laboratories/rig'
import { demoPlaceholder, onDemoImgError } from '@/lib/demoPlaceholder'

const emit = defineEmits<{
  navigate: [page: string]
}>()

// Palette-matched fallback tile for missing cover art.
const ph = { bg: '#EDE6D8', fg: '#8A7B68', accent: '#a5562e' }

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const libraryStats: WebStatItem[] = [
  { value: '47,000+', label: 'Titles in collection' },
  { value: '12,400', label: 'Active cardholders' },
  { value: '340+', label: 'Programs per year' },
  { value: '1951', label: 'Year founded' },
]

const hours = [
  { day: 'Monday – Thursday', time: '10:00 AM – 8:00 PM' },
  { day: 'Friday', time: '10:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 5:00 PM' },
  { day: 'Sunday', time: '1:00 PM – 5:00 PM' },
]

const featuredEvents = [
  {
    title: 'Summer Reading Kickoff',
    date: 'Jun 14',
    iso: '2026-06-14',
    description:
      'Join us for the start of our annual summer reading program with crafts, prizes, and live music on the lawn.',
    icon: 'heroicons:sparkles',
  },
  {
    title: 'Author Talk: Elena Marsh',
    date: 'Jun 18',
    iso: '2026-06-18',
    description:
      'Local author Elena Marsh discusses her new novel set on the southern Oregon coast.',
    icon: 'heroicons:microphone',
  },
  {
    title: 'Maker Lab: Intro to 3D Printing',
    date: 'Jun 21',
    iso: '2026-06-21',
    description:
      'Learn the basics of 3D modeling and print your first object. Ages 12+. Registration required.',
    icon: 'heroicons:wrench-screwdriver',
  },
]

const staffPicks = [
  {
    title: 'The God of the Woods',
    author: 'Liz Moore',
    note: 'A gripping mystery set in the Adirondacks that kept me turning pages all weekend.',
    staff: 'Margaret, Head Librarian',
    img: '',
  },
  {
    title: 'Intermezzo',
    author: 'Sally Rooney',
    note: 'Rooney at her most tender — two brothers navigating grief and love in Dublin.',
    staff: 'David, Reference Desk',
    img: '',
  },
]

const communityQuotes = [
  {
    quote:
      "The children's wing saved our rainy afternoons. My kids ask to go to the library every week now.",
    name: 'Sarah M.',
    context: 'Parent & cardholder since 2019',
  },
  {
    quote:
      "I found my first job through the library's resume workshop. This place does so much more than lend books.",
    name: 'Jason T.',
    context: 'Briar Cove resident',
  },
  {
    quote: 'The local history archive has been invaluable for my research on the Coquille tribe.',
    name: 'Dr. Ruth Clearwater',
    context: 'Oregon State University',
  },
]
</script>

<template>
  <!-- Hero -->
  <Hero layout="immersive" class="bg-primary">
    <template #media>
      <img
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-overlay"
        loading="eager"
      />
    </template>
    <template #title>
      <h1 class="font-serif text-3xl font-bold sm:text-4xl">Briar Cove Public Library</h1>
    </template>
    <template #description>
      <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed">
        Over 47,000 titles — books, audiobooks, DVDs, periodicals, and digital resources. Your
        library card unlocks all of it.
      </p>
    </template>
  </Hero>

  <!-- Catalog Search Card -->
  <section class="-mt-6 px-6">
    <Card class="mx-auto max-w-xl p-6">
      <form
        class="flex gap-3"
        role="search"
        aria-label="Library catalog"
        @submit.prevent="emit('navigate', 'catalog')"
      >
        <label for="home-catalog-search" class="sr-only">Search by title, author, or keyword</label>
        <Input
          id="home-catalog-search"
          v-model="searchQuery"
          placeholder="Search by title, author, or keyword..."
          class="flex-1"
        />
        <Button variant="primary">Search</Button>
      </form>
    </Card>
  </section>

  <!-- Library Stats -->
  <StatRow :stats="libraryStats" variant="bordered" />

  <!-- Hours Banner -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="sr-only">Library Hours</h2>
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
        <span class="font-bold" aria-hidden="true">Hours</span>
        <dl class="contents">
          <div v-for="h in hours" :key="h.day" class="inline">
            <dt class="inline font-bold">{{ h.day }}:</dt>
            {{ ' ' }}
            <dd class="inline">{{ h.time }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </Section>

  <!-- Featured Events -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-bold">Upcoming Events</h2>
          <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
        </div>
        <button
          class="text-sm font-medium transition-colors hover:underline"
          @click="emit('navigate', 'events')"
        >
          View all events &rarr;
        </button>
      </div>
      <div class="mt-8 space-y-4">
        <Card
          v-for="e in featuredEvents"
          :key="e.title"
          class="flex gap-4 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <time
            :datetime="e.iso"
            class="bg-primary flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md text-center"
            :aria-label="e.date"
          >
            <span class="text-xs font-bold uppercase leading-none" aria-hidden="true">{{
              e.date.split(' ')[0]
            }}</span>
            <span class="text-lg font-bold leading-none" aria-hidden="true">{{
              e.date.split(' ')[1]
            }}</span>
          </time>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <Icon :icon="e.icon" size="sm" aria-hidden="true" />
              <h3 class="font-bold">{{ e.title }}</h3>
            </div>
            <p class="mt-1 text-sm leading-relaxed">{{ e.description }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Staff Picks Preview -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-bold">Staff Picks</h2>
          <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
        </div>
        <button
          class="text-sm font-medium transition-colors hover:underline"
          @click="emit('navigate', 'picks')"
        >
          See all picks &rarr;
        </button>
      </div>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card v-for="b in staffPicks" :key="b.title" class="group flex gap-4 p-5">
          <div class="overflow-hidden">
            <img
              :src="b.img || demoPlaceholder(b.title, ph)"
              :alt="b.img ? `Cover of ${b.title}` : `${b.title} — cover art unavailable`"
              class="h-28 w-20 flex-shrink-0 rounded object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              @error="onDemoImgError($event, b.title, ph)"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold">{{ b.title }}</h3>
            <p class="mt-1 text-sm">by {{ b.author }}</p>
            <p class="mt-2 text-sm italic leading-relaxed">"{{ b.note }}"</p>
            <Badge variant="muted" class="mt-3">&mdash; {{ b.staff }}</Badge>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Community Voices -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Community Voices</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Testimonial v-for="q in communityQuotes" :key="q.name" layout="card">
          <template #decorator>
            <Icon
              icon="heroicons:chat-bubble-bottom-center-text"
              size="sm"
              class="mb-3"
              aria-hidden="true"
            />
          </template>
          <template #quote>{{ q.quote }}</template>
          <template #attribution>
            <p class="text-sm font-bold">{{ q.name }}</p>
            <p class="text-xs">{{ q.context }}</p>
          </template>
        </Testimonial>
      </div>
    </div>
  </Section>

  <!-- Get a Card CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold">Get a free library card today</p>
    <p class="mt-1 text-sm">
      All you need is proof of residency and a valid ID. Cards are issued at the circulation desk.
    </p>
    <template #action>
      <Button variant="cta-light" class="whitespace-nowrap" @click="emit('navigate', 'card')"
        >Sign Up</Button
      >
    </template>
  </CTABanner>
</template>
