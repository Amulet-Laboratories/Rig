<script setup lang="ts">
import { Section, Card, Badge, Divider, Ornament, NewsletterForm } from '@amulet-laboratories/rig'
import { upcomingShows, press, cvAwards } from '../data'
</script>

<template>
  <div>
    <h1 class="sr-only">News & Exhibitions</h1>

    <!-- Upcoming Exhibitions -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <p class="text-xs uppercase tracking-eyebrow-lg scroll-reveal">Upcoming</p>
        <Divider class="mt-3" />

        <div class="mt-10 space-y-8">
          <Card v-for="show in upcomingShows" :key="show.title" class="scroll-reveal p-6">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge
                  size="sm"
                  :class="
                    show.type === 'solo' ? 'bg-accent/12 text-accent' : 'bg-card text-foreground'
                  "
                >
                  {{ show.type === 'solo' ? 'Solo Exhibition' : 'Group Exhibition' }}
                </Badge>
                <h2 class="mt-3 text-2xl font-normal italic">{{ show.title }}</h2>
                <p class="mt-1 text-sm">{{ show.venue }}</p>
              </div>
              <p class="text-accent text-sm font-medium">{{ show.dates }}</p>
            </div>
            <Divider class="my-4" />
            <p class="text-sm leading-body-loose">{{ show.description }}</p>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Accent rule -->
    <Ornament variant="rule" size="sm" />

    <!-- Press -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <p class="text-xs uppercase tracking-eyebrow-lg scroll-reveal">Press &amp; Publications</p>
        <Divider class="mt-3" />

        <div class="mt-10 space-y-6">
          <div v-for="p in press" :key="p.source" class="scroll-reveal flex gap-6">
            <span
              class="text-accent flex-shrink-0 text-4xl font-normal italic leading-none"
              aria-hidden="true"
              >&ldquo;</span
            >
            <div>
              <p class="text-sm italic leading-relaxed">{{ p.quote }}</p>
              <p class="mt-2 text-xs uppercase">{{ p.source }}</p>
            </div>
          </div>

          <Divider />

          <div v-for="a in cvAwards" :key="a.text" class="scroll-reveal flex gap-4 text-sm">
            <span class="text-muted-foreground w-10 flex-shrink-0 tabular-nums">{{ a.year }}</span>
            <span>{{ a.text }}</span>
          </div>
        </div>
      </div>
    </Section>

    <!-- Mailing list -->
    <Section>
      <div class="mx-auto max-w-md scroll-reveal text-center">
        <p class="text-accent text-xs uppercase tracking-eyebrow-lg">Stay Connected</p>
        <p class="mt-4 text-sm leading-relaxed">
          Exhibition announcements, new work, and occasional studio notes.
        </p>
        <NewsletterForm placeholder="Your email" button-text="Subscribe" />
      </div>
    </Section>
  </div>
</template>
