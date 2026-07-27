<script setup lang="ts">
import {
  Hero,
  Section,
  StatRow,
  CTABanner,
  Testimonial,
  Button,
  Card,
  Badge,
  ServiceGrid,
} from '@amulet-laboratories/rig'
import type { WebStatItem, ServiceItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const clinicStats: WebStatItem[] = [
  { value: '14', label: 'Years Serving Briar Cove' },
  { value: '4,200+', label: 'Patients Treated' },
  { value: '4', label: 'Team Members' },
  { value: '6', label: 'Services Offered' },
]

const services: ServiceItem[] = [
  {
    id: 'wellness-exams',
    title: 'Wellness Exams',
    description:
      'Annual checkups, vaccinations, and preventive care for dogs, cats, and small animals.',
  },
  {
    id: 'dental-care',
    title: 'Dental Care',
    description:
      'Professional cleanings, extractions, and oral health assessments under safe anesthesia.',
  },
  {
    id: 'surgery',
    title: 'Surgery',
    description:
      'Spay/neuter, soft tissue, and orthopedic procedures in our fully equipped surgical suite.',
  },
]

const testimonials = [
  {
    quote:
      'Dr. Reyes caught an early heart murmur in our golden retriever that another vet missed entirely. We owe her everything.',
    name: 'The Park Family',
    pet: 'Biscuit, Golden Retriever',
  },
  {
    quote:
      'My rescue cat was terrified of vets until we came to Compass. The entire staff is patient and gentle. Night and day difference.',
    name: 'Casey M.',
    pet: 'Miso, Domestic Shorthair',
  },
  {
    quote:
      'They squeezed us in on a Saturday when my dog ate something he should not have. Fast, calm, professional. He is fine now.',
    name: 'Tom H.',
    pet: 'Otis, Border Collie',
  },
]
</script>

<template>
  <!-- Hero — split screen -->
  <Hero layout="split">
    <template #eyebrow>
      <Badge variant="secondary" class="w-fit">Now Accepting New Patients</Badge>
    </template>
    <template #title>
      <h1 class="text-2xl font-bold sm:text-4xl lg:text-5xl">
        Compassionate care for your whole family
      </h1>
    </template>
    <template #description>
      <p class="max-w-lg text-base leading-relaxed">
        Full-service veterinary care in Briar Cove since 2012. We treat dogs, cats, rabbits, and
        small exotics with the same attention we'd give our own pets.
      </p>
    </template>
    <template #actions>
      <Button variant="primary" size="lg" @click="emit('navigate', 'appointment')"
        >Book Appointment</Button
      >
      <Button variant="secondary" size="lg" @click="emit('navigate', 'team')">Meet the Team</Button>
    </template>
    <template #media>
      <div class="bg-card relative hidden h-full min-h-[380px] sm:block">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
          alt="Two dogs running together on a beach"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      </div>
    </template>
  </Hero>

  <!-- Clinic Stats -->
  <StatRow :stats="clinicStats" variant="card" />

  <!-- Testimonials — social proof first -->
  <Section variant="alternate" title="What Pet Owners Say">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Testimonial v-for="t in testimonials" :key="t.name" layout="border">
        <template #decorator>&ldquo;</template>
        <template #quote>{{ t.quote }}</template>
        <template #attribution>
          <p class="text-sm font-bold">{{ t.name }}</p>
          <p class="text-xs">{{ t.pet }}</p>
        </template>
      </Testimonial>
    </div>
  </Section>

  <!-- Services Preview -->
  <Section title="Our Services">
    <ServiceGrid :items="services" layout="grid" :columns="3">
      <template #item="{ item }">
        <Card class="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h3 class="text-base font-bold">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed">{{ item.description }}</p>
        </Card>
      </template>
    </ServiceGrid>
    <div class="mt-8 text-center">
      <button
        class="text-sm font-medium transition-colors hover:underline"
        @click="emit('navigate', 'services')"
      >
        View all 6 services &rarr;
      </button>
    </div>
  </Section>

  <!-- Wellness CTA -->
  <CTABanner layout="centered">
    <p class="text-lg font-bold text-accent-foreground">Is your pet due for a wellness exam?</p>
    <p class="mt-1 text-sm">Annual checkups catch problems early. Book your visit today.</p>
    <template #action>
      <Button
        variant="secondary"
        class="bg-background whitespace-nowrap"
        @click="emit('navigate', 'appointment')"
        >Book Now</Button
      >
    </template>
  </CTABanner>

  <!-- New Patients Banner -->
  <Section>
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-xl font-bold">New to Compass?</h2>
      <p class="mt-2 text-sm">
        Learn what to expect at your first visit, what to bring, and how to register your pet.
      </p>
      <Button variant="secondary" class="mt-4" @click="emit('navigate', 'new-patients')"
        >New Patient Info</Button
      >
    </div>
  </Section>
</template>
