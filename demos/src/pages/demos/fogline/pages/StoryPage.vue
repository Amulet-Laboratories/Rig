<script setup lang="ts">
import { computed } from 'vue'
import {
  Section,
  StatRow,
  CTABanner,
  Button,
  ServiceGrid,
  TeamGrid,
  Gallery,
  FlankedHeading,
  Ornament,
  SectionDivider,
  Timeline,
} from '@amulet-laboratories/rig'
import { team, roasteryStats, values, timeline, roasteryGallery } from '../data'

interface TimelineItem {
  label: string
  description?: string
  timestamp?: string
  status?: 'completed' | 'active' | 'pending'
}

const emit = defineEmits<{ navigate: [page: string] }>()

const timelineItems = computed<TimelineItem[]>(() =>
  timeline.map((t, i) => ({
    label: String(t.year),
    description: t.event,
    status: i === timeline.length - 1 ? 'active' : 'completed',
  })),
)
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <FlankedHeading>
        <h1 class="font-serif text-3xl font-bold">Our Story</h1>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed">
        A converted net-mending shed, a fifty-year-old roaster, and a belief that coffee should be
        traceable to the farm.
      </p>
    </div>
  </Section>

  <!-- Origin narrative -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div>
        <h2 class="font-serif text-2xl font-bold">How It Started</h2>
        <Ornament variant="rule" size="sm" class="mt-2" />
        <div class="mt-5 space-y-4 text-sm leading-relaxed">
          <p>
            Elena Campos spent seven years in restaurant consulting in Portland — good work, good
            restaurants, and a growing obsession with the coffee she was drinking between meetings.
            She started home-roasting in 2012, tracking every variable in a spreadsheet that
            eventually ran to 3,000 rows.
          </p>
          <p>
            In 2015, she took her first trip to Huehuetenango, Guatemala. She walked the rows with
            producers, tasted cherry off the branch, and came home knowing she wanted to make this
            her life.
          </p>
          <p>
            She found a decommissioned 1974 Probat UG-22 in a warehouse in Astoria in 2017. It took
            two years to restore and a flatbed truck to move. In 2019, she signed a lease on a
            converted net-mending shed on Harbor Road in Briar Cove and opened Fogline weeks before
            the pandemic.
          </p>
          <p>
            The name comes from the fog line — the marine layer that rolls in at about 200 feet
            elevation every morning along the Oregon coast. Elena says the fog is when coffee tastes
            best: cool air, warm cup, slow morning.
          </p>
        </div>
      </div>
      <div class="overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
          alt="Coffee roasting at Fogline"
          class="aspect-[4/3] w-full rounded-sm object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </Section>

  <SectionDivider variant="organic" />

  <!-- Philosophy -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">What We Believe</h2>
      </FlankedHeading>
      <ServiceGrid :items="values" layout="numbered" :columns="3" class="mt-8" />
    </div>
  </Section>

  <SectionDivider variant="organic" flip />

  <!-- Gallery — The Roastery -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">Inside the Roastery</h2>
      <Ornament variant="diamond" size="sm" class="mx-auto mt-2" />
      <Gallery :items="roasteryGallery" layout="alternating" class="mt-10" />
    </div>
  </Section>

  <!-- Timeline -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Timeline</h2>
      </FlankedHeading>
      <Timeline :items="timelineItems" class="mt-8" />
    </div>
  </Section>

  <!-- Stats -->
  <Section class="bg-secondary">
    <StatRow :stats="roasteryStats" variant="filled" />
  </Section>

  <SectionDivider variant="organic" />

  <!-- Team -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">The Team</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Four people, one roaster, and a shared conviction that the details matter.
      </p>
      <TeamGrid :members="team" layout="horizontal" :columns="2" class="mt-8" />
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Come taste the difference</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Our tasting bar is open Wednesday through Sunday. Walk-ins welcome.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta" @click="emit('navigate', 'visit')">Visit Us</Button>
        <Button variant="secondary" @click="emit('navigate', 'coffee')">Browse Coffee</Button>
      </div>
    </template>
  </CTABanner>
</template>
