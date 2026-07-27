<script setup lang="ts">
import { Section, CTABanner, Button, Card, Icon } from '@amulet-laboratories/rig'
import PracticeIcon from '../components/PracticeIcon.vue'

const emit = defineEmits<{ navigate: [page: string] }>()

interface PracticeArea {
  id: string
  icon: string
  title: string
  tagline: string
  description: string
  services: string[]
  whenToConsult: string
}

const practices: PracticeArea[] = [
  {
    id: 'real-estate',
    icon: 'home',
    title: 'Real Estate Law',
    tagline: 'Protecting your investment from contract to closing.',
    description:
      'Whether you are purchasing your first home on the Oregon coast, selling a commercial property, or navigating a complex land-use issue, our real estate team brings three decades of local experience to every transaction.',
    services: [
      'Residential purchases and sales',
      'Commercial real estate transactions',
      'Title examination and insurance',
      'Boundary and easement disputes',
      '1031 tax-deferred exchanges',
      'Land use and zoning matters',
      'Landlord-tenant disputes',
      'Construction contracts and liens',
    ],
    whenToConsult:
      "Before signing a purchase agreement, if you receive a title exception you don't understand, or any time a property dispute arises.",
  },
  {
    id: 'estate-planning',
    icon: 'scroll',
    title: 'Estate Planning',
    tagline: 'Preserving your legacy with clarity and care.',
    description:
      'A well-drafted estate plan protects your family, minimizes tax exposure, and ensures your wishes are carried out. We take the time to understand your situation and create documents that reflect your values.',
    services: [
      'Last wills and testaments',
      'Revocable and irrevocable trusts',
      'Durable powers of attorney',
      'Advance directives and healthcare proxies',
      'Probate and estate administration',
      'Beneficiary designation review',
      'Guardianship and conservatorship',
      'Charitable giving strategies',
    ],
    whenToConsult:
      'After a major life event — marriage, birth, divorce, retirement, or the death of a loved one — or if you have not reviewed your plan in the last five years.',
  },
  {
    id: 'business',
    icon: 'building',
    title: 'Business Formation',
    tagline: 'Building your business on solid legal ground.',
    description:
      'From choosing the right entity structure to drafting partnership agreements and resolving disputes, we help Oregon business owners make informed decisions at every stage of growth.',
    services: [
      'LLC, corporation, and partnership formation',
      'Operating and partnership agreements',
      'Buy-sell agreements',
      'Contract drafting and review',
      'Business succession planning',
      'Commercial lease negotiation',
      'Partnership and shareholder disputes',
      'Regulatory compliance',
    ],
    whenToConsult:
      'When starting or restructuring a business, bringing on a partner, planning an exit, or facing a commercial dispute.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <h1 class="font-serif text-3xl font-normal sm:text-4xl">Practice Areas</h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed">
      Aldric, Pace &amp; Wynn focuses on three interconnected areas of law, each supported by
      decades of local knowledge and a commitment to thorough, personalized counsel.
    </p>
  </Section>

  <!-- Practice area details -->
  <Section v-for="(p, i) in practices" :key="p.id" :variant="i % 2 === 1 ? 'alternate' : undefined">
    <div class="flex items-center gap-3">
      <div class="bg-secondary flex h-10 w-10 items-center justify-center rounded">
        <PracticeIcon :icon="p.icon" />
      </div>
      <h2 class="font-serif text-xl font-normal">{{ p.title }}</h2>
    </div>
    <p class="mt-2 text-sm font-medium">{{ p.tagline }}</p>
    <p class="mt-4 max-w-3xl text-sm leading-relaxed">{{ p.description }}</p>

    <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card class="p-5">
        <p class="text-xs font-medium uppercase tracking-wider">Services</p>
        <ul class="mt-3 space-y-2">
          <li v-for="s in p.services" :key="s" class="flex items-start gap-2 text-sm">
            <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
            {{ s }}
          </li>
        </ul>
      </Card>
      <Card class="p-5">
        <p class="text-xs font-medium uppercase tracking-wider">When to Consult an Attorney</p>
        <p class="mt-3 text-sm leading-relaxed">{{ p.whenToConsult }}</p>
      </Card>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-normal">Need guidance in one of these areas?</p>
    <p class="mt-1 text-sm">We offer initial consultations to discuss your situation.</p>
    <template #action>
      <Button variant="cta-light" @click="emit('navigate', 'contact')"
        >Schedule a Consultation</Button
      >
    </template>
  </CTABanner>
</template>
