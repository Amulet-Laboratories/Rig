<script setup lang="ts">
import {
  Section,
  Card,
  Button,
  Badge,
  Divider,
  Icon,
  CTABanner,
  ContactForm,
  MapPlaceholder,
} from '@amulet-laboratories/rig'
import type { ContactFormField } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const hours = [
  { day: 'Monday \u2013 Thursday', time: '3 PM \u2013 10 PM' },
  { day: 'Friday \u2013 Saturday', time: '12 PM \u2013 12 AM' },
  { day: 'Sunday', time: '12 PM \u2013 8 PM' },
]

const contactFields: ContactFormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    autocomplete: 'name',
    maxlength: 200,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    autocomplete: 'email',
    maxlength: 320,
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'General, Private Events, Wholesale, or Press',
    maxlength: 200,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
    placeholder: 'What can we help with?',
    maxlength: 2000,
    rows: 4,
  },
]
</script>

<template>
  <h1 class="sr-only">Contact &amp; Location</h1>

  <!-- Header -->
  <Section
    variant="alternate"
    title="Find Us"
    subtitle="42 Wharf Street, right where the harbor smells like salt and hops."
  />

  <!-- Location + Hours -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Location card -->
      <Card class="p-6">
        <h2 class="text-lg font-black uppercase">Location</h2>
        <Divider class="my-3" />
        <address class="text-sm not-italic leading-relaxed">
          <strong>Undertow Brewing Co.</strong><br />
          42 Wharf Street<br />
          Briar Cove, OR 97420
        </address>
        <div class="mt-4 space-y-2 text-sm">
          <p class="flex items-center gap-2">
            <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
            <a href="tel:+15415550171" class="transition-colors hover:underline">(541) 555-0171</a>
          </p>
          <p class="flex items-center gap-2">
            <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
            <a href="mailto:hello@undertowbrewing.com" class="transition-colors hover:underline"
              >hello@undertowbrewing.com</a
            >
          </p>
        </div>
      </Card>

      <!-- Hours card -->
      <Card class="p-6">
        <h2 class="text-lg font-black uppercase">Taproom Hours</h2>
        <Divider class="my-3" />
        <dl class="space-y-2 text-sm">
          <div v-for="h in hours" :key="h.day" class="flex justify-between">
            <dt>{{ h.day }}</dt>
            <dd class="font-bold tabular-nums">{{ h.time }}</dd>
          </div>
        </dl>
        <Divider class="my-3" />
        <div class="space-y-2">
          <Badge variant="secondary">21+ after 9 PM</Badge>
          <p class="text-xs">Happy Hour Mon&ndash;Fri 3&ndash;6 PM &middot; $2 off all pints</p>
        </div>
      </Card>
    </div>
  </Section>

  <!-- Directions + Map -->
  <Section variant="alternate" title="Getting Here">
    <div class="mx-auto max-w-3xl">
      <div class="mt-6 space-y-3 text-sm leading-relaxed">
        <p>
          We are on Wharf Street at the south end of the harbor. Look for the converted warehouse
          with the loading dock facing the water.
        </p>
        <p>
          <strong>Parking:</strong> Street parking on Wharf and 1st. Free lot behind the building on
          weekends.
        </p>
        <p>
          <strong>Accessibility:</strong> Ground-floor entrance off the loading dock. Wheelchair
          accessible throughout the taproom and patio.
        </p>
      </div>
      <div class="mt-8">
        <MapPlaceholder
          address="42 Wharf Street, Briar Cove, OR 97420"
          description="South end of the harbor, converted warehouse with the loading dock"
        />
      </div>
    </div>
  </Section>

  <!-- Contact form -->
  <Section title="Drop Us a Line">
    <div class="mx-auto max-w-xl">
      <p class="text-center text-sm leading-relaxed">
        Private events, wholesale accounts, press inquiries, or just want to tell us your favorite
        beer. We read everything.
      </p>
      <ContactForm
        form-name="undertow-contact"
        :fields="contactFields"
        submit-label="Send It"
        submitting-label="Sending..."
        honeypot
        class="mt-8"
        @submit="() => {}"
      />
    </div>
  </Section>

  <!-- CTA Banner -->
  <CTABanner layout="centered">
    <h2 class="text-xl font-black uppercase">While you are here</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      Check the tap list, grab a bite, or see what is coming up this week.
    </p>
    <template #action>
      <Button variant="default" @click="emit('navigate', 'menu')">See the Menu</Button>
      <Button variant="outline" @click="emit('navigate', 'events')">Upcoming Events</Button>
    </template>
  </CTABanner>
</template>
