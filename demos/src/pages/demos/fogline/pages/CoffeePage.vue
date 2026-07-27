<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Section,
  Card,
  Badge,
  Button,
  Divider,
  FlankedHeading,
  Icon,
  Ornament,
  useDetailView,
} from '@amulet-laboratories/rig'
import { coffees, coffeeCategories, tagVariants } from '../data'
import type { Coffee } from '../data'

const activeCategory = ref('All')

const { selected: selectedCoffee, select: selectCoffee, back: backToGrid } = useDetailView<Coffee>()

const filtered = computed(() => {
  if (activeCategory.value === 'All') return coffees
  return coffees.filter((c) => c.category === activeCategory.value)
})

const relatedCoffees = computed(() => {
  if (!selectedCoffee.value) return []
  return coffees
    .filter(
      (c) => c.category === selectedCoffee.value!.category && c.id !== selectedCoffee.value!.id,
    )
    .slice(0, 3)
})
</script>

<template>
  <!-- Detail View -->
  <template v-if="selectedCoffee">
    <Section>
      <div class="mx-auto max-w-5xl">
        <button
          class="text-primary mb-6 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
          @click="backToGrid"
        >
          <span>&larr;</span> Back to Coffee
        </button>

        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <!-- Image -->
          <div class="overflow-hidden rounded-lg">
            <img
              loading="lazy"
              :src="selectedCoffee.img"
              :alt="selectedCoffee.name"
              class="aspect-square w-full object-cover"
            />
          </div>

          <!-- Info -->
          <div>
            <Badge
              v-if="selectedCoffee.tag"
              size="sm"
              :variant="tagVariants[selectedCoffee.tag] || undefined"
            >
              {{ selectedCoffee.tag }}
            </Badge>
            <p class="text-muted-foreground mt-2 text-xs font-semibold uppercase tracking-wider">
              {{ selectedCoffee.category }}
            </p>
            <h1 class="mt-2 font-serif text-3xl font-bold">{{ selectedCoffee.name }}</h1>
            <p class="text-primary mt-4 font-mono text-2xl font-bold">
              {{ selectedCoffee.price }}
              <span class="text-muted-foreground text-sm font-normal"
                >/ {{ selectedCoffee.weight }}</span
              >
            </p>

            <Divider class="my-5" />

            <p class="text-sm italic leading-relaxed">{{ selectedCoffee.notes }}</p>

            <dl class="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 text-xs sm:gap-x-6">
              <div>
                <dt class="text-muted-foreground font-semibold uppercase tracking-wider">Origin</dt>
                <dd class="mt-0.5 font-medium">{{ selectedCoffee.origin }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground font-semibold uppercase tracking-wider">Region</dt>
                <dd class="mt-0.5 font-medium">{{ selectedCoffee.region }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground font-semibold uppercase tracking-wider">
                  Process
                </dt>
                <dd class="mt-0.5 font-medium">{{ selectedCoffee.process }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground font-semibold uppercase tracking-wider">Roast</dt>
                <dd class="mt-0.5 font-medium">{{ selectedCoffee.roast }}</dd>
              </div>
            </dl>

            <Button variant="primary" size="lg" class="mt-8 w-full">Add to Cart</Button>
            <p class="text-muted-foreground mt-3 text-center text-xs">
              Free shipping on orders over $40 &middot; Roasted to order
            </p>
          </div>
        </div>

        <!-- Related coffees -->
        <div v-if="relatedCoffees.length" class="mt-16">
          <h2 class="font-serif text-xl font-bold">More in {{ selectedCoffee.category }}</h2>
          <Ornament variant="rule" size="sm" class="mt-2" />
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Card
              v-for="rc in relatedCoffees"
              :key="rc.id"
              interactive
              class="group overflow-hidden"
              @click="selectCoffee(rc)"
            >
              <div class="overflow-hidden">
                <img
                  :src="rc.img"
                  :alt="rc.name"
                  class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div class="p-4">
                <h3 class="font-serif text-sm font-bold leading-tight">{{ rc.name }}</h3>
                <p class="text-muted-foreground mt-1 text-xs">{{ rc.origin }}</p>
                <p class="mt-2 font-mono font-medium">{{ rc.price }}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  </template>

  <!-- Grid View -->
  <template v-else>
    <!-- Header -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl text-center">
        <FlankedHeading>
          <h1 class="font-serif text-3xl font-bold">Our Coffee</h1>
        </FlankedHeading>
        <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed">
          Single origins from farms we visit. Blends we built over years of tasting. Roasted fresh
          every week in Briar Cove.
        </p>
      </div>
    </Section>

    <!-- Filter bar -->
    <nav
      class="bg-background border-border sticky top-0 z-10 overflow-x-auto border-b px-6 py-3"
      aria-label="Coffee categories"
    >
      <div class="mx-auto flex max-w-5xl items-center gap-2">
        <Button
          v-for="cat in coffeeCategories"
          :key="cat"
          :variant="activeCategory === cat ? 'primary' : 'secondary'"
          :aria-pressed="activeCategory === cat"
          size="sm"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </Button>
      </div>
    </nav>

    <!-- Coffee grid -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <p class="mb-6 text-sm">
          {{ filtered.length }}
          {{ filtered.length === 1 ? 'coffee' : 'coffees' }}
          <span v-if="activeCategory !== 'All'">
            in <strong>{{ activeCategory }}</strong>
          </span>
        </p>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="c in filtered"
            :key="c.id"
            interactive
            class="group overflow-hidden"
            @click="selectCoffee(c)"
          >
            <div class="relative overflow-hidden">
              <img
                :src="c.img"
                :alt="c.name"
                class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <Badge
                v-if="c.tag"
                size="sm"
                class="absolute left-2 top-2"
                :variant="tagVariants[c.tag] || undefined"
              >
                {{ c.tag }}
              </Badge>
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between gap-2">
                <h2 class="font-serif text-base font-bold">{{ c.name }}</h2>
                <span class="font-mono text-sm font-medium">{{ c.price }}</span>
              </div>

              <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <dt class="text-muted-foreground">Origin</dt>
                  <dd class="font-medium">{{ c.origin }}</dd>
                </div>
                <div>
                  <dt class="text-muted-foreground">Roast</dt>
                  <dd class="font-medium">{{ c.roast }}</dd>
                </div>
              </dl>

              <p class="mt-3 text-xs leading-relaxed italic">{{ c.notes }}</p>
            </div>
          </Card>
        </div>

        <div v-if="filtered.length === 0" class="py-16 text-center">
          <p class="text-sm">No coffees in this category yet.</p>
          <Button variant="secondary" size="sm" class="mt-4" @click="activeCategory = 'All'">
            View All Coffees
          </Button>
        </div>
      </div>
    </Section>

    <!-- Shipping info -->
    <Section class="bg-secondary">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-center font-serif text-xl font-bold">Shipping &amp; Freshness</h2>
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card class="p-5 text-center">
            <Icon
              icon="heroicons:truck"
              size="sm"
              aria-hidden="true"
              class="text-primary mx-auto"
            />
            <h3 class="mt-3 font-serif text-sm font-bold">Free shipping</h3>
            <p class="mt-1 text-xs leading-relaxed">On orders over $40 in the continental US.</p>
          </Card>
          <Card class="p-5 text-center">
            <Icon
              icon="heroicons:arrow-uturn-left"
              size="sm"
              aria-hidden="true"
              class="text-primary mx-auto"
            />
            <h3 class="mt-3 font-serif text-sm font-bold">Subscriptions</h3>
            <p class="mt-1 text-xs leading-relaxed">
              Save 10% with recurring delivery every 2 or 4 weeks.
            </p>
          </Card>
          <Card class="p-5 text-center">
            <Icon
              icon="heroicons:clock"
              size="sm"
              aria-hidden="true"
              class="text-primary mx-auto"
            />
            <h3 class="mt-3 font-serif text-sm font-bold">Roasted to order</h3>
            <p class="mt-1 text-xs leading-relaxed">
              Every bag has a roast date. We ship within 48 hours of roasting.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  </template>
</template>
