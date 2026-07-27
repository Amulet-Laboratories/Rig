<script setup lang="ts">
import {
  Section,
  Badge,
  Button,
  CTABanner,
  PricingCard,
  FeatureList,
  ServiceGrid,
  FlankedHeading,
  SectionDivider,
  Card,
  Icon,
  Ornament,
} from '@amulet-laboratories/rig'
import { wholesaleTiers, wholesalePartners, subscriptionFeatures } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <FlankedHeading>
        <h1 class="font-serif text-3xl font-bold">Wholesale</h1>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed">
        We supply cafes, restaurants, and offices along the Oregon coast and beyond. Fresh-roasted,
        delivered weekly, with the support to serve it well.
      </p>
    </div>
  </Section>

  <!-- Tiers -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">Partnership Tiers</h2>
      <Ornament variant="rule" size="sm" class="mx-auto mt-2" />
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <PricingCard v-for="(tier, i) in wholesaleTiers" :key="tier.name" :featured="i === 0">
          <template #title>{{ tier.name }}</template>
          <template #price>{{ tier.discount }}</template>
          <template #description>Minimum: {{ tier.minOrder }}</template>
          <template #features>
            <ul class="space-y-2 text-xs">
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-start gap-2 leading-relaxed"
              >
                <Icon
                  icon="heroicons:check"
                  size="sm"
                  aria-hidden="true"
                  class="text-success mt-0.5 shrink-0"
                />
                {{ feature }}
              </li>
            </ul>
          </template>
          <template #cta>
            <Button variant="primary" size="sm" class="w-full">Get Started</Button>
          </template>
        </PricingCard>
      </div>
    </div>
  </Section>

  <SectionDivider variant="organic" />

  <!-- Current partners -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Current Partners</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Fogline coffee is served at these Briar Cove businesses.
      </p>
      <ServiceGrid :items="wholesalePartners" :columns="2" class="mt-8">
        <template #item="{ item }">
          <Card class="flex items-start gap-4 p-5">
            <div
              class="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
              <Icon
                icon="heroicons:user-group"
                size="sm"
                aria-hidden="true"
                class="text-primary-foreground"
              />
            </div>
            <div>
              <h3 class="font-serif text-sm font-bold">{{ item.title }}</h3>
              <p class="text-muted-foreground text-xs">
                {{ (item as (typeof wholesalePartners)[number]).type }}
              </p>
              <Badge size="sm" class="mt-1"
                >Since {{ (item as (typeof wholesalePartners)[number]).since }}</Badge
              >
            </div>
          </Card>
        </template>
      </ServiceGrid>
    </div>
  </Section>

  <SectionDivider variant="organic" flip />

  <!-- Subscription -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <h2 class="font-serif text-2xl font-bold">Home Subscriptions</h2>
          <Ornament variant="rule" size="sm" class="mt-2" />
          <p class="mt-4 text-sm leading-relaxed">
            Not a wholesale buyer? No problem. Our home subscription delivers fresh-roasted coffee
            to your door every 2 or 4 weeks. Choose a specific coffee or let us rotate through our
            seasonal menu.
          </p>
          <FeatureList :items="subscriptionFeatures" layout="list" class="mt-4">
            <template #icon>
              <Icon
                icon="heroicons:check"
                size="sm"
                aria-hidden="true"
                class="text-success shrink-0"
              />
            </template>
          </FeatureList>
          <Button variant="primary" size="lg" class="mt-6"> Start a Subscription </Button>
        </div>
        <div class="overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
            alt="Fresh bag of Fogline coffee beans"
            class="aspect-[4/3] w-full rounded-sm object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Interested in wholesale?</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Fill out our inquiry form or call us directly. We will set up a tasting and walk you through
      the program.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta" @click="emit('navigate', 'visit')">Contact Us</Button>
        <Button variant="secondary" @click="emit('navigate', 'coffee')">See Our Coffee</Button>
      </div>
    </template>
  </CTABanner>
</template>
