<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Section,
  Button,
  Card,
  Badge,
  Divider,
  Icon,
  useDetailView,
} from '@amulet-laboratories/rig'
import { products, categories, tagVariants } from '../data'
import type { Product } from '../data'
import { demoPlaceholder, onDemoImgError } from '@/lib/demoPlaceholder'

// Palette-matched fallback tile for missing/dead product imagery.
const ph = { bg: '#EAE0CC', fg: '#8A7B5E', accent: '#b8860b' }

const activeCategory = ref('Shop All')
const {
  selected: selectedProduct,
  select: selectProduct,
  back: backToShop,
} = useDetailView<Product>()

const filteredProducts = computed(() => {
  if (activeCategory.value === 'Shop All') return products
  return products.filter((p) => p.category === activeCategory.value)
})

const relatedProducts = computed(() => {
  if (!selectedProduct.value) return []
  return products
    .filter(
      (p) => p.category === selectedProduct.value!.category && p.id !== selectedProduct.value!.id,
    )
    .slice(0, 3)
})
</script>

<template>
  <!-- Product Detail View -->
  <template v-if="selectedProduct">
    <Section>
      <div class="mx-auto max-w-5xl">
        <button
          class="text-primary mb-6 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
          @click="backToShop"
        >
          <span>&larr;</span> Back to Shop
        </button>

        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <!-- Image -->
          <div class="overflow-hidden rounded-lg">
            <img
              loading="lazy"
              :src="selectedProduct.img || demoPlaceholder(selectedProduct.name, ph)"
              :alt="selectedProduct.name"
              class="aspect-square w-full object-cover"
              @error="onDemoImgError($event, selectedProduct.name, ph)"
            />
          </div>

          <!-- Info -->
          <div>
            <Badge
              v-if="selectedProduct.tag"
              size="sm"
              :variant="tagVariants[selectedProduct.tag] || undefined"
            >
              {{ selectedProduct.tag }}
            </Badge>
            <p class="text-muted-foreground mt-2 text-xs font-semibold uppercase tracking-wider">
              {{ selectedProduct.category }}
            </p>
            <h1 class="mt-2 font-serif text-3xl font-bold">{{ selectedProduct.name }}</h1>
            <p class="text-primary mt-4 text-2xl font-bold">
              {{ selectedProduct.price }}
            </p>

            <Divider class="my-5" />

            <p class="text-sm leading-relaxed">{{ selectedProduct.description }}</p>

            <div class="mt-5 space-y-2 text-xs">
              <p><span class="font-semibold">Maker:</span> {{ selectedProduct.maker }}</p>
              <p><span class="font-semibold">Materials:</span> {{ selectedProduct.materials }}</p>
            </div>

            <Button variant="primary" size="lg" class="mt-8 w-full">Add to Cart</Button>
            <p class="text-muted-foreground mt-3 text-center text-xs">
              Free shipping on orders over $75 · 30-day returns
            </p>
          </div>
        </div>

        <!-- Related products -->
        <div v-if="relatedProducts.length" class="mt-16">
          <h2 class="font-serif text-xl font-bold">More in {{ selectedProduct.category }}</h2>
          <span data-rig-accent class="mt-2 block h-0.5 w-8" aria-hidden="true" />
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Card
              v-for="rp in relatedProducts"
              :key="rp.id"
              interactive
              class="group overflow-hidden"
              @click="selectProduct(rp)"
            >
              <div class="overflow-hidden">
                <img
                  :src="rp.img || demoPlaceholder(rp.name, ph)"
                  :alt="rp.name"
                  class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  @error="onDemoImgError($event, rp.name, ph)"
                />
              </div>
              <div class="p-4">
                <h3 class="text-sm font-semibold leading-tight">{{ rp.name }}</h3>
                <p class="mt-1 font-bold">{{ rp.price }}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  </template>

  <!-- Shop Grid View -->
  <template v-else>
    <!-- Header -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl text-center">
        <h1 class="font-serif text-3xl font-bold">Shop</h1>
        <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
        <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed">
          Every product on our shelves is here because we use it ourselves. No filler, no
          drop-shipping — just good things from good people.
        </p>
      </div>
    </Section>

    <!-- Category filter bar -->
    <nav
      class="bg-background border-border sticky top-0 z-10 overflow-x-auto border-b px-6 py-3"
      aria-label="Product categories"
    >
      <div class="mx-auto flex max-w-5xl items-center gap-2">
        <Button
          v-for="cat in categories"
          :key="cat"
          :variant="activeCategory === cat ? 'primary' : 'secondary'"
          size="sm"
          :aria-pressed="activeCategory === cat"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </Button>
      </div>
    </nav>

    <!-- Product grid -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <p class="mb-6 text-sm">
          {{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? 'product' : 'products' }}
          <span v-if="activeCategory !== 'Shop All'">
            in <strong>{{ activeCategory }}</strong>
          </span>
        </p>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            v-for="p in filteredProducts"
            :key="p.id"
            interactive
            class="group overflow-hidden"
            @click="selectProduct(p)"
          >
            <div class="relative overflow-hidden">
              <img
                :src="p.img || demoPlaceholder(p.name, ph)"
                :alt="p.name"
                class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                @error="onDemoImgError($event, p.name, ph)"
              />
              <Badge
                v-if="p.tag"
                size="sm"
                class="absolute left-2 top-2"
                :variant="tagVariants[p.tag] || undefined"
              >
                {{ p.tag }}
              </Badge>
            </div>
            <div class="p-4">
              <p class="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                {{ p.category }}
              </p>
              <h3 class="mt-1 text-sm font-semibold leading-tight">{{ p.name }}</h3>
              <p class="text-muted-foreground mt-1 text-xs">{{ p.maker }}</p>
              <p class="mt-2 font-bold">{{ p.price }}</p>
            </div>
          </Card>
        </div>
        <div v-if="filteredProducts.length === 0" class="py-16 text-center">
          <p class="text-sm">No products in this category yet.</p>
          <Button variant="secondary" size="sm" class="mt-4" @click="activeCategory = 'Shop All'">
            View All Products
          </Button>
        </div>
      </div>
    </Section>

    <!-- Shipping info -->
    <Section class="bg-secondary">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-center font-serif text-xl font-bold">Shipping & Returns</h2>
        <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card class="p-5 text-center">
            <Icon icon="heroicons:truck" size="sm" class="mx-auto" aria-hidden="true" />
            <h3 class="mt-3 text-sm font-bold">Free Shipping</h3>
            <p class="mt-1 text-xs leading-relaxed">
              On orders over $75. Standard delivery 3-5 business days.
            </p>
          </Card>
          <Card class="p-5 text-center">
            <Icon icon="heroicons:shield-check" size="sm" class="mx-auto" aria-hidden="true" />
            <h3 class="mt-3 text-sm font-bold">Gift Wrapping</h3>
            <p class="mt-1 text-xs leading-relaxed">
              Kraft paper and twine. $5 at checkout. Handwritten note free.
            </p>
          </Card>
          <Card class="p-5 text-center">
            <Icon icon="heroicons:arrow-uturn-left" size="sm" class="mx-auto" aria-hidden="true" />
            <h3 class="mt-3 text-sm font-bold">30-Day Returns</h3>
            <p class="mt-1 text-xs leading-relaxed">
              Return unused items within 30 days. No questions asked.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  </template>
</template>
