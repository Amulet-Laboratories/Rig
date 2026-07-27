<script setup lang="ts">
import { Section, CTABanner, Button, Card, Badge } from '@amulet-laboratories/rig'
import { ref, computed } from 'vue'

const emit = defineEmits<{ navigate: [page: string] }>()

const resources = [
  {
    category: 'Estate Planning',
    title: 'Understanding the Difference Between Wills and Trusts',
    summary:
      'A will takes effect after death and must pass through probate. A trust can take effect during your lifetime and may allow your estate to avoid probate entirely. Learn which instrument — or combination — is right for your situation.',
    readTime: '6 min read',
  },
  {
    category: 'Real Estate',
    title: 'What to Expect During a Title Search in Oregon',
    summary:
      'Before any real property transaction closes, a title search reveals liens, easements, encumbrances, and other issues that could affect ownership. Here is what the process looks like and why it matters.',
    readTime: '5 min read',
  },
  {
    category: 'Business',
    title: 'LLC vs. Corporation: Choosing the Right Entity in Oregon',
    summary:
      'The entity you choose affects liability protection, taxation, management flexibility, and your ability to raise capital. We outline the key differences to help you make an informed decision.',
    readTime: '7 min read',
  },
  {
    category: 'Real Estate',
    title: 'Coastal Property Considerations: Setbacks, Erosion, and Insurance',
    summary:
      'Purchasing property along the Oregon coast involves unique challenges including ocean setback lines, erosion hazard zones, and specialized insurance requirements.',
    readTime: '8 min read',
  },
  {
    category: 'Estate Planning',
    title: 'Powers of Attorney: Why You Need One Before You Need One',
    summary:
      'A durable power of attorney ensures someone you trust can manage your financial and legal affairs if you become unable to do so. Waiting until a crisis occurs is too late.',
    readTime: '4 min read',
  },
  {
    category: 'Business',
    title: 'Operating Agreements: The Document Every Oregon LLC Needs',
    summary:
      'Oregon law does not require an operating agreement, but every multi-member LLC should have one. It defines ownership percentages, management roles, profit distribution, and dispute resolution.',
    readTime: '6 min read',
  },
  {
    category: 'Real Estate',
    title: '1031 Exchanges: Deferring Capital Gains on Investment Property',
    summary:
      'A 1031 exchange allows you to defer capital gains tax when you sell an investment property and reinvest in a like-kind property. Strict timelines and rules apply.',
    readTime: '7 min read',
  },
  {
    category: 'Estate Planning',
    title: 'Probate in Oregon: What Families Need to Know',
    summary:
      'When a loved one passes, the probate process can feel overwhelming. This guide walks through the Oregon probate timeline, costs, and alternatives.',
    readTime: '5 min read',
  },
]

const categories = ['All', 'Estate Planning', 'Real Estate', 'Business']
const activeCategory = ref('All')

const filteredResources = computed(() => {
  if (activeCategory.value === 'All') return resources
  return resources.filter((r) => r.category === activeCategory.value)
})
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <h1 class="font-serif text-3xl font-normal sm:text-4xl">Client Resources</h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed">
      Educational guides to help you understand common legal topics. These resources are for
      informational purposes only and do not constitute legal advice.
    </p>
  </Section>

  <!-- Filters -->
  <section class="border-b px-6 py-4">
    <div class="mx-auto flex max-w-5xl flex-wrap gap-2">
      <button
        v-for="cat in categories"
        :key="cat"
        class="rounded-sm px-3 py-2 text-xs transition-colors"
        :class="
          activeCategory === cat
            ? 'bg-primary text-primary-foreground'
            : 'bg-transparent text-muted-foreground'
        "
        :aria-pressed="activeCategory === cat"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>
  </section>

  <!-- Resources grid -->
  <Section>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card v-for="r in filteredResources" :key="r.title" class="p-6">
        <div class="flex items-center gap-2">
          <Badge variant="secondary">{{ r.category }}</Badge>
          <span class="text-xs">{{ r.readTime }}</span>
        </div>
        <h3 class="mt-3 font-medium leading-snug">{{ r.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed">{{ r.summary }}</p>
        <Button variant="outline" size="sm" class="mt-4" @click="emit('navigate', 'contact')">
          Ask About This Topic
        </Button>
      </Card>
    </div>

    <div v-if="filteredResources.length === 0" class="py-12 text-center">
      <p class="text-sm">No resources found in this category.</p>
    </div>
  </Section>

  <!-- Disclaimer -->
  <Section variant="alternate">
    <p class="text-xs leading-relaxed">
      <strong>Disclaimer:</strong> The information provided in these resources is for general
      educational purposes only and does not constitute legal advice. Every legal situation is
      unique. For advice specific to your circumstances, please schedule a consultation with one of
      our attorneys.
    </p>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-normal">Have questions about a specific topic?</p>
    <p class="mt-1 text-sm">Our attorneys are happy to discuss your situation in detail.</p>
    <template #action>
      <Button variant="cta-light" @click="emit('navigate', 'contact')"
        >Schedule a Consultation</Button
      >
    </template>
  </CTABanner>
</template>
