<script setup lang="ts">
import { ref } from 'vue'
import { Button, Badge, Icon, Section } from '@amulet-laboratories/rig'
import { services } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const expandedService = ref<string | null>(null)
const toggleService = (id: string) => {
  expandedService.value = expandedService.value === id ? null : id
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">Services</p>
        <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />
        <h1 class="mt-6 text-3xl font-extralight uppercase tracking-widest">What We Investigate</h1>
        <p class="mt-4 text-sm leading-relaxed">
          Duskline handles civil and domestic investigations only. Each case is managed personally
          by Jack Maren — no subcontractors, no junior associates, no handoffs.
        </p>

        <div class="mt-10 space-y-0">
          <div
            v-for="(s, i) in services"
            :key="s.id"
            class="border-t border-border py-8 transition-all"
            :class="expandedService === s.id ? 'bg-card -mx-6 px-6 rounded' : ''"
          >
            <button
              class="cursor-pointer flex w-full items-start gap-8 text-left transition-colors hover:opacity-90 sm:gap-12"
              :aria-expanded="expandedService === s.id"
              :aria-controls="`service-panel-${s.id}`"
              @click="toggleService(s.id)"
            >
              <span
                class="flex-shrink-0 font-mono text-2xl font-extralight tabular-nums text-primary"
                aria-hidden="true"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-light uppercase tracking-wide">{{ s.title }}</h2>
                  <Icon
                    icon="heroicons:chevron-down"
                    size="sm"
                    aria-hidden="true"
                    class="transition-transform"
                    :class="{ 'rotate-180': expandedService === s.id }"
                  />
                </div>
                <p class="mt-3 text-sm leading-relaxed">{{ s.description }}</p>
              </div>
            </button>

            <!-- Expanded detail -->
            <div
              v-if="expandedService === s.id"
              :id="`service-panel-${s.id}`"
              role="region"
              :aria-label="`${s.title} details`"
              class="mt-6 ml-16 sm:ml-20"
            >
              <div data-rig-accent class="mb-4 h-px w-8" aria-hidden="true" />
              <p class="text-sm leading-relaxed">{{ s.detail }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <Badge v-for="ct in s.caseTypes" :key="ct" size="sm" variant="primary">
                  {{ ct }}
                </Badge>
              </div>
              <Button
                variant="secondary"
                size="sm"
                class="mt-6"
                @click.stop="emit('navigate', 'contact')"
              >
                Inquire About {{ s.title }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
