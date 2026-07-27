<script setup lang="ts">
import { Section, Card, Divider } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const timeline = [
  { year: '2010', event: 'Dr. Sonia Reyes graduates from Oregon State with her DVM' },
  { year: '2012', event: 'Compass Animal Hospital opens at 340 Harbor View Drive' },
  { year: '2014', event: 'Dr. James Wren joins the team, expanding exotic animal care' },
  { year: '2017', event: 'In-house digital radiology and ultrasound installed' },
  { year: '2019', event: 'Celebrated 2,000th patient — Mango, a rescue cockatiel' },
  { year: '2021', event: 'Added dedicated surgical suite with advanced monitoring' },
  { year: '2024', event: 'Reached 4,200+ patients served across Briar Cove and beyond' },
]

const values = [
  {
    title: 'Honesty',
    description:
      'We tell you what we see, what we recommend, and what it costs — before we proceed. No surprise bills, no unnecessary treatments.',
  },
  {
    title: 'Gentleness',
    description:
      "Fear-free handling isn't a buzzword here. We move slowly, speak softly, and adapt to each patient's temperament.",
  },
  {
    title: 'Thoroughness',
    description:
      "Every exam is complete. We don't rush, and we don't skip steps. Your 15-minute checkup gets our full attention.",
  },
  {
    title: 'Community',
    description:
      'We live here too. Dr. Reyes walks her greyhounds on the same beaches. Casey coaches youth soccer. This is our town.',
  },
]

const hours = [
  { day: 'Monday – Friday', time: '7:30 AM – 6:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 2:00 PM' },
  { day: 'Sunday', time: 'Closed (Emergency Line Available)' },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold sm:text-4xl">About Compass</h1>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-base leading-relaxed">
        A small clinic with big standards. We've been caring for Briar Cove's pets since 2012 — and
        we plan to be here for a long time.
      </p>
    </div>
  </Section>

  <!-- Story -->
  <Section>
    <div class="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div>
        <h2 class="text-xl font-bold">Our Story</h2>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
        <p class="mt-4 text-sm leading-relaxed">
          Dr. Sonia Reyes opened Compass Animal Hospital in 2012 after spending two years searching
          the Oregon coast for the right community. Briar Cove was it — small enough to know every
          patient by name, close-knit enough to care about the people behind them.
        </p>
        <p class="mt-3 text-sm leading-relaxed">
          What started as a one-vet practice in a converted bungalow has grown into a four-person
          team with a fully equipped surgical suite, digital diagnostics, and a reputation for doing
          things right. We've never advertised. Every new patient comes through word of mouth.
        </p>
      </div>
      <div class="relative aspect-[4/3] overflow-hidden rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80"
          alt="Veterinary clinic interior with warm lighting"
          class="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </Section>

  <!-- Values -->
  <Section variant="alternate" title="What We Stand For">
    <div class="mx-auto max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card v-for="v in values" :key="v.title" class="p-5">
        <h3 class="text-base font-bold">{{ v.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed">{{ v.description }}</p>
      </Card>
    </div>
  </Section>

  <!-- Timeline -->
  <Section title="Our Timeline">
    <div class="mx-auto max-w-2xl space-y-0">
      <div v-for="(t, i) in timeline" :key="t.year" class="flex gap-4">
        <div class="flex flex-col items-center">
          <div
            class="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
          >
            {{ t.year.slice(2) }}
          </div>
          <div v-if="i < timeline.length - 1" class="bg-border w-px flex-1"></div>
        </div>
        <div class="pb-8">
          <p class="text-xs font-bold">{{ t.year }}</p>
          <p class="mt-1 text-sm">{{ t.event }}</p>
        </div>
      </div>
    </div>
  </Section>

  <!-- Location & Hours -->
  <Section variant="alternate">
    <div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
      <div>
        <h2 class="text-xl font-bold">Find Us</h2>
        <address class="mt-4 not-italic text-sm leading-relaxed">
          <strong>Compass Animal Hospital</strong><br />
          340 Harbor View Drive<br />
          Briar Cove, OR 97420<br /><br />
          <strong>Phone:</strong>
          <a href="tel:+15415550199" class="transition-colors hover:underline">(541) 555-0199</a
          ><br />
          <strong>Email:</strong>
          hello@compassvet.com
        </address>
        <div class="mt-6">
          <button
            class="text-sm font-medium transition-colors hover:underline"
            @click="emit('navigate', 'team')"
          >
            Meet our team &rarr;
          </button>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-bold">Hours</h2>
        <dl class="mt-4 space-y-2">
          <div
            v-for="h in hours"
            :key="h.day"
            class="bg-background flex items-center justify-between rounded-md p-3 text-sm"
          >
            <dt class="font-medium">{{ h.day }}</dt>
            <dd>{{ h.time }}</dd>
          </div>
        </dl>
        <Divider class="my-4" />
        <p class="text-sm">
          <span class="font-medium">Emergency line</span> available after hours at the same number.
        </p>
      </div>
    </div>
  </Section>
</template>
