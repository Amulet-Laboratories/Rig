<script setup lang="ts">
import { Button, Card, Section, StatRow, CTABanner, FlankedHeading } from '@amulet-laboratories/rig'
import type { WebStatItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const timeline = [
  {
    year: '2018',
    event:
      'Cole Marsden signs the lease on a decommissioned fish processing warehouse at 42 Wharf Street.',
  },
  {
    year: '2019',
    event:
      'Undertow Brewing opens. First batch — Riptide IPA — sells out in a weekend. Seven-barrel brewhouse installed.',
  },
  {
    year: '2020',
    event:
      'Survived the pandemic with to-go crowlers and patio seating. Added the kitchen with help from a Briar Cove small business grant.',
  },
  {
    year: '2021',
    event:
      'Fogbank Haze (Hazy Pale Ale) introduced. Immediately becomes the best-seller. Trivia Night program launches.',
  },
  {
    year: '2022',
    event:
      'Kelp Forest Saison collaboration with Maren Lys. KBCV 91.7 FM starts monthly live remote broadcasts.',
  },
  {
    year: '2023',
    event:
      'Expanded taproom capacity by 30 seats. Cornhole patio built out back. Storm Surge DIPA wins bronze at Oregon Brewers Festival.',
  },
  {
    year: '2024',
    event:
      'Barnacle Brown (English Brown Ale) added as the first rotating seasonal. Merch line launched.',
  },
]

const values = [
  {
    title: 'Local sourcing',
    description:
      'Cod from the harbor, hazelnuts from the Willamette Valley, bread from Salt & Signal down the street. We buy from our neighbors first.',
  },
  {
    title: 'No TVs',
    description: "We opened without televisions and we're keeping it that way. Talk to each other.",
  },
  {
    title: 'Water conservation',
    description:
      'Brewing uses a lot of water. We invested in a closed-loop cooling system and donated the savings to the Briar Cove watershed fund.',
  },
  {
    title: 'Small batches',
    description:
      "Our 7-barrel system means we can't brew at scale even if we wanted to. Every batch is hands-on, start to finish.",
  },
]

const stats: WebStatItem[] = [
  { label: 'Year opened', value: '2019' },
  { label: 'Brewhouse', value: '7bbl' },
  { label: 'Taps pouring', value: '10' },
  { label: 'Televisions', value: '0' },
]
</script>

<template>
  <h1 class="sr-only">Our Story</h1>

  <!-- Header -->
  <Section
    variant="alternate"
    title="Our Story"
    subtitle="A brewery in a warehouse on the wharf."
  />

  <!-- Origin -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div>
        <h2 class="text-2xl font-black uppercase">How It Started</h2>
        <div class="mt-5 space-y-4 text-sm leading-relaxed">
          <p>
            Cole Marsden spent eight years in corporate sales in Portland. Good money, bad
            fluorescent lighting, and a growing suspicion that he was in the wrong building. He'd
            been homebrewing since college — sours in the closet, IPAs on the back porch, a stout
            that once blew the lid off a fermenter in his apartment.
          </p>
          <p>
            In 2018, he took a weekend trip to Briar Cove and walked past a decommissioned fish
            processing warehouse on Wharf Street with a "For Lease" sign in the window. The rent was
            cheap. The loading dock faced the harbor. He signed the lease that afternoon.
          </p>
          <p>
            Undertow Brewing opened in the spring of 2019 with a 7-barrel brewhouse, four taps, and
            no kitchen. The first batch — Riptide IPA — sold out in a weekend. Seven years later,
            we're up to ten taps, a full kitchen, and a patio with cornhole boards. Still no
            televisions.
          </p>
        </div>
      </div>
      <div class="overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559526642-c3f001ea68ee?auto=format&fit=crop&w=600&q=80"
          alt="Inside Undertow Brewing taproom"
          class="h-80 w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </Section>

  <!-- Timeline -->
  <Section variant="alternate" title="Timeline">
    <div class="mx-auto max-w-3xl">
      <div class="mt-10 space-y-0">
        <div
          v-for="(t, i) in timeline"
          :key="t.year"
          class="flex gap-6 py-5"
          :class="i < timeline.length - 1 ? 'border-b' : ''"
        >
          <span class="w-16 shrink-0 text-xl font-black tabular-nums">{{ t.year }}</span>
          <p class="text-sm leading-relaxed">{{ t.event }}</p>
        </div>
      </div>
    </div>
  </Section>

  <!-- Values -->
  <Section title="What We Stand For">
    <div class="mx-auto max-w-4xl">
      <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card v-for="v in values" :key="v.title" class="p-5">
          <h3 class="text-sm font-bold uppercase tracking-wider">{{ v.title }}</h3>
          <p class="mt-2 text-xs leading-relaxed">{{ v.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Community -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <FlankedHeading>
        <h2 class="text-2xl font-black uppercase">Community</h2>
      </FlankedHeading>
      <p class="mt-6 text-sm leading-relaxed">
        Briar Cove is small. We like it that way. We collaborate with our neighbors — Maren Lys
        paints our label art, Salt &amp; Signal supplies our bread, and KBCV 91.7 FM broadcasts live
        from the taproom once a month. On Earth Day we lead a coastal cleanup; everyone who fills a
        bag gets a free pint. The cornhole league is serious, the trivia is not, and someone usually
        brings their dog.
      </p>
    </div>
  </Section>

  <!-- Stats -->
  <StatRow :stats="stats" variant="filled-secondary" />

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="text-xl font-black uppercase">Come have a beer</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      42 Wharf Street, Briar Cove. Open every day except when we're not.
    </p>
    <template #action>
      <Button variant="default" @click="emit('navigate', 'menu')">See the Menu</Button>
      <Button variant="outline" @click="emit('navigate', 'events')">Upcoming Events</Button>
    </template>
  </CTABanner>
</template>
