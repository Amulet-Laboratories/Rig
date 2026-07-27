<script setup lang="ts">
import { ref } from 'vue'
import { Section, Card, Button, Input, Badge, Icon } from '@amulet-laboratories/rig'

const searchQuery = ref('')

const categories = [
  {
    name: 'Fiction',
    count: '14,200+',
    icon: 'heroicons:book-open',
    description: 'Novels, short stories, literary fiction, genre fiction, and graphic novels.',
  },
  {
    name: 'Non-Fiction',
    count: '11,800+',
    icon: 'heroicons:academic-cap',
    description: 'Biography, history, science, self-help, true crime, and reference materials.',
  },
  {
    name: "Children's",
    count: '8,400+',
    icon: 'heroicons:sparkles',
    description: 'Picture books, early readers, middle grade, and chapter books for ages 0–12.',
  },
  {
    name: 'Young Adult',
    count: '3,200+',
    icon: 'heroicons:user-group',
    description: 'YA fiction and non-fiction for teens and young adults ages 12–18.',
  },
  {
    name: 'DVDs & Blu-ray',
    count: '2,800+',
    icon: 'heroicons:film',
    description: 'Feature films, documentaries, TV series, and educational content.',
  },
  {
    name: 'Audiobooks',
    count: '3,100+',
    icon: 'heroicons:microphone',
    description: 'Physical audiobooks on CD and digital audiobooks via Libby.',
  },
  {
    name: 'Periodicals',
    count: '120+',
    icon: 'heroicons:newspaper',
    description: 'Current magazines, newspapers, and journal subscriptions.',
  },
  {
    name: 'Local History',
    count: '1,400+',
    icon: 'heroicons:archive-box',
    description: 'Briar Cove Sentinel archives, tribal histories, cannery records, and maps.',
  },
]

const newArrivals = [
  {
    title: 'Intermezzo',
    author: 'Sally Rooney',
    format: 'Fiction',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'The God of the Woods',
    author: 'Liz Moore',
    format: 'Fiction',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Nexus',
    author: 'Yuval Noah Harari',
    format: 'Non-Fiction',
    img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'The Women',
    author: 'Kristin Hannah',
    format: 'Fiction',
    img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'Remarkably Bright Creatures',
    author: 'Shelby Van Pelt',
    format: 'Fiction',
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=200&q=80',
  },
  {
    title: 'An Immense World',
    author: 'Ed Yong',
    format: 'Non-Fiction',
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=200&q=80',
  },
]
</script>

<template>
  <!-- Search Hero -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="font-serif text-3xl font-bold">Search the Catalog</h1>
      <p class="mt-2 text-sm">
        Browse over 47,000 titles — books, audiobooks, DVDs, periodicals, and digital resources.
      </p>
      <Card class="mx-auto mt-6 max-w-xl p-6">
        <form class="flex gap-3" role="search" aria-label="Library catalog" @submit.prevent>
          <label for="catalog-search" class="sr-only">Search by title, author, or keyword</label>
          <Input
            id="catalog-search"
            v-model="searchQuery"
            placeholder="Search by title, author, ISBN, or keyword..."
            class="flex-1"
          />
          <Button variant="primary">Search</Button>
        </form>
        <p class="mt-3 text-xs">
          Try: "Oregon coast history" &middot; "picture books about dogs" &middot; "Sally Rooney"
        </p>
      </Card>
    </div>
  </Section>

  <!-- Browse by Category -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Browse by Category</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="c in categories"
          :key="c.name"
          class="p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="mb-3 flex items-center gap-3">
            <div class="bg-secondary flex h-8 w-8 items-center justify-center rounded-md">
              <Icon :icon="c.icon" size="sm" aria-hidden="true" />
            </div>
            <Badge variant="secondary">{{ c.count }}</Badge>
          </div>
          <h3 class="font-bold">{{ c.name }}</h3>
          <p class="mt-1 text-xs leading-relaxed">{{ c.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- New Arrivals -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">New Arrivals</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card v-for="b in newArrivals" :key="b.title" class="group overflow-hidden p-0">
          <div class="overflow-hidden">
            <img
              :src="b.img"
              :alt="`Cover of ${b.title}`"
              class="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="p-3">
            <h3 class="text-xs font-bold leading-tight">{{ b.title }}</h3>
            <p class="mt-0.5 text-xs">{{ b.author }}</p>
            <Badge variant="secondary" class="mt-1.5 text-xs">{{ b.format }}</Badge>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Inter-Library Loan -->
  <Section>
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold">Can't Find What You Need?</h2>
      <span class="bg-accent mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-sm leading-relaxed">
        We participate in the Oregon Statewide Inter-Library Loan program. If we don't have a title
        in our collection, we can request it from any library in the state — usually delivered
        within 5–7 business days.
      </p>
      <Card class="mt-6 p-6 text-left">
        <h3 class="font-bold">How It Works</h3>
        <ol class="mt-3 space-y-2 text-sm">
          <li class="flex gap-3">
            <span
              class="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              >1</span
            >
            <span>Search our catalog. If the item isn't available, click "Request via ILL."</span>
          </li>
          <li class="flex gap-3">
            <span
              class="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              >2</span
            >
            <span>Fill in the request form with your library card number.</span>
          </li>
          <li class="flex gap-3">
            <span
              class="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              >3</span
            >
            <span>We'll notify you by email or phone when your item arrives.</span>
          </li>
        </ol>
      </Card>
      <p class="mt-4 text-xs">
        Inter-library loans are free for Briar Cove cardholders. Some restrictions apply to rare or
        reference materials.
      </p>
    </div>
  </Section>
</template>
