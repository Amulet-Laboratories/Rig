<script setup lang="ts">
import Testimonial from './Testimonial.vue'
import { ref } from 'vue'

const pgLayout = ref<'card' | 'border'>('card')
</script>

<template>
  <Story title="Testimonial" icon="lucide:quote" group="web">
    <Variant title="Card (Default)">
      <Testimonial layout="card">
        <template #decorator>
          <span style="font-size: 36px; line-height: 1; color: var(--primary)">&ldquo;</span>
        </template>
        <template #quote>
          <p style="margin: 0; font-size: 16px; font-style: italic; color: var(--foreground)">
            This product transformed our workflow entirely. We shipped in half the time.
          </p>
        </template>
        <template #attribution>
          <div>
            <span style="font-weight: 600; color: var(--foreground)">Jane Doe</span>
            <span style="color: var(--muted-foreground)"> — CEO, Acme Corp</span>
          </div>
        </template>
      </Testimonial>
    </Variant>

    <Variant title="Border">
      <Testimonial layout="border">
        <template #quote>
          <p style="margin: 0; font-size: 16px; font-style: italic; color: var(--foreground)">
            The best developer experience I have encountered in years. Clean APIs, great docs.
          </p>
        </template>
        <template #attribution>
          <div>
            <span style="font-weight: 600; color: var(--foreground)">Alex Smith</span>
            <span style="color: var(--muted-foreground)"> — Lead Engineer, Startup Inc</span>
          </div>
        </template>
      </Testimonial>
    </Variant>

    <Variant title="With Divider">
      <Testimonial layout="card">
        <template #decorator>
          <span style="font-size: 36px; line-height: 1; color: var(--primary)">&ldquo;</span>
        </template>
        <template #quote>
          <p style="margin: 0; font-size: 16px; font-style: italic; color: var(--foreground)">
            Accessible by default, no hacks needed. Exactly what our team was looking for.
          </p>
        </template>
        <template #divider>
          <hr style="border: none; border-top: 1px solid var(--border); margin: 16px 0" />
        </template>
        <template #attribution>
          <div>
            <span style="font-weight: 600; color: var(--foreground)">Morgan Lee</span>
            <span style="color: var(--muted-foreground)"> — Product Manager, Design Co</span>
          </div>
        </template>
      </Testimonial>
    </Variant>

    <Variant title="Playground">
      <Testimonial :layout="pgLayout">
        <template #decorator>
          <span style="font-size: 36px; line-height: 1; color: var(--primary)">&ldquo;</span>
        </template>
        <template #quote>
          <p style="margin: 0; font-size: 16px; font-style: italic; color: var(--foreground)">
            Playground testimonial quote. Switch layouts using the controls.
          </p>
        </template>
        <template #attribution>
          <div>
            <span style="font-weight: 600; color: var(--foreground)">Pat Rivera</span>
            <span style="color: var(--muted-foreground)"> — Director, Some Company</span>
          </div>
        </template>
      </Testimonial>

      <template #controls>
        <HstSelect v-model="pgLayout" title="Layout" :options="['card', 'border']" />
      </template>
    </Variant>
  </Story>
</template>
