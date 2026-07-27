<script setup lang="ts">
import { Button, Card, Badge, Icon, Ornament, Section, FeatureList } from '@amulet-laboratories/rig'
import { rooms, allAmenities } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <div>
    <!-- Header -->
    <Section variant="alternate">
      <div class="text-center">
        <p class="text-xs font-light uppercase">Accommodations</p>
        <h1 class="mt-4 font-serif text-4xl font-light sm:text-5xl">Rooms & Suites</h1>
        <Ornament variant="rule" size="sm" />
        <p class="mx-auto mt-4 max-w-lg text-sm font-light">
          Five distinct rooms, each with its own character. All share ocean air, quality linens, and
          our attention to the details that matter.
        </p>
      </div>
    </Section>

    <!-- Room cards -->
    <Section>
      <div class="mx-auto max-w-5xl space-y-12">
        <Card v-for="r in rooms" :key="r.id" class="scroll-reveal overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-2">
            <img
              :src="r.img"
              :alt="r.name"
              class="h-64 w-full object-cover sm:h-full"
              loading="lazy"
            />
            <div class="p-6 sm:p-8">
              <div class="flex items-start justify-between">
                <div>
                  <h2 class="text-xl font-normal">{{ r.name }}</h2>
                  <div class="mt-1 flex items-center gap-2">
                    <Badge v-if="r.signature" variant="default">Signature</Badge>
                    <span class="text-muted-foreground text-xs font-light"
                      >{{ r.size }} · {{ r.sleeps }}</span
                    >
                  </div>
                </div>
                <span class="text-lg">{{ r.rate }}</span>
              </div>
              <p class="mt-4 text-sm font-light leading-relaxed">{{ r.description }}</p>
              <div class="mt-6">
                <p class="text-xs font-light uppercase">Room Amenities</p>
                <FeatureList :items="r.amenities" layout="grid" :columns="2" class="mt-2">
                  <template #icon>
                    <Ornament variant="rule" size="sm" />
                  </template>
                </FeatureList>
              </div>
              <Button variant="primary" size="sm" class="mt-6" @click="emit('navigate', 'reserve')">
                Book This Room
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Section>

    <!-- All amenities -->
    <Section variant="alternate" title="Every Stay Includes">
      <div class="mx-auto max-w-3xl">
        <FeatureList :items="allAmenities" layout="grid" :columns="2" class="mt-8 text-left">
          <template #icon>
            <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
          </template>
        </FeatureList>
      </div>
    </Section>

    <!-- Policies & CTA -->
    <Section>
      <div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
        <div class="scroll-reveal text-center">
          <p class="text-xs font-light uppercase">Check-in</p>
          <p class="mt-2 text-lg font-light">3:00 PM</p>
        </div>
        <div class="scroll-reveal text-center">
          <p class="text-xs font-light uppercase">Check-out</p>
          <p class="mt-2 text-lg font-light">11:00 AM</p>
        </div>
        <div class="scroll-reveal text-center">
          <p class="text-xs font-light uppercase">Pets</p>
          <p class="mt-2 text-lg font-light">Garden Cottage</p>
          <p class="mt-1 text-xs font-light">$50/night pet fee</p>
        </div>
      </div>
      <div class="mt-10 text-center">
        <Button variant="primary" size="lg" @click="emit('navigate', 'reserve')"
          >Check Availability</Button
        >
      </div>
    </Section>
  </div>
</template>
