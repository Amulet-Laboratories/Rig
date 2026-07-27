<script setup lang="ts">
import {
  Button,
  Section,
  StatRow,
  CTABanner,
  Testimonial,
  ServiceGrid,
} from '@amulet-laboratories/rig'
import { stats, services, testimonials } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const highlightedServices = services.slice(0, 3)
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Hero — noir with faded background -->
    <div class="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        loading="eager"
      />
      <div class="relative z-10 w-full px-6 py-20 text-center">
        <h1
          class="mt-8 text-3xl font-extralight uppercase leading-none tracking-wider sm:text-5xl lg:text-7xl"
        >
          Private<br />
          <span class="text-primary">Investigation</span>
        </h1>
        <p class="mt-10 text-xs uppercase tracking-widest">Briar Cove, Oregon</p>
        <div
          class="mx-auto mt-4 flex items-center justify-center gap-4 text-xs uppercase tracking-eyebrow"
        >
          <span>Licensed</span>
          <span class="text-primary" aria-hidden="true">&bull;</span>
          <span>Bonded</span>
          <span class="text-primary" aria-hidden="true">&bull;</span>
          <span>Insured</span>
        </div>
        <p class="mt-10 font-mono text-sm text-primary">
          <a href="tel:+15415550177" class="transition-colors hover:underline">(541) 555-0177</a>
        </p>
        <div data-rig-accent class="mx-auto mt-10 h-px w-16" aria-hidden="true" />
      </div>
    </div>

    <!-- Stats bar -->
    <StatRow :stats="stats" variant="bordered" />

    <!-- Services preview -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <p class="text-center text-xs font-medium uppercase tracking-widest text-primary">
          Services
        </p>
        <div data-rig-accent class="mx-auto mt-2 h-px w-8" aria-hidden="true" />

        <ServiceGrid :items="highlightedServices" layout="numbered" class="mt-10">
          <template #item="{ item, index }">
            <div class="py-8">
              <div class="flex items-start gap-8 sm:gap-12">
                <span
                  class="flex-shrink-0 font-mono text-2xl font-extralight tabular-nums text-primary"
                  aria-hidden="true"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <div>
                  <h3 class="text-lg font-light uppercase tracking-wide">{{ item.title }}</h3>
                  <p class="mt-3 text-sm leading-relaxed">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </template>
        </ServiceGrid>

        <div class="mt-6 text-center">
          <Button variant="secondary" size="sm" @click="emit('navigate', 'services')">
            View All Services
          </Button>
        </div>
      </div>
    </Section>

    <!-- Testimonials -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <p class="text-center text-xs font-medium uppercase tracking-widest text-primary">
          What Clients Say
        </p>
        <div data-rig-accent class="mx-auto mt-2 h-px w-8" aria-hidden="true" />
        <div class="mt-10 space-y-10">
          <Testimonial v-for="t in testimonials" :key="t.attribution" layout="border">
            <template #quote>{{ t.quote }}</template>
            <template #attribution>
              <p class="text-xs uppercase tracking-wider">{{ t.attribution }}</p>
            </template>
          </Testimonial>
        </div>
        <p class="mt-10 text-center text-xs tracking-wider text-muted-foreground">
          Client identities are never disclosed. References provided upon request and with client
          consent.
        </p>
      </div>
    </Section>

    <!-- Pre-footer CTA -->
    <CTABanner layout="centered" variant="card" class="relative overflow-hidden">
      <div class="absolute inset-0 bg-stripe-primary opacity-[0.03]" aria-hidden="true" />
      <p class="relative text-xs uppercase tracking-widest text-primary">
        Every case begins with a phone call
      </p>
      <p class="relative mt-4 text-2xl font-extralight">
        <a href="tel:+15415550177" class="transition-colors hover:text-primary">(541) 555-0177</a>
      </p>
      <p class="relative mt-3 text-xs">Confidential initial consultations. No obligation.</p>
    </CTABanner>
  </div>
</template>
