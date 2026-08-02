<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@amulet-laboratories/rig'
import '@/assets/scoped/demo-index.css'

type DemoMode = 'light' | 'dark'
type DemoCategory = 'Hospitality' | 'Professional' | 'Creative' | 'Local & Civic'

interface Demo {
  slug: string
  name: string
  industry: string
  category: DemoCategory
  bg: string
  fg: string
  accent: string
  mode: DemoMode
  modeLabel: string
  display: string
  tagline: string
  navItems: string[]
  pageCount: number
}

const demos: Demo[] = [
  {
    slug: 'tidemark',
    name: 'Tidemark Realty',
    industry: 'Real Estate',
    category: 'Local & Civic',
    bg: '#FAF7F2',
    fg: '#2C2420',
    accent: '#1a7a7a',
    mode: 'light',
    modeLabel: 'Warm light',
    display: 'Cormorant Garamond',
    tagline: 'Coastal property, grounded counsel.',
    navItems: ['Listings', 'About', 'Areas', 'Market'],
    pageCount: 7,
  },
  {
    slug: 'briarcove',
    name: 'City of Briar Cove',
    industry: 'Municipal Government',
    category: 'Local & Civic',
    bg: '#FFFFFF',
    fg: '#1A1D23',
    accent: '#6d42c4',
    mode: 'light',
    modeLabel: 'Neutral light',
    display: 'Libre Franklin',
    tagline: 'Permits, parks, and public services.',
    navItems: ['Services', 'Government', 'Meetings', 'Contact'],
    pageCount: 7,
  },
  {
    slug: 'duskline',
    name: 'Duskline Investigations',
    industry: 'Private Investigation',
    category: 'Professional',
    bg: '#0D0F12',
    fg: '#E2E6EC',
    accent: '#3cc8b4',
    mode: 'dark',
    modeLabel: 'Cold dark',
    display: 'IBM Plex Sans Condensed',
    tagline: 'Licensed. Discreet. Thorough.',
    navItems: ['Services', 'Credentials', 'Process'],
    pageCount: 6,
  },
  {
    slug: 'saltsignal',
    name: 'Salt & Signal General Goods',
    industry: 'Indie Retail',
    category: 'Creative',
    bg: '#F5F0E8',
    fg: '#2E2218',
    accent: '#b8860b',
    mode: 'light',
    modeLabel: 'Warm light',
    display: 'Fraunces',
    tagline: 'Handmade and locally sourced.',
    navItems: ['Shop', 'Story', 'Visit'],
    pageCount: 4,
  },
  {
    slug: 'marenlys',
    name: 'Maren Lys — Visual Works',
    industry: 'Artist Portfolio',
    category: 'Creative',
    bg: '#FAFAFA',
    fg: '#111111',
    accent: '#c43a8a',
    mode: 'light',
    modeLabel: 'Ultra-light',
    display: 'Instrument Serif',
    tagline: 'Color, form, and negative space.',
    navItems: ['Work', 'About', 'News'],
    pageCount: 6,
  },
  {
    slug: 'lanternhouse',
    name: 'The Lantern House',
    industry: 'Boutique Hotel',
    category: 'Hospitality',
    bg: '#110e18',
    fg: '#F0E8D8',
    accent: '#a87bd4',
    mode: 'dark',
    modeLabel: 'Plum dark',
    display: 'Bodoni Moda',
    tagline: '22 rooms on the Pacific.',
    navItems: ['Rooms', 'Dining', 'Reserve'],
    pageCount: 5,
  },
  {
    slug: 'aldricpace',
    name: 'Aldric, Pace & Wynn LLP',
    industry: 'Law Firm',
    category: 'Professional',
    bg: '#FAFBFC',
    fg: '#1B2033',
    accent: '#8B6F4E',
    mode: 'light',
    modeLabel: 'Cold light',
    display: 'EB Garamond',
    tagline: 'Trusted counsel for coastal Oregon.',
    navItems: ['Attorneys', 'Practices', 'Contact'],
    pageCount: 5,
  },
  {
    slug: 'undertow',
    name: 'Undertow Brewing Co.',
    industry: 'Craft Brewery',
    category: 'Hospitality',
    bg: '#1C1917',
    fg: '#F5F0EB',
    accent: '#D95F2A',
    mode: 'dark',
    modeLabel: 'Gritty dark',
    display: 'Archivo Black',
    tagline: 'Brewed in a converted fish warehouse.',
    navItems: ['Menu', 'Story', 'Events'],
    pageCount: 4,
  },
  {
    slug: 'kbcv',
    name: 'KBCV 91.7 FM',
    industry: 'Community Radio',
    category: 'Creative',
    bg: '#F7F3EE',
    fg: '#2A2521',
    accent: '#B83232',
    mode: 'light',
    modeLabel: 'Warm neutral',
    display: 'Chivo',
    tagline: 'Independent voices since 2008.',
    navItems: ['Schedule', 'Shows', 'Community', 'Support'],
    pageCount: 6,
  },
  {
    slug: 'compass',
    name: 'Compass Animal Hospital',
    industry: 'Veterinary Clinic',
    category: 'Professional',
    bg: '#f8fdf6',
    fg: '#1D2B1E',
    accent: '#2d7a3e',
    mode: 'light',
    modeLabel: 'Soft light',
    display: 'Outfit',
    tagline: 'Compassionate care for your whole family.',
    navItems: ['Services', 'Team', 'Contact'],
    pageCount: 8,
  },
  {
    slug: 'fogline',
    name: 'Fogline Coffee Roasters',
    industry: 'Coffee Roastery',
    category: 'Hospitality',
    bg: '#16120E',
    fg: '#EDE4D8',
    accent: '#C8A265',
    mode: 'dark',
    modeLabel: 'Dark roast',
    display: 'Cormorant Garamond',
    tagline: 'Roasted where the fog meets the coast.',
    navItems: ['Coffee', 'Story', 'Wholesale', 'Visit'],
    pageCount: 5,
  },
  {
    slug: 'rootremedy',
    name: 'Root & Remedy',
    industry: 'Cannabis Dispensary',
    category: 'Professional',
    bg: '#0B1222',
    fg: '#ECE8E1',
    accent: '#7BA68E',
    mode: 'dark',
    modeLabel: 'Midnight navy',
    display: 'Newsreader',
    tagline: 'Plant medicine, guided with care.',
    navItems: ['Menu', 'About', 'Wellness', 'Visit'],
    pageCount: 5,
  },
  {
    slug: 'briarcovelib',
    name: 'Briar Cove Public Library',
    industry: 'Public Library',
    category: 'Local & Civic',
    bg: '#FAF8F4',
    fg: '#2B2622',
    accent: '#a5562e',
    mode: 'light',
    modeLabel: 'Warm light',
    display: 'Bitter',
    tagline: '47,000 titles. Open 7 days a week.',
    navItems: ['Catalog', 'Events', 'Rooms'],
    pageCount: 8,
  },
]

const categories: Array<'All' | DemoCategory> = [
  'All',
  'Hospitality',
  'Professional',
  'Creative',
  'Local & Civic',
]

const activeCategory = ref<'All' | DemoCategory>('All')

const filteredDemos = computed(() =>
  activeCategory.value === 'All' ? demos : demos.filter((d) => d.category === activeCategory.value),
)
</script>

<template>
  <div class="min-h-svh bg-purple-deep text-cream">
    <!-- Subtle top rule -->
    <div class="demo-index-rule h-px w-full" />

    <!-- Header -->
    <header class="mx-auto max-w-6xl xl:max-w-7xl px-6 pt-14 pb-10">
      <a
        href="https://amuletlabs.org/hexrig/"
        class="group/back inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-eyebrow text-warm-pink transition-colors duration-200 hover:text-cream"
      >
        <span
          class="demo-index-back-arrow inline-block transition-transform duration-200 ease-smooth group-hover/back:-translate-x-1"
          >&larr;</span
        >
        Hexrig
      </a>

      <div class="mt-8">
        <p class="text-xs font-medium uppercase tracking-eyebrow-lg text-rose-surface">
          Example sites built with Hexrig
        </p>
        <h1 class="mt-3 text-3xl font-light leading-tight text-cream sm:text-4xl">
          Thirteen sites, one design system
        </h1>
        <p class="mt-4 max-w-lg text-sm font-light leading-body-loose text-warm-pink">
          Each site below is built entirely from Hexrig — headless Vue 3 components (Rig) and
          curated CSS themes (Hex) — the same design system, styled thirteen different ways. Every
          one uses a different theme to show how far one component library stretches.
        </p>
        <p class="mt-3 max-w-lg text-xs font-light leading-relaxed text-cream/60">
          The businesses are fictional. They share an invented coastal town, Briar Cove, so each
          demo reads like a real site rather than a disconnected component playground.
        </p>

        <!-- The museum is not one of the thirteen — it is the argument for the
             system rather than an example of it, so it gets its own entry. -->
        <RouterLink
          to="/museum"
          class="mt-6 inline-flex items-center gap-2 rounded-full bg-cream/5 px-4 py-2 text-sm font-light text-cream transition-colors hover:bg-cream/10"
        >
          <span aria-hidden="true">🏛</span>
          The Museum of User Interfaces
          <span class="text-warm-pink">— eight eras, one component set</span>
        </RouterLink>
      </div>
      <!-- Filter pills + live count -->
      <div class="mt-8 flex flex-wrap items-center gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          :aria-pressed="activeCategory === cat"
          class="rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200"
          :class="
            activeCategory === cat
              ? 'bg-rose text-purple-deep'
              : 'bg-cream/5 text-warm-pink hover:bg-cream/10'
          "
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
        <p class="ml-auto font-mono text-xs tracking-wide text-warm-pink">
          {{ filteredDemos.length }} of {{ demos.length }} demos
        </p>
      </div>
    </header>

    <!-- Grid -->
    <main id="main-content" class="mx-auto max-w-6xl xl:max-w-7xl px-6 pb-16">
      <TransitionGroup
        name="demo-card"
        tag="div"
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <RouterLink
          v-for="demo in filteredDemos"
          :key="demo.slug"
          :to="`/${demo.slug}`"
          class="demo-card group relative flex flex-col overflow-hidden rounded-lg"
          :style="{
            '--demo-accent': demo.accent,
            '--demo-bg': demo.bg,
            '--demo-fg': demo.fg,
            '--demo-display': `'${demo.display}', serif`,
          }"
        >
          <!-- Browser mockup preview -->
          <div class="demo-card-preview relative">
            <!-- Browser chrome bar -->
            <div class="demo-card-chrome flex items-center gap-1.5 px-3 py-1.5">
              <span class="h-1.5 w-1.5 rounded-full bg-red-500 opacity-40" />
              <span class="h-1.5 w-1.5 rounded-full bg-yellow-500 opacity-40" />
              <span class="h-1.5 w-1.5 rounded-full bg-green-500 opacity-40" />
              <span
                class="demo-card-url ml-2 flex-1 rounded-sm px-2 py-0.5 text-center font-mono text-[8px] tracking-wide"
              >
                {{ demo.slug }}.briarcove.org
              </span>
            </div>

            <!-- Simplified page layout -->
            <div class="px-3 pt-2 pb-4">
              <!-- Mini nav -->
              <div class="flex items-center justify-between">
                <div class="demo-card-nav-rule h-1 w-8 rounded-full" />
                <div class="flex gap-1.5">
                  <span
                    v-for="item in demo.navItems"
                    :key="item"
                    class="demo-card-nav-item font-mono text-[6px] uppercase tracking-wider"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <!-- Hero area -->
              <div class="mt-4 text-center">
                <p class="demo-card-tagline text-xs font-medium leading-snug sm:text-sm">
                  {{ demo.tagline }}
                </p>
                <div class="demo-card-accent-bar mx-auto mt-2 h-4 w-16 rounded-sm" />
              </div>

              <!-- Content lines -->
              <div class="mx-auto mt-3 flex max-w-[75%] flex-col items-center gap-1">
                <div class="demo-card-content-line h-[2px] w-full rounded-full" />
                <div class="demo-card-content-line h-[2px] w-[80%] rounded-full" />
              </div>
            </div>
          </div>

          <!-- Info footer -->
          <div class="flex flex-1 flex-col justify-between gap-3 bg-purple px-5 py-4">
            <div>
              <div class="flex items-start justify-between gap-2">
                <h2 class="font-serif text-base font-medium leading-snug text-cream">
                  {{ demo.name }}
                </h2>
                <span
                  v-if="demo.pageCount > 1"
                  class="demo-card-page-count shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium tracking-wide"
                >
                  {{ demo.pageCount }} pages
                </span>
              </div>
              <p
                class="mt-1 text-[10px] font-medium uppercase tracking-eyebrow-sm text-warm-pink/70"
              >
                {{ demo.industry }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <!-- Palette + font info -->
              <div class="flex items-center gap-1.5">
                <span
                  class="demo-card-swatch--bg inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
                  :title="`bg ${demo.bg}`"
                />
                <span
                  class="demo-card-swatch--fg inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
                  :title="`fg ${demo.fg}`"
                />
                <span
                  class="demo-card-swatch--accent inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
                  :title="`accent ${demo.accent}`"
                />
                <span class="ml-1.5 text-[9px] tracking-wide text-cream/55">
                  {{ demo.display }}
                </span>
              </div>

              <!-- Arrow -->
              <span
                class="card-arrow inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-rose"
              >
                &rarr;
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- Brand card — only in the unfiltered view, spans the last row's empty cells -->
        <div
          v-if="activeCategory === 'All'"
          key="brand-card"
          class="demo-brand-card flex flex-col items-center justify-center rounded-lg bg-purple p-5 text-center transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 sm:p-8 lg:col-span-2"
        >
          <div class="h-px w-10 bg-rose-surface" />
          <p class="mt-4 text-[10px] uppercase tracking-eyebrow-lg text-rose-surface">One system</p>
          <p class="mt-3 text-lg font-light text-cream">13 themes</p>
          <p class="mt-2 max-w-[200px] text-xs font-light leading-relaxed text-warm-pink">
            Same Rig components, same Hex token framework — restyled thirteen ways with zero forked
            markup.
          </p>
          <div class="mt-4 h-px w-10 bg-rose-surface" />
        </div>
      </TransitionGroup>
    </main>

    <!-- CTA -->
    <section class="mx-auto max-w-6xl xl:max-w-7xl px-6 pb-20 text-center">
      <div
        class="demo-cta-card rounded-lg px-5 py-8 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 sm:px-8 sm:py-12"
      >
        <p class="font-serif text-xl font-medium text-cream sm:text-2xl">
          Build your own with Hexrig
        </p>
        <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-warm-pink">
          Every site here is composed from the same open component library and CSS theme framework.
          149 headless Vue 3 components, 27 curated themes, zero runtime.
        </p>
        <div class="mt-8">
          <a href="https://amuletlabs.org/hexrig/">
            <Button variant="cta" class="inline-block"> Explore Hexrig </Button>
          </a>
        </div>
        <p class="mt-4 text-xs text-cream/60">
          A design system by Amulet Laboratories. All businesses shown are fictional.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="demo-index-footer border-t px-6 py-8 text-center">
      <p class="text-xs tracking-wide text-cream/55">Amulet Laboratories &middot; Hexrig</p>
    </footer>
  </div>
</template>
