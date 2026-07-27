<script setup lang="ts">
import { Section, CTABanner, Button, Ornament } from '@amulet-laboratories/rig'
import { cvEducation, cvSolo, cvGroup, cvResidencies, cvAwards } from '../data'
import type { CVEntry } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()

const cvSections: { title: string; entries: CVEntry[] }[] = [
  { title: 'Education', entries: cvEducation },
  { title: 'Solo & Two-Person Exhibitions', entries: cvSolo },
  { title: 'Group Exhibitions', entries: cvGroup },
  { title: 'Residencies', entries: cvResidencies },
  { title: 'Awards & Publications', entries: cvAwards },
]
</script>

<template>
  <div>
    <!-- Full-width studio photo -->
    <Section>
      <div class="mx-auto max-w-5xl scroll-reveal">
        <h1 class="text-3xl font-normal italic">About</h1>
        <img
          src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80"
          alt="Maren Lys in her studio in the Dune Quarter"
          class="mt-8 aspect-[4/3] w-full object-cover sm:aspect-[5/2]"
          loading="lazy"
        />
      </div>
    </Section>

    <!-- Bio -->
    <Section>
      <div class="mx-auto max-w-2xl scroll-reveal">
        <p class="text-sm leading-prose">
          Maren Lys (b. 1995, Astoria, OR) is a painter and mixed-media artist working from a studio
          in the Dune Quarter of Briar Cove, Oregon. Her practice centers on the material culture of
          coastal landscapes — erosion patterns, tidal deposits, burn scars, fog. She holds an MFA
          from Pacific Northwest College of Art and is represented by Brine Gallery in Portland.
        </p>
      </div>
    </Section>

    <!-- Accent rule -->
    <Ornament variant="rule" size="sm" />

    <!-- Artist statement -->
    <Section variant="alternate">
      <div class="mx-auto max-w-2xl scroll-reveal text-center">
        <p class="text-accent text-xs uppercase tracking-eyebrow-lg">Artist Statement</p>
        <p class="mt-6 text-base italic leading-prose">
          I make work about what the coast does to things over time. Erosion, oxidation, saturation,
          bleaching. The ocean is an archive of slow destruction, and I am interested in what it
          chooses to keep and what it dissolves.
        </p>
        <p class="mt-4 text-base italic leading-prose">
          My materials come from the landscape — sand, salt, beeswax, found metal, ash from
          controlled burns — because the subject and the medium should share a vocabulary.
        </p>
        <p class="mt-4 text-base italic leading-prose">
          I work in series because a single painting cannot describe a system. Each series is a
          sustained inquiry into one process, one stretch of shore, one set of atmospheric
          conditions. The work is finished when the question changes.
        </p>
      </div>
    </Section>

    <!-- Structured CV -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <h2 class="text-xs uppercase scroll-reveal">Curriculum Vitae</h2>

        <div class="mt-8 space-y-10">
          <div v-for="section in cvSections" :key="section.title" class="scroll-reveal">
            <h3 class="text-accent text-xs font-medium uppercase">
              {{ section.title }}
            </h3>
            <dl class="mt-3 space-y-2">
              <div v-for="entry in section.entries" :key="entry.text" class="flex gap-4 text-sm">
                <dt class="text-muted-foreground w-10 flex-shrink-0 tabular-nums">
                  {{ entry.year }}
                </dt>
                <dd>{{ entry.text }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Section>

    <!-- Accent rule -->
    <Ornament variant="rule" size="sm" />

    <!-- Studio visit CTA -->
    <CTABanner layout="centered" variant="card" class="scroll-reveal">
      <template #default>
        <p class="text-2xl font-normal italic">Visit the studio</p>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          The Dune Quarter studio is open by appointment for commissions, press, and portfolio
          reviews.
        </p>
      </template>
      <template #action>
        <Button variant="primary" size="sm" @click="emit('navigate', 'contact')"
          >Request a Visit</Button
        >
      </template>
    </CTABanner>
  </div>
</template>
