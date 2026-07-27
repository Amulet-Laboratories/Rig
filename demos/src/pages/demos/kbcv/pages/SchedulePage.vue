<script setup lang="ts">
import { Section, Button, CTABanner, Divider } from '@amulet-laboratories/rig'
import { days, hours, showAt } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <h1 class="sr-only">Weekly Schedule</h1>

  <!-- Schedule Header -->
  <Section
    variant="alternate"
    title="Weekly Schedule"
    subtitle="KBCV 91.7 FM broadcasts seven days a week from 6am to midnight."
  />

  <!-- Full Schedule Grid -->
  <Section>
    <div class="mx-auto max-w-6xl">
      <div class="overflow-x-auto">
        <table class="font-mono w-full min-w-3xl border-collapse text-xs">
          <caption class="sr-only">
            KBCV 91.7 FM weekly broadcast schedule
          </caption>
          <thead>
            <tr>
              <th scope="col" class="border-b p-2 text-left font-bold">
                <span class="sr-only">Time</span>
              </th>
              <th
                v-for="day in days"
                :key="day"
                scope="col"
                class="text-primary border-b p-2 text-center font-bold"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(hour, hi) in hours" :key="hour">
              <th scope="row" class="border-muted border-b p-2 text-left font-medium">
                {{ hour }}
              </th>
              <td v-for="day in days" :key="day" class="border-muted border-b p-2 text-center">
                {{ showAt(day, hi) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Section>

  <!-- Featured Shows Link -->
  <Section variant="alternate">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold">Featured Shows</h2>
      <Divider class="mx-auto my-4 max-w-20" />
      <p class="text-sm leading-relaxed">
        KBCV produces over 40 hours of original programming each week, from morning jazz to
        late-night experimental music. Meet the hosts and explore the full lineup.
      </p>
      <Button variant="outline" class="mt-6" @click="emit('navigate', 'shows')">
        Browse All Shows
      </Button>
    </div>
  </Section>

  <!-- CTA Banner -->
  <CTABanner layout="centered">
    <h2 class="text-2xl font-bold">Want to hear something different?</h2>
    <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed">
      We are always looking for new voices. If you have an idea for a show, we want to hear it.
    </p>
    <template #action>
      <Button variant="primary" size="lg" @click="emit('navigate', 'support')">
        Pitch a Show
      </Button>
    </template>
  </CTABanner>
</template>
