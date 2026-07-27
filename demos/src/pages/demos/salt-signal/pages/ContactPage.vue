<script setup lang="ts">
import { ref } from 'vue'
import {
  Section,
  Card,
  Button,
  Icon,
  Divider,
  CTABanner,
  Input,
  Select,
  Textarea,
  MapPlaceholder,
} from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()
const submitted = ref(false)

const inquiryOptions: SelectOption[] = [
  { id: 'general', label: 'General question' },
  { id: 'product', label: 'Product inquiry' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'events', label: 'Events & markets' },
  { id: 'press', label: 'Press' },
]

const hours = [
  { day: 'Tuesday – Saturday', time: '10:00 AM – 6:00 PM' },
  { day: 'Sunday', time: '11:00 AM – 4:00 PM' },
  { day: 'Monday', time: 'Closed' },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <h1 class="font-serif text-3xl font-bold">Get in Touch</h1>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed">
        Whether you have a question about a product, want to stock our goods, or just want to say
        hello — we would love to hear from you.
      </p>
    </div>
  </Section>

  <!-- Form + sidebar -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5">
      <!-- Contact form -->
      <div class="lg:col-span-3">
        <Card class="p-6">
          <h2 class="font-serif text-lg font-bold">Send Us a Message</h2>
          <p class="mt-1 text-xs leading-relaxed">
            We read every message and reply within a day, usually sooner.
          </p>

          <div
            v-if="submitted"
            class="bg-success/12 mt-6 rounded-lg p-6 text-center"
            role="status"
            aria-live="polite"
          >
            <div
              class="bg-success/12 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
            >
              <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
            </div>
            <h3 class="mt-3 font-serif text-lg font-semibold">Message Sent</h3>
            <p class="mt-2 text-sm leading-relaxed">Thank you. We will be in touch soon.</p>
            <div class="mt-4 flex flex-wrap justify-center gap-3">
              <Button variant="primary" size="sm" @click="emit('navigate', 'shop')">
                Browse the Shop
              </Button>
              <Button variant="secondary" size="sm" @click="emit('navigate', 'visit')">
                Plan a Visit
              </Button>
            </div>
          </div>

          <form
            v-else
            class="mt-6 space-y-4"
            aria-label="Contact Salt & Signal"
            @submit.prevent="submitted = true"
          >
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Name" placeholder="Your name" required />
              <Input label="Email" placeholder="you@example.com" type="email" required />
            </div>
            <div>
              <label for="ss-inquiry" class="mb-1 block text-xs font-medium">Inquiry Type</label>
              <Select
                id="ss-inquiry"
                :options="inquiryOptions"
                placeholder="What can we help with?"
              />
            </div>
            <div>
              <label for="ss-message" class="mb-1 block text-xs font-medium">Message</label>
              <Textarea id="ss-message" placeholder="Tell us what's on your mind..." required />
            </div>
            <Button variant="primary" class="w-full" type="submit">Send Message</Button>
            <p class="text-muted-foreground text-xs">
              We typically respond within one business day.
            </p>
          </form>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-5 lg:col-span-2">
        <!-- Contact info -->
        <Card class="p-5">
          <h2 class="font-serif text-lg font-bold">Contact Info</h2>
          <address class="mt-4 space-y-2 text-sm not-italic">
            <p>45 Main Street</p>
            <p>Briar Cove, OR 97420</p>
          </address>
          <Divider class="my-4" />
          <div class="space-y-2 text-sm">
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

        <!-- Hours -->
        <Card class="p-5">
          <h2 class="font-serif text-lg font-bold">Hours</h2>
          <dl class="mt-4 space-y-2">
            <div v-for="h in hours" :key="h.day" class="flex items-center justify-between text-sm">
              <dt>{{ h.day }}</dt>
              <dd :class="{ italic: h.time === 'Closed' }">{{ h.time }}</dd>
            </div>
          </dl>
        </Card>

        <!-- Events note -->
        <Card class="p-5">
          <h3 class="font-serif text-sm font-bold">Makers' Markets</h3>
          <p class="mt-2 text-xs leading-relaxed">
            We host makers' markets throughout the year — local artisans, live demos, and seasonal
            goods on the sidewalk outside the shop. Follow us for dates.
          </p>
        </Card>

        <!-- Map -->
        <MapPlaceholder
          address="45 Main Street, Briar Cove, OR"
          description="Between Drift Coffee and Briar Cove Hardware"
          aspect="aspect-[16/10]"
        />
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Come see us</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Nothing beats walking through the door. Browse the shelves, sample the honey, and meet the
      people behind the products.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta-ghost" @click="emit('navigate', 'shop')"> Shop Online </Button>
        <Button variant="cta-light" @click="emit('navigate', 'visit')"> Visit the Shop </Button>
      </div>
    </template>
  </CTABanner>
</template>
