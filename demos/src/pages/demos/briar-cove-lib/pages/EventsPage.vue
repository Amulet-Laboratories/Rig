<script setup lang="ts">
import { Section, CTABanner, Card, Button, Badge, Icon } from '@amulet-laboratories/rig'

const emit = defineEmits<{
  navigate: [page: string]
}>()

const events = [
  {
    title: 'Summer Reading Kickoff',
    date: 'Jun 14',
    iso: '2026-06-14',
    time: '10:00 AM – 2:00 PM',
    description:
      'Join us for the start of our annual summer reading program with crafts, prizes, and live music on the library lawn.',
    icon: 'heroicons:sparkles',
    location: 'Library Lawn',
  },
  {
    title: 'Author Talk: Elena Marsh',
    date: 'Jun 18',
    iso: '2026-06-18',
    time: '6:30 PM',
    description:
      'Local author Elena Marsh discusses her new novel set on the southern Oregon coast. Books available for signing.',
    icon: 'heroicons:microphone',
    location: 'Compass Room',
  },
  {
    title: 'Maker Lab: Intro to 3D Printing',
    date: 'Jun 21',
    iso: '2026-06-21',
    time: '2:00 PM – 4:00 PM',
    description:
      'Learn the basics of 3D modeling and print your first object. Ages 12+. Registration required.',
    icon: 'heroicons:wrench-screwdriver',
    location: 'Teen Maker Lab',
  },
  {
    title: 'Preschool Storytime',
    date: 'Jun 24',
    iso: '2026-06-24',
    time: '10:30 AM',
    description: 'Songs, stories, and crafts for ages 2–5. No registration needed.',
    icon: 'heroicons:book-open',
    location: "Children's Wing",
  },
  {
    title: 'Friends of the Library Book Sale',
    date: 'Jun 28',
    iso: '2026-06-28',
    time: '9:00 AM – 3:00 PM',
    description:
      'Thousands of donated books, DVDs, and records. Proceeds support library programs. $5 bag sale at 2 PM.',
    icon: 'heroicons:tag',
    location: 'Community Room',
  },
  {
    title: 'Teen Game Night',
    date: 'Jul 2',
    iso: '2026-07-02',
    time: '5:00 PM – 7:00 PM',
    description:
      'Board games, video games, and snacks for ages 12–18. Bring your own Switch controllers.',
    icon: 'heroicons:sparkles',
    location: 'Teen Maker Lab',
  },
  {
    title: 'Genealogy Workshop',
    date: 'Jul 5',
    iso: '2026-07-05',
    time: '1:00 PM – 3:00 PM',
    description:
      'Learn to use Ancestry Library Edition and local history resources to trace your family tree.',
    icon: 'heroicons:user-group',
    location: 'Compass Room',
  },
]

const programs = [
  {
    name: 'Preschool Storytime',
    schedule: 'Tuesdays & Thursdays, 10:30 AM',
    audience: 'Ages 2–5',
    description:
      'Thirty minutes of interactive stories, songs, and fingerplays designed to build early literacy skills. Followed by a simple craft activity.',
  },
  {
    name: 'Maker Lab Open Hours',
    schedule: 'Wednesdays & Saturdays, 2–5 PM',
    audience: 'Ages 12+',
    description:
      'Drop in to use our 3D printers, laser cutter, sewing machines, and electronics station. Staff and teen volunteers on hand to help.',
  },
  {
    name: 'Author Talk Series',
    schedule: 'Third Wednesday of each month, 6:30 PM',
    audience: 'All ages',
    description:
      'Pacific Northwest authors share their work and answer questions. Books available for purchase and signing through our partnership with Compass Books.',
  },
  {
    name: 'Book Club: Page & Pour',
    schedule: 'First Friday of each month, 5:30 PM',
    audience: 'Adults',
    description:
      'Our monthly book club meets at Tidemark Brewing for lively discussion. Pick up the current title at the circulation desk.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-serif text-3xl font-bold">Events &amp; Programs</h1>
      <p class="mt-2 text-sm leading-relaxed">
        From storytime for toddlers to author talks and maker workshops — there's something
        happening at the library almost every day.
      </p>
    </div>
  </Section>

  <!-- Upcoming Events -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Upcoming Events</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-4">
        <Card
          v-for="e in events"
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
            <div class="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{{ e.time }}</Badge>
              <Badge variant="secondary">{{ e.location }}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Ongoing Programs -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Ongoing Programs</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card v-for="p in programs" :key="p.name" class="p-5">
          <h3 class="font-bold">{{ p.name }}</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{{ p.schedule }}</Badge>
            <Badge variant="muted">{{ p.audience }}</Badge>
          </div>
          <p class="mt-3 text-sm leading-relaxed">{{ p.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Host an Event -->
  <CTABanner layout="row">
    <p class="text-lg font-bold">Want to host an event at the library?</p>
    <p class="mt-1 text-sm">
      Our meeting rooms are free for community organizations. Contact us to learn more about hosting
      your next event.
    </p>
    <template #action>
      <Button variant="cta-light" class="whitespace-nowrap" @click="emit('navigate', 'about')"
        >Contact Us</Button
      >
    </template>
  </CTABanner>
</template>
