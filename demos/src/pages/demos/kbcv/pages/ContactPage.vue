<script setup lang="ts">
import {
  Section,
  Card,
  Button,
  Icon,
  CTABanner,
  ContactForm,
  MapPlaceholder,
  Divider,
} from '@amulet-laboratories/rig'
import { contactFields } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold">Contact Us</h1>
      <p class="mt-2 text-sm leading-relaxed">
        Questions, show pitches, volunteer inquiries, or just want to say hello. We read everything.
      </p>
    </div>
  </Section>

  <!-- Form + Sidebar -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-5">
      <!-- Contact Form -->
      <div class="lg:col-span-3">
        <ContactForm
          form-name="kbcv-contact"
          :fields="contactFields"
          submit-label="Send Message"
          submitting-label="Sending..."
          honeypot
          @submit="() => {}"
        />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Station Info -->
        <Card class="p-5">
          <h2 class="text-lg font-bold">Station Info</h2>
          <Divider class="my-3" />
          <address class="not-italic text-sm leading-relaxed">
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:map-pin" size="sm" aria-hidden="true" />
              88 Lighthouse Road<br />
              Briar Cove, OR 97420
            </p>
          </address>
          <div class="mt-4 space-y-2 text-sm">
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
              <a href="tel:+15415550917" class="transition-colors hover:underline"
                >(541) 555-0917</a
              >
            </p>
            <p class="flex items-center gap-2">
              <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
              <a href="mailto:studio@kbcv.org" class="transition-colors hover:underline"
                >studio@kbcv.org</a
              >
            </p>
          </div>
        </Card>

        <!-- Studio Hours -->
        <Card class="p-5">
          <h2 class="text-lg font-bold">Hours</h2>
          <Divider class="my-3" />
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt>Studio</dt>
              <dd class="font-medium">Mon&ndash;Fri 9am&ndash;5pm</dd>
            </div>
            <div class="flex justify-between">
              <dt>On Air</dt>
              <dd class="font-medium">6am&ndash;midnight daily</dd>
            </div>
          </dl>
        </Card>

        <!-- Map -->
        <MapPlaceholder
          address="88 Lighthouse Road, Briar Cove, OR 97420"
          description="KBCV 91.7 FM community radio station"
        />
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="text-2xl font-bold">Tune in at 91.7 FM</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Check the full weekly schedule or explore our shows.
    </p>
    <template #action>
      <Button variant="cta" @click="emit('navigate', 'schedule')">See the Schedule</Button>
      <Button variant="cta-ghost" @click="emit('navigate', 'shows')">Our Shows</Button>
    </template>
  </CTABanner>
</template>
