<script setup lang="ts">
import {
  Section,
  CTABanner,
  Card,
  Button,
  Icon,
  MapPlaceholder,
  ContactForm,
  FeatureList,
  FlankedHeading,
  Ornament,
  SectionDivider,
} from '@amulet-laboratories/rig'
import { firstVisitFeatures, contactFields } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const hours = [
  { day: 'Monday \u2013 Saturday', time: '10:00 AM \u2013 7:00 PM' },
  { day: 'Sunday', time: '11:00 AM \u2013 5:00 PM' },
]

const neighborhood = [
  {
    name: 'Drift Coffee',
    type: 'Coffee Shop',
    description: 'Pour-overs and pastries in a converted fishing shack. Two doors down.',
    distance: '1 min walk',
  },
  {
    name: 'Undertow Brewing',
    type: 'Brewery & Taproom',
    description: 'Craft beer and food trucks. A good stop after your visit.',
    distance: '3 min walk',
  },
  {
    name: 'Briar Cove Harbor Trail',
    type: 'Walking Trail',
    description: 'A 1.2-mile loop along the marina. Starts at the end of Harbor Road.',
    distance: '2 min walk',
  },
  {
    name: 'Compass Animal Hospital',
    type: 'Veterinary Clinic',
    description: 'In case your dog needs a check-up while you are in town.',
    distance: '5 min walk',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <h1 class="font-serif text-3xl font-bold">Visit Us</h1>
      <Ornament variant="rule" size="sm" class="mx-auto mt-2" />
      <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed">
        128 Harbor Road, Briar Cove, Oregon. Walk-ins welcome, consultations always free.
      </p>
    </div>
  </Section>

  <!-- Info grid -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Location & contact -->
      <div>
        <Card class="p-5">
          <h2 class="font-serif text-lg font-bold">Location</h2>
          <address class="mt-4 space-y-2 text-sm not-italic">
            <p>128 Harbor Road</p>
            <p>Briar Cove, OR 97420</p>
          </address>
          <div class="mt-5 space-y-2 text-sm">
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
              <a href="tel:+15415550192" class="transition-colors hover:underline"
                >(541) 555-0192</a
              >
            </p>
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
              <a href="mailto:hello@rootandremedy.com" class="transition-colors hover:underline"
                >hello@rootandremedy.com</a
              >
            </p>
          </div>
        </Card>

        <Card class="mt-5 p-5">
          <h2 class="font-serif text-lg font-bold">Hours</h2>
          <dl class="mt-4 space-y-2">
            <div v-for="h in hours" :key="h.day" class="flex items-center justify-between text-sm">
              <dt>{{ h.day }}</dt>
              <dd>{{ h.time }}</dd>
            </div>
          </dl>
          <p class="text-muted-foreground mt-4 text-xs">
            Last consultation 30 minutes before close.
          </p>
        </Card>

        <Card class="mt-5 p-5">
          <h2 class="font-serif text-lg font-bold">Getting Here</h2>
          <div class="mt-4 space-y-3 text-sm">
            <p>
              <strong>By car:</strong> Take US-101 to the Briar Cove exit, then follow Harbor Road
              toward the marina. We are on the right, in the building with the green awning.
            </p>
            <p>
              <strong>Parking:</strong> Free lot behind the building. Street parking also available
              on Harbor Road.
            </p>
            <p>
              <strong>Accessibility:</strong> Ground-floor entrance, ADA compliant. Wheelchair
              accessible throughout.
            </p>
          </div>
        </Card>
      </div>

      <!-- Map + image -->
      <div class="space-y-5">
        <MapPlaceholder
          address="128 Harbor Road, Briar Cove, OR"
          description="Near the marina, green awning"
          aspect="aspect-[16/10]"
        />
        <img
          src="https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80"
          alt="Root & Remedy storefront on Harbor Road"
          class="aspect-[16/10] w-full rounded-lg object-cover"
          loading="lazy"
        />
        <Card class="p-5">
          <h3 class="font-serif text-sm font-bold">New to cannabis?</h3>
          <p class="mt-2 text-xs leading-relaxed">
            No experience needed. Our team will walk you through everything — from what to bring, to
            how products work, to finding the right starting dose.
          </p>
          <Button variant="primary" size="sm" class="mt-4" @click="emit('navigate', 'wellness')">
            Wellness Programs
          </Button>
        </Card>
      </div>
    </div>
  </Section>

  <SectionDivider />

  <!-- First visit guide — FeatureList -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Your First Visit</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        No appointment needed. Here is what to expect when you walk in.
      </p>
      <FeatureList :items="firstVisitFeatures" layout="list" class="mt-8">
        <template #icon="{ index }">
          <span
            class="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
          >
            {{ index + 1 }}
          </span>
        </template>
      </FeatureList>
    </div>
  </Section>

  <SectionDivider />

  <!-- While you're in town -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">While You're in Town</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed">
        Briar Cove is worth the wander. A few of our favorite neighbors:
      </p>
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card v-for="n in neighborhood" :key="n.name" class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-serif text-sm font-bold">{{ n.name }}</h3>
              <p class="text-primary text-xs font-semibold">{{ n.type }}</p>
            </div>
            <span class="text-muted-foreground shrink-0 text-xs">{{ n.distance }}</span>
          </div>
          <p class="mt-2 text-xs leading-relaxed">{{ n.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <SectionDivider flip />

  <!-- Contact form -->
  <Section variant="alternate">
    <div class="mx-auto max-w-xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Get in Touch</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed">
        Questions before you visit? Send us a message and we will respond within a few hours.
      </p>
      <ContactForm
        form-name="root-remedy-contact"
        :fields="contactFields"
        submit-label="Send Message"
        submitting-label="Sending..."
        class="mt-8"
        @submit="() => {}"
      />
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Prefer to call?</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Reach us at
      <a href="tel:+15415550192" class="underline transition-opacity hover:opacity-70"
        >(541) 555-0192</a
      >
      during business hours, or email
      <a href="mailto:hello@rootandremedy.com" class="underline transition-opacity hover:opacity-70"
        >hello@rootandremedy.com</a
      >
      anytime.
    </p>
  </CTABanner>
</template>
