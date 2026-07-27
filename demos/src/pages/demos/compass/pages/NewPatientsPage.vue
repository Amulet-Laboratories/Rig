<script setup lang="ts">
import { ref } from 'vue'
import {
  Section,
  CTABanner,
  Card,
  Button,
  Input,
  FeatureList,
  Icon,
} from '@amulet-laboratories/rig'
import type { FeatureItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()
const submitted = ref(false)

const whatToBring: FeatureItem[] = [
  { id: 'bring-1', text: 'Photo ID' },
  { id: 'bring-2', text: 'Previous veterinary records (digital or paper)' },
  { id: 'bring-3', text: 'List of current medications and supplements' },
  { id: 'bring-4', text: 'Vaccination history' },
  { id: 'bring-5', text: 'Any relevant lab results or imaging' },
  { id: 'bring-6', text: 'Your pet in a carrier or on a leash' },
]

const firstVisitSteps = [
  {
    title: 'Register',
    description:
      'Fill out the new patient form online (below) or arrive 15 minutes early to complete it on-site.',
  },
  {
    title: 'Meet Your Vet',
    description:
      "Your first appointment is 30 minutes — longer than a standard visit — so we can learn your pet's full history.",
  },
  {
    title: 'Full Exam',
    description:
      'Nose-to-tail physical examination, weight, dental check, and discussion of any concerns.',
  },
  {
    title: 'Care Plan',
    description:
      "We'll outline recommended vaccinations, preventive care, and any follow-up visits before you leave.",
  },
]

const faq = [
  {
    q: 'What animals do you treat?',
    a: 'Dogs, cats, rabbits, guinea pigs, hamsters, ferrets, and select avian species. Dr. Wren handles exotic and avian cases.',
  },
  {
    q: 'Do you accept pet insurance?',
    a: 'We accept all major pet insurance providers. We process payment at time of service and provide the documentation you need to file a claim.',
  },
  {
    q: 'What are your payment options?',
    a: 'Cash, check, Visa, Mastercard, and CareCredit. We can discuss payment plans for major procedures.',
  },
  {
    q: 'Can I stay with my pet during the exam?',
    a: "Absolutely. We encourage it. For procedures requiring sedation or anesthesia, we'll give you a detailed timeline and updates.",
  },
  {
    q: 'What if my pet is anxious at the vet?',
    a: 'Tell us ahead of time. We use fear-free handling techniques and can recommend calming aids for the visit. We never rush nervous patients.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold sm:text-4xl">New Patients</h1>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-base leading-relaxed">
        Welcome to Compass. Here's everything you need to know before your first visit.
      </p>
    </div>
  </Section>

  <!-- First Visit Steps -->
  <Section>
    <div class="mx-auto max-w-3xl">
      <h2 class="text-xl font-bold">Your First Visit</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-0">
        <div v-for="(s, i) in firstVisitSteps" :key="s.title" class="flex gap-4">
          <div class="flex flex-col items-center">
            <div
              class="bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
            >
              {{ i + 1 }}
            </div>
            <div v-if="i < firstVisitSteps.length - 1" class="bg-border w-px flex-1"></div>
          </div>
          <div class="pb-8">
            <h3 class="text-sm font-bold">{{ s.title }}</h3>
            <p class="mt-1 text-sm leading-relaxed">{{ s.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </Section>

  <!-- What to Bring -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <h2 class="text-xl font-bold">What to Bring</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <FeatureList :items="whatToBring" layout="grid" :columns="2" class="mt-8">
        <template #item="{ item: bring }">
          <div class="bg-background flex items-center gap-3 rounded-md p-3 text-sm">
            <Icon icon="heroicons:check" size="sm" aria-hidden="true" class="flex-shrink-0" />
            {{ bring.text }}
          </div>
        </template>
      </FeatureList>
    </div>
  </Section>

  <!-- Registration Form -->
  <Section title="Pre-Registration" subtitle="Complete this form to save time at your first visit.">
    <div class="mx-auto max-w-lg">
      <div v-if="submitted" class="mt-8 space-y-4 text-center" role="status" aria-live="polite">
        <p class="text-lg font-medium text-primary">Request submitted.</p>
        <p class="text-muted-foreground">We will contact you within one business day.</p>
      </div>
      <Card v-else class="mt-8 p-6">
        <form
          class="space-y-4"
          aria-label="New patient registration"
          @submit.prevent="submitted = true"
        >
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="np-owner" class="mb-1 block text-sm font-medium">Owner Name</label>
              <Input id="np-owner" placeholder="Dana Park" required />
            </div>
            <div>
              <label for="np-phone" class="mb-1 block text-sm font-medium">Phone</label>
              <Input id="np-phone" type="tel" placeholder="(541) 555-0000" required />
            </div>
          </div>
          <div>
            <label for="np-email" class="mb-1 block text-sm font-medium">Email</label>
            <Input id="np-email" type="email" placeholder="dana@example.com" required />
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="np-pet" class="mb-1 block text-sm font-medium">Pet's Name</label>
              <Input id="np-pet" placeholder="Biscuit" />
            </div>
            <div>
              <label for="np-species" class="mb-1 block text-sm font-medium"
                >Species &amp; Breed</label
              >
              <Input id="np-species" placeholder="Dog — Lab" />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="np-age" class="mb-1 block text-sm font-medium">Pet's Age</label>
              <Input id="np-age" placeholder="3 years" />
            </div>
            <div>
              <label for="np-sex" class="mb-1 block text-sm font-medium"
                >Sex / Spay-Neuter Status</label
              >
              <Input id="np-sex" placeholder="Female, spayed" />
            </div>
          </div>
          <div>
            <label for="np-concerns" class="mb-1 block text-sm font-medium"
              >Any current concerns?</label
            >
            <Input id="np-concerns" placeholder="Optional — limping, appetite change, etc." />
          </div>
          <Button variant="primary" class="w-full" size="lg">Submit Registration</Button>
        </form>
      </Card>
    </div>
  </Section>

  <!-- FAQ -->
  <Section variant="alternate" title="Frequently Asked Questions">
    <div class="mx-auto max-w-3xl space-y-4">
      <Card v-for="f in faq" :key="f.q" class="p-5">
        <h3 class="text-sm font-bold">{{ f.q }}</h3>
        <p class="mt-2 text-sm leading-relaxed">{{ f.a }}</p>
      </Card>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold text-accent-foreground">Ready to schedule your first visit?</p>
    <p class="mt-1 text-sm">We can't wait to meet you and your pet.</p>
    <template #action>
      <Button variant="secondary" class="bg-background" @click="emit('navigate', 'appointment')"
        >Book Appointment</Button
      >
    </template>
  </CTABanner>
</template>
