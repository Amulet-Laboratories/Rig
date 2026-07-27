<script setup lang="ts">
import { Section, CTABanner, Card, Button, Badge, Divider, Icon } from '@amulet-laboratories/rig'

const emit = defineEmits<{
  navigate: [page: string]
}>()

const cardTypes = [
  {
    name: 'Adult Card',
    eligibility: 'Ages 18+',
    description:
      'Full borrowing privileges for residents of Briar Cove and Coos County. Check out up to 25 items at a time with a 3-week loan period.',
    requirements: ['Valid photo ID', 'Proof of current address'],
    benefits: [
      '25 items at a time',
      '3-week loan period',
      '2 renewals per item',
      'Digital resources access',
      'Meeting room reservations',
      'Inter-library loan',
    ],
  },
  {
    name: 'Child Card',
    eligibility: 'Ages 0–17',
    description:
      'Designed for young readers. Check out up to 15 items. A parent or guardian must sign the application and present their own ID.',
    requirements: ['Parent/guardian photo ID', 'Parent/guardian proof of address'],
    benefits: [
      '15 items at a time',
      '3-week loan period',
      'Summer Reading Program',
      'Storytime access',
      'Maker Lab (12+)',
      'Digital resources access',
    ],
  },
  {
    name: 'Non-Resident Card',
    eligibility: 'Outside Coos County',
    description:
      'For visitors and residents outside Coos County. Annual fee of $25. Same borrowing privileges as the Adult Card.',
    requirements: ['Valid photo ID', 'Proof of current address', '$25 annual fee'],
    benefits: [
      '25 items at a time',
      '3-week loan period',
      '2 renewals per item',
      'Digital resources access',
      'Inter-library loan',
    ],
  },
  {
    name: 'Institutional Card',
    eligibility: 'Organizations & businesses',
    description:
      'For local schools, daycares, nonprofits, and businesses. Check out up to 50 items for classroom or organizational use.',
    requirements: [
      'Letter on organization letterhead',
      'Authorized representative ID',
      'Contact information',
    ],
    benefits: [
      '50 items at a time',
      '6-week loan period',
      'Bulk checkout',
      'Classroom collections',
      'Program support',
    ],
  },
]

const faqs = [
  {
    q: 'How long does it take to get a card?',
    a: "Cards are issued immediately at the circulation desk. Bring your ID and proof of address, and you'll walk out with a card in about 5 minutes.",
  },
  {
    q: 'What counts as proof of address?',
    a: "A utility bill, bank statement, lease agreement, or piece of mail dated within the last 30 days. A driver's license with current address also works.",
  },
  {
    q: 'What if I lose my card?',
    a: "Replacement cards cost $1. Visit the circulation desk with your photo ID and we'll issue a new one on the spot.",
  },
  {
    q: 'Can I use my card at other libraries?',
    a: 'Briar Cove cards work at all Coos County library branches. For libraries outside the county, use our free inter-library loan service.',
  },
  {
    q: 'Are there late fees?',
    a: 'No. Briar Cove Public Library eliminated late fees in 2022. Items checked out more than 30 days past due will be billed at replacement cost.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section class="bg-primary">
    <div class="mx-auto max-w-4xl text-center">
      <h1 class="font-serif text-3xl font-bold">Get a Library Card</h1>
      <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed">
        Your free library card unlocks 47,000+ titles, digital resources, meeting rooms, programs,
        and more. Sign up takes about 5 minutes.
      </p>
    </div>
  </Section>

  <!-- Card Types -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Card Types</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card v-for="c in cardTypes" :key="c.name" class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold">{{ c.name }}</h3>
            <Badge variant="secondary">{{ c.eligibility }}</Badge>
          </div>
          <p class="mt-3 text-sm leading-relaxed">{{ c.description }}</p>

          <Divider class="my-4" />

          <div>
            <p class="text-xs font-bold uppercase tracking-wider">Requirements</p>
            <ul class="mt-2 space-y-1">
              <li v-for="r in c.requirements" :key="r" class="flex items-center gap-2 text-sm">
                <Icon icon="heroicons:plus" size="sm" aria-hidden="true" />
                {{ r }}
              </li>
            </ul>
          </div>

          <div class="mt-4">
            <p class="text-xs font-bold uppercase tracking-wider">Benefits</p>
            <ul class="mt-2 space-y-1">
              <li v-for="b in c.benefits" :key="b" class="flex items-center gap-2 text-sm">
                <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
                {{ b }}
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- How to Sign Up -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold">How to Sign Up</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div class="text-center">
          <div
            class="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
          >
            1
          </div>
          <h3 class="mt-3 text-sm font-bold">Visit the Library</h3>
          <p class="mt-1 text-xs leading-relaxed">
            Come to the circulation desk at 215 Main Street during library hours.
          </p>
        </div>
        <div class="text-center">
          <div
            class="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
          >
            2
          </div>
          <h3 class="mt-3 text-sm font-bold">Bring Your Documents</h3>
          <p class="mt-1 text-xs leading-relaxed">
            Photo ID and proof of current address. Children need a parent or guardian present.
          </p>
        </div>
        <div class="text-center">
          <div
            class="bg-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
          >
            3
          </div>
          <h3 class="mt-3 text-sm font-bold">Start Borrowing</h3>
          <p class="mt-1 text-xs leading-relaxed">
            Your card is activated immediately. Check out books, access digital resources, and more.
          </p>
        </div>
      </div>
    </div>
  </Section>

  <!-- FAQ -->
  <Section>
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center text-2xl font-bold">Frequently Asked Questions</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-4">
        <Card v-for="faq in faqs" :key="faq.q" class="p-5">
          <h3 class="font-bold">{{ faq.q }}</h3>
          <p class="mt-2 text-sm leading-relaxed">{{ faq.a }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold">Ready to explore everything the library offers?</p>
    <p class="mt-1 text-sm">
      Stop by the circulation desk during library hours. We'll have your card ready in 5 minutes.
    </p>
    <template #action>
      <Button variant="cta-light" class="whitespace-nowrap" @click="emit('navigate', 'catalog')"
        >Browse the Catalog</Button
      >
    </template>
  </CTABanner>
</template>
