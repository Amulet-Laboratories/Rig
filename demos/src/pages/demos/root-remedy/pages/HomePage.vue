<script setup lang="ts">
import {
  Hero,
  Section,
  Button,
  Card,
  Badge,
  Icon,
  Testimonial,
  ServiceGrid,
  Gallery,
  FeatureList,
  SectionDivider,
  FlankedHeading,
  Ornament,
  StatRow,
} from '@amulet-laboratories/rig'
import {
  products,
  reviews,
  tagVariants,
  serviceItems,
  dispensaryGallery,
  benefitFeatures,
  dispensaryStats,
} from '../data'
import { demoPlaceholder, onDemoImgError } from '@/lib/demoPlaceholder'

const emit = defineEmits<{ navigate: [page: string] }>()

// Palette-matched fallback tile for missing/dead product imagery.
const ph = { bg: '#1A2438', fg: '#8CA0AE', accent: '#7BA68E' }

const featured = products
  .filter((p) => p.tag === 'Popular' || p.tag === 'Staff Pick' || p.tag === 'New')
  .slice(0, 8)
</script>

<template>
  <!-- Immersive hero with background image -->
  <Hero layout="immersive" scrim class="relative overflow-hidden">
    <template #media>
      <img
        src="https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </template>
    <template #eyebrow>
      <span>Medical Cannabis Dispensary &middot; Briar Cove, Oregon</span>
    </template>
    <template #title>
      <h1 class="mx-auto max-w-3xl font-serif text-3xl sm:text-4xl lg:text-5xl">
        Plant medicine, guided with care
      </h1>
    </template>
    <template #description>
      <p class="mx-auto max-w-lg">
        Lab-tested products, free consultations, and patient education. Cannabis therapy grounded in
        science and compassion.
      </p>
    </template>
    <template #actions>
      <Button variant="cta-ghost" size="lg" @click="emit('navigate', 'menu')"> View Menu </Button>
      <Button
        variant="cta-light"
        size="lg"
        class="border border-primary-foreground bg-transparent"
        @click="emit('navigate', 'visit')"
      >
        Plan Your Visit
      </Button>
    </template>
  </Hero>

  <!-- Stats strip -->
  <StatRow :stats="dispensaryStats" variant="filled" />

  <!-- Benefits feature list -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Why Patients Choose Us</h2>
      </FlankedHeading>
      <FeatureList :items="benefitFeatures" layout="grid" :columns="3" class="mt-8">
        <template #icon>
          <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
        </template>
      </FeatureList>
    </div>
  </Section>

  <SectionDivider />

  <!-- Featured products -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="font-serif text-2xl font-bold">Featured Products</h2>
          <Ornament variant="rule" size="sm" class="mt-2" />
        </div>
        <Button variant="secondary" size="sm" @click="emit('navigate', 'menu')">Full Menu</Button>
      </div>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="p in featured"
          :key="p.id"
          interactive
          class="group overflow-hidden"
          @click="emit('navigate', 'menu')"
        >
          <div class="relative overflow-hidden">
            <img
              :src="p.img || demoPlaceholder(p.name, ph)"
              :alt="p.name"
              class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="onDemoImgError($event, p.name, ph)"
            />
            <Badge
              v-if="p.tag"
              size="sm"
              class="absolute left-2 top-2"
              :variant="tagVariants[p.tag] || undefined"
            >
              {{ p.tag }}
            </Badge>
          </div>
          <div class="p-4">
            <h3 class="text-sm font-semibold leading-tight">{{ p.name }}</h3>
            <p class="text-muted-foreground mt-1 text-xs">
              {{ p.strain }} &middot; {{ p.category }}
            </p>
            <p class="mt-2 font-bold">{{ p.price }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <SectionDivider flip />

  <!-- Services — numbered grid -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">How We Help</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        More than a dispensary. We offer clinical-grade guidance for every stage of your cannabis
        journey.
      </p>
      <ServiceGrid :items="serviceItems" layout="numbered" :columns="2" class="mt-8" />
    </div>
  </Section>

  <!-- Gallery — alternating layout -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Inside Root &amp; Remedy</h2>
      </FlankedHeading>
      <Gallery :items="dispensaryGallery" layout="alternating" class="mt-8" />
    </div>
  </Section>

  <SectionDivider />

  <!-- Patient reviews -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Patient Stories</h2>
      </FlankedHeading>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Testimonial v-for="r in reviews" :key="r.name" layout="card">
          <template #decorator>
            <span class="text-primary font-serif text-3xl leading-none">&ldquo;</span>
          </template>
          <template #quote>
            <p class="text-sm leading-relaxed">{{ r.text }}</p>
          </template>
          <template #attribution>
            <p class="mt-3 text-sm font-semibold">{{ r.name }}</p>
            <p class="text-muted-foreground text-xs">{{ r.location }} &middot; {{ r.condition }}</p>
          </template>
        </Testimonial>
      </div>
    </div>
  </Section>

  <SectionDivider />

  <!-- About teaser -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <Ornament variant="diamond" size="sm" class="mx-auto mb-4" />
      <h2 class="font-serif text-2xl font-bold">Founded by a Pharmacist</h2>
      <Ornament variant="rule" size="sm" class="mx-auto mt-2" />
      <p class="mt-4 text-sm leading-relaxed">
        Elena Vasquez spent 15 years in traditional pharmacy before opening Root &amp; Remedy. She
        saw patients cycling through prescriptions without getting better — and knew cannabis could
        help.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" @click="emit('navigate', 'about')">Our Story</Button>
        <Button variant="secondary" @click="emit('navigate', 'wellness')">
          Wellness Programs
        </Button>
      </div>
    </div>
  </Section>
</template>
