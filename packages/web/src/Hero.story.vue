<script setup lang="ts">
import Hero from './Hero.vue'
import { ref } from 'vue'

const pgLayout = ref<'split' | 'centered' | 'immersive'>('split')
</script>

<template>
  <Story title="Hero" icon="lucide:star" group="web">
    <Variant title="Split (Default)">
      <Hero layout="split">
        <template #eyebrow>
          <span
            style="
              display: inline-block;
              padding: 4px 12px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: var(--primary);
            "
          >
            New Release
          </span>
        </template>
        <template #title>
          <h1 style="margin: 0; font-size: 48px; color: var(--foreground)">
            Build something remarkable
          </h1>
        </template>
        <template #description>
          <p style="margin: 0; font-size: 18px; color: var(--muted-foreground)">
            A headless component library designed for speed, accessibility, and elegance.
          </p>
        </template>
        <template #actions>
          <div style="display: flex; gap: 12px">
            <button
              style="
                padding: 10px 24px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Get Started
            </button>
            <button
              style="
                padding: 10px 24px;
                background: transparent;
                color: var(--foreground);
                border: 1px solid var(--border);
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Learn More
            </button>
          </div>
        </template>
        <template #media>
          <div
            style="
              width: 100%;
              aspect-ratio: 4/3;
              background: var(--muted);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--muted-foreground);
            "
          >
            Media placeholder
          </div>
        </template>
      </Hero>
    </Variant>

    <Variant title="Centered">
      <Hero layout="centered">
        <template #eyebrow>
          <span style="font-size: 14px; font-weight: 600; color: var(--primary)">
            Introducing Rig
          </span>
        </template>
        <template #title>
          <h1 style="margin: 0; font-size: 56px; text-align: center; color: var(--foreground)">
            Components without compromise
          </h1>
        </template>
        <template #description>
          <p
            style="
              margin: 0;
              font-size: 20px;
              text-align: center;
              max-width: 640px;
              color: var(--muted-foreground);
            "
          >
            Headless, accessible, and endlessly customizable. Bring your own design.
          </p>
        </template>
        <template #actions>
          <div style="display: flex; gap: 12px; justify-content: center">
            <button
              style="
                padding: 12px 28px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Get Started
            </button>
          </div>
        </template>
      </Hero>
    </Variant>

    <Variant title="Immersive">
      <Hero layout="immersive">
        <template #title>
          <h1
            style="margin: 0; font-size: 56px; text-align: center; color: var(--primary-foreground)"
          >
            Full-bleed hero
          </h1>
        </template>
        <template #description>
          <p
            style="
              margin: 0;
              font-size: 18px;
              text-align: center;
              color: var(--primary-foreground);
              opacity: 0.9;
            "
          >
            Content overlays a background media element.
          </p>
        </template>
        <template #media>
          <div
            style="
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, var(--primary), var(--card));
            "
          />
        </template>
      </Hero>
    </Variant>

    <Variant title="With Overlay">
      <Hero layout="split">
        <template #title>
          <h1 style="margin: 0; font-size: 48px; color: var(--foreground)">Find your next stay</h1>
        </template>
        <template #description>
          <p style="margin: 0; color: var(--muted-foreground)">
            Luxury rooms at unbeatable prices.
          </p>
        </template>
        <template #overlay>
          <div
            style="
              padding: 24px;
              background: var(--card);
              border: 1px solid var(--border);
              border-radius: 8px;
              color: var(--foreground);
              text-align: center;
            "
          >
            Search / booking card overlapping the hero
          </div>
        </template>
      </Hero>
    </Variant>

    <Variant title="Playground">
      <Hero :layout="pgLayout">
        <template #eyebrow>
          <span style="font-size: 14px; font-weight: 600; color: var(--primary)"> Eyebrow </span>
        </template>
        <template #title>
          <h1 style="margin: 0; font-size: 48px; color: var(--foreground)">Playground Hero</h1>
        </template>
        <template #description>
          <p style="margin: 0; color: var(--muted-foreground)">
            Toggle the layout prop to see different configurations.
          </p>
        </template>
        <template #actions>
          <button
            style="
              padding: 10px 24px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 6px;
              cursor: pointer;
            "
          >
            Primary CTA
          </button>
        </template>
        <template v-if="pgLayout === 'split'" #media>
          <div
            style="
              width: 100%;
              aspect-ratio: 4/3;
              background: var(--muted);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--muted-foreground);
            "
          >
            Media
          </div>
        </template>
      </Hero>

      <template #controls>
        <HstSelect
          v-model="pgLayout"
          title="Layout"
          :options="['split', 'centered', 'immersive']"
        />
      </template>
    </Variant>
  </Story>
</template>
