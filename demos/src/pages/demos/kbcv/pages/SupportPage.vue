<script setup lang="ts">
import {
  Section,
  Card,
  Button,
  Badge,
  Icon,
  CTABanner,
  ServiceGrid,
  Divider,
} from '@amulet-laboratories/rig'
import { volunteerRoles } from '../data'
import type { VolunteerRole } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const donationTiers = [
  {
    id: 'listener',
    title: 'Listener',
    amount: '$5/month',
    description: 'Keeps one hour of programming on the air',
  },
  {
    id: 'sustainer',
    title: 'Sustainer',
    amount: '$20/month',
    description: 'Covers a full day of broadcast costs',
  },
  {
    id: 'champion',
    title: 'Champion',
    amount: '$50/month',
    description: 'Sponsors equipment maintenance and studio upgrades',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold">Support KBCV</h1>
      <p class="mt-2 text-sm leading-relaxed">
        KBCV is listener-supported. No corporate sponsors, no algorithms, no paywalls. Every dollar
        goes directly to keeping independent community radio on the air in Briar Cove.
      </p>
    </div>
  </Section>

  <!-- Donate -->
  <Section>
    <div class="mx-auto max-w-4xl text-center">
      <Icon icon="heroicons:heart" size="lg" aria-hidden="true" />
      <h2 class="mt-4 text-2xl font-bold">Keep Community Radio Alive</h2>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed">
        KBCV is a 501(c)(3) nonprofit. Your donation is tax-deductible and goes directly to
        programming, equipment, and operations. Choose a level that works for you.
      </p>

      <!-- Donation Tiers -->
      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card v-for="tier in donationTiers" :key="tier.id" class="p-6">
          <h3 class="text-lg font-bold">{{ tier.title }}</h3>
          <p class="text-primary mt-2 text-2xl font-black">{{ tier.amount }}</p>
          <p class="mt-3 text-sm leading-relaxed">{{ tier.description }}</p>
          <Button variant="cta" class="mt-6 w-full">Donate</Button>
        </Card>
      </div>

      <p class="mt-8 text-sm">Prefer a one-time gift? Any amount helps.</p>
    </div>
  </Section>

  <Divider />

  <!-- Volunteer -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-center text-2xl font-bold">Volunteer at KBCV</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed">
        We run on volunteer power. Whether you want to host a show, help with events, or work behind
        the scenes, there is a place for you at the station.
      </p>
      <ServiceGrid :items="volunteerRoles" layout="grid" :columns="3" class="mt-10">
        <template #item="{ item }">
          <Card class="p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div class="bg-secondary mb-3 flex h-10 w-10 items-center justify-center rounded-full">
              <Icon :icon="(item as VolunteerRole).icon" size="sm" aria-hidden="true" />
            </div>
            <h3 class="text-lg font-bold">{{ item.title }}</h3>
            <Badge variant="secondary" class="mt-2">{{ (item as VolunteerRole).commitment }}</Badge>
            <p class="mt-3 text-sm leading-relaxed">{{ item.description }}</p>
          </Card>
        </template>
      </ServiceGrid>
      <div class="mt-8 text-center">
        <Button variant="secondary" @click="emit('navigate', 'contact')">
          Apply to Volunteer
        </Button>
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="text-2xl font-bold">Every voice matters</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Have a question, a show idea, or just want to say hello? We would love to hear from you.
    </p>
    <template #action>
      <Button variant="cta" @click="emit('navigate', 'contact')">Contact Us</Button>
    </template>
  </CTABanner>
</template>
