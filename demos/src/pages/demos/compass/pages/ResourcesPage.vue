<script setup lang="ts">
import { Section, CTABanner, Card, Button, Icon } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const guides = [
  {
    title: 'Vaccination Schedules',
    description:
      'Core and lifestyle vaccination timelines for puppies, kittens, adult dogs, and adult cats. Includes Oregon-specific recommendations.',
    category: 'Prevention',
    icon: 'shield',
  },
  {
    title: 'Tick & Flea Prevention',
    description:
      'Oregon coast-specific guide covering seasonal risk periods, recommended products, and environmental management around your home.',
    category: 'Prevention',
    icon: 'shield',
  },
  {
    title: 'Senior Pet Wellness',
    description:
      'Checklist for pets 7+ years. Covers screening schedules, dietary changes, mobility support, and cognitive health.',
    category: 'Wellness',
    icon: 'heart',
  },
  {
    title: 'Emergency First Aid',
    description:
      'Step-by-step guide for common emergencies: choking, bleeding, poisoning, heatstroke, and trauma. Print and keep on your fridge.',
    category: 'Emergency',
    icon: 'alert',
  },
  {
    title: 'Post-Surgery Recovery',
    description:
      "What to expect after your pet's procedure. Covers incision care, activity restrictions, medication schedules, and when to call us.",
    category: 'Recovery',
    icon: 'clipboard',
  },
  {
    title: 'Dental Home Care',
    description:
      "How to brush your pet's teeth, dental chew recommendations, and signs of oral disease to watch for between professional cleanings.",
    category: 'Wellness',
    icon: 'heart',
  },
  {
    title: 'Nutrition Guidelines',
    description:
      'Feeding guides by age, breed size, and activity level. Includes a list of toxic foods and safe human-food treats.',
    category: 'Nutrition',
    icon: 'nutrition',
  },
  {
    title: 'New Puppy & Kitten Guide',
    description:
      'Everything you need for the first year: vaccination timeline, socialization windows, training basics, and milestone checkups.',
    category: 'Getting Started',
    icon: 'star',
  },
]

const externalLinks = [
  {
    name: 'ASPCA Animal Poison Control',
    url: 'https://www.aspca.org/pet-care/animal-poison-control',
    description: '24/7 hotline and searchable database of toxic substances.',
  },
  {
    name: 'Oregon Veterinary Medical Association',
    url: 'https://www.oregonvma.org',
    description: 'State-level resources, referral directories, and pet owner education.',
  },
  {
    name: 'Coos Bay Emergency Vet',
    url: 'https://www.southcoastvet.com',
    description: 'South Coast Veterinary Emergency — 24-hour facility for after-hours emergencies.',
  },
  {
    name: 'Pet Insurance Comparison',
    url: 'https://www.petinsurancereview.com',
    description: 'Our recommended starting points for pet insurance research.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold sm:text-4xl">Pet Health Resources</h1>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-base leading-relaxed">
        Downloadable guides, checklists, and trusted external links to help you care for your pet
        between visits.
      </p>
    </div>
  </Section>

  <!-- Guides Grid -->
  <Section title="Guides & Checklists">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card
        v-for="g in guides"
        :key="g.title"
        class="group flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div
          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
          :class="g.icon === 'alert' ? 'bg-destructive/8' : 'bg-secondary'"
        >
          <Icon
            :icon="
              g.icon === 'shield'
                ? 'heroicons:shield-check'
                : g.icon === 'heart'
                  ? 'heroicons:heart'
                  : g.icon === 'alert'
                    ? 'heroicons:bell-alert'
                    : g.icon === 'clipboard'
                      ? 'heroicons:clipboard-document-list'
                      : g.icon === 'nutrition'
                        ? 'heroicons:sun'
                        : 'heroicons:star'
            "
            size="sm"
            aria-hidden="true"
            :class="g.icon === 'alert' ? 'text-destructive' : ''"
          />
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider">{{ g.category }}</span>
          <h3 class="mt-0.5 text-sm font-bold">{{ g.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed">{{ g.description }}</p>
        </div>
      </Card>
    </div>
  </Section>

  <!-- External Links -->
  <Section variant="alternate" title="Trusted External Resources">
    <div class="mx-auto max-w-4xl space-y-3">
      <a
        v-for="l in externalLinks"
        :key="l.name"
        :href="l.url"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-background flex items-start gap-3 rounded-md p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <Icon
          icon="heroicons:arrow-top-right-on-square"
          size="sm"
          aria-hidden="true"
          class="mt-0.5 flex-shrink-0"
        />
        <div>
          <p class="text-sm font-bold">{{ l.name }}</p>
          <p class="mt-1 text-sm">{{ l.description }}</p>
        </div>
      </a>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold text-accent-foreground">Have questions about your pet's health?</p>
    <p class="mt-1 text-sm">We're happy to discuss concerns at your next appointment.</p>
    <template #action>
      <Button variant="secondary" class="bg-background" @click="emit('navigate', 'appointment')"
        >Book Appointment</Button
      >
    </template>
  </CTABanner>
</template>
