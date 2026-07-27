<script setup lang="ts">
import {
  Section,
  Button,
  Badge,
  Divider,
  Gallery,
  Icon,
  useDetailView,
} from '@amulet-laboratories/rig'
import { exhibitions } from '../data'
import type { Exhibition } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const {
  selected: selectedSeries,
  select: selectSeries,
  back: backToWork,
} = useDetailView<Exhibition>()

function thumbCrop(url: string, index: number): string {
  const crops = ['&crop=entropy', '&crop=top', '&crop=bottom', '&crop=left']
  return url
    .replace('&fit=crop', `&fit=crop${crops[index % crops.length]}`)
    .replace('w=800', 'w=300')
}
</script>

<template>
  <div>
    <!-- Series Detail View -->
    <template v-if="selectedSeries">
      <Section>
        <div class="mx-auto max-w-5xl">
          <button
            class="text-accent mb-8 inline-flex items-center gap-2 text-xs uppercase transition-colors"
            @click="backToWork"
          >
            <span>&larr;</span> All Series
          </button>

          <div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
            <!-- Images -->
            <div>
              <div class="overflow-hidden">
                <img
                  loading="lazy"
                  :src="selectedSeries.img"
                  :alt="selectedSeries.imgAlt ?? selectedSeries.title ?? ''"
                  class="aspect-[4/5] w-full object-cover"
                />
              </div>

              <!-- Thumbnail strip -->
              <div class="mt-3 grid grid-cols-4 gap-2">
                <div v-for="i in 4" :key="i" class="overflow-hidden">
                  <img
                    :src="thumbCrop(selectedSeries.img ?? '', i)"
                    :alt="`${selectedSeries.title} — detail ${i}`"
                    class="aspect-square w-full object-cover opacity-70 transition-opacity hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <!-- Info -->
            <div>
              <p class="text-muted-foreground text-xs tabular-nums">{{ selectedSeries.year }}</p>
              <h1 class="mt-2 text-4xl font-normal italic tracking-tight sm:text-5xl">
                {{ selectedSeries.title }}
              </h1>
              <p class="mt-2 text-xs uppercase">{{ selectedSeries.count }} works</p>

              <div class="mt-2 flex flex-wrap gap-2">
                <Badge size="sm" class="bg-card">
                  {{ selectedSeries.medium }}
                </Badge>
                <Badge v-if="selectedSeries.available" size="sm" class="bg-accent/12 text-accent">
                  Works Available
                </Badge>
              </div>

              <Divider class="my-6" />

              <p class="text-sm leading-body-loose">{{ selectedSeries.description }}</p>

              <p class="text-muted-foreground mt-4 text-xs">
                Exhibited at {{ selectedSeries.venue }}
              </p>

              <Divider class="my-6" />

              <div class="flex gap-3">
                <Button
                  v-if="selectedSeries.available"
                  variant="primary"
                  size="sm"
                  @click="emit('navigate', 'contact')"
                >
                  Inquire About Available Works
                </Button>
                <Button variant="secondary" size="sm" @click="emit('navigate', 'contact')">
                  Press / Reproduction Rights
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </template>

    <!-- Gallery Overview -->
    <template v-else>
      <Section>
        <div class="mx-auto max-w-5xl">
          <p class="text-xs uppercase tracking-eyebrow-lg scroll-reveal">Selected Series</p>
          <Divider class="mt-3" />

          <Gallery :items="exhibitions" layout="alternating" class="mt-16">
            <template #image="{ item, index }">
              <button
                class="group block w-full overflow-hidden text-left scroll-reveal"
                :aria-label="`View ${item.title} series`"
                @click="selectSeries(item as Exhibition)"
              >
                <img
                  :src="item.img"
                  :alt="item.imgAlt ?? item.title ?? ''"
                  class="w-full object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-95"
                  :class="index % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'"
                  loading="lazy"
                />
              </button>
            </template>
            <template #content="{ item }">
              <div class="scroll-reveal">
                <p class="text-muted-foreground text-xs tabular-nums">
                  {{ (item as Exhibition).year }}
                </p>
                <h2 class="mt-2 text-3xl font-normal italic sm:text-4xl">
                  {{ item.title }}
                </h2>
                <p class="mt-1 text-xs">
                  {{ (item as Exhibition).count }} works · {{ (item as Exhibition).medium }}
                </p>
                <Badge
                  v-if="(item as Exhibition).available"
                  size="sm"
                  class="bg-accent/12 text-accent mt-2"
                >
                  Works Available
                </Badge>
                <p class="mt-4 text-sm leading-body-loose">{{ item.description }}</p>
                <button
                  class="mt-6 inline-flex items-center gap-1.5 text-xs tracking-wider transition-colors hover:text-accent"
                  @click="selectSeries(item as Exhibition)"
                >
                  View series
                  <Icon icon="heroicons:arrow-right" size="sm" aria-hidden="true" />
                </button>
              </div>
            </template>
          </Gallery>
        </div>
      </Section>
    </template>
  </div>
</template>
