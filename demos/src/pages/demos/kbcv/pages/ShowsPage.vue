<script setup lang="ts">
import {
  Section,
  Card,
  Button,
  Icon,
  Badge,
  CTABanner,
  ServiceGrid,
  Divider,
} from '@amulet-laboratories/rig'
import { shows } from '../data'
import type { Show } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold">Our Shows</h1>
      <p class="mt-2 text-sm leading-relaxed">
        Over 40 hours of original programming every week — jazz, talk, experimental, history, and
        everything in between. All produced locally by Briar Cove volunteers.
      </p>
    </div>
  </Section>

  <!-- Full Show Grid -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <ServiceGrid :items="shows" layout="grid" :columns="4" class="mt-2">
        <template #item="{ item }">
          <Card class="p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div class="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <Icon :icon="(item as Show).icon" size="sm" aria-hidden="true" />
            </div>
            <h3 class="text-lg font-bold">{{ item.title }}</h3>
            <p class="text-accent mt-1 text-xs font-medium">Hosted by {{ (item as Show).host }}</p>
            <Badge variant="secondary" class="mt-2">{{ (item as Show).schedule }}</Badge>
            <p class="mt-3 text-sm leading-relaxed">{{ item.description }}</p>
          </Card>
        </template>
      </ServiceGrid>
    </div>
  </Section>

  <Divider />

  <!-- Interested in hosting? -->
  <Section variant="alternate">
    <div class="mx-auto max-w-xl text-center">
      <Icon icon="heroicons:microphone" size="lg" aria-hidden="true" />
      <h2 class="mt-4 text-2xl font-bold">Interested in hosting?</h2>
      <p class="mt-3 text-sm leading-relaxed">
        KBCV is always looking for new voices. If you have an idea for a show, we provide training,
        equipment, and a timeslot. Pitch us your concept and we will work with you to get it on the
        air.
      </p>
      <Button variant="secondary" class="mt-6" @click="emit('navigate', 'support')">
        Learn More
      </Button>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="text-2xl font-bold">Tune in at 91.7 FM</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Check the full weekly schedule to find your next favorite show.
    </p>
    <template #action>
      <Button variant="cta" @click="emit('navigate', 'schedule')">See the Schedule</Button>
    </template>
  </CTABanner>
</template>
