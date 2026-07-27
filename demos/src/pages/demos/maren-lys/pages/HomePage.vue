<script setup lang="ts">
import {
  Hero,
  Section,
  StatRow,
  Card,
  CTABanner,
  Testimonial,
  Button,
  Divider,
  Ornament,
  NewsletterForm,
} from '@amulet-laboratories/rig'
import { exhibitions, press, exhibitionStats } from '../data'
import { demoPlaceholder, onDemoImgError } from '@/lib/demoPlaceholder'

const emit = defineEmits<{ navigate: [page: string] }>()

const featuredExhibition = exhibitions[0]!

// Palette-matched fallback tile for missing/dead artwork imagery.
const ph = { bg: '#EDEBEA', fg: '#8A8586', accent: '#C43A8A' }
</script>

<template>
  <div>
    <!-- Hero — art-first immersive -->
    <Hero layout="immersive" class="min-h-[85vh] justify-end pb-16">
      <template #media>
        <img
          :src="
            featuredExhibition.img ||
            demoPlaceholder(featuredExhibition.title ?? 'Featured work', ph)
          "
          :alt="featuredExhibition.imgAlt ?? featuredExhibition.title + ' — featured work'"
          class="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          @error="onDemoImgError($event, featuredExhibition.title ?? 'Featured work', ph)"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/90"
        />
      </template>
      <template #eyebrow>
        <p class="text-xs uppercase tracking-eyebrow-xl">Painter · Mixed Media · Oregon Coast</p>
      </template>
      <template #title>
        <h1 class="text-6xl font-normal italic leading-display-tight sm:text-8xl">
          Maren<br />Lys
        </h1>
      </template>
      <template #description>
        <p class="mx-auto mt-4 max-w-sm text-sm leading-relaxed">
          Work rooted in erosion, fog, and the material culture of the southern Oregon shoreline.
        </p>
      </template>
      <template #actions>
        <Button variant="primary" size="sm" @click="emit('navigate', 'work')">View Work</Button>
        <Button variant="secondary" size="sm" @click="emit('navigate', 'about')">About</Button>
      </template>
    </Hero>

    <!-- Accent rule -->
    <Ornament variant="rule" size="sm" />

    <!-- Exhibition stats -->
    <Section>
      <div class="mx-auto max-w-5xl scroll-reveal">
        <StatRow :stats="exhibitionStats" variant="bordered" />
      </div>
    </Section>

    <!-- Recent series preview -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <p class="text-xs uppercase tracking-eyebrow-lg scroll-reveal">Recent Work</p>
        <Divider class="mt-3" />

        <div class="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="ex in exhibitions.slice(0, 3)"
            :key="ex.id"
            class="group cursor-pointer overflow-hidden scroll-reveal"
            @click="emit('navigate', 'work')"
          >
            <div class="overflow-hidden">
              <img
                :src="ex.img || demoPlaceholder(ex.title ?? 'Work', ph)"
                :alt="ex.imgAlt ?? ex.title ?? ''"
                class="aspect-[4/3] w-full object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-90"
                loading="lazy"
                @error="onDemoImgError($event, ex.title ?? 'Work', ph)"
              />
            </div>
            <div class="p-4">
              <p class="text-muted-foreground text-xs tabular-nums">{{ ex.year }}</p>
              <h3 class="mt-1 text-xl font-normal italic">{{ ex.title }}</h3>
              <p class="mt-1 text-xs">{{ ex.count }} works · {{ ex.medium }}</p>
            </div>
          </Card>
        </div>

        <div class="mt-10 text-center">
          <Button variant="secondary" size="sm" @click="emit('navigate', 'work')"
            >View All Series</Button
          >
        </div>
      </div>
    </Section>

    <!-- Accent rule -->
    <Ornament variant="rule" size="sm" />

    <!-- Press teaser — single featured quote -->
    <Section variant="alternate">
      <div class="mx-auto max-w-3xl scroll-reveal text-center">
        <Testimonial layout="card">
          <template #decorator>
            <span class="text-accent text-4xl font-normal italic leading-none">&ldquo;</span>
          </template>
          <template #quote>
            <p class="text-lg italic leading-relaxed">{{ press[1]!.quote }}</p>
          </template>
          <template #attribution>
            <p class="mt-4 text-xs uppercase">{{ press[1]!.source }}</p>
          </template>
        </Testimonial>
        <Button variant="secondary" size="sm" class="mt-8" @click="emit('navigate', 'news')"
          >Press &amp; News</Button
        >
      </div>
    </Section>

    <!-- Studio visit CTA -->
    <CTABanner layout="centered" variant="background" class="scroll-reveal">
      <template #default>
        <p class="text-accent text-xs uppercase tracking-eyebrow-lg">Studio</p>
        <p class="mt-3 text-2xl font-normal italic">Now accepting visit requests for summer 2026</p>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          The Dune Quarter studio is open by appointment. Commissions, press visits, and portfolio
          reviews welcome.
        </p>
      </template>
      <template #action>
        <Button variant="primary" size="sm" @click="emit('navigate', 'contact')"
          >Request a Visit</Button
        >
      </template>
    </CTABanner>

    <!-- Mailing list -->
    <Section>
      <div class="mx-auto max-w-md scroll-reveal text-center">
        <p class="text-accent text-xs uppercase tracking-eyebrow-lg">Studio Updates</p>
        <p class="mt-4 text-sm leading-relaxed">
          New work, exhibition openings, and studio notes. A few times a year, never more.
        </p>
        <NewsletterForm placeholder="Your email" button-text="Subscribe" />
      </div>
    </Section>
  </div>
</template>
