<script setup lang="ts">
import {
  Hero,
  Section,
  StatRow,
  CTABanner,
  Testimonial,
  Button,
  Card,
} from '@amulet-laboratories/rig'
import type { WebStatItem } from '@amulet-laboratories/rig'
import PracticeIcon from '../components/PracticeIcon.vue'

const emit = defineEmits<{ navigate: [page: string] }>()

const stats: WebStatItem[] = [
  { value: '30+', label: 'Years of Practice' },
  { value: '500+', label: 'Closings Handled' },
  { value: '3', label: 'Practice Areas' },
  { value: '1996', label: 'Established' },
]

const practices = [
  {
    icon: 'home',
    title: 'Real Estate Law',
    description:
      'Residential and commercial transactions, title review, land use, boundary disputes, and 1031 exchanges throughout coastal Oregon.',
  },
  {
    icon: 'scroll',
    title: 'Estate Planning',
    description:
      'Wills, trusts, powers of attorney, advance directives, and probate administration — tailored to protect what matters most.',
  },
  {
    icon: 'building',
    title: 'Business Formation',
    description:
      'Entity selection, formation documents, operating agreements, partnership disputes, and ongoing corporate counsel.',
  },
]

const testimonials = [
  {
    quote:
      'Margaret guided us through a complicated coastal property purchase with patience and precision. We never felt rushed.',
    name: 'David & Carol Ashworth',
    context: 'Real Estate Client',
  },
  {
    quote:
      'After my husband passed, Catherine handled the estate with such care. She explained every step and never made me feel like a burden.',
    name: 'Helen Marchetti',
    context: 'Estate Planning Client',
  },
  {
    quote:
      'William helped us structure our partnership agreement in a way that has saved us from two potential disputes. Worth every penny.',
    name: 'James Kouri',
    context: 'Business Formation Client',
  },
]
</script>

<template>
  <!-- Hero — split screen -->
  <Hero layout="split" class="bg-card">
    <template #title>
      <div class="bg-accent mb-4 h-0.5 w-12" aria-hidden="true" />
      <h1 class="font-serif text-3xl font-normal leading-snug sm:text-4xl lg:text-5xl">
        Trusted counsel for coastal Oregon
      </h1>
    </template>
    <template #description>
      <p class="max-w-xl text-sm leading-relaxed sm:text-base">
        Aldric, Pace &amp; Wynn has served Briar Cove and the surrounding communities for thirty
        years. Real estate, estate planning, and business formation — handled with the care and
        rigor our clients expect.
      </p>
    </template>
    <template #actions>
      <Button variant="primary" @click="emit('navigate', 'contact')"
        >Schedule a Consultation</Button
      >
      <Button variant="outline" @click="emit('navigate', 'practices')">Our Practice Areas</Button>
    </template>
    <template #media>
      <img
        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=900&fit=crop"
        alt="Bronze statue of Lady Justice holding balanced scales"
        class="h-full w-full object-cover"
      />
    </template>
  </Hero>

  <!-- Firm stats -->
  <StatRow :stats="stats" variant="bordered" />

  <!-- Practice areas preview -->
  <Section
    title="Practice Areas"
    subtitle="Three focused areas of law, each supported by decades of local experience."
  >
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Card v-for="p in practices" :key="p.title" class="p-6">
        <div class="bg-secondary mb-4 flex h-10 w-10 items-center justify-center rounded">
          <PracticeIcon :icon="p.icon" />
        </div>
        <h3 class="font-medium">{{ p.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed">{{ p.description }}</p>
      </Card>
    </div>
    <div class="mt-8 text-center">
      <Button variant="outline" size="sm" @click="emit('navigate', 'practices')"
        >View All Practice Areas</Button
      >
    </div>
  </Section>

  <!-- Testimonials -->
  <Section variant="alternate" title="What Our Clients Say">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <Testimonial v-for="t in testimonials" :key="t.name" layout="card">
        <template #decorator>&ldquo;</template>
        <template #quote>{{ t.quote }}</template>
        <template #attribution>
          <p class="text-xs font-medium">{{ t.name }}</p>
          <p class="text-xs">{{ t.context }}</p>
        </template>
      </Testimonial>
    </div>
  </Section>

  <!-- Pre-footer CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-normal">Ready to discuss your legal matter?</p>
    <p class="mt-1 text-sm">Initial consultations available Monday through Friday.</p>
    <template #action>
      <Button variant="cta-light" @click="emit('navigate', 'contact')"
        >Schedule a Consultation</Button
      >
    </template>
  </CTABanner>
</template>
