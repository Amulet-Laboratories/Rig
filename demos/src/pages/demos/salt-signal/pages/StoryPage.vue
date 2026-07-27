<script setup lang="ts">
import { Section, StatRow, CTABanner, Card, Button } from '@amulet-laboratories/rig'
import { makers, storeStats, values } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <h1 class="font-serif text-3xl font-bold">Our Story</h1>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed">
        A general store for people who notice the difference.
      </p>
    </div>
  </Section>

  <!-- The Beginning -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div>
        <h2 class="font-serif text-2xl font-bold">How It Started</h2>
        <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />
        <div class="mt-5 space-y-4 text-sm leading-relaxed">
          <p>
            Lina Okafor spent a decade in marketing in Portland — good work, decent pay, and a
            growing feeling that she was helping people buy things they didn't need.
          </p>
          <p>
            In 2021, she moved to Briar Cove to be closer to her brother David, who was serving on
            the city council. The town had a bakery, a hardware store, and a brewery, but nowhere to
            buy a decent candle or a jar of local honey without driving 45 minutes to the coast.
          </p>
          <p>
            She signed the lease on a 600-square-foot storefront on Main Street in January 2022.
            Salt &amp; Signal opened that March with 40 products on the shelves, most of them
            sourced within 50 miles.
          </p>
          <p>
            The name comes from two things Briar Cove has in abundance: sea salt from the Pacific,
            and the old signal tower on the bluff that guided ships into the harbor.
          </p>
        </div>
      </div>
      <div class="overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80"
          alt="Inside Salt & Signal general store"
          class="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </Section>

  <!-- Philosophy -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">What We Believe</h2>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Every product on our shelf earned its place. We don't stock anything we wouldn't use in our
        own homes.
      </p>
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card v-for="v in values" :key="v.title" class="p-5">
          <h3 class="font-serif text-sm font-bold">{{ v.title }}</h3>
          <p class="mt-2 text-xs leading-relaxed">{{ v.description }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Makers -->
  <Section>
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">Meet the Makers</h2>
      <span data-rig-accent class="mx-auto mt-2 block h-0.5 w-10" aria-hidden="true" />
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        The people behind the products. We know every maker personally — most of them live within an
        hour of the shop.
      </p>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card v-for="m in makers" :key="m.id" class="overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-3">
            <img
              v-if="m.img"
              :src="m.img"
              :alt="`Photo of ${m.name}`"
              class="aspect-[16/9] w-full object-cover sm:col-span-1 sm:aspect-square"
              loading="lazy"
            />
            <div class="p-5 sm:col-span-2">
              <h3 class="font-serif text-base font-bold">{{ m.name }}</h3>
              <p class="text-primary text-xs">{{ m.role }}</p>
              <p class="mt-2 text-xs leading-relaxed">{{ m.bio }}</p>
              <p class="text-muted-foreground mt-2 text-xs">Products: {{ m.products }}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </Section>

  <!-- By the numbers -->
  <Section class="bg-secondary">
    <StatRow :stats="storeStats" variant="filled" />
  </Section>

  <!-- CTA -->
  <CTABanner layout="centered">
    <h2 class="font-serif text-xl font-bold">Come say hello</h2>
    <p class="mx-auto mt-3 max-w-md text-sm">
      We're on Main Street in Briar Cove, Tuesday through Sunday. Grab a honey sample, browse the
      shelves, and see what's new.
    </p>
    <template #action>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <Button variant="cta-ghost" @click="emit('navigate', 'visit')"> Visit the Shop </Button>
        <Button variant="cta-light" @click="emit('navigate', 'shop')"> Browse Online </Button>
      </div>
    </template>
  </CTABanner>
</template>
