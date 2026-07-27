<script setup lang="ts">
import { Button, Ornament, Section, CTABanner, MenuList } from '@amulet-laboratories/rig'
import { starters, mains, desserts, cocktails, wines } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <div>
    <!-- Dining header -->
    <Section variant="alternate">
      <div class="text-center">
        <p class="text-xs font-light uppercase">Seasonal Pacific Northwest Cuisine</p>
        <h1 class="mt-4 font-serif text-4xl font-light sm:text-5xl">The Dining Room</h1>
        <Ornament variant="rule" size="sm" />
        <p class="mx-auto mt-4 max-w-lg text-sm font-light">
          Open nightly, 5:30pm–10pm. Reservations encouraged. Our menu changes with the seasons,
          sourcing from local farms, fisheries, and foragers.
        </p>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
          alt="Elegant plated dish at The Lantern House dining room"
          class="mx-auto mt-8 h-56 w-full max-w-2xl rounded object-cover"
          loading="lazy"
        />
      </div>
    </Section>

    <!-- Menu -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <h2 class="scroll-reveal text-center font-serif text-2xl font-light">To Start</h2>
        <Ornament variant="rule" size="sm" />
        <MenuList :items="starters" class="mt-8" />

        <h2 class="scroll-reveal mt-16 text-center font-serif text-2xl font-light">Main Courses</h2>
        <Ornament variant="rule" size="sm" />
        <MenuList :items="mains" class="mt-8" />

        <h2 class="scroll-reveal mt-16 text-center font-serif text-2xl font-light">To Finish</h2>
        <Ornament variant="rule" size="sm" />
        <MenuList :items="desserts" class="mt-8" />
      </div>
    </Section>

    <!-- The Bar -->
    <Section
      class="bg-secondary"
      title="The Bar"
      subtitle="Craft cocktails, local wine, and Oregon spirits. Open 4pm–12am."
    >
      <div class="mx-auto max-w-3xl">
        <h3 class="scroll-reveal mt-12 text-center font-serif text-lg font-light">Cocktails</h3>
        <MenuList :items="cocktails" class="mt-6" />

        <h3 class="scroll-reveal mt-12 text-center font-serif text-lg font-light">Wine</h3>
        <p class="mt-2 text-center text-xs font-light">Glass / Bottle</p>
        <MenuList :items="wines" class="mt-6" />
      </div>
    </Section>

    <!-- Reservation reminder -->
    <CTABanner layout="centered" variant="background" class="scroll-reveal">
      <p class="text-sm font-light">
        Dining reservations are recommended, especially on weekends. Guests of the inn receive
        priority seating.
      </p>
      <template #action>
        <Button variant="primary" @click="emit('navigate', 'reserve')">Reserve a Table</Button>
      </template>
    </CTABanner>
  </div>
</template>
