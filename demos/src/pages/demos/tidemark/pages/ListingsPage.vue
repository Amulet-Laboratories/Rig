<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Button,
  Card,
  Badge,
  Icon,
  Input,
  Divider,
  Section,
  Select,
  MapPlaceholder,
  ToggleGroup,
  useDetailView,
} from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'
import { properties, soldProperties, agents, tagVariants } from '../data'
import type { Property } from '../data'

const props = defineProps<{ initialFilter?: string; initialPropertyId?: string }>()
const emit = defineEmits<{ navigate: [page: string] }>()

// --- Favorites ---
const favorites = ref<Set<string>>(new Set())
const toggleFavorite = (id: string, e: Event) => {
  e.stopPropagation()
  const next = new Set(favorites.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  favorites.value = next
}

// --- Filters ---
const searchQuery = ref('')
const filterNeighborhood = ref('')
const filterBeds = ref('')
const filterPrice = ref('')
const filterOpenHouse = ref(false)

const allNeighborhoods = [...new Set(properties.map((p) => p.neighborhood))].sort()

const neighborhoodOptions = computed<SelectOption[]>(() =>
  allNeighborhoods.map((n) => ({ id: n, label: n })),
)

const priceOptions: SelectOption[] = [
  { id: 'under-500', label: 'Under $500k' },
  { id: '500-750', label: '$500k – $750k' },
  { id: '750-1m', label: '$750k – $1M' },
  { id: 'over-1m', label: 'Over $1M' },
]

const bedOptions: SelectOption[] = [
  { id: '0', label: 'Any' },
  { id: '1', label: '1+' },
  { id: '2', label: '2+' },
  { id: '3', label: '3+' },
  { id: '4', label: '4+' },
]

const openHouseCount = computed(() => properties.filter((p) => p.tagType === 'open-house').length)

const filteredProperties = computed(() => {
  return properties.filter((p) => {
    if (filterNeighborhood.value && p.neighborhood !== filterNeighborhood.value) return false
    if (filterBeds.value && filterBeds.value !== '0' && p.beds < Number(filterBeds.value))
      return false
    if (filterPrice.value) {
      const num = Number(p.price.replace(/[$,]/g, ''))
      if (filterPrice.value === 'under-500' && num >= 500000) return false
      if (filterPrice.value === '500-750' && (num < 500000 || num >= 750000)) return false
      if (filterPrice.value === '750-1m' && (num < 750000 || num >= 1000000)) return false
      if (filterPrice.value === 'over-1m' && num < 1000000) return false
    }
    if (filterOpenHouse.value && p.tagType !== 'open-house') return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    return true
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  filterNeighborhood.value = ''
  filterBeds.value = ''
  filterPrice.value = ''
  filterOpenHouse.value = false
}

const hasActiveFilters = computed(
  () =>
    searchQuery.value ||
    filterNeighborhood.value ||
    filterBeds.value ||
    filterPrice.value ||
    filterOpenHouse.value,
)

// Apply initial filter from neighborhood navigation
watch(
  () => props.initialFilter,
  (val) => {
    filterNeighborhood.value = val || ''
  },
  { immediate: true },
)

// Auto-select property from featured listing click
watch(
  () => props.initialPropertyId,
  (val) => {
    if (val) {
      const p = properties.find((prop) => prop.id === val)
      if (p) selectProperty(p)
    }
  },
  { immediate: true },
)

// --- Property detail ---
const {
  selected: selectedProperty,
  select: selectProperty,
  back: backToDetail,
} = useDetailView<Property>()

const listingAgent = computed(() => {
  if (!selectedProperty.value) return null
  return agents.find((a) => a.id === selectedProperty.value!.agentId) ?? null
})

const backToListings = () => {
  backToDetail()
  lightboxOpen.value = false
}

// --- Lightbox ---
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxRef = ref<HTMLElement | null>(null)

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  nextTick(() => {
    lightboxRef.value?.querySelector<HTMLElement>('button')?.focus()
  })
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const prevImage = () => {
  if (!selectedProperty.value) return
  const len = selectedProperty.value.images.length
  lightboxIndex.value = (lightboxIndex.value - 1 + len) % len
}

const nextImage = () => {
  if (!selectedProperty.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % selectedProperty.value.images.length
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()

  // Focus trap
  if (e.key === 'Tab' && lightboxRef.value) {
    const focusable = lightboxRef.value.querySelectorAll<HTMLElement>('button')
    if (!focusable.length) return
    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

// --- Touch swipe ---
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0]?.clientX ?? 0
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0]?.clientX ?? 0
  const delta = touchStartX.value - touchEndX.value
  if (Math.abs(delta) > 50) {
    if (delta > 0) nextImage()
    else prevImage()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// --- Mortgage calculator ---
const downPaymentPct = ref(20)
const interestRate = ref(6.5)
const loanTerm = ref('30')

const monthlyPayment = computed(() => {
  if (!selectedProperty.value) return 0
  const priceNum = Number(selectedProperty.value.price.replace(/[$,]/g, ''))
  const principal = priceNum * (1 - downPaymentPct.value / 100)
  const r = interestRate.value / 100 / 12
  const n = Number(loanTerm.value) * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
})

function formatCurrency(val: number): string {
  return val.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

// --- Saved search ---
const savedSearchEmail = ref('')
const savedSearchSubmitted = ref(false)
const submitSavedSearch = () => {
  if (savedSearchEmail.value) savedSearchSubmitted.value = true
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Lightbox overlay -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen && selectedProperty"
        ref="lightboxRef"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        role="dialog"
        aria-label="Photo gallery"
        aria-modal="true"
        @click.self="closeLightbox"
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd"
      >
        <button
          class="cursor-pointer absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close gallery"
          @click="closeLightbox"
        >
          <Icon icon="heroicons:x-mark" size="sm" aria-hidden="true" />
        </button>

        <button
          class="cursor-pointer absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Previous photo"
          @click="prevImage"
        >
          <Icon icon="heroicons:chevron-left" />
        </button>

        <img
          loading="lazy"
          :src="selectedProperty.images[lightboxIndex]"
          :alt="`${selectedProperty.title} — photo ${lightboxIndex + 1} of ${selectedProperty.images.length}`"
          class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />

        <button
          class="cursor-pointer absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Next photo"
          @click="nextImage"
        >
          <Icon icon="heroicons:chevron-right" />
        </button>

        <p
          class="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs text-white"
        >
          {{ lightboxIndex + 1 }} / {{ selectedProperty.images.length }}
        </p>
      </div>
    </Teleport>

    <!-- Property Detail View -->
    <template v-if="selectedProperty">
      <Section>
        <div class="mx-auto max-w-5xl">
          <button
            class="text-primary cursor-pointer mb-6 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
            @click="backToListings"
          >
            <span>&larr;</span> Back to Listings
          </button>

          <!-- Hero image (clickable) -->
          <div
            class="relative cursor-pointer overflow-hidden rounded-lg"
            role="button"
            tabindex="0"
            :aria-label="`View all ${selectedProperty.images.length} photos`"
            @click="openLightbox(0)"
            @keydown.enter.self.prevent="openLightbox(0)"
            @keydown.space.self.prevent="openLightbox(0)"
          >
            <img
              loading="lazy"
              :src="selectedProperty.images[0]"
              :alt="selectedProperty.alt"
              class="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.02] sm:aspect-[21/9]"
            />
            <span
              class="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white"
            >
              {{ selectedProperty.images.length }} photos — click to browse
            </span>
            <!-- Virtual tour button -->
            <button
              v-if="selectedProperty.hasVirtualTour"
              class="text-foreground cursor-pointer absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium shadow-md transition-colors hover:bg-white"
              @click.stop
            >
              <Icon icon="heroicons:play-circle" size="sm" aria-hidden="true" />
              Virtual Tour
            </button>
          </div>

          <!-- Thumbnail gallery -->
          <div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            <button
              v-for="(img, i) in selectedProperty.images.slice(0, 6)"
              :key="i"
              class="cursor-pointer overflow-hidden rounded-md transition-opacity"
              :class="
                i === lightboxIndex
                  ? 'ring-2 ring-primary ring-offset-1'
                  : 'opacity-70 hover:opacity-100'
              "
              :aria-current="i === lightboxIndex ? 'true' : undefined"
              :aria-label="`View photo ${i + 1}${i === lightboxIndex ? ' (current)' : ''}`"
              @click="openLightbox(i)"
            >
              <img
                :src="img"
                :alt="`${selectedProperty.title} — photo ${i + 1}`"
                class="aspect-[4/3] w-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </button>
          </div>

          <!-- Info grid -->
          <div class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <!-- Left: details -->
            <div class="lg:col-span-2">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-3">
                    <h1 class="font-serif text-3xl font-bold">{{ selectedProperty.title }}</h1>
                    <Badge
                      v-if="selectedProperty.tag"
                      size="sm"
                      :variant="tagVariants[selectedProperty.tagType] || undefined"
                    >
                      {{ selectedProperty.tag }}
                    </Badge>
                  </div>
                  <p class="mt-1 text-sm">
                    {{ selectedProperty.address }} · {{ selectedProperty.neighborhood }}
                  </p>
                  <p class="text-muted-foreground mt-1 font-mono text-xs">
                    MLS# {{ selectedProperty.mls }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-primary text-3xl font-bold">
                    {{ selectedProperty.price }}
                  </p>
                  <p class="mt-1 text-xs">
                    ${{ selectedProperty.pricePerSqft }}/sqft · {{ selectedProperty.dom }} days on
                    market
                  </p>
                </div>
              </div>

              <!-- Quick stats -->
              <div class="bg-card mt-6 flex flex-wrap gap-6 rounded-lg p-4 text-sm">
                <span class="font-medium">{{ selectedProperty.beds }} Bedrooms</span>
                <span class="font-medium">{{ selectedProperty.baths }} Bathrooms</span>
                <span class="font-medium">{{ selectedProperty.sqft }} sqft</span>
                <span class="font-medium">Built {{ selectedProperty.yearBuilt }}</span>
                <span class="font-medium">{{ selectedProperty.lotSize }}</span>
                <span class="font-medium">Tax: {{ selectedProperty.propertyTax }}</span>
              </div>

              <Divider class="my-6" />
              <p class="text-base leading-relaxed">{{ selectedProperty.description }}</p>

              <!-- Features -->
              <h2 class="mt-8 font-serif text-xl font-semibold">Property Features</h2>
              <ul class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <li
                  v-for="f in selectedProperty.features"
                  :key="f"
                  class="flex items-center gap-2 text-sm"
                >
                  <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
                  {{ f }}
                </li>
              </ul>

              <MapPlaceholder
                :address="`${selectedProperty.address}, Briar Cove, OR 97420`"
                :description="`${selectedProperty.neighborhood} neighborhood`"
                aspect="aspect-[16/7]"
                class="mt-8"
              />
            </div>

            <!-- Right sidebar -->
            <div class="space-y-6">
              <!-- Agent card -->
              <Card v-if="listingAgent" class="sticky top-24 p-6">
                <p class="text-xs font-medium uppercase tracking-wider">Listing Agent</p>
                <div class="mt-4 flex items-center gap-4">
                  <img
                    v-if="listingAgent.img"
                    loading="lazy"
                    :src="listingAgent.img"
                    :alt="`Photo of ${listingAgent.name}`"
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-semibold">{{ listingAgent.name }}</p>
                    <p class="text-primary text-xs">{{ listingAgent.role }}</p>
                  </div>
                </div>
                <Divider class="my-4" />
                <div class="space-y-2 text-sm">
                  <p>
                    <a
                      :href="`tel:${listingAgent.phone}`"
                      class="transition-colors hover:underline"
                      >{{ listingAgent.phone }}</a
                    >
                  </p>
                  <p>
                    <a
                      :href="`mailto:${listingAgent.email}`"
                      class="transition-colors hover:underline"
                      >{{ listingAgent.email }}</a
                    >
                  </p>
                </div>
                <Button
                  variant="primary"
                  class="mt-4 w-full"
                  @click="emit('navigate', `contact:property:${selectedProperty.title}`)"
                >
                  Schedule a Showing
                </Button>

                <!-- Inline inquiry form -->
                <Divider class="my-4" />
                <p class="text-xs font-medium uppercase tracking-wider">Ask About This Property</p>
                <form class="mt-3 space-y-3" aria-label="Property inquiry" @submit.prevent>
                  <Input placeholder="Your name" />
                  <Input placeholder="Email address" type="email" />
                  <Input placeholder="Phone number" type="tel" />
                  <Button variant="secondary" class="w-full" size="sm" type="submit"
                    >Send Message</Button
                  >
                </form>
              </Card>

              <!-- Mortgage calculator -->
              <Card class="p-6">
                <p class="text-xs font-medium uppercase tracking-wider">Payment Estimate</p>
                <span data-rig-accent class="mt-2 block h-0.5 w-8" aria-hidden="true" />
                <p class="text-primary mt-4 font-serif text-2xl font-bold">
                  {{ formatCurrency(monthlyPayment)
                  }}<span class="text-sm font-normal font-sans">/mo</span>
                </p>

                <div class="mt-5 space-y-4">
                  <div>
                    <label class="flex items-center justify-between text-xs">
                      <span>Down payment</span>
                      <span class="text-primary font-medium">{{ downPaymentPct }}%</span>
                    </label>
                    <input
                      v-model.number="downPaymentPct"
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      class="range-primary mt-1.5 w-full"
                    />
                  </div>
                  <div>
                    <label class="flex items-center justify-between text-xs">
                      <span>Interest rate</span>
                      <span class="text-primary font-medium">{{ interestRate }}%</span>
                    </label>
                    <input
                      v-model.number="interestRate"
                      type="range"
                      min="3"
                      max="9"
                      step="0.25"
                      class="range-primary mt-1.5 w-full"
                    />
                  </div>
                  <ToggleGroup
                    v-model="loanTerm"
                    :items="[
                      { value: '15', label: '15-year' },
                      { value: '30', label: '30-year' },
                    ]"
                  />
                </div>
                <p class="text-muted-foreground mt-4 text-xs leading-relaxed">
                  Estimate only. Does not include taxes, insurance, or HOA.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </template>

    <!-- Listings Grid View -->
    <template v-else>
      <Section>
        <div class="mx-auto max-w-6xl">
          <h1 class="font-serif text-3xl font-bold">
            All Listings
            <span data-rig-accent class="mt-3 block h-0.5 w-12" />
          </h1>
          <p class="mt-2 text-sm">
            {{ filteredProperties.length }} properties in Briar Cove and surrounding areas
          </p>

          <!-- Filter bar -->
          <div
            class="bg-card border-border mt-8 flex flex-wrap items-end gap-4 rounded-lg border p-4"
          >
            <div class="w-full sm:min-w-[200px] sm:flex-1">
              <label for="listing-search" class="mb-1 block text-xs font-medium">Search</label>
              <Input
                id="listing-search"
                v-model="searchQuery"
                placeholder="Address, neighborhood, keyword..."
              />
            </div>
            <div>
              <label for="filter-neighborhood" class="mb-1 block text-xs font-medium"
                >Neighborhood</label
              >
              <Select
                id="filter-neighborhood"
                v-model="filterNeighborhood"
                :options="neighborhoodOptions"
                placeholder="All areas"
              />
            </div>
            <div>
              <label for="filter-beds" class="mb-1 block text-xs font-medium">Bedrooms</label>
              <Select
                id="filter-beds"
                v-model="filterBeds"
                :options="bedOptions"
                placeholder="Any"
              />
            </div>
            <div>
              <label for="filter-price" class="mb-1 block text-xs font-medium">Price</label>
              <Select
                id="filter-price"
                v-model="filterPrice"
                :options="priceOptions"
                placeholder="Any price"
              />
            </div>
            <Button
              v-if="openHouseCount"
              :variant="filterOpenHouse ? 'primary' : 'secondary'"
              :aria-pressed="filterOpenHouse"
              size="sm"
              @click="filterOpenHouse = !filterOpenHouse"
            >
              Open Houses ({{ openHouseCount }})
            </Button>
            <Button v-if="hasActiveFilters" variant="secondary" size="sm" @click="clearFilters">
              Clear
            </Button>
          </div>

          <!-- Saved search alert -->
          <div
            class="bg-primary/6 border-primary/15 mt-4 flex flex-col items-start gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
          >
            <div class="flex items-center gap-2">
              <Icon icon="heroicons:bell" size="sm" aria-hidden="true" />
              <p class="text-xs font-medium">Get notified when new listings match your search</p>
            </div>
            <template v-if="!savedSearchSubmitted">
              <form class="flex gap-2" @submit.prevent="submitSavedSearch">
                <Input
                  v-model="savedSearchEmail"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
                <Button variant="primary" size="sm" type="submit">Alert Me</Button>
              </form>
            </template>
            <p v-else class="text-primary text-xs font-medium">
              Alerts saved — we will email you when new listings match.
            </p>
          </div>

          <!-- Results grid -->
          <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="p in filteredProperties"
              :key="p.id"
              interactive
              class="group overflow-hidden"
              @click="selectProperty(p)"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="p.img"
                  :alt="p.alt"
                  class="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <Badge
                  v-if="p.tag"
                  size="sm"
                  class="absolute left-3 top-3"
                  :class="p.tagType === 'pending' ? 'opacity-85' : ''"
                  :variant="tagVariants[p.tagType] || undefined"
                >
                  {{ p.tag }}
                </Badge>
                <!-- Photo count -->
                <span
                  class="bg-black/60 absolute bottom-3 right-3 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                >
                  {{ p.images.length }} photos
                </span>
                <!-- Urgency indicator -->
                <span
                  v-if="p.dom <= 7"
                  class="bg-accent/90 text-accent-foreground absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  New this week
                </span>
                <!-- Favorite toggle -->
                <button
                  class="cursor-pointer absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110"
                  :class="favorites.has(p.id) ? 'bg-primary' : 'bg-black/40'"
                  :aria-label="
                    favorites.has(p.id) ? `Remove ${p.title} from favorites` : `Save ${p.title}`
                  "
                  @click="toggleFavorite(p.id, $event)"
                >
                  <Icon icon="heroicons:heart" size="sm" aria-hidden="true" />
                </button>
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
                    <span>{{ p.sqft }}</span>
                    <span class="text-muted-foreground text-xs">${{ p.pricePerSqft }}/sqft</span>
                  </p>
                  <span class="text-muted-foreground text-xs">{{ p.dom }}d on market</span>
                </div>
              </div>
            </Card>
          </div>

          <!-- Empty state -->
          <div v-if="filteredProperties.length === 0" class="py-16 text-center">
            <p class="text-lg font-medium">No properties match your filters</p>
            <p class="mt-2 text-sm">Try adjusting your search or clearing filters.</p>
            <Button variant="secondary" class="mt-4" @click="clearFilters">Clear Filters</Button>
          </div>
        </div>
      </Section>

      <!-- Recently Sold -->
      <Section variant="alternate">
        <div class="mx-auto max-w-6xl">
          <h2 class="font-serif text-2xl font-semibold">
            Recently Sold
            <span data-rig-accent class="mt-3 block h-0.5 w-12" />
          </h2>
          <p class="mt-2 text-sm">Recent closings handled by Tidemark Realty</p>

          <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card v-for="sp in soldProperties" :key="sp.id" class="overflow-hidden">
              <div class="relative overflow-hidden">
                <img
                  :src="sp.img"
                  :alt="sp.title"
                  class="aspect-[16/10] w-full object-cover grayscale-[30%]"
                  loading="lazy"
                />
                <Badge size="sm" class="bg-muted text-muted-foreground absolute left-3 top-3">
                  Sold
                </Badge>
              </div>
              <div class="p-5">
                <h3 class="font-semibold">{{ sp.title }}</h3>
                <p class="mt-1 text-xs">{{ sp.neighborhood }}</p>
                <Divider class="my-3" />
                <div class="flex items-center justify-between text-sm">
                  <span class="font-bold">{{ sp.soldPrice }}</span>
                  <span class="text-xs">{{ sp.soldDate }}</span>
                </div>
                <p class="mt-2 text-xs">
                  {{ sp.beds }} bd · {{ sp.baths }} ba · {{ sp.sqft }} sqft
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </template>
  </div>
</template>
