<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { useFathom } from '@amulet-laboratories/rig'
import { useProducts } from '../../composables/useProducts'
import { useAmazonLocale } from '../../composables/useAmazonLocale'

const props = defineProps<{
  slug: string
}>()

const { getProduct } = useProducts()
const { data: product, status } = await useAsyncData(`product-${props.slug}`, () =>
  getProduct(props.slug),
)

const { trackAffiliateClick } = useFathom()
const { localizeAmazon } = useAmazonLocale()

interface Retailer {
  name: string
  url: string
  commission_rate: string
}

// Every retailer we have a link for, ordered by commission (highest first).
// We earn on whichever the reader picks, so surfacing all of them captures
// shoppers loyal to a specific store instead of losing them at an Amazon-only
// button — while the top slot nudges toward our best-margin option.
const retailers = computed<Retailer[]>(() => {
  if (!product.value) return []
  const list: Retailer[] = []
  if (product.value.amazon?.url) {
    list.push({
      name: 'Amazon',
      url: product.value.amazon.url,
      commission_rate: product.value.amazon.commission_rate || '0%',
    })
  }
  for (const r of product.value.alt_retailers ?? []) {
    if (r?.url) list.push({ name: r.name, url: r.url, commission_rate: r.commission_rate || '0%' })
  }
  return list.sort(
    (a, b) => (parseFloat(b.commission_rate) || 0) - (parseFloat(a.commission_rate) || 0),
  )
})

const verifiedLabel = computed(() => {
  const d = product.value?.last_verified
  if (!d) return ''
  const dt = new Date(d)
  return isNaN(dt.getTime())
    ? ''
    : dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

// SSR/prerender renders amazon.com (correct for SEO + the US majority). On the
// client, an international visitor with a configured per-region tag is routed
// to their local Amazon storefront instead — see useAmazonLocale.
function onRetailerClick(e: MouseEvent, r: Retailer) {
  trackAffiliateClick(props.slug)
  if (r.name !== 'Amazon') return
  const localized = localizeAmazon(r.url)
  if (localized !== r.url) {
    e.preventDefault()
    window.open(localized, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <div v-if="status === 'pending'" data-rig-product-card>
    <div data-rig-product-card-header>
      <div data-rig-product-card-info>
        <span data-rig-product-card-name data-rig-skeleton>&nbsp;</span>
        <span data-rig-product-card-brand data-rig-skeleton>&nbsp;</span>
      </div>
    </div>
    <p data-rig-product-card-oneliner data-rig-skeleton>&nbsp;</p>
  </div>

  <div v-else-if="product" data-rig-product-card>
    <div v-if="product.image_url" data-rig-product-card-image>
      <NuxtImg
        :src="product.image_url"
        :alt="product.image_alt || product.name"
        width="280"
        height="280"
        loading="lazy"
      />
    </div>
    <div data-rig-product-card-header>
      <div data-rig-product-card-info>
        <span data-rig-product-card-name>{{ product.name }}</span>
        <span data-rig-product-card-brand
          >{{ product.brand }} &middot; {{ product.price_range }}</span
        >
      </div>
      <!-- 91 merch products carry `rating: null` deliberately, pending a real
           one. Unguarded, this printed "null/5". -->
      <span v-if="product.rating" data-rig-product-card-rating>{{ product.rating }}/5</span>
    </div>
    <p data-rig-product-card-oneliner>{{ product.one_liner }}</p>
    <div data-rig-product-card-details>
      <div data-rig-product-card-pros>
        <strong>Pros</strong>
        <ul>
          <li v-for="pro in product.pros" :key="pro">{{ pro }}</li>
        </ul>
      </div>
      <div data-rig-product-card-cons>
        <strong>Cons</strong>
        <ul>
          <li v-for="con in product.cons" :key="con">{{ con }}</li>
        </ul>
      </div>
    </div>
    <div data-rig-product-card-footer>
      <div v-if="retailers.length" data-rig-product-card-buy>
        <span v-if="retailers.length > 1" data-rig-product-card-buy-label>Where to buy</span>
        <template v-for="(r, i) in retailers" :key="r.name + r.url">
          <a
            :href="r.url"
            target="_blank"
            rel="nofollow noopener sponsored"
            :data-rig-product-card-link="i === 0 ? '' : undefined"
            :data-rig-product-card-link-secondary="i === 0 ? undefined : ''"
            @click="onRetailerClick($event, r)"
          >
            <span>{{ i === 0 ? `Check price on ${r.name}` : r.name }}</span>
            <span v-if="i === 0 && retailers.length > 1" data-rig-product-card-recommended
              >Recommended</span
            >
          </a>
        </template>
      </div>
      <p v-if="verifiedLabel" data-rig-product-card-verified>Prices checked {{ verifiedLabel }}</p>
    </div>
  </div>
</template>

<!--
  Layout only. Colour belongs to Hex, which themes these same data-rig-*
  attributes across all 27 themes.

  It lives here rather than in Hex because Hex has no layout rules at all — zero
  `display:` declarations across every shared component — and not in Rig core,
  whose 149 components carry no <style> block by design. rig-nuxt's content
  components are where structure lives: QuickAnswer.vue and FaqBlock.vue already
  do exactly this.

  This was previously duplicated as scoped CSS in seven site-local copies of this
  component, keyed off .pcw-* classes Hex could never reach. That is why the
  copies existed at all: the library had no way to express this, so every site
  expressed it privately and the library went stale behind them.
-->
<style scoped>
[data-rig-product-card-buy] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

[data-rig-product-card-buy-label] {
  flex-basis: 100%;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

[data-rig-product-card-link],
[data-rig-product-card-link-secondary] {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

[data-rig-product-card-recommended] {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.1em 0.5em;
  border-radius: 999px;
}

[data-rig-product-card-verified] {
  flex-basis: 100%;
  margin: 0.5rem 0 0;
  font-size: 0.72rem;
}
</style>
