<script setup lang="ts">
import { Card, Badge, Icon, Section } from '@amulet-laboratories/rig'
import { recurringEvents as recurring, upcomingEvents as upcoming } from '../data'

const iconMap: Record<string, string> = {
  music: 'heroicons:musical-note',
  puzzle: 'heroicons:puzzle-piece',
  beaker: 'heroicons:beaker',
  tag: 'heroicons:tag',
}

function getIconName(icon: string): string {
  return iconMap[icon] ?? 'heroicons:question-mark-circle'
}
</script>

<template>
  <h1 class="sr-only">Events</h1>

  <!-- Header -->
  <Section
    variant="alternate"
    title="Events"
    subtitle="Trivia, live music, tours, and the occasional cornhole tournament."
  />

  <!-- Recurring -->
  <Section title="Every Week">
    <div class="mx-auto max-w-3xl">
      <div class="mt-10 space-y-5">
        <Card
          v-for="e in recurring"
          :key="e.name"
          class="flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div
            class="bg-secondary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded"
          >
            <Icon :icon="getIconName(e.icon)" size="sm" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold">{{ e.name }}</h3>
                <p class="mt-0.5 text-xs">{{ e.day }}</p>
              </div>
              <span class="shrink-0 text-sm font-bold">{{ e.time }}</span>
            </div>
            <p class="mt-2 text-xs leading-relaxed">{{ e.description }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Upcoming -->
  <Section variant="alternate" title="Coming Up">
    <div class="mx-auto max-w-3xl">
      <div class="mt-10 space-y-5">
        <Card
          v-for="e in upcoming"
          :key="e.name"
          class="flex items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div
            class="bg-secondary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded"
          >
            <Icon :icon="getIconName(e.icon)" size="sm" aria-hidden="true" />
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold">{{ e.name }}</h3>
                <p class="mt-0.5 text-xs">{{ e.date }}</p>
              </div>
              <span class="shrink-0 text-sm font-bold">{{ e.time }}</span>
            </div>
            <p class="mt-2 text-xs leading-relaxed">{{ e.description }}</p>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Private events -->
  <Section title="Private Events">
    <div class="mx-auto max-w-xl text-center">
      <p class="text-sm leading-relaxed">
        The taproom is available for private events on Mondays and Tuesday evenings. Capacity: 60
        seated, 80 standing. Full bar and kitchen access included. Email
        <a
          href="mailto:events@undertowbrewing.com"
          class="font-semibold underline transition-opacity hover:opacity-70"
          >events@undertowbrewing.com</a
        >
        to inquire.
      </p>
      <Badge variant="secondary" class="mt-4">Minimum 2 weeks advance booking</Badge>
    </div>
  </Section>
</template>
