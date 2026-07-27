<script setup lang="ts">
import {
  Badge,
  Button,
  Card,
  CTABanner,
  Ornament,
  Section,
  Testimonial,
  ServiceGrid,
} from '@amulet-laboratories/rig'
import type { ServiceItem } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const localRecs: (ServiceItem & { type: string; distance: string })[] = [
  {
    id: 'rec-undertow',
    title: 'Undertow Brewing',
    type: 'Brewery',
    description: 'Craft beer and live music on Fridays. A 10-minute walk along the harbor trail.',
    distance: '0.5 mi',
  },
  {
    id: 'rec-salt',
    title: 'Salt & Signal',
    type: 'General Goods',
    description: 'Curated home goods, pantry items, and local ceramics on Main Street.',
    distance: '0.3 mi',
  },
  {
    id: 'rec-market',
    title: 'Briar Cove Farmers Market',
    type: 'Market',
    description:
      'Saturdays 9 AM – 1 PM in the Old Harbor parking lot. Seasonal produce and hot food.',
    distance: '0.4 mi',
  },
  {
    id: 'rec-salal',
    title: 'Salal Creek Trail',
    type: 'Hiking',
    description: 'Easy 3-mile loop through old-growth forest. Trailhead is a 5-minute drive.',
    distance: '3 mi',
  },
  {
    id: 'rec-compass',
    title: 'Compass Animal Hospital',
    type: 'Pet Services',
    description: 'Full-service vet for guests traveling with pets. Open weekdays.',
    distance: '1.2 mi',
  },
  {
    id: 'rec-tideline',
    title: 'Tideline Art Walk',
    type: 'Culture',
    description: 'First Friday gallery walks in Old Harbor. Local artists including Maren Lys.',
    distance: '0.6 mi',
  },
  {
    id: 'rec-kbcv',
    title: 'KBCV Community Radio',
    type: 'Radio',
    description: 'Tune to 91.7 FM for local news, tide reports, and a curated music mix.',
    distance: '',
  },
  {
    id: 'rec-library',
    title: 'Briar Cove Public Library',
    type: 'Library',
    description: 'Local history archive, author talks, and a quiet reading room on Main Street.',
    distance: '0.3 mi',
  },
]

const outdoor: (ServiceItem & { distance: string })[] = [
  {
    id: 'outdoor-lighthouse',
    title: 'Cape Briar Lighthouse',
    description:
      'Scenic overlook with panoramic ocean views. Open for tours on weekends, May through October.',
    distance: '4 mi',
  },
  {
    id: 'outdoor-beach',
    title: 'Driftwood Beach',
    description:
      'A 2-mile stretch of sand accessible directly from the inn. Tidepools at the north end during low tide.',
    distance: '0.1 mi',
  },
  {
    id: 'outdoor-osprey',
    title: 'Osprey Point State Park',
    description: 'Whale-watching platform, picnic areas, and a moderate 5-mile coastal trail.',
    distance: '7 mi',
  },
  {
    id: 'outdoor-marina',
    title: 'Briar Cove Marina',
    description: 'Crabbing, kayak rentals, and seasonal fishing charters. Open daily.',
    distance: '0.8 mi',
  },
]

const seasonal = [
  {
    event: 'Storm-Watching Season',
    months: 'November – February',
    note: 'Complimentary hot toddy service in the lobby during winter storms.',
  },
  {
    event: 'Whale Migration',
    months: 'December – January, March – June',
    note: 'Gray whales pass within sight of the inn. Binoculars available at the front desk.',
  },
  {
    event: 'Briar Cove Arts Festival',
    months: 'July',
    note: 'A week of gallery openings, live music, and outdoor installations throughout town.',
  },
  {
    event: 'Harvest Dinner Series',
    months: 'September – October',
    note: "Multi-course dinners featuring the season's final harvest from local farms.",
  },
]
</script>

<template>
  <div>
    <!-- Header -->
    <Section variant="alternate">
      <div class="text-center">
        <p class="text-xs font-light uppercase">While You're Here</p>
        <h1 class="mt-4 font-serif text-3xl font-light sm:text-4xl lg:text-5xl">
          Explore Briar Cove
        </h1>
        <Ornament variant="rule" size="sm" />
        <p class="mx-auto mt-4 max-w-lg text-sm font-light">
          Our front desk keeps a curated list of local favorites. Whether you're here for a weekend
          or a week, Briar Cove has more than enough to fill the hours between meals.
        </p>
      </div>
    </Section>

    <!-- Outdoor & nature -->
    <Section title="Outdoors &amp; Nature">
      <div class="mx-auto max-w-4xl">
        <ServiceGrid :items="outdoor" :columns="2" class="mt-10">
          <template #item="{ item }">
            <Card class="scroll-reveal p-5">
              <div class="flex items-start justify-between">
                <h3 class="text-sm font-semibold">{{ item.title }}</h3>
                <span v-if="(item as (typeof outdoor)[number]).distance" class="shrink-0 text-xs">
                  {{ (item as (typeof outdoor)[number]).distance }}
                </span>
              </div>
              <p class="mt-2 text-xs font-light leading-relaxed">{{ item.description }}</p>
            </Card>
          </template>
        </ServiceGrid>
      </div>
    </Section>

    <!-- Town favorites -->
    <Section variant="alternate" title="Town Favorites">
      <div class="mx-auto max-w-4xl">
        <ServiceGrid :items="localRecs" :columns="2" class="mt-10">
          <template #item="{ item }">
            <Card class="scroll-reveal p-5">
              <div class="flex items-start justify-between">
                <h3 class="text-sm font-semibold">{{ item.title }}</h3>
                <Badge variant="default" size="sm">
                  {{ (item as (typeof localRecs)[number]).type }}
                </Badge>
              </div>
              <p class="mt-2 text-xs font-light leading-relaxed">{{ item.description }}</p>
              <p v-if="(item as (typeof localRecs)[number]).distance" class="mt-2 text-xs">
                {{ (item as (typeof localRecs)[number]).distance }} from the inn
              </p>
            </Card>
          </template>
        </ServiceGrid>
      </div>
    </Section>

    <!-- Seasonal highlights -->
    <Section title="Seasonal Highlights">
      <div class="mx-auto max-w-3xl">
        <div class="mt-10 space-y-8">
          <div
            v-for="s in seasonal"
            :key="s.event"
            class="border-border scroll-reveal border-b pb-6"
          >
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-lg">{{ s.event }}</h3>
              <span class="shrink-0 text-xs font-light">{{ s.months }}</span>
            </div>
            <p class="mt-2 text-sm font-light">{{ s.note }}</p>
          </div>
        </div>
      </div>
    </Section>

    <!-- Front desk note -->
    <Section variant="alternate">
      <Testimonial layout="card" class="scroll-reveal mx-auto max-w-2xl text-center">
        <template #decorator><span aria-hidden="true">&ldquo;</span></template>
        <template #quote
          >Ask the front desk for our printed guide — it includes walking maps, tide charts, and a
          few secret spots we don't put online.</template
        >
        <template #attribution><p>The Lantern House Team</p></template>
      </Testimonial>
    </Section>

    <!-- CTA -->
    <CTABanner layout="centered">
      <template #title>Ready to visit?</template>
      <template #description>Reserve your room at The Lantern House.</template>
      <template #action>
        <Button variant="cta-light" @click="emit('navigate', 'reserve')">Book Your Stay</Button>
      </template>
    </CTABanner>
  </div>
</template>
