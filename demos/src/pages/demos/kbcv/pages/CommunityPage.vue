<script setup lang="ts">
import {
  Section,
  Card,
  Button,
  Badge,
  CTABanner,
  ServiceGrid,
  Divider,
} from '@amulet-laboratories/rig'
import { communityEvents, timeline } from '../data'
import type { CommunityEvent } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold">Community</h1>
      <p class="mt-2 text-sm leading-relaxed">
        KBCV is more than a radio station — it is the connective tissue of Briar Cove. From live
        remotes at the taproom to summer solstice broadcasts in the park, we show up where the
        community gathers.
      </p>
    </div>
  </Section>

  <!-- Events -->
  <Section>
    <div class="mx-auto max-w-3xl">
      <h2 class="text-2xl font-bold">Upcoming Events</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <ServiceGrid :items="communityEvents" layout="list" class="mt-8">
        <template #item="{ item }">
          <Card class="flex gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Badge variant="primary" class="h-fit shrink-0">{{
              (item as CommunityEvent).date
            }}</Badge>
            <div>
              <h3 class="font-bold">{{ item.title }}</h3>
              <p class="mt-1 text-sm leading-relaxed">{{ item.description }}</p>
            </div>
          </Card>
        </template>
      </ServiceGrid>
    </div>
  </Section>

  <Divider />

  <!-- Station History -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <h2 class="text-2xl font-bold">Station History</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          KBCV signed on the air in March 2008 from a converted garage on Lighthouse Road. Founded
          by Helen Park and a group of Briar Cove volunteers, the station started with a 10-watt
          transmitter and a borrowed microphone. Today KBCV broadcasts at 300 watts, produces over
          40 hours of original programming weekly, and operates with three paid staff and 28 active
          volunteers.
        </p>
        <p>
          The station's call letters honor Briar Cove's original name on the Coquille tribal maps.
          In 2019, KBCV won the Grassroots Radio Coalition's "Station of the Year" award. Our
          transmitter sits on the ridge above Cedar Point, covering a 12-mile broadcast radius that
          reaches from Bandon to Gold Beach.
        </p>
      </div>

      <!-- Timeline -->
      <div class="mt-10 space-y-0">
        <div v-for="(t, i) in timeline" :key="i" class="relative flex gap-6 pb-8 last:pb-0">
          <!-- Line -->
          <div class="flex flex-col items-center">
            <div class="bg-primary h-3 w-3 rounded-full" />
            <div v-if="i < timeline.length - 1" class="bg-border w-px flex-1" />
          </div>
          <!-- Content -->
          <div class="pb-2">
            <span class="text-primary text-sm font-bold">{{ t.year }}</span>
            <p class="mt-1 text-sm leading-relaxed">{{ t.event }}</p>
          </div>
        </div>
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="text-2xl font-bold">Be Part of the Story</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Whether you volunteer, donate, or just tune in — you are what makes community radio work.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta" @click="emit('navigate', 'support')">Volunteer</Button>
        <Button variant="secondary" @click="emit('navigate', 'contact')">Contact Us</Button>
      </div>
    </template>
  </CTABanner>
</template>
