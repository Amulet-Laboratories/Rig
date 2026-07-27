<script setup lang="ts">
import { Section, StatRow, ServiceGrid, CTABanner, Button, Divider } from '@amulet-laboratories/rig'
import type { WebStatItem, ServiceItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const stats: WebStatItem[] = [
  { value: '30+', label: 'Years' },
  { value: '3', label: 'Attorneys' },
  { value: '4,000+', label: 'Clients Served' },
  { value: 'Briar Cove, OR', label: 'Proudly Local' },
]

const values: ServiceItem[] = [
  {
    id: 'client-first',
    title: 'Client-First Counsel',
    description:
      "Every engagement begins with listening. We take the time to understand each client's circumstances, priorities, and concerns before recommending a course of action.",
  },
  {
    id: 'local-knowledge',
    title: 'Local Knowledge',
    description:
      'Three decades on the southern Oregon coast means we know the land records, the local courts, the municipal codes, and the people who administer them.',
  },
  {
    id: 'clear-communication',
    title: 'Clear Communication',
    description:
      'Legal matters should never feel opaque. We explain the process, the options, and the costs in plain language — and we return calls promptly.',
  },
  {
    id: 'practical-solutions',
    title: 'Practical Solutions',
    description:
      'Not every dispute requires litigation, and not every transaction requires complexity. We look for the most direct path to a sound result.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <h1 class="font-serif text-3xl font-normal sm:text-4xl">Our Firm</h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed">
      Nearly three decades of focused legal practice on the southern Oregon coast.
    </p>
  </Section>

  <!-- Firm history -->
  <Section>
    <h2 class="font-serif text-xl font-normal">History</h2>
    <div class="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed">
      <p>
        Aldric, Pace &amp; Wynn LLP was founded in 1996 by William Aldric and Margaret Pace. The
        firm opened as a two-attorney office at 240 Harbor Street in downtown Briar Cove, focused on
        the legal needs most common to coastal Oregon communities: real estate transactions and
        estate planning. From the beginning, the practice was built on a straightforward premise —
        that careful, responsive legal work could be delivered without pretense.
      </p>
      <p>
        In 2019, Catherine Wynn joined the firm after several years as a licensed real estate broker
        and a clerkship in Coos County. Her arrival expanded the firm's capabilities into business
        formation and civil litigation, allowing Aldric, Pace &amp; Wynn to serve a broader range of
        client needs while maintaining the same standard of personal attention.
      </p>
      <p>
        Today, the firm has served Briar Cove and the surrounding communities of the southern Oregon
        coast for nearly thirty years. The practice remains intentionally focused — three attorneys,
        three practice areas, and a commitment to knowing each client by name.
      </p>
    </div>
  </Section>

  <Divider />

  <!-- Values -->
  <Section variant="alternate" title="What Guides Our Practice">
    <ServiceGrid :items="values" layout="grid" :columns="2" />
  </Section>

  <Divider />

  <!-- Community involvement -->
  <Section>
    <h2 class="font-serif text-xl font-normal">Community Involvement</h2>
    <div class="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed">
      <p>
        Aldric, Pace &amp; Wynn has long viewed pro bono service as a professional obligation, not
        an optional gesture. Our attorneys volunteer through the Oregon State Bar's Volunteer
        Lawyers Project, providing free legal assistance to low-income residents of Coos and Curry
        counties in matters ranging from landlord-tenant disputes to basic estate planning.
      </p>
      <p>
        Beyond individual pro bono work, the firm maintains active ties to the organizations that
        shape civic life in Briar Cove. Margaret Pace serves on the board of the Briar Cove Chamber
        of Commerce, and William Aldric is a past president of the Coos County Bar Association.
        Catherine Wynn volunteers with the Briar Cove Community Foundation.
      </p>
      <p>
        Each summer, the firm sponsors a free legal clinic at the annual Harbor Festival, offering
        walk-in consultations on topics such as property boundaries, small business formation, and
        advance directives. The clinic has become one of the festival's most visited community
        services.
      </p>
    </div>
  </Section>

  <!-- Stats -->
  <StatRow :stats="stats" variant="bordered" />

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-normal">Schedule a Consultation</p>
    <p class="mt-1 text-sm">
      We welcome the opportunity to learn about your legal matter and discuss how we may help.
    </p>
    <template #action>
      <Button variant="cta-light" @click="emit('navigate', 'contact')">Contact Our Office</Button>
    </template>
  </CTABanner>
</template>
