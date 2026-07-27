<script setup lang="ts">
import {
  Hero,
  Section,
  Button,
  Card,
  Badge,
  StatRow,
  Testimonial,
  CTABanner,
  ServiceGrid,
  FlankedHeading,
  SectionDivider,
  Ornament,
} from '@amulet-laboratories/rig'
import { coffees, reviews, roasteryStats, values, tagVariants } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const featured = coffees
  .filter((c) => c.tag === 'Staff Pick' || c.tag === 'Best Seller' || c.tag === 'New')
  .slice(0, 4)
</script>

<template>
  <!-- Hero -->
  <Hero layout="centered">
    <template #eyebrow>
      <span>Small-batch coffee &middot; Briar Cove, Oregon</span>
    </template>
    <template #title>
      <h1 class="mx-auto max-w-2xl font-serif">Roasted where the fog meets the coast</h1>
    </template>
    <template #description>
      <p class="mx-auto max-w-lg">
        Single-origin and blended coffees, direct-traded from farms we know by name. Roasted in
        small batches on a 1974 Probat.
      </p>
    </template>
    <template #actions>
      <Button variant="cta" size="lg" @click="emit('navigate', 'coffee')">
        Explore Our Coffee
      </Button>
    </template>
  </Hero>

  <SectionDivider variant="organic" />

  <!-- Featured coffees -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="font-serif text-2xl font-bold">Featured Roasts</h2>
          <Ornament variant="rule" size="sm" class="mt-2" />
        </div>
        <Button variant="secondary" size="sm" @click="emit('navigate', 'coffee')">View All</Button>
      </div>
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="c in featured"
          :key="c.id"
          interactive
          class="group overflow-hidden"
          @click="emit('navigate', 'coffee')"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="c.img"
              :alt="c.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-serif text-sm font-bold">{{ c.name }}</h3>
              <Badge v-if="c.tag" :variant="tagVariants[c.tag] || undefined" size="sm">
                {{ c.tag }}
              </Badge>
            </div>
            <p class="text-muted-foreground mt-1 font-mono text-xs">{{ c.origin }}</p>
            <p class="text-muted-foreground mt-1 text-xs">{{ c.notes }}</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="font-mono text-sm font-medium">{{ c.price }}</span>
              <span class="text-muted-foreground text-xs">{{ c.weight }}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <SectionDivider variant="organic" flip />

  <!-- Our approach -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">How We Roast</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Three principles guide every batch that leaves our roastery.
      </p>
      <ServiceGrid :items="values" layout="numbered" :columns="3" class="mt-8" />
    </div>
  </Section>

  <!-- Stats -->
  <Section class="bg-secondary">
    <StatRow :stats="roasteryStats" variant="filled" />
  </Section>

  <SectionDivider variant="organic" />

  <!-- Testimonials -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">What People Say</h2>
      </FlankedHeading>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Testimonial
          v-for="r in reviews"
          :key="r.name"
          :quote="r.text"
          :name="r.name"
          :role="r.location"
        />
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Visit the tasting bar</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Espresso, pour-overs, and cupping flights. Wednesday through Sunday on Harbor Road.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta" @click="emit('navigate', 'visit')">Get Directions</Button>
        <Button variant="secondary" @click="emit('navigate', 'coffee')">Browse Coffee</Button>
      </div>
    </template>
  </CTABanner>
</template>
