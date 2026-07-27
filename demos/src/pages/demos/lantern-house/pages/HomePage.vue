<script setup lang="ts">
import {
  Button,
  Card,
  Hero,
  Ornament,
  Section,
  StatRow,
  CTABanner,
  Testimonial,
} from '@amulet-laboratories/rig'
import { hotelStats, rooms, reviews, menuPreview } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const featuredRooms = [rooms[0]!, rooms[3]!]
</script>

<template>
  <div>
    <!-- Hero — full-bleed immersive -->
    <Hero layout="immersive" class="min-h-[90vh]">
      <template #media>
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
          alt="Exterior of The Lantern House at dusk"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background/90"
        />
      </template>
      <template #eyebrow>
        <p class="text-xs font-light uppercase">A coastal inn · Briar Cove, Oregon</p>
      </template>
      <template #title>
        <h1 class="mt-6 font-serif text-4xl font-light leading-display sm:text-5xl lg:text-7xl">
          The Lantern House
        </h1>
      </template>
      <template #description>
        <p class="mx-auto mt-6 max-w-md text-base font-light leading-relaxed">
          22 rooms on the Pacific. A cocktail bar, a restaurant, and the sound of the ocean.
        </p>
      </template>
      <template #actions>
        <Button variant="primary" size="lg" class="mt-10" @click="emit('navigate', 'reserve')">
          Book Your Stay
        </Button>
      </template>
    </Hero>

    <!-- Stats -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl scroll-reveal">
        <StatRow :stats="hotelStats" variant="bordered" />
      </div>
    </Section>

    <!-- Featured rooms -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h2 class="scroll-reveal text-center font-serif text-2xl font-light">Featured Rooms</h2>
        <Ornament variant="rule" size="sm" />
        <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Card
            v-for="r in featuredRooms"
            :key="r.id"
            interactive
            class="group scroll-reveal overflow-hidden"
            @click="emit('navigate', 'rooms')"
          >
            <div class="overflow-hidden">
              <img
                :src="r.img"
                :alt="r.name"
                class="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between">
                <h3 class="font-serif text-lg font-normal">{{ r.name }}</h3>
                <span class="text-primary text-sm font-light">{{ r.rate }}</span>
              </div>
              <p class="mt-2 text-sm font-light leading-relaxed">{{ r.description }}</p>
            </div>
          </Card>
        </div>
        <div class="mt-10 text-center">
          <Button variant="secondary" @click="emit('navigate', 'rooms')">View All Rooms</Button>
        </div>
      </div>
    </Section>

    <!-- Guest Reviews -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="scroll-reveal text-center font-serif text-2xl font-light">Guest Voices</h2>
        <Ornament variant="rule" size="sm" />
        <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Testimonial v-for="r in reviews" :key="r.name" layout="card" class="scroll-reveal">
            <template #decorator>
              <span class="text-primary font-serif text-3xl leading-none" aria-hidden="true"
                >&ldquo;</span
              >
            </template>
            <template #quote>
              <p class="text-sm font-light leading-relaxed">{{ r.text }}</p>
            </template>
            <template #attribution>
              <p class="mt-3 text-sm font-medium">{{ r.name }}</p>
              <p class="text-primary text-xs font-light">{{ r.stayType }}</p>
              <p class="text-muted-foreground text-xs font-light">{{ r.location }}</p>
            </template>
          </Testimonial>
        </div>
      </div>
    </Section>

    <!-- Dining teaser -->
    <Section>
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="scroll-reveal font-serif text-2xl font-light">The Dining Room</h2>
        <Ornament variant="rule" size="sm" />
        <p class="mt-4 text-sm font-light">
          Open nightly, 5:30pm–10pm. Seasonal Pacific Northwest cuisine with an emphasis on local
          ingredients.
        </p>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
          alt="Elegant plated dish at The Lantern House dining room"
          class="scroll-reveal mx-auto mt-8 aspect-[16/9] w-full max-w-lg rounded-lg object-cover"
          loading="lazy"
        />
        <div class="mt-10 space-y-6 text-left">
          <div
            v-for="d in menuPreview"
            :key="d.name"
            class="border-border scroll-reveal flex items-start justify-between gap-4 border-b pb-4"
          >
            <div>
              <h3 class="font-serif text-base">{{ d.name }}</h3>
              <p class="mt-1 text-sm font-light">{{ d.note }}</p>
            </div>
            <span class="shrink-0 text-sm font-light">{{ d.price }}</span>
          </div>
        </div>
        <Button variant="secondary" class="mt-8" @click="emit('navigate', 'dining')">
          Full Menu & Bar
        </Button>
      </div>
    </Section>

    <!-- Reservation CTA -->
    <CTABanner layout="row" variant="background" class="scroll-reveal">
      <h2 class="font-serif text-3xl font-light">Begin your stay</h2>
      <p class="mt-4 max-w-md text-sm font-light">
        Direct reservations include complimentary breakfast and a welcome cocktail.
      </p>
      <dl class="text-muted-foreground mt-6 flex max-w-sm items-center gap-2 text-sm font-light">
        <div class="flex items-center gap-2">
          <dt class="sr-only">Check-in</dt>
          <dd>Check-in: 3:00 PM</dd>
        </div>
        <span aria-hidden="true">&middot;</span>
        <div class="flex items-center gap-2">
          <dt class="sr-only">Check-out</dt>
          <dd>Check-out: 11:00 AM</dd>
        </div>
      </dl>
      <template #action>
        <Button variant="primary" size="lg" class="mt-8" @click="emit('navigate', 'reserve')">
          Check Availability
        </Button>
      </template>
    </CTABanner>
  </div>
</template>
