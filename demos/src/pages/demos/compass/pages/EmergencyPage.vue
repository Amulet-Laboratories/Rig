<script setup lang="ts">
import { Section, CTABanner, Card, FeatureList, Icon } from '@amulet-laboratories/rig'
import type { FeatureItem } from '@amulet-laboratories/rig'

const protocols = [
  {
    title: 'During Business Hours',
    description: 'Walk-ins accepted. Call ahead if possible so we can prepare.',
    phone: '(541) 555-0199',
    phoneHref: 'tel:+15415550199',
    hours: 'Mon–Fri 7:30 AM – 6 PM, Sat 8 AM – 2 PM',
  },
  {
    title: 'After Hours',
    description:
      "Call the same number for our after-hours emergency recording. We'll direct you to the nearest 24-hour facility in Coos Bay.",
    phone: '(541) 555-0199',
    phoneHref: 'tel:+15415550199',
    hours: 'Evenings, Sundays, Holidays',
  },
  {
    title: 'Poison Control',
    description:
      'ASPCA Animal Poison Control Center. A $75 consultation fee may apply. Available 24/7/365.',
    phone: '(888) 426-4435',
    phoneHref: 'tel:+18884264435',
    hours: '24 hours / 7 days',
  },
]

const warningSignsDog: FeatureItem[] = [
  { id: 'dog-1', text: 'Difficulty breathing or rapid panting' },
  { id: 'dog-2', text: 'Unable to stand or walk' },
  { id: 'dog-3', text: 'Seizures or collapse' },
  { id: 'dog-4', text: 'Swollen or distended abdomen' },
  { id: 'dog-5', text: "Bleeding that won't stop" },
  { id: 'dog-6', text: 'Ingestion of toxic substance' },
  { id: 'dog-7', text: 'Eye injury or sudden blindness' },
  { id: 'dog-8', text: 'Not eating for 24+ hours with lethargy' },
]

const warningSignsCat: FeatureItem[] = [
  { id: 'cat-1', text: 'Open-mouth breathing or panting' },
  { id: 'cat-2', text: 'Hiding and refusing food for 24+ hours' },
  { id: 'cat-3', text: 'Straining to urinate (especially male cats)' },
  { id: 'cat-4', text: 'Sudden paralysis of hind legs' },
  { id: 'cat-5', text: 'Seizures or collapse' },
  { id: 'cat-6', text: 'Ingestion of lilies, string, or chemicals' },
  { id: 'cat-7', text: 'Trauma (fall, hit by car)' },
  { id: 'cat-8', text: 'Severe vomiting or bloody diarrhea' },
]

const firstAidTips: FeatureItem[] = [
  {
    id: 'fa-1',
    text: 'Stay Calm',
    detail: 'Your pet picks up on your stress. Speak softly and move slowly.',
  },
  {
    id: 'fa-2',
    text: 'Protect Yourself',
    detail: 'Injured animals may bite. Use a towel to gently restrain if needed.',
  },
  {
    id: 'fa-3',
    text: "Don't Give Medications",
    detail: 'Human medications can be fatal to pets. Call us first.',
  },
  {
    id: 'fa-4',
    text: 'Transport Safely',
    detail: 'Use a flat surface or carrier. Support the spine if you suspect injury.',
  },
  {
    id: 'fa-5',
    text: 'Call Ahead',
    detail: "Even if you're coming as a walk-in, a quick call lets us prepare for your arrival.",
  },
]
</script>

<template>
  <!-- Emergency Header -->
  <Section variant="default" class="bg-destructive/8">
    <div class="mx-auto max-w-3xl text-center">
      <div
        class="bg-destructive mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
      >
        <Icon
          icon="heroicons:exclamation-triangle"
          size="sm"
          aria-hidden="true"
          class="text-destructive-foreground"
        />
      </div>
      <h1 class="text-destructive text-3xl font-bold sm:text-4xl">Emergency Information</h1>
      <p class="mt-4 text-base leading-relaxed">
        If your pet is in immediate danger, call us now. This page covers emergency protocols,
        warning signs, and basic first aid.
      </p>
      <a
        href="tel:+15415550199"
        class="bg-destructive mt-6 inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-bold text-destructive-foreground"
      >
        <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
        Call (541) 555-0199
      </a>
    </div>
  </Section>

  <!-- Protocols -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-destructive text-xl font-bold">Emergency Protocols</h2>
      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card v-for="p in protocols" :key="p.title" class="p-5">
          <h3 class="text-destructive text-sm font-bold">{{ p.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed">{{ p.description }}</p>
          <a :href="p.phoneHref" class="text-destructive mt-3 block text-sm font-bold underline">{{
            p.phone
          }}</a>
          <p class="mt-1 text-xs">{{ p.hours }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Warning Signs -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-xl font-bold">When to Seek Emergency Care</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h3 class="flex items-center gap-2 text-base font-bold">
            <span class="text-lg">&#128054;</span> Dogs
          </h3>
          <FeatureList :items="warningSignsDog" layout="list" class="mt-4">
            <template #item="{ item: sign }">
              <div class="flex items-start gap-2 text-sm">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  size="sm"
                  aria-hidden="true"
                  class="text-destructive mt-0.5 flex-shrink-0"
                />
                {{ sign.text }}
              </div>
            </template>
          </FeatureList>
        </div>
        <div>
          <h3 class="flex items-center gap-2 text-base font-bold">
            <span class="text-lg">&#128049;</span> Cats
          </h3>
          <FeatureList :items="warningSignsCat" layout="list" class="mt-4">
            <template #item="{ item: sign }">
              <div class="flex items-start gap-2 text-sm">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  size="sm"
                  aria-hidden="true"
                  class="text-destructive mt-0.5 flex-shrink-0"
                />
                {{ sign.text }}
              </div>
            </template>
          </FeatureList>
        </div>
      </div>
    </div>
  </Section>

  <!-- First Aid -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-xl font-bold">Basic First Aid Tips</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <FeatureList :items="firstAidTips" layout="grid" :columns="3" class="mt-8">
        <template #item="{ item: tip, index }">
          <Card class="p-5">
            <div class="flex items-start gap-3">
              <span
                class="bg-primary flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                >{{ index + 1 }}</span
              >
              <div>
                <h3 class="text-sm font-bold">{{ tip.text }}</h3>
                <p class="mt-1 text-sm">{{ tip.detail }}</p>
              </div>
            </div>
          </Card>
        </template>
      </FeatureList>
    </div>
  </Section>

  <!-- Bottom Banner -->
  <CTABanner layout="centered" variant="destructive">
    <p class="text-lg font-bold text-accent-foreground">
      When in doubt, call. We'd rather hear from you when it's nothing than miss something that
      matters.
    </p>
    <p class="mt-2 text-sm">
      <a href="tel:+15415550199" class="font-bold underline transition-opacity hover:opacity-70"
        >(541) 555-0199</a
      >
      — available during all business hours
    </p>
  </CTABanner>
</template>
