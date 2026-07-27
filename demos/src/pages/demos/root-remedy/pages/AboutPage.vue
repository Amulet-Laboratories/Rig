<script setup lang="ts">
import {
  Hero,
  Section,
  StatRow,
  CTABanner,
  Button,
  TeamGrid,
  ServiceGrid,
  Gallery,
  FlankedHeading,
  Ornament,
  SectionDivider,
} from '@amulet-laboratories/rig'
import { staff, dispensaryStats, valueItems, dispensaryGallery } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <!-- Split hero with founder image -->
  <Hero layout="split">
    <template #eyebrow>
      <span>Our Story</span>
    </template>
    <template #title>
      <h1 class="font-serif text-3xl sm:text-4xl">A dispensary built on clinical care</h1>
    </template>
    <template #description>
      <p>
        Root &amp; Remedy was founded by a pharmacist who believed cannabis deserved the same rigor,
        research, and respect as any other medicine.
      </p>
    </template>
    <template #actions>
      <Button variant="primary" size="lg" @click="emit('navigate', 'visit')">
        Plan Your Visit
      </Button>
      <Button variant="secondary" size="lg" @click="emit('navigate', 'wellness')">
        Wellness Programs
      </Button>
    </template>
    <template #media>
      <img
        loading="lazy"
        src="https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&w=800&q=80"
        alt="Elena Vasquez, founder of Root & Remedy"
        class="aspect-[4/3] w-full object-cover"
      />
    </template>
  </Hero>

  <!-- By the numbers -->
  <StatRow :stats="dispensaryStats" variant="bordered" />

  <!-- Origin story — alternating gallery -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">How It Started</h2>
      </FlankedHeading>
      <div class="mx-auto mt-5 max-w-3xl space-y-4 text-center text-sm leading-relaxed">
        <p>
          Elena Vasquez spent 15 years behind a pharmacy counter in Portland. She filled
          prescriptions for painkillers, sleep aids, and anxiety medications — and watched patients
          cycle through refills without getting better.
        </p>
        <p>
          In 2022, she started studying cannabinoid medicine. The research was clear: for certain
          conditions, cannabis worked as well or better than the drugs she was dispensing, with
          fewer side effects and lower risk of dependency.
        </p>
      </div>

      <Ornament class="my-8" />

      <Gallery :items="dispensaryGallery" layout="alternating" />

      <div class="mx-auto mt-8 max-w-3xl space-y-4 text-center text-sm leading-relaxed">
        <p>
          She moved to Briar Cove in early 2023, drawn by the town's pace and its need for a proper
          medical dispensary. Root &amp; Remedy opened that June in a converted apothecary on Harbor
          Road — fitting, given what she set out to build.
        </p>
        <p>
          The name reflects the philosophy: go to the root of the problem, and remedy it with
          intention.
        </p>
      </div>
    </div>
  </Section>

  <SectionDivider />

  <!-- Values -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">What We Believe</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Cannabis is medicine. We treat it with the same rigor, care, and respect as any other
        therapeutic tool.
      </p>
      <ServiceGrid :items="valueItems" layout="grid" :columns="2" class="mt-8" />
    </div>
  </Section>

  <SectionDivider flip />

  <!-- Team -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Meet the Team</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Every member of our team holds certifications in cannabis education or related health
        disciplines.
      </p>
      <TeamGrid :members="staff" layout="card" :columns="3" class="mt-8">
        <template #credentials="{ member }">
          <p class="text-muted-foreground mt-2 text-xs">
            Specialty: {{ (member as (typeof staff)[number]).specialty }}
          </p>
        </template>
      </TeamGrid>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered" variant="inverted">
    <h2 class="font-serif text-xl font-bold">Ready to start?</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Whether you have an OMMP card or you are exploring cannabis for the first time, we will guide
      you through every step.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta-ghost" @click="emit('navigate', 'visit')"> Plan Your Visit </Button>
        <Button
          variant="cta-light"
          class="border border-primary-foreground bg-transparent"
          @click="emit('navigate', 'menu')"
        >
          Browse Menu
        </Button>
      </div>
    </template>
  </CTABanner>
</template>
