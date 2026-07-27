<script setup lang="ts">
import { Card, Icon, Section, Divider, Button } from '@amulet-laboratories/rig'
import { marketStats, quarterly, marketInterpretation } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-4xl text-center">
        <h1 class="font-serif text-3xl font-bold">
          Briar Cove Market Snapshot
          <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" />
        </h1>
        <p class="mt-3 text-sm">Current conditions for the greater Briar Cove housing market</p>

        <!-- Current stats -->
        <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            v-for="stat in marketStats"
            :key="stat.label"
            class="p-5 text-center transition-shadow duration-300 hover:shadow-md"
          >
            <p class="text-primary text-2xl font-bold">{{ stat.value }}</p>
            <p class="mt-1 text-xs font-medium uppercase tracking-wider">{{ stat.label }}</p>
            <p v-if="stat.change" class="text-accent mt-2 text-xs font-medium">
              {{ stat.change }}
            </p>
          </Card>
        </div>
      </div>
    </Section>

    <!-- What this means -->
    <Section variant="alternate">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-center font-serif text-2xl font-semibold">
          What This Means for You
          <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" />
        </h2>
        <p class="mt-6 text-center text-base leading-relaxed">
          {{ marketInterpretation.summary }}
        </p>

        <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card class="p-6 transition-shadow duration-300 hover:shadow-md">
            <div class="flex items-center gap-3">
              <div
                class="bg-primary/12 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
              >
                <Icon icon="heroicons:home" size="sm" aria-hidden="true" />
              </div>
              <h3 class="font-serif text-lg font-semibold">For Buyers</h3>
            </div>
            <p class="mt-4 text-sm leading-relaxed">{{ marketInterpretation.buyerTip }}</p>
          </Card>
          <Card class="p-6 transition-shadow duration-300 hover:shadow-md">
            <div class="flex items-center gap-3">
              <div
                class="bg-accent/12 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
              >
                <Icon icon="heroicons:currency-dollar" size="sm" aria-hidden="true" />
              </div>
              <h3 class="font-serif text-lg font-semibold">For Sellers</h3>
            </div>
            <p class="mt-4 text-sm leading-relaxed">{{ marketInterpretation.sellerTip }}</p>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Quarterly breakdown -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h2 class="text-center font-serif text-2xl font-semibold">
          Quarterly Summary
          <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" />
        </h2>

        <div class="mt-8 overflow-x-auto">
          <table class="w-full font-mono text-sm">
            <caption class="sr-only">
              Briar Cove quarterly real estate market data
            </caption>
            <thead>
              <tr class="border-b border-border">
                <th class="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider">
                  Quarter
                </th>
                <th class="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider">
                  Median Price
                </th>
                <th class="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider">
                  Homes Sold
                </th>
                <th class="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider">
                  Avg. DOM
                </th>
                <th class="py-3 pl-4 text-right text-xs font-medium uppercase tracking-wider">
                  Sale-to-List
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="q in quarterly"
                :key="q.quarter"
                class="border-b border-border transition-colors hover:bg-card"
              >
                <td class="py-3 pr-4 font-medium">{{ q.quarter }}</td>
                <td class="py-3 px-4 text-right">{{ q.median }}</td>
                <td class="py-3 px-4 text-right">{{ q.sold }}</td>
                <td class="py-3 px-4 text-right">{{ q.avgDom }} days</td>
                <td class="py-3 pl-4 text-right">{{ q.saleToList }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Divider class="my-8" />

        <div class="text-center">
          <p class="text-xs leading-relaxed">
            Data reflects Briar Cove and surrounding areas. Updated quarterly. Not a substitute for
            a professional market analysis. Contact Dana for a personalized assessment.
          </p>
          <Button variant="primary" class="mt-6" @click="emit('navigate', 'contact')">
            Request a Market Analysis
          </Button>
        </div>
      </div>
    </Section>
  </div>
</template>
