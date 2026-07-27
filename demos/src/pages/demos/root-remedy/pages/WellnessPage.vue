<script setup lang="ts">
import {
  Hero,
  Section,
  Button,
  Badge,
  Icon,
  MenuList,
  ServiceGrid,
  FeatureList,
  FlankedHeading,
  Ornament,
  SectionDivider,
  CTABanner,
} from '@amulet-laboratories/rig'
import type { FeatureItem } from '@amulet-laboratories/rig'
import { wellnessWorkshops, wellnessResources } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const workshopBenefits: FeatureItem[] = [
  { id: 'free', text: 'Most workshops are free — no purchase required' },
  { id: 'small', text: 'Small groups (max 12) for personal attention' },
  { id: 'led', text: 'Led by certified cannabis educators and pharmacists' },
  { id: 'materials', text: 'Take-home guides and reference materials included' },
  { id: 'open', text: 'Open to patients, caregivers, and curious community members' },
]
</script>

<template>
  <!-- Hero -->
  <Hero layout="centered" class="bg-primary">
    <template #eyebrow>
      <span>Education &amp; Community</span>
    </template>
    <template #title>
      <h1 class="mx-auto max-w-2xl font-serif">Knowledge is the best medicine we can offer</h1>
    </template>
    <template #description>
      <p class="mx-auto max-w-lg">
        Free workshops, patient support groups, and clinical resources. Cannabis education grounded
        in science, delivered with care.
      </p>
    </template>
    <template #actions>
      <Button variant="cta-ghost" size="lg" @click="emit('navigate', 'visit')">
        Visit Us to Sign Up
      </Button>
    </template>
  </Hero>

  <!-- Workshop schedule — MenuList -->
  <Section>
    <div class="mx-auto max-w-3xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Monthly Workshop Series</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Every Saturday at 11am in our consultation room. Walk in or reserve a spot by calling ahead.
      </p>
      <MenuList :items="wellnessWorkshops" priced class="mt-8">
        <template #note="{ item }">
          <span class="text-primary text-xs font-medium">{{ item.note }}</span>
        </template>
      </MenuList>
    </div>
  </Section>

  <Ornament class="my-4" />

  <!-- Workshop benefits -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">What to Expect</h2>
      </FlankedHeading>
      <FeatureList :items="workshopBenefits" layout="list" class="mt-8">
        <template #icon>
          <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
        </template>
      </FeatureList>
    </div>
  </Section>

  <SectionDivider />

  <!-- Resources & programs -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Programs &amp; Resources</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Beyond the workshops. Ongoing support for patients and the community.
      </p>
      <ServiceGrid :items="wellnessResources" layout="grid" :columns="2" class="mt-8" />
    </div>
  </Section>

  <SectionDivider flip />

  <!-- Conditions we help with -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Conditions We Support</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Cannabis therapy has clinical evidence supporting its use for a range of conditions. We help
        patients navigate the options.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <Badge
          v-for="condition in [
            'Chronic Pain',
            'Anxiety & PTSD',
            'Insomnia',
            'Arthritis',
            'Nausea & Appetite',
            'Muscle Spasms',
            'Migraines',
            'Inflammation',
          ]"
          :key="condition"
          size="lg"
        >
          {{ condition }}
        </Badge>
      </div>
      <p class="text-muted-foreground mx-auto mt-6 max-w-md text-center text-xs leading-relaxed">
        This is not medical advice. Cannabis affects everyone differently. We recommend consulting
        with your healthcare provider and our clinical team before starting any cannabis regimen.
      </p>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Start with a conversation</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Book a free consultation or drop in during workshop hours. No purchase necessary — we are
      happy to just talk.
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
