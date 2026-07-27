<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Icon, Section, CTABanner, Timeline } from '@amulet-laboratories/rig'
import { processSteps, faqItems } from '../data'

interface TimelineItem {
  label: string
  description?: string
  timestamp?: string
  status?: 'completed' | 'active' | 'pending'
}

const emit = defineEmits<{ navigate: [page: string] }>()

const openFaq = ref<number | null>(null)
const toggleFaq = (i: number) => {
  openFaq.value = openFaq.value === i ? null : i
}

const timelineItems = computed<TimelineItem[]>(() =>
  processSteps.map((s) => ({
    label: `${s.step} · ${s.title}`,
    description: s.description,
    status: 'pending',
  })),
)
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Process -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">How It Works</p>
        <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />
        <h1 class="mt-6 text-3xl font-extralight uppercase tracking-widest">The Process</h1>
        <p class="mt-4 text-sm leading-relaxed">
          Every investigation follows the same five-step framework. You know what to expect at each
          stage — no surprises, no hidden costs.
        </p>

        <Timeline :items="timelineItems" class="mt-10" />
      </div>
    </Section>

    <!-- FAQ -->
    <Section variant="alternate">
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">Frequently Asked</p>
        <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />

        <div class="mt-10 space-y-0">
          <div v-for="(faq, i) in faqItems" :key="faq.question" class="border-t border-border">
            <button
              class="cursor-pointer flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:opacity-90"
              :aria-expanded="openFaq === i"
              :aria-controls="`faq-panel-${i}`"
              @click="toggleFaq(i)"
            >
              <span class="text-sm font-medium">{{ faq.question }}</span>
              <Icon
                icon="heroicons:chevron-down"
                size="sm"
                aria-hidden="true"
                class="transition-transform"
                :class="{ 'rotate-180': openFaq === i }"
              />
            </button>
            <div v-if="openFaq === i" :id="`faq-panel-${i}`" role="region" class="pb-6">
              <p class="text-sm leading-relaxed text-muted-foreground">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <!-- Confidentiality statement -->
    <Section>
      <div class="mx-auto max-w-2xl text-center">
        <div data-rig-accent class="mx-auto h-px w-16" aria-hidden="true" />
        <p class="mt-6 text-xs font-medium uppercase tracking-widest text-primary">
          Confidentiality
        </p>
        <p class="mt-4 text-sm leading-relaxed">
          All communications between Duskline Investigations and its clients are strictly
          confidential. Case details, client identities, and investigation results are never
          disclosed to third parties without written client authorization or valid legal process.
        </p>
        <p class="mt-4 text-sm leading-relaxed">
          This website does not use cookies for tracking. Contact form submissions are encrypted in
          transit and stored on secure, access-controlled servers.
        </p>
        <div data-rig-accent class="mx-auto mt-6 h-px w-16" aria-hidden="true" />
      </div>
    </Section>

    <!-- CTA -->
    <CTABanner layout="centered" variant="card">
      <p class="text-xs uppercase tracking-widest text-primary">Ready to discuss your case?</p>
      <p class="mt-4 text-2xl font-extralight">
        <a href="tel:+15415550177" class="transition-colors hover:text-primary">(541) 555-0177</a>
      </p>
      <template #action>
        <Button variant="primary" @click="emit('navigate', 'contact')">Contact Form</Button>
      </template>
    </CTABanner>
  </div>
</template>
