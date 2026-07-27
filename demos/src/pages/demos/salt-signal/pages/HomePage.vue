<script setup lang="ts">
import {
  Hero,
  Section,
  Button,
  Card,
  Badge,
  Testimonial,
  Icon,
  CTABanner,
} from '@amulet-laboratories/rig'
import { products, collections, reviews, tagVariants } from '../data'
import { demoPlaceholder, onDemoImgError } from '@/lib/demoPlaceholder'

const emit = defineEmits<{ navigate: [page: string] }>()

// Palette-matched fallback tile for missing/dead product imagery.
const ph = { bg: '#EAE0CC', fg: '#8A7B5E', accent: '#b8860b' }

const featured = products
  .filter((p) => p.tag === 'New' || p.tag === 'Staff Pick' || p.tag === 'Local')
  .slice(0, 8)
</script>

<template>
  <!-- Hero banner -->
  <Hero layout="split">
    <template #eyebrow>
      <span>General Goods &middot; Briar Cove, Oregon</span>
    </template>
    <template #title>
      <h1 class="font-serif text-3xl sm:text-4xl">The good stuff, curated with intention</h1>
    </template>
    <template #description>
      <p class="max-w-lg">
        Home goods, pantry staples, ceramics, and locally made products. The opposite of everything
        Amazon.
      </p>
    </template>
    <template #actions>
      <Button variant="primary" size="lg" @click="emit('navigate', 'shop')"> Shop Now </Button>
      <Button variant="secondary" size="lg" @click="emit('navigate', 'story')"> Our Story </Button>
    </template>
    <template #media>
      <img
        src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80"
        alt="Curated goods on wooden shelves"
        class="h-full w-full object-cover"
        loading="eager"
        @error="onDemoImgError($event, 'Salt & Signal', ph)"
      />
    </template>
  </Hero>

  <!-- Featured products -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="font-serif text-2xl font-bold">New & Noteworthy</h2>
          <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />
        </div>
        <Button variant="secondary" size="sm" @click="emit('navigate', 'shop')">View All</Button>
      </div>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="p in featured"
          :key="p.id"
          interactive
          class="group overflow-hidden"
          @click="emit('navigate', 'shop')"
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
            <p class="text-muted-foreground mt-1 text-xs">{{ p.maker }}</p>
            <p class="mt-2 font-bold">{{ p.price }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Collections -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">Curated Collections</h2>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card
          v-for="c in collections"
          :key="c.name"
          interactive
          class="group overflow-hidden text-center"
          @click="emit('navigate', 'shop')"
        >
          <div class="overflow-hidden">
            <img
              :src="c.img || demoPlaceholder(c.name, ph)"
              :alt="c.name"
              class="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @error="onDemoImgError($event, c.name, ph)"
            />
          </div>
          <div class="p-5">
            <h3 class="font-serif text-lg font-bold">{{ c.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed">{{ c.description }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Customer Reviews -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">What People Say</h2>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Testimonial v-for="r in reviews" :key="r.name" layout="border">
          <template #decorator>
            <span class="text-primary font-serif text-3xl leading-none">&ldquo;</span>
          </template>
          <template #quote>
            <p class="text-sm leading-relaxed">{{ r.text }}</p>
          </template>
          <template #attribution>
            <p class="mt-3 text-sm font-semibold">{{ r.name }}</p>
            <p class="text-muted-foreground text-xs">{{ r.location }} · re: {{ r.product }}</p>
          </template>
        </Testimonial>
      </div>
    </div>
  </Section>

  <!-- Story teaser -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="font-serif text-2xl font-bold">Our Story</h2>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mt-4 text-sm leading-relaxed">
        Salt &amp; Signal opened in 2022 in a 600-square-foot storefront on Main Street. Every
        product on our shelves is here because we use it ourselves.
      </p>
      <Button variant="secondary" class="mt-6" @click="emit('navigate', 'story')">Read More</Button>
    </div>
  </Section>

  <!-- Shipping quick info -->
  <Section class="bg-secondary">
    <div
      class="mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 text-center sm:flex-row sm:gap-10"
    >
      <div class="flex items-center gap-2 text-sm font-medium">
        <Icon icon="heroicons:truck" size="sm" aria-hidden="true" />
        Free shipping over $75
      </div>
      <div class="flex items-center gap-2 text-sm font-medium">
        <Icon icon="heroicons:shield-check" size="sm" aria-hidden="true" />
        Gift wrapping available
      </div>
      <div class="flex items-center gap-2 text-sm font-medium">
        <Icon icon="heroicons:arrow-uturn-left" size="sm" aria-hidden="true" />
        30-day returns
      </div>
    </div>
  </Section>

  <!-- Visit CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold">Shop local, shop intentional</p>
    <p class="mt-1 text-sm">
      Visit us on Main Street or browse online. We ship anywhere in the US.
    </p>
    <template #action>
      <Button variant="cta-light" @click="emit('navigate', 'visit')">Plan Your Visit</Button>
    </template>
  </CTABanner>
</template>
