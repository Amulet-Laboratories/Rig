<script setup lang="ts">
import { ref } from 'vue'
import {
  Section,
  Button,
  Card,
  Input,
  Select,
  Textarea,
  MapPlaceholder,
  Icon,
  type SelectOption,
} from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()
const submitted = ref(false)

const practiceOptions: SelectOption[] = [
  { id: 'real-estate', label: 'Real Estate Law' },
  { id: 'estate-planning', label: 'Estate Planning' },
  { id: 'business-formation', label: 'Business Formation' },
  { id: 'other', label: 'Other / Not Sure' },
]

const attorneyOptions: SelectOption[] = [
  { id: 'no-preference', label: 'No preference' },
  { id: 'margaret-pace', label: 'Margaret Pace' },
  { id: 'william-aldric', label: 'William Aldric' },
  { id: 'catherine-wynn', label: 'Catherine Wynn' },
]

const hours = [
  { day: 'Monday – Friday', time: '8:30 AM – 5:00 PM' },
  { day: 'Saturday', time: 'By Appointment' },
  { day: 'Sunday', time: 'Closed' },
]

const faqs = [
  {
    q: 'What should I bring to my first consultation?',
    a: 'Any relevant documents — contracts, deeds, correspondence, court filings, or existing estate planning documents. A written summary of your situation and a list of questions is also helpful.',
  },
  {
    q: 'How much does an initial consultation cost?',
    a: 'We offer an initial consultation to discuss your situation and determine how we may be able to help. Please call our office for current consultation fees and availability.',
  },
  {
    q: 'Do you offer virtual consultations?',
    a: 'Yes. We offer consultations by phone or video conference for clients who are unable to visit our office in person. The same confidentiality and attention apply.',
  },
  {
    q: 'How long does a typical real estate closing take?',
    a: 'Most residential transactions close within 30 to 45 days from the date of the purchase agreement. Commercial transactions and those involving complex title issues may take longer.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <h1 class="font-serif text-3xl font-normal sm:text-4xl">Contact Us</h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed">
      We welcome the opportunity to discuss your legal matter. Reach us by phone, email, or use the
      form below to request a consultation.
    </p>
  </Section>

  <!-- Contact form + sidebar -->
  <Section>
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-3">
      <!-- Form -->
      <div class="sm:col-span-2">
        <Card class="p-6">
          <h2 class="font-serif text-lg font-normal">Request a Consultation</h2>
          <p class="mt-1 text-xs">All consultations are confidential.</p>

          <div v-if="submitted" class="bg-success/12 text-success mt-6 rounded-lg p-6 text-center">
            <p class="text-sm font-medium">Thank you for your inquiry.</p>
            <p class="mt-1 text-xs">We will be in touch within one business day.</p>
          </div>

          <form v-else class="mt-6 space-y-4" @submit.prevent="submitted = true">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="ap-first-name" class="mb-1 block text-xs font-medium">First Name</label>
                <Input id="ap-first-name" placeholder="First name" required />
              </div>
              <div>
                <label for="ap-last-name" class="mb-1 block text-xs font-medium">Last Name</label>
                <Input id="ap-last-name" placeholder="Last name" required />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="ap-email" class="mb-1 block text-xs font-medium">Email</label>
                <Input id="ap-email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label for="ap-phone" class="mb-1 block text-xs font-medium">Phone</label>
                <Input id="ap-phone" type="tel" placeholder="(541) 555-0000" />
              </div>
            </div>
            <div>
              <label for="ap-practice-area" class="mb-1 block text-xs font-medium"
                >Area of Interest</label
              >
              <Select
                id="ap-practice-area"
                :options="practiceOptions"
                placeholder="Select a practice area"
              />
            </div>
            <div>
              <label for="ap-attorney" class="mb-1 block text-xs font-medium"
                >Preferred Attorney</label
              >
              <Select id="ap-attorney" :options="attorneyOptions" placeholder="No preference" />
            </div>
            <div>
              <label for="ap-description" class="mb-1 block text-xs font-medium"
                >Brief Description of Your Matter</label
              >
              <Textarea
                id="ap-description"
                placeholder="Please provide a brief overview of your legal matter..."
                required
              />
            </div>

            <p class="text-xs leading-relaxed">
              Submitting this form does not create an attorney-client relationship. Information
              provided will be kept confidential and used only to evaluate your inquiry.
            </p>

            <Button variant="primary" type="submit" class="w-full sm:w-auto">Submit Inquiry</Button>
          </form>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Office info -->
        <Card class="p-5">
          <p class="text-xs font-medium uppercase tracking-wider">Our Office</p>
          <address class="mt-3 not-italic text-xs leading-relaxed">
            240 Harbor Street, Suite 300<br />
            Briar Cove, Oregon 97420
          </address>
          <div class="mt-4 space-y-2">
            <p class="flex items-center gap-2 text-xs">
              <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
              <a href="tel:+15415550148" class="transition-colors hover:underline"
                >(541) 555-0148</a
              >
            </p>
            <p class="flex items-center gap-2 text-xs">
              <Icon icon="heroicons:printer" size="sm" aria-hidden="true" />
              Fax: (541) 555-0149
            </p>
            <p class="flex items-center gap-2 text-xs">
              <Icon icon="heroicons:envelope" size="sm" aria-hidden="true" />
              <a href="mailto:intake@aldricpace.com" class="transition-colors hover:underline"
                >intake@aldricpace.com</a
              >
            </p>
          </div>
        </Card>

        <!-- Hours -->
        <Card class="p-5">
          <p class="text-xs font-medium uppercase tracking-wider">Office Hours</p>
          <dl class="mt-3 space-y-2">
            <div v-for="h in hours" :key="h.day" class="flex justify-between text-xs">
              <dt>{{ h.day }}</dt>
              <dd>{{ h.time }}</dd>
            </div>
          </dl>
        </Card>

        <!-- Quick actions -->
        <Card class="p-5">
          <p class="text-xs font-medium uppercase tracking-wider">Quick Links</p>
          <div class="mt-3 space-y-2">
            <button
              class="block w-full text-left text-xs transition-colors hover:underline"
              @click="emit('navigate', 'attorneys')"
            >
              Meet Our Attorneys &rarr;
            </button>
            <button
              class="block w-full text-left text-xs transition-colors hover:underline"
              @click="emit('navigate', 'practices')"
            >
              View Practice Areas &rarr;
            </button>
            <button
              class="block w-full text-left text-xs transition-colors hover:underline"
              @click="emit('navigate', 'resources')"
            >
              Client Resources &rarr;
            </button>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- FAQs -->
  <Section variant="alternate" title="Frequently Asked Questions">
    <div class="space-y-6">
      <div v-for="faq in faqs" :key="faq.q">
        <h3 class="font-medium">{{ faq.q }}</h3>
        <p class="mt-2 text-sm leading-relaxed">{{ faq.a }}</p>
      </div>
    </div>
  </Section>

  <!-- Directions -->
  <Section title="Finding Our Office">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <p class="text-sm leading-relaxed">
          Our office is located in the Harbor Street Professional Building in downtown Briar Cove,
          one block east of the waterfront. Street parking is available on Harbor Street and Second
          Avenue. The building entrance is on the ground floor; our suite is on the third floor.
          Elevator access is available.
        </p>
        <div class="mt-6">
          <p class="text-xs font-medium uppercase tracking-wider">Parking</p>
          <p class="mt-1 text-sm">
            Free 2-hour street parking on Harbor Street. Municipal lot on Second Avenue (free, no
            time limit).
          </p>
        </div>
        <div class="mt-4">
          <p class="text-xs font-medium uppercase tracking-wider">Accessibility</p>
          <p class="mt-1 text-sm">
            The building is fully accessible with elevator service to all floors and accessible
            restrooms.
          </p>
        </div>
      </div>
      <MapPlaceholder address="240 Harbor St, Briar Cove, OR" />
    </div>
  </Section>
</template>
