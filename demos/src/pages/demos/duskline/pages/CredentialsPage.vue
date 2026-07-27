<script setup lang="ts">
import { Button, Card, Badge, Divider, Section, CTABanner } from '@amulet-laboratories/rig'
import { credentials, caseStudies } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Principal Investigator -->
    <Section class="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover opacity-[0.04]"
        loading="lazy"
      />
      <div class="relative mx-auto max-w-3xl text-center">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">Credentials</p>
        <div data-rig-accent class="mx-auto mt-2 h-px w-8" aria-hidden="true" />

        <h1 class="mt-6 text-3xl font-extralight leading-relaxed">{{ credentials.name }}</h1>
        <p class="mt-2 text-xs uppercase tracking-eyebrow">{{ credentials.title }}</p>

        <p class="mx-auto mt-8 max-w-md text-sm leading-relaxed">{{ credentials.bio }}</p>
      </div>
    </Section>

    <!-- License & Memberships -->
    <Section variant="alternate">
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">
          License & Experience
        </p>
        <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />

        <div class="mt-8 space-y-2.5">
          <p
            v-for="item in credentials.history"
            :key="item"
            class="pl-4 text-sm border-l-2 border-primary"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </Section>

    <!-- Training -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">
          Continuing Education & Training
        </p>
        <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />

        <div class="mt-8 space-y-2.5">
          <p
            v-for="item in credentials.training"
            :key="item"
            class="pl-4 text-sm border-l-2 border-primary"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </Section>

    <!-- Court Testimony -->
    <Section variant="alternate">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">Court Testimony</p>
        <div data-rig-accent class="mx-auto mt-2 h-px w-8" aria-hidden="true" />
        <p class="mt-8 font-mono text-xl font-extralight text-primary">
          {{ credentials.courtExperience }}
        </p>
      </div>
    </Section>

    <!-- Case Studies -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <p class="text-xs font-medium uppercase tracking-widest text-primary">
          Selected Case Summaries
        </p>
        <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />
        <p class="mt-4 text-xs tracking-wider text-muted-foreground">
          Details anonymized. Published with client consent.
        </p>

        <div class="mt-10 space-y-8">
          <Card v-for="c in caseStudies" :key="c.id" class="p-6">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-lg font-light uppercase tracking-wide">{{ c.title }}</h3>
              <Badge size="sm" variant="primary">
                {{ c.type }}
              </Badge>
            </div>
            <p class="mt-4 text-sm leading-relaxed">{{ c.summary }}</p>
            <Divider class="my-4" />
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-medium uppercase tracking-wider text-primary">Outcome</p>
                <p class="mt-1 text-sm leading-relaxed">{{ c.outcome }}</p>
              </div>
              <div class="flex-shrink-0 text-right">
                <p class="text-xs uppercase tracking-wider text-muted-foreground">Duration</p>
                <p class="mt-1 font-mono text-sm">{{ c.duration }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- CTA -->
    <CTABanner layout="centered" variant="card">
      <p class="text-xs uppercase tracking-widest text-primary">Discuss your case</p>
      <p class="mt-4 text-2xl font-extralight">
        <a href="tel:+15415550177" class="transition-colors hover:text-primary">(541) 555-0177</a>
      </p>
      <template #action>
        <Button variant="primary" @click="emit('navigate', 'contact')">Contact Form</Button>
      </template>
    </CTABanner>
  </div>
</template>
