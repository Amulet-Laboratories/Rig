<script setup lang="ts">
import { Section, Card, Badge, Divider } from '@amulet-laboratories/rig'

const emit = defineEmits<{
  navigate: [page: string]
}>()

const staffPicks = [
  {
    title: 'The God of the Woods',
    author: 'Liz Moore',
    note: 'A gripping mystery set in the Adirondacks that kept me turning pages all weekend. The dual timelines are masterfully handled.',
    staff: 'Margaret Holm',
    role: 'Head Librarian',
    genre: 'Mystery',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Intermezzo',
    author: 'Sally Rooney',
    note: 'Rooney at her most tender — two brothers navigating grief and love in Dublin. Her best work since Normal People.',
    staff: 'David Chen',
    role: 'Reference Librarian',
    genre: 'Literary Fiction',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Remarkably Bright Creatures',
    author: 'Shelby Van Pelt',
    note: 'A debut novel narrated partly by a giant Pacific octopus. Funny and heartbreaking in equal measure.',
    staff: 'Rosa Gutierrez',
    role: "Children's Librarian",
    genre: 'Fiction',
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'An Immense World',
    author: 'Ed Yong',
    note: 'Changed the way I think about animal perception forever. Accessible science writing at its best.',
    staff: 'Tom Halverson',
    role: 'Teen Services',
    genre: 'Science',
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'The Women',
    author: 'Kristin Hannah',
    note: 'A powerful story of a nurse during and after the Vietnam War. Historical fiction that hits you in the gut.',
    staff: 'Janet Park',
    role: 'Circulation Manager',
    genre: 'Historical Fiction',
    img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Nexus',
    author: 'Yuval Noah Harari',
    note: 'Harari turns his attention to artificial intelligence and information networks. Thought-provoking as always.',
    staff: 'David Chen',
    role: 'Reference Librarian',
    genre: 'Non-Fiction',
    img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=200&q=80',
  },
]

const bookClubs = [
  {
    name: 'Page & Pour',
    schedule: 'First Friday, 5:30 PM',
    location: 'Tidemark Brewing',
    description:
      'Our flagship adult book club. Lively discussion over craft beer. Open to all — pick up the current title at the circulation desk.',
    currentBook: 'Demon Copperhead by Barbara Kingsolver',
  },
  {
    name: 'Little Readers Circle',
    schedule: 'Second Saturday, 10:00 AM',
    location: "Children's Wing",
    description:
      'A parent-child book club for ages 6–10. Read the book at home and come ready for crafts and conversation.',
    currentBook: 'The Wild Robot by Peter Brown',
  },
  {
    name: 'Between the Lines',
    schedule: 'Third Thursday, 6:00 PM',
    location: 'Salal Creek Room',
    description:
      'Non-fiction book club exploring science, history, and biography. Thoughtful discussion for curious minds.',
    currentBook: 'An Immense World by Ed Yong',
  },
]

const readingChallenge = {
  name: 'Briar Cove Spring Reading Challenge',
  goal: 'Read 12 books between March 1 and May 31',
  prizes: ['Bookmark at 4 books', 'Tote bag at 8 books', 'Gift card to Compass Books at 12 books'],
  status: 'Registration opens February 15',
}
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-serif text-3xl font-bold">Staff Picks &amp; Reading</h1>
      <p class="mt-2 text-sm leading-relaxed">
        Curated recommendations from our librarians, plus book clubs and reading challenges to keep
        you turning pages.
      </p>
    </div>
  </Section>

  <!-- Staff Picks -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Staff Picks</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card v-for="b in staffPicks" :key="b.title" class="group flex gap-4 p-5">
          <div class="overflow-hidden">
            <img
              :src="b.img"
              :alt="`Cover of ${b.title}`"
              class="h-36 w-24 flex-shrink-0 rounded object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold">{{ b.title }}</h3>
              <Badge variant="secondary" class="text-xs">{{ b.genre }}</Badge>
            </div>
            <p class="mt-1 text-sm">by {{ b.author }}</p>
            <Divider class="my-3" />
            <p class="text-sm italic leading-relaxed">"{{ b.note }}"</p>
            <p class="mt-3 text-xs font-medium">{{ b.staff }}, {{ b.role }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Book Clubs -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Book Clubs</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 space-y-6">
        <Card v-for="club in bookClubs" :key="club.name" class="p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-bold">{{ club.name }}</h3>
              <div class="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{{ club.schedule }}</Badge>
                <Badge variant="muted">{{ club.location }}</Badge>
              </div>
              <p class="mt-3 text-sm leading-relaxed">{{ club.description }}</p>
            </div>
            <div class="bg-secondary shrink-0 rounded-md p-4 sm:w-48">
              <p class="text-xs font-bold uppercase tracking-wider">Currently Reading</p>
              <p class="mt-1 text-sm font-bold">{{ club.currentBook }}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Reading Challenge -->
  <Section>
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold">{{ readingChallenge.name }}</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-sm">{{ readingChallenge.goal }}</p>
      <Card class="mt-6 p-6 text-left">
        <h3 class="text-center font-bold">Prize Milestones</h3>
        <div class="mt-4 space-y-3">
          <div
            v-for="(prize, i) in readingChallenge.prizes"
            :key="i"
            class="flex items-center gap-3"
          >
            <div
              class="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            >
              {{ (i + 1) * 4 }}
            </div>
            <p class="text-sm">{{ prize }}</p>
          </div>
        </div>
        <Divider class="my-4" />
        <p class="text-center text-sm font-medium">{{ readingChallenge.status }}</p>
      </Card>
      <button
        class="mt-6 text-sm font-medium transition-colors hover:underline"
        @click="emit('navigate', 'events')"
      >
        See all library events &rarr;
      </button>
    </div>
  </Section>
</template>
