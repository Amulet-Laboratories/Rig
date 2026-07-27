<script setup lang="ts">
import {
  Section,
  Card,
  Button,
  Divider,
  TeamGrid,
  FeatureList,
  Icon,
} from '@amulet-laboratories/rig'
import type { TeamMember, FeatureItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{
  navigate: [page: string]
}>()

const staff: TeamMember[] = [
  {
    id: 'margaret-holm',
    name: 'Margaret Holm',
    role: 'Head Librarian',
    bio: 'Margaret has led the library through two renovations and the digital transformation. She holds an MLIS from the University of Washington and is passionate about local history preservation.',
  },
  {
    id: 'david-chen',
    name: 'David Chen',
    role: 'Reference Librarian',
    bio: 'David manages the reference desk and digital resources. He runs the genealogy workshops and manages the Ancestry Library Edition program.',
  },
  {
    id: 'rosa-gutierrez',
    name: 'Rosa Gutierrez',
    role: "Children's Librarian",
    bio: "Rosa runs storytime, the summer reading program, and oversees the children's wing. She has a gift for matching young readers with the perfect book.",
  },
  {
    id: 'tom-halverson',
    name: 'Tom Halverson',
    role: 'Teen Services',
    bio: 'Tom manages the teen maker lab, Game Night, and young adult collection. He coordinates the teen volunteer program and 3D printing workshops.',
  },
  {
    id: 'janet-park',
    name: 'Janet Park',
    role: 'Circulation Manager',
    bio: 'Janet and her team handle checkouts, returns, holds, and inter-library loans. She also manages library card registration and the meeting room schedule.',
  },
]

const staffYears: Record<string, string> = {
  'margaret-holm': 'Since 2008',
  'david-chen': 'Since 2015',
  'rosa-gutierrez': 'Since 2019',
  'tom-halverson': 'Since 2021',
  'janet-park': 'Since 2012',
}

const supportWays: FeatureItem[] = [
  { id: 'join', text: 'Join the Friends', detail: 'Annual membership starts at $10' },
  { id: 'donate', text: 'Donate books', detail: 'Gently used books for the annual sale' },
  {
    id: 'volunteer',
    text: 'Volunteer',
    detail: 'Help at events, shelve books, or assist with programs',
  },
  { id: 'gift', text: 'Make a gift', detail: 'Tax-deductible donations of any amount' },
]

const milestones = [
  { year: '1938', event: 'WPA construction of the Main Street building begins.' },
  {
    year: '1951',
    event: 'Briar Cove Public Library officially opens with a collection of 3,200 books.',
  },
  { year: '1973', event: "Children's wing added during the first major expansion." },
  { year: '1998', event: 'Public internet terminals installed — the first in Coos County.' },
  { year: '2008', event: 'Second floor renovation adds meeting rooms and study carrels.' },
  {
    year: '2018',
    event: 'Teen Maker Lab opens with 3D printers, laser cutter, and electronics station.',
  },
  {
    year: '2022',
    event: 'Late fees eliminated. Digital lending program launches with Libby and Kanopy.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="font-serif text-3xl font-bold">About the Library</h1>
      <p class="mt-3 text-sm leading-relaxed">
        Housed in a 1938 WPA-built structure on Main Street, the Briar Cove Public Library has
        served the community since 1951.
      </p>
    </div>
  </Section>

  <!-- About Image + Story -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
          alt="Interior of Briar Cove Public Library"
          class="aspect-[4/3] w-full rounded-lg object-cover shadow-md"
          loading="lazy"
        />
        <div>
          <h2 class="text-2xl font-bold">Our Story</h2>
          <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
          <p class="mt-4 text-sm leading-relaxed">
            Our Main Street building houses two floors of collections, a children's wing, a teen
            maker lab, two meeting rooms, four study carrels, and a local history archive. We're
            open 7 days a week.
          </p>
          <p class="mt-3 text-sm leading-relaxed">
            The library partners with KBCV 91.7 FM for live broadcasts, hosts the annual Friends of
            the Library book sale, and co-sponsors the Briar Cove Spring Reading Challenge.
          </p>
          <p class="mt-3 text-sm leading-relaxed">
            Our local history archive holds the Briar Cove Sentinel back to 1923, records from the
            old fish cannery, and the Coquille tribal oral history collection.
          </p>
        </div>
      </div>
    </div>
  </Section>

  <!-- Mission -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-xl font-bold">Our Mission</h2>
      <p class="mt-4 text-sm italic leading-relaxed">
        "To provide free and equitable access to information, foster a love of reading, preserve
        local history, and serve as a gathering place for the Briar Cove community."
      </p>
    </div>
  </Section>

  <!-- Timeline -->
  <Section>
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center text-2xl font-bold">Library Timeline</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-0">
        <div v-for="(m, i) in milestones" :key="m.year" class="flex gap-4">
          <div class="flex flex-col items-center">
            <div
              class="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
            >
              {{ m.year.slice(2) }}
            </div>
            <div v-if="i < milestones.length - 1" class="bg-border w-px flex-1"></div>
          </div>
          <div class="pb-6">
            <p class="text-sm font-bold">{{ m.year }}</p>
            <p class="mt-1 text-sm leading-relaxed">{{ m.event }}</p>
          </div>
        </div>
      </div>
    </div>
  </Section>

  <!-- Staff -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Our Staff</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <TeamGrid :members="staff" layout="card" :columns="3" class="mt-8">
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

  <!-- Friends of the Library -->
  <Section>
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold">Friends of the Library</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-sm leading-relaxed">
        The Friends of the Briar Cove Public Library is a volunteer organization that supports the
        library through fundraising, advocacy, and community outreach. Their annual book sale raises
        over $8,000 each year for library programs.
      </p>
      <Card class="mt-6 p-6 text-left">
        <h3 class="font-bold">Ways to Support</h3>
        <FeatureList :items="supportWays" layout="list" class="mt-3">
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

  <!-- Contact / Address -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-xl font-bold">Visit Us</h2>
      <Divider class="mx-auto my-4 max-w-[120px]" />
      <address class="not-italic text-sm">
        <span class="inline-flex items-center gap-1.5">
          <Icon icon="heroicons:map-pin" size="sm" aria-hidden="true" />
          215 Main Street, Briar Cove, OR 97420
        </span>
        <br />
        <span class="inline-flex items-center gap-1.5">
          <Icon icon="heroicons:phone" size="sm" aria-hidden="true" />
          <a href="tel:+15415550142" class="transition-colors hover:underline">(541) 555-0142</a>
        </span>
      </address>
      <div class="mt-4">
        <Button variant="primary" @click="emit('navigate', 'card')">Get a Library Card</Button>
      </div>
    </div>
  </Section>
</template>
