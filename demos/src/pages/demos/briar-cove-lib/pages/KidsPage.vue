<script setup lang="ts">
import {
  Section,
  Card,
  Badge,
  Button,
  Icon,
  ServiceGrid,
  TeamGrid,
  FeatureList,
  CTABanner,
} from '@amulet-laboratories/rig'
import type { TeamMember, FeatureItem, ServiceItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{
  navigate: [page: string]
}>()

const storytimes: ServiceItem[] = [
  {
    id: 'baby-rhyme',
    title: 'Baby Rhyme Time',
    description: 'Songs, rhymes, and movement for babies and their caregivers.',
  },
  {
    id: 'preschool-storytime',
    title: 'Preschool Storytime',
    description: 'Stories, songs, and a craft to build early literacy skills.',
  },
  {
    id: 'family-storytime',
    title: 'Saturday Family Storytime',
    description: 'Rotating weekly themes for the whole family.',
  },
]

const storytimeDetails: Record<string, { ages: string; schedule: string }> = {
  'baby-rhyme': { ages: 'Ages 0-2', schedule: 'Tuesdays, 10:00 AM' },
  'preschool-storytime': { ages: 'Ages 3-5', schedule: 'Wednesdays, 10:30 AM' },
  'family-storytime': { ages: 'All ages', schedule: 'Saturdays, 11:00 AM' },
}

const youthPrograms = [
  {
    name: 'STEAM Explorers',
    ages: 'Ages 6-10',
    schedule: 'First Thursday of each month, 3:30 PM',
    description:
      'Hands-on science and maker activities. Past projects include bottle rockets, simple circuits, and stop-motion animation.',
  },
  {
    name: 'Teen Book Club',
    ages: 'Ages 13-18',
    schedule: 'Third Wednesday of each month, 4:00 PM',
    description:
      'Read and discuss young adult fiction and nonfiction. Titles chosen by vote. Snacks provided.',
  },
  {
    name: 'Homework Help',
    ages: 'Grades K-8',
    schedule: 'Monday - Thursday, 3:00 - 5:00 PM',
    description:
      'Drop in for free tutoring from trained volunteer tutors. Help available in reading, math, and science.',
  },
  {
    name: 'Summer Reading Challenge',
    ages: 'All ages',
    schedule: 'June - August',
    description:
      'Earn prizes for reaching reading milestones. Includes weekly drawings, a kickoff party, and an end-of-summer celebration.',
  },
]

const wingFeatures: FeatureItem[] = [
  { id: 'nook', text: 'Picture book nook', detail: 'Cozy reading area for the youngest visitors' },
  {
    id: 'readers',
    text: 'Early reader shelves',
    detail: 'Leveled readers organized by reading stage',
  },
  { id: 'maker', text: 'Maker station', detail: 'Art supplies, building blocks, and STEAM kits' },
  { id: 'teen', text: 'Teen corner with gaming PCs', detail: 'Dedicated space for ages 13-18' },
  { id: 'study', text: 'Quiet study area', detail: 'Tables and chairs for homework and reading' },
]

const kidsStaff: TeamMember[] = [
  {
    id: 'rosa-gutierrez',
    name: 'Rosa Gutierrez',
    role: "Children's Librarian",
    bio: "Rosa has led storytime, the summer reading program, and the children's wing since 2019. She has a gift for matching young readers with the perfect book and believes every child deserves a library they feel at home in.",
  },
  {
    id: 'tom-halverson',
    name: 'Tom Halverson',
    role: 'Teen Services',
    bio: 'Tom joined the library in 2021 to build out teen programming. He manages the teen maker lab, Game Night, the young adult collection, and coordinates the teen volunteer program.',
  },
]

const staffYears: Record<string, string> = {
  'rosa-gutierrez': 'Since 2019',
  'tom-halverson': 'Since 2021',
}

const parentResources: FeatureItem[] = [
  {
    id: 'card',
    text: 'Library cards for kids',
    detail: 'Children ages 0-17 can get a free card with a parent or guardian present',
  },
  {
    id: 'libby-kids',
    text: 'Libby Kids',
    detail: 'Borrow e-books and audiobooks designed for young readers',
  },
  {
    id: 'abcmouse',
    text: 'ABCmouse',
    detail: 'Full access to ABCmouse learning activities with your library card',
  },
  {
    id: 'tumblebooks',
    text: 'TumbleBooks',
    detail: 'Animated talking picture books and read-along chapter books',
  },
  {
    id: 'buddy',
    text: 'Volunteer as a reading buddy',
    detail: 'Help a young reader build confidence — training provided',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-serif text-3xl font-bold">Kids &amp; Youth</h1>
      <p class="mt-2 text-sm leading-relaxed">
        Programs, spaces, and resources for children ages 0-12 and teens 13-18. Something for every
        age and every stage of reading.
      </p>
    </div>
  </Section>

  <!-- Storytimes -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Storytimes</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <ServiceGrid :items="storytimes" layout="grid" :columns="3" class="mt-8">
        <template #item="{ item }">
          <Card class="p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div class="mb-3 flex items-center gap-2">
              <Icon icon="heroicons:book-open" size="sm" aria-hidden="true" />
              <h3 class="font-bold">{{ item.title }}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge variant="secondary">{{ storytimeDetails[item.id]?.ages }}</Badge>
              <Badge variant="secondary">{{ storytimeDetails[item.id]?.schedule }}</Badge>
            </div>
            <p class="mt-3 text-sm leading-relaxed">{{ item.description }}</p>
          </Card>
        </template>
      </ServiceGrid>
    </div>
  </Section>

  <!-- Youth Programs -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Youth Programs</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card v-for="p in youthPrograms" :key="p.name" class="p-5">
          <h3 class="font-bold">{{ p.name }}</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{{ p.schedule }}</Badge>
            <Badge variant="muted">{{ p.ages }}</Badge>
          </div>
          <p class="mt-3 text-sm leading-relaxed">{{ p.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Children's Wing -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">The Children's Wing</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-sm leading-relaxed">
        Added in 1973, the 5,000-square-foot children's wing is a dedicated space for young readers
        and families. It includes a picture book nook, early reader shelves, a maker station, a teen
        corner with gaming PCs, and a quiet study area.
      </p>
      <Card class="mt-6 p-6">
        <h3 class="font-bold">Wing Features</h3>
        <FeatureList :items="wingFeatures" layout="list" class="mt-3">
          <template #icon>
            <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
          </template>
          <template #text="{ item }">
            <span
              ><strong>{{ item.text }}</strong> — {{ item.detail }}</span
            >
          </template>
        </FeatureList>
      </Card>
    </div>
  </Section>

  <!-- Staff Spotlight -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Staff Spotlight</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <TeamGrid :members="kidsStaff" layout="card" :columns="2" class="mt-8">
        <template #photo="{ member }">
          <div
            class="bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
          >
            {{
              member.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
            }}
          </div>
        </template>
        <template #credentials="{ member }">
          <p class="text-xs font-medium">{{ staffYears[member.id] }}</p>
        </template>
      </TeamGrid>
    </div>
  </Section>

  <!-- Parent Resources -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Parent Resources</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-sm leading-relaxed">
        Everything you need to get your child started at the library — from library cards to digital
        tools to volunteer opportunities.
      </p>
      <Card class="mt-6 p-6">
        <FeatureList :items="parentResources" layout="list" class="mt-1">
          <template #icon>
            <Icon icon="heroicons:check-circle" size="sm" aria-hidden="true" />
          </template>
          <template #text="{ item }">
            <span
              ><strong>{{ item.text }}</strong> — {{ item.detail }}</span
            >
          </template>
        </FeatureList>
      </Card>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold">Get a Library Card for Your Child</p>
    <p class="mt-1 text-sm">
      Children ages 0-17 can get a free card with a parent or guardian present. Stop by the
      circulation desk — it takes about 5 minutes.
    </p>
    <template #action>
      <Button variant="cta-light" class="whitespace-nowrap" @click="emit('navigate', 'card')"
        >Get a Card</Button
      >
    </template>
  </CTABanner>
</template>
