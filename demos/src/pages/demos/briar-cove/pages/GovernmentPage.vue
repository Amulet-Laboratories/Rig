<script setup lang="ts">
import { Card, Badge, Divider, Section } from '@amulet-laboratories/rig'
import { officials, departments } from '../data'

const council = officials.filter((o) => o.role !== 'City Manager')
const cityManager = officials.find((o) => o.role === 'City Manager')
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- City Council -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h1 class="font-serif text-3xl font-bold">City Government</h1>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          Briar Cove operates under a Council-Manager form of government. The City Council is the
          elected legislative and policy-making body. The City Manager oversees daily operations.
        </p>

        <h2 class="mt-12 font-serif text-2xl font-bold">City Council</h2>
        <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="official in council" :key="official.id" class="overflow-hidden">
            <img
              :src="official.img"
              :alt="`Photo of ${official.name}`"
              class="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div class="p-5">
              <h3 class="font-serif text-lg font-semibold">{{ official.name }}</h3>
              <p class="text-primary text-sm font-medium">{{ official.role }}</p>
              <p class="text-muted-foreground mt-1 text-xs">Term: {{ official.term }}</p>
              <p class="mt-3 text-xs leading-relaxed">{{ official.bio }}</p>
              <Divider class="my-3" />
              <p class="text-xs font-medium">Committees</p>
              <div class="mt-1.5 flex flex-wrap gap-1.5">
                <Badge v-for="c in official.committees" :key="c" size="sm" class="bg-secondary">
                  {{ c }}
                </Badge>
              </div>
              <p class="mt-3 text-xs">
                <a
                  :href="`mailto:${official.email}`"
                  class="text-primary transition-colors hover:underline"
                >
                  {{ official.email }}
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- City Manager -->
    <Section v-if="cityManager" variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-bold">City Manager</h2>
        <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />

        <Card class="mt-8 overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-4">
            <img
              :src="cityManager.img"
              :alt="`Photo of ${cityManager.name}`"
              class="aspect-[3/4] w-full object-cover sm:col-span-1"
              loading="lazy"
            />
            <div class="p-6 sm:col-span-3">
              <h3 class="font-serif text-2xl font-semibold">{{ cityManager.name }}</h3>
              <p class="text-primary text-sm font-medium">
                {{ cityManager.role }} · {{ cityManager.term }}
              </p>
              <p class="mt-4 text-sm leading-relaxed">{{ cityManager.bio }}</p>
              <Divider class="my-4" />
              <p class="text-xs font-medium">Department Oversight</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <Badge v-for="d in departments" :key="d.id" size="sm" class="bg-secondary">
                  {{ d.title }}
                </Badge>
              </div>
              <p class="mt-4 text-xs">
                <a
                  :href="`mailto:${cityManager.email}`"
                  class="text-primary transition-colors hover:underline"
                >
                  {{ cityManager.email }}
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Section>

    <!-- Org Chart placeholder -->
    <Section>
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="font-serif text-2xl font-bold">Organizational Structure</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true" />
        <div
          class="bg-card border border-border mt-8 flex min-h-48 items-center justify-center rounded-lg sm:aspect-[16/7] sm:min-h-0"
        >
          <div class="text-center">
            <p class="text-primary font-serif text-lg font-semibold">Citizens of Briar Cove</p>
            <p class="text-muted-foreground mt-1 text-xs" aria-hidden="true">&darr;</p>
            <p class="text-sm font-medium">Mayor & City Council (5 elected)</p>
            <p class="text-muted-foreground mt-1 text-xs" aria-hidden="true">&darr;</p>
            <p class="text-sm font-medium">City Manager (appointed)</p>
            <p class="text-muted-foreground mt-1 text-xs" aria-hidden="true">&darr;</p>
            <p class="text-xs">6 Departments · 48 full-time employees</p>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
