<script setup lang="ts">
import {
  Section,
  CTABanner,
  Card,
  Button,
  ServiceGrid,
  FeatureList,
  Icon,
} from '@amulet-laboratories/rig'
import type { ServiceItem, FeatureItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const services: (ServiceItem & { details: FeatureItem[]; accent?: boolean })[] = [
  {
    id: 'wellness-exams',
    title: 'Wellness Exams',
    description:
      "Annual checkups, vaccinations, and preventive care for dogs, cats, and small animals. We tailor visit frequency to your pet's age, breed, and health history.",
    details: [
      { id: 'we-1', text: 'Full physical examination' },
      { id: 'we-2', text: 'Core & lifestyle vaccinations' },
      { id: 'we-3', text: 'Parasite screening' },
      { id: 'we-4', text: 'Weight & nutrition assessment' },
      { id: 'we-5', text: 'Dental health check' },
    ],
  },
  {
    id: 'dental-care',
    title: 'Dental Care',
    description:
      'Professional cleanings, extractions, and oral health assessments under safe anesthesia. Dental disease is the most common condition in pets over age three.',
    details: [
      { id: 'dc-1', text: 'Pre-anesthetic bloodwork' },
      { id: 'dc-2', text: 'Ultrasonic scaling & polishing' },
      { id: 'dc-3', text: 'Digital dental radiographs' },
      { id: 'dc-4', text: 'Extractions when needed' },
      { id: 'dc-5', text: 'At-home care guidance' },
    ],
  },
  {
    id: 'surgery',
    title: 'Surgery',
    description:
      'Spay/neuter, soft tissue, and orthopedic procedures in our fully equipped surgical suite with dedicated anesthesia monitoring.',
    details: [
      { id: 'su-1', text: 'Pre-surgical bloodwork' },
      { id: 'su-2', text: 'IV fluid support' },
      { id: 'su-3', text: 'Continuous vital monitoring' },
      { id: 'su-4', text: 'Pain management protocol' },
      { id: 'su-5', text: 'Take-home recovery instructions' },
    ],
  },
  {
    id: 'emergency-care',
    title: 'Emergency Care',
    description:
      'Walk-in emergencies accepted during business hours. After-hours, call our emergency line for guidance to the nearest 24-hour facility.',
    details: [
      { id: 'ec-1', text: 'Trauma stabilization' },
      { id: 'ec-2', text: 'Toxin ingestion treatment' },
      { id: 'ec-3', text: 'Acute illness assessment' },
      { id: 'ec-4', text: 'Pain relief & fluid therapy' },
      { id: 'ec-5', text: 'Referral coordination' },
    ],
    accent: true,
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    description:
      'In-house bloodwork, digital X-ray, and ultrasound for fast, accurate results. Most results available same-day.',
    details: [
      { id: 'di-1', text: 'Complete blood count (CBC)' },
      { id: 'di-2', text: 'Chemistry panels' },
      { id: 'di-3', text: 'Digital radiography' },
      { id: 'di-4', text: 'Abdominal ultrasound' },
      { id: 'di-5', text: 'Urinalysis & cytology' },
    ],
  },
  {
    id: 'nutrition-counseling',
    title: 'Nutrition Counseling',
    description:
      "Custom diet plans, prescription food guidance, and weight management programs designed for your pet's specific needs.",
    details: [
      { id: 'nc-1', text: 'Body condition scoring' },
      { id: 'nc-2', text: 'Breed-specific dietary plans' },
      { id: 'nc-3', text: 'Prescription diet management' },
      { id: 'nc-4', text: 'Weight loss programs' },
      { id: 'nc-5', text: 'Life-stage nutrition guidance' },
    ],
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold sm:text-4xl">Our Services</h1>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-base leading-relaxed">
        Comprehensive veterinary care from routine wellness to urgent situations. Every service is
        delivered with the same standard: thorough, honest, and gentle.
      </p>
    </div>
  </Section>

  <!-- Services Grid -->
  <Section>
    <ServiceGrid :items="services" layout="list">
      <template #item="{ item }">
        <Card class="overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-3">
            <div class="p-6 sm:col-span-2">
              <h2
                class="text-lg font-bold"
                :class="(item as (typeof services)[number]).accent ? 'text-accent' : 'text-primary'"
              >
                {{ item.title }}
              </h2>
              <p class="mt-2 text-sm leading-relaxed">{{ item.description }}</p>
            </div>
            <div class="bg-card p-6 sm:border-l">
              <p class="mb-2 text-xs font-bold uppercase tracking-wider">Includes</p>
              <FeatureList :items="(item as (typeof services)[number]).details" layout="list">
                <template #item="{ item: feature }">
                  <div class="flex items-start gap-2 text-sm">
                    <Icon
                      icon="heroicons:check"
                      size="sm"
                      aria-hidden="true"
                      class="mt-0.5 flex-shrink-0"
                    />
                    {{ feature.text }}
                  </div>
                </template>
              </FeatureList>
            </div>
          </div>
        </Card>
      </template>
    </ServiceGrid>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold text-accent-foreground">Ready to schedule?</p>
    <p class="mt-1 text-sm">Request an appointment online or call (541) 555-0199.</p>
    <template #action>
      <Button variant="secondary" class="bg-background" @click="emit('navigate', 'appointment')"
        >Book Appointment</Button
      >
    </template>
  </CTABanner>
</template>
