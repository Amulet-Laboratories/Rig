<script setup lang="ts">
import { useFathom } from '@amulet-laboratories/rig'
import { useProducts } from '../../composables/useProducts'

const props = defineProps<{
  slug: string
}>()

const { getProduct } = useProducts()
const { data: product, status } = await useAsyncData(`product-${props.slug}`, () =>
  getProduct(props.slug),
)

const { trackAffiliateClick } = useFathom()

function onAffiliateClick() {
  trackAffiliateClick(props.slug)
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
      <span data-rig-product-card-rating>{{ product.rating }}/5</span>
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
      <a
        :href="product.amazon?.url"
        target="_blank"
        rel="nofollow noopener sponsored"
        data-rig-product-card-link
        @click="onAffiliateClick"
      >
        Check price on Amazon
      </a>
    </div>
  </div>
</template>
