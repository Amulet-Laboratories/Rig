<script setup lang="ts">
import CTABanner from './CTABanner.vue'
import { ref } from 'vue'

const pgLayout = ref<'row' | 'centered'>('row')
</script>

<template>
  <Story title="CTABanner" icon="lucide:megaphone" group="web">
    <Variant title="Row (Default)">
      <CTABanner layout="row">
        <div>
          <h3 style="margin: 0 0 4px; font-size: 20px; color: var(--foreground)">
            Ready to get started?
          </h3>
          <p style="margin: 0; color: var(--muted-foreground)">
            Join thousands of teams already using our platform.
          </p>
        </div>
        <template #action>
          <button
            style="
              padding: 10px 24px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              white-space: nowrap;
            "
          >
            Start Free Trial
          </button>
        </template>
      </CTABanner>
    </Variant>

    <Variant title="Centered">
      <CTABanner layout="centered">
        <div style="text-align: center">
          <h3 style="margin: 0 0 8px; font-size: 24px; color: var(--foreground)">
            Start building today
          </h3>
          <p style="margin: 0; color: var(--muted-foreground); max-width: 480px">
            No credit card required. Get up and running in minutes.
          </p>
        </div>
        <template #action>
          <button
            style="
              padding: 12px 32px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
            "
          >
            Create Account
          </button>
        </template>
      </CTABanner>
    </Variant>

    <Variant title="With Icon">
      <CTABanner layout="centered">
        <template #icon>
          <span style="font-size: 32px">&#9889;</span>
        </template>
        <div style="text-align: center">
          <h3 style="margin: 0 0 8px; font-size: 24px; color: var(--foreground)">
            Supercharge your workflow
          </h3>
          <p style="margin: 0; color: var(--muted-foreground)">
            Automate repetitive tasks and focus on what matters.
          </p>
        </div>
        <template #action>
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
            Learn More
          </button>
        </template>
      </CTABanner>
    </Variant>

    <Variant title="Playground">
      <CTABanner :layout="pgLayout">
        <div :style="pgLayout === 'centered' ? 'text-align: center' : ''">
          <h3 style="margin: 0 0 4px; font-size: 20px; color: var(--foreground)">
            Call to action headline
          </h3>
          <p style="margin: 0; color: var(--muted-foreground)">
            Supporting description text for the banner.
          </p>
        </div>
        <template #action>
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
            Take Action
          </button>
        </template>
      </CTABanner>

      <template #controls>
        <HstSelect v-model="pgLayout" title="Layout" :options="['row', 'centered']" />
      </template>
    </Variant>
  </Story>
</template>
