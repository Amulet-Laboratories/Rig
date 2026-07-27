<script setup lang="ts">
import { computed } from 'vue'
import { Button, Divider, Section, Badge, StatRow } from '@amulet-laboratories/rig'
import { agent, properties, heroStats } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const activeListings = computed(() => properties.filter((p) => p.tagType !== 'pending'))
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <!-- Photo -->
          <div class="lg:col-span-2">
            <img
              v-if="agent.img"
              loading="lazy"
              :src="agent.img"
              :alt="`Photo of ${agent.name}`"
              class="aspect-[3/4] w-full rounded-lg object-cover"
            />
          </div>

          <!-- Bio -->
          <div class="lg:col-span-3">
            <h1 class="font-serif text-3xl font-bold">
              {{ agent.name }}
              <span data-rig-accent class="mt-3 block h-0.5 w-12" />
            </h1>
            <p class="text-primary mt-2 text-sm font-medium">
              {{ agent.role }} · {{ agent.years }} years on the Oregon coast
            </p>

            <p class="mt-6 text-base leading-relaxed">{{ agent.bio }}</p>

            <p class="mt-4 text-sm leading-relaxed">
              Whether you are buying your first home, selling a family property, or relocating from
              out of state, you will work directly with me from first showing to closing day. No
              hand-offs, no team runaround — just one broker who knows this market inside out.
            </p>

            <!-- Specialties -->
            <div class="mt-6">
              <p class="text-xs font-medium uppercase tracking-eyebrow-lg">Specialties</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <Badge v-for="s in agent.specialties" :key="s" size="sm" class="bg-card">
                  {{ s }}
                </Badge>
              </div>
            </div>

            <Divider class="my-6" />

            <!-- Contact -->
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <a
                :href="`tel:${agent.phone}`"
                class="text-primary transition-colors hover:underline"
              >
                {{ agent.phone }}
              </a>
              <a
                :href="`mailto:${agent.email}`"
                class="text-primary transition-colors hover:underline"
              >
                {{ agent.email }}
              </a>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" @click="emit('navigate', 'contact')"> Get in Touch </Button>
              <Button variant="secondary" @click="emit('navigate', 'listings')">
                View Listings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <!-- Stats -->
    <StatRow :stats="heroStats" variant="filled" />

    <!-- Active Listings -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-semibold">
          Active Listings
          <span data-rig-accent class="mt-3 block h-0.5 w-12" />
        </h2>
        <p class="mt-2 text-sm">{{ activeListings.length }} properties currently on the market</p>

        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <button
            v-for="listing in activeListings"
            :key="listing.id"
            :aria-label="`View ${listing.title}`"
            class="cursor-pointer overflow-hidden rounded-lg text-left transition-shadow hover:shadow-md"
            @click="emit('navigate', `listings:property:${listing.id}`)"
          >
            <img
              :src="listing.img"
              :alt="listing.title"
              class="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div class="bg-card p-4">
              <p class="font-serif text-sm font-semibold">{{ listing.title }}</p>
              <p class="text-primary text-sm font-bold">{{ listing.price }}</p>
              <p class="text-muted-foreground mt-1 text-xs">
                {{ listing.beds }} bd · {{ listing.baths }} ba · {{ listing.neighborhood }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </Section>
  </div>
</template>
