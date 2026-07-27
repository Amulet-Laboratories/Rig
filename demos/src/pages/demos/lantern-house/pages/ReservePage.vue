<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Card,
  Icon,
  Input,
  Ornament,
  Section,
  Select,
  Textarea,
  MapPlaceholder,
} from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()
const submitted = ref(false)

const roomOptions: SelectOption[] = [
  { id: '', label: 'No preference' },
  { id: 'harbor-suite', label: 'Harbor Suite ($320/night)' },
  { id: 'dune-room', label: 'Dune Room ($240/night)' },
  { id: 'fog-room', label: 'Fog Room ($220/night)' },
  { id: 'captains-quarters', label: "Captain's Quarters ($360/night)" },
  { id: 'garden-cottage', label: 'Garden Cottage ($280/night)' },
]

const guestOptions: SelectOption[] = [
  { id: '1', label: '1 Guest' },
  { id: '2', label: '2 Guests' },
]

const policies = [
  { label: 'Check-in', value: '3:00 PM' },
  { label: 'Check-out', value: '11:00 AM' },
  { label: 'Cancellation', value: '48 hours prior to arrival' },
  { label: 'Minimum Stay', value: '2 nights on weekends (Jun–Sep)' },
  { label: 'Pets', value: 'Garden Cottage only, $50/night' },
  { label: 'Children', value: 'Guests 12 and older are welcome' },
]

const perks = [
  'Complimentary breakfast each morning',
  'Welcome cocktail at The Bar',
  'Priority dining reservations',
  'Late check-out upon availability',
  'Curated local guide and tide chart',
  'Complimentary parking',
]
</script>

<template>
  <div>
    <!-- Header -->
    <Section variant="alternate">
      <div class="text-center">
        <p class="text-xs font-light uppercase">Plan Your Visit</p>
        <h1 class="mt-4 font-serif text-4xl font-light sm:text-5xl">Reserve Your Stay</h1>
        <Ornament variant="rule" size="sm" />
        <p class="mx-auto mt-4 max-w-lg text-sm font-light">
          Book directly and receive complimentary breakfast, a welcome cocktail, and our best
          available rate.
        </p>
      </div>
    </Section>

    <!-- Reservation form -->
    <Section>
      <div class="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-3">
        <!-- Form -->
        <div class="lg:col-span-2">
          <Card class="p-6 sm:p-8">
            <h2 class="text-xl font-light">Check Availability</h2>
            <form
              class="mt-6 space-y-4"
              aria-label="Reservation request"
              @submit.prevent="submitted = true"
            >
              <div
                v-if="submitted"
                class="bg-success/12 text-success rounded-lg p-4 text-center text-sm"
              >
                Thank you. Your reservation request has been received. We will confirm by email
                within 24 hours.
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="lh-first" class="mb-1 block text-xs font-light">First Name</label>
                  <Input id="lh-first" placeholder="First name" required />
                </div>
                <div>
                  <label for="lh-last" class="mb-1 block text-xs font-light">Last Name</label>
                  <Input id="lh-last" placeholder="Last name" required />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="lh-email" class="mb-1 block text-xs font-light">Email</label>
                  <Input id="lh-email" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <label for="lh-phone" class="mb-1 block text-xs font-light">Phone</label>
                  <Input id="lh-phone" type="tel" placeholder="(541) 555-0000" />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="lh-checkin" class="mb-1 block text-xs font-light"
                    >Check-in Date</label
                  >
                  <Input id="lh-checkin" type="date" required />
                </div>
                <div>
                  <label for="lh-checkout" class="mb-1 block text-xs font-light"
                    >Check-out Date</label
                  >
                  <Input id="lh-checkout" type="date" />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="lh-room" class="mb-1 block text-xs font-light">Preferred Room</label>
                  <Select id="lh-room" :options="roomOptions" placeholder="No preference" />
                </div>
                <div>
                  <label for="lh-guests" class="mb-1 block text-xs font-light">Guests</label>
                  <Select id="lh-guests" :options="guestOptions" />
                </div>
              </div>
              <div>
                <label for="lh-requests" class="mb-1 block text-xs font-light"
                  >Special Requests</label
                >
                <Textarea
                  id="lh-requests"
                  :rows="3"
                  placeholder="Anniversary, dietary needs, early check-in..."
                />
              </div>
              <Button variant="primary" type="submit" class="w-full sm:w-auto">
                Request Reservation
              </Button>
            </form>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <Card class="p-5">
            <p class="text-xs font-light uppercase">Book Direct Perks</p>
            <ul class="mt-3 space-y-2">
              <li v-for="p in perks" :key="p" class="flex items-start gap-2 text-xs font-light">
                <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
                {{ p }}
              </li>
            </ul>
          </Card>

          <Card class="p-5">
            <p class="text-xs font-light uppercase">Contact</p>
            <div class="mt-3 space-y-2">
              <p class="text-xs font-light">
                <a href="tel:+15415550144" class="transition-colors hover:underline"
                  >(541) 555-0144</a
                >
              </p>
              <p class="text-xs font-light">
                <a
                  href="mailto:reservations@lanternhouse.com"
                  class="transition-colors hover:underline"
                  >reservations@lanternhouse.com</a
                >
              </p>
            </div>
          </Card>

          <Card class="p-5">
            <p class="text-xs font-light uppercase">Quick Links</p>
            <div class="mt-3 space-y-2">
              <button
                class="block text-left text-xs font-light transition-colors hover:underline"
                @click="emit('navigate', 'rooms')"
              >
                View Rooms &amp; Rates &rarr;
              </button>
              <button
                class="block text-left text-xs font-light transition-colors hover:underline"
                @click="emit('navigate', 'dining')"
              >
                Dining Menu &rarr;
              </button>
              <button
                class="block text-left text-xs font-light transition-colors hover:underline"
                @click="emit('navigate', 'explore')"
              >
                Explore Briar Cove &rarr;
              </button>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Policies -->
    <Section variant="alternate" title="Policies">
      <div class="mx-auto max-w-3xl">
        <dl class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="p in policies"
            :key="p.label"
            class="border-border scroll-reveal flex justify-between border-b pb-3"
          >
            <dt class="text-xs font-light uppercase tracking-wider">{{ p.label }}</dt>
            <dd class="text-xs font-light">{{ p.value }}</dd>
          </div>
        </dl>
      </div>
    </Section>

    <!-- Getting here -->
    <Section>
      <div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
        <div class="scroll-reveal">
          <h2 class="text-2xl font-light">Getting Here</h2>
          <address class="mt-4 not-italic text-sm font-light leading-relaxed">
            18 Dune Road<br />
            Briar Cove, Oregon 97420
          </address>
          <p class="mt-4 text-sm font-light leading-relaxed">
            From US-101, take the Briar Cove exit and follow Dune Road west toward the ocean. The
            inn is at the end of the road, marked by a lantern at the gate. Complimentary parking is
            available on-site.
          </p>
          <p class="mt-4 text-sm font-light">
            <strong>Nearest airport:</strong> Southwest Oregon Regional (OTH), 45 minutes.
          </p>
        </div>
        <MapPlaceholder address="18 Dune Rd, Briar Cove, OR" />
      </div>
    </Section>
  </div>
</template>
