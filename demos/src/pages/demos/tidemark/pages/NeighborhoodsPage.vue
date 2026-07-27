<script setup lang="ts">
import { Button, Card, Badge, Divider, Section } from '@amulet-laboratories/rig'
import { neighborhoods, properties } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

function listingCount(neighborhoodTitle: string): number {
  return properties.filter((p) => p.neighborhood === neighborhoodTitle).length
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-5xl">
        <h1 class="text-center font-serif text-3xl font-bold">
          Neighborhood Guides
          <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" />
        </h1>
        <p class="mt-3 text-center text-sm">
          Four distinct neighborhoods, each with its own character. All within a few miles of each
          other.
        </p>

        <div class="mt-12 space-y-10">
          <Card
            v-for="hood in neighborhoods"
            :key="hood.id"
            class="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          >
            <!-- Image + overlay -->
            <div class="group relative overflow-hidden">
              <img
                :src="hood.img"
                :alt="hood.imgAlt"
                class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-[21/9]"
                loading="lazy"
              />
              <div class="overlay-bottom absolute inset-0" />
              <div class="absolute bottom-0 left-0 p-6">
                <h2 class="font-serif text-2xl font-bold text-white">{{ hood.title }}</h2>
                <div class="mt-2 flex flex-wrap gap-2">
                  <Badge
                    v-for="tag in hood.lifestyleTags"
                    :key="tag"
                    size="sm"
                    class="bg-white/20 text-white"
                  >
                    {{ tag }}
                  </Badge>
                </div>
              </div>
            </div>

            <div class="p-6">
              <p class="text-sm leading-relaxed">{{ hood.description }}</p>

              <Divider class="my-5" />

              <!-- Data grid -->
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider">Median Price</p>
                  <p class="text-primary mt-1 font-serif text-2xl font-bold">
                    {{ hood.medianPrice }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider">Price/sqft</p>
                  <p class="mt-1 text-sm font-medium">{{ hood.medianPricePerSqft }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider">Walkability</p>
                  <p class="mt-1 text-sm font-medium">{{ hood.walkability }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider">Schools</p>
                  <p class="mt-1 text-sm font-medium">{{ hood.schoolDistrict }}</p>
                  <p class="text-primary text-xs">Rating: {{ hood.schoolRating }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wider">Listings</p>
                  <p class="text-primary mt-1 text-lg font-bold">
                    {{ listingCount(hood.title) }}
                  </p>
                </div>
              </div>

              <Divider class="my-5" />

              <!-- Amenities -->
              <p class="text-xs font-medium uppercase tracking-wider">Nearby</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="a in hood.amenities"
                  :key="a"
                  class="bg-card rounded-md px-3 py-1 text-xs"
                >
                  {{ a }}
                </span>
              </div>

              <div class="mt-6">
                <Button
                  variant="primary"
                  size="sm"
                  @click="emit('navigate', `listings:${hood.title}`)"
                >
                  View {{ hood.title }} Listings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  </div>
</template>
