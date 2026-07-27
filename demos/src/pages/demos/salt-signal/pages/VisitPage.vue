<script setup lang="ts">
import { Section, CTABanner, Card, Button, Icon, MapPlaceholder } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const hours = [
  { day: 'Tuesday – Saturday', time: '10:00 AM – 6:00 PM' },
  { day: 'Sunday', time: '11:00 AM – 4:00 PM' },
  { day: 'Monday', time: 'Closed' },
]

const neighborhood = [
  {
    name: 'Undertow Brewing',
    type: 'Brewery & Taproom',
    description: 'Craft beer two blocks up — grab a pint on the patio and walk over.',
    distance: '2 min walk',
  },
  {
    name: 'Briar Cove Harbor Trail',
    type: 'Walking Trail',
    description:
      'A 1.2-mile loop that starts at the marina and winds up to the signal tower overlook.',
    distance: '5 min walk',
  },
  {
    name: 'Drift Coffee',
    type: 'Coffee Shop',
    description:
      'Pour-overs and pastries in a converted fishing shack. Best espresso on the coast.',
    distance: '1 min walk',
  },
  {
    name: 'Briar Cove Library',
    type: 'Public Library',
    description:
      "A gem of a public library with an ocean-view reading room and a great kids' section.",
    distance: '4 min walk',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <h1 class="font-serif text-3xl font-bold">Visit the Shop</h1>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed">
        45 Main Street, Briar Cove, Oregon. Honey samples are always out.
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
            <p>45 Main Street</p>
            <p>Briar Cove, OR 97420</p>
          </address>
          <div class="mt-5 space-y-2 text-sm">
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
              <a href="tel:+15415550165" class="transition-colors hover:underline"
                >(541) 555-0165</a
              >
            </p>
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
              <a href="mailto:hello@saltandsignal.com" class="transition-colors hover:underline"
                >hello@saltandsignal.com</a
              >
            </p>
          </div>
        </Card>

        <Card class="mt-5 p-5">
          <h2 class="font-serif text-lg font-bold">Hours</h2>
          <dl class="mt-4 space-y-2">
            <div v-for="h in hours" :key="h.day" class="flex items-center justify-between text-sm">
              <dt>{{ h.day }}</dt>
              <dd :class="{ italic: h.time === 'Closed' }">{{ h.time }}</dd>
            </div>
          </dl>
        </Card>

        <Card class="mt-5 p-5">
          <h2 class="font-serif text-lg font-bold">Getting Here</h2>
          <div class="mt-4 space-y-3 text-sm">
            <p>
              <strong>By car:</strong> Take US-101 to the Briar Cove exit, then follow Main Street
              into town. We're on the left, between Drift Coffee and the hardware store.
            </p>
            <p>
              <strong>Parking:</strong> Free street parking on Main Street. Additional lot behind
              the library, one block east.
            </p>
            <p>
              <strong>Accessibility:</strong> Street-level entrance, no steps. Aisles accommodate
              wheelchairs and strollers.
            </p>
          </div>
        </Card>
      </div>

      <!-- Map + shop image -->
      <div class="space-y-5">
        <MapPlaceholder
          address="45 Main Street, Briar Cove, OR"
          description="Between Drift Coffee and Briar Cove Hardware"
          aspect="aspect-[16/10]"
        />
        <img
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80"
          alt="Salt & Signal storefront on Main Street"
          class="aspect-[16/10] w-full rounded-lg object-cover"
          loading="lazy"
        />
        <Card class="p-5">
          <h3 class="font-serif text-sm font-bold">Can't visit in person?</h3>
          <p class="mt-2 text-xs leading-relaxed">
            Most of our catalog is available online with free shipping on orders over $75. Gift
            wrapping and handwritten notes available at checkout.
          </p>
          <Button variant="primary" size="sm" class="mt-4" @click="emit('navigate', 'shop')">
            Shop Online
          </Button>
        </Card>
      </div>
    </div>
  </Section>

  <!-- While you're in town -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">While You're in Town</h2>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed">
        Briar Cove is small but worth the wander. A few of our favorite neighbors:
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

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Questions?</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Call us at
      <a href="tel:+15415550165" class="underline transition-opacity hover:opacity-70"
        >(541) 555-0165</a
      >
      or email
      <a href="mailto:hello@saltandsignal.com" class="underline transition-opacity hover:opacity-70"
        >hello@saltandsignal.com</a
      >. We usually reply within a day.
    </p>
  </CTABanner>
</template>
