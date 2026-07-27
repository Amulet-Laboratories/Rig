<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Card,
  Badge,
  Divider,
  Hero,
  Icon,
  Input,
  Section,
  StatRow,
  CTABanner,
  Testimonial,
} from '@amulet-laboratories/rig'
import { heroStats, properties, testimonials, tagVariants } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const featured = properties
  .filter((p) => p.tagType === 'featured' || p.tagType === 'new')
  .slice(0, 3)

const guideEmail = ref('')
const guideSubmitted = ref(false)
const submitGuide = () => {
  if (guideEmail.value) guideSubmitted.value = true
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Hero with background image -->
    <Hero layout="immersive" scrim>
      <template #media>
        <img
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover"
        />
      </template>
      <template #eyebrow>
        <span class="font-mono text-xs font-medium uppercase tracking-eyebrow-lg">
          Coastal Real Estate &middot; Briar Cove, Oregon
        </span>
      </template>
      <template #title>
        <h1 class="font-serif text-4xl font-bold leading-display sm:text-5xl lg:text-6xl">
          Find your place on the coast
        </h1>
      </template>
      <template #description>
        <p class="mx-auto max-w-xl">
          Curated properties in Briar Cove and the surrounding communities. Twenty years of local
          expertise, one dedicated broker.
        </p>
        <p class="text-muted-foreground mt-3 text-xs font-medium">
          Trusted by 150+ families since 2006
        </p>
      </template>
      <template #actions>
        <Button variant="primary" size="lg" @click="emit('navigate', 'listings')">
          Browse Listings
        </Button>
        <Button variant="secondary" size="lg" @click="emit('navigate', 'about')">
          About Dana
        </Button>
      </template>
    </Hero>

    <!-- Company highlights -->
    <StatRow :stats="heroStats" variant="filled" />

    <!-- Featured Listings -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="font-serif text-3xl font-bold">Featured Listings</h2>
            <span data-rig-accent class="mt-3 block h-0.5 w-12" />
            <p class="mt-3 text-sm">Handpicked properties currently on the market</p>
          </div>
          <Button variant="secondary" size="sm" @click="emit('navigate', 'listings')">
            View All Listings
          </Button>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- First card spans 2 columns on lg -->
          <Card
            v-for="(p, i) in featured"
            :key="p.id"
            interactive
            class="group overflow-hidden"
            :class="{ 'sm:col-span-2 lg:col-span-2': i === 0 }"
            @click="emit('navigate', `listings:property:${p.id}`)"
          >
            <div class="relative overflow-hidden">
              <img
                :src="p.img"
                :alt="p.alt"
                :class="i === 0 ? 'aspect-[4/3] sm:aspect-[21/9]' : 'aspect-[16/10]'"
                class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <Badge
                v-if="p.tag"
                size="sm"
                class="absolute left-3 top-3"
                :variant="tagVariants[p.tagType] || undefined"
              >
                {{ p.tag }}
              </Badge>
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-serif text-lg font-semibold leading-tight">{{ p.title }}</h3>
                  <p class="mt-1 text-xs">{{ p.address }} · {{ p.neighborhood }}</p>
                </div>
                <span class="text-primary text-lg font-bold whitespace-nowrap">
                  {{ p.price }}
                </span>
              </div>
              <p class="mt-3 text-sm leading-relaxed">{{ p.description }}</p>
              <Divider class="my-4" />
              <div class="flex items-center justify-between">
                <p class="flex items-center gap-3 text-sm">
                  <span>{{ p.beds }} bd</span>
                  <span>{{ p.baths }} ba</span>
                  <span>{{ p.sqft }} sqft</span>
                </p>
                <span class="text-muted-foreground text-xs">{{ p.dom }}d on market</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Testimonials -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-center font-serif text-3xl font-bold">What Clients Say</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" />
        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Testimonial v-for="t in testimonials" :key="t.name" layout="card">
            <template #decorator>
              <span class="text-primary font-serif text-4xl leading-none">&ldquo;</span>
            </template>
            <template #quote>
              <p class="text-base leading-relaxed">{{ t.quote }}</p>
            </template>
            <template #attribution>
              <p class="mt-4 text-sm font-semibold">{{ t.name }}</p>
              <p class="text-primary text-xs">{{ t.detail }}</p>
            </template>
          </Testimonial>
        </div>
      </div>
    </Section>

    <!-- Buyer's Guide CTA (email-gated) -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <div
          class="bg-card border-border flex flex-col items-center gap-6 rounded-lg border p-8 sm:flex-row sm:items-start sm:gap-10"
        >
          <div
            class="bg-accent flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <Icon icon="heroicons:book-open" size="sm" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <h3 class="font-serif text-xl font-semibold">Free Coastal Buyer's Guide</h3>
            <p class="mt-2 text-sm leading-relaxed">
              Everything you need to know about buying on the Oregon coast — neighborhoods, market
              trends, the inspection process, and what the Portland transplants wish they knew
              before they signed.
            </p>
            <template v-if="!guideSubmitted">
              <form
                class="mt-4 flex flex-wrap gap-3"
                aria-label="Download buyer's guide"
                @submit.prevent="submitGuide"
              >
                <Input
                  v-model="guideEmail"
                  placeholder="your@email.com"
                  type="email"
                  class="min-w-[200px] flex-1"
                  required
                />
                <Button variant="primary" size="sm" type="submit">Send Me the Guide</Button>
              </form>
              <p class="text-muted-foreground mt-2 text-xs">
                Free PDF. No spam — just the guide and occasional new-listing alerts.
              </p>
            </template>
            <div v-else class="text-primary mt-4 flex items-center gap-2 text-sm font-medium">
              <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
              Check your inbox — the guide is on its way.
            </div>
            <div class="mt-3">
              <Button variant="secondary" size="sm" @click="emit('navigate', 'market')">
                View Market Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <!-- CTA -->
    <CTABanner layout="centered" class="bg-foreground text-background">
      <h2 class="text-background font-serif text-2xl font-bold">Looking for something specific?</h2>
      <p class="text-background mx-auto mt-4 max-w-md text-sm leading-relaxed opacity-85">
        I know every street, every view, and every deal on the coast. Tell me what you need — I will
        find it.
      </p>
      <template #action>
        <Button variant="primary" size="lg" @click="emit('navigate', 'contact')">
          Get in Touch
        </Button>
      </template>
    </CTABanner>
  </div>
</template>
