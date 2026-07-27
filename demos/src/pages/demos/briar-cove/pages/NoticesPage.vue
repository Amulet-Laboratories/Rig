<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Card, Badge, Input, Section } from '@amulet-laboratories/rig'
import { notices } from '../data'
import type { Notice } from '../data'

const submitted = ref(false)

const filterType = ref<Notice['type'] | ''>('')
const allTypes: Notice['type'][] = ['Advisory', 'Meeting', 'Report', 'Event']

const noticeVariant: Record<string, string> = {
  Advisory: 'warning',
  Meeting: 'info',
  Report: 'muted',
  Event: 'success',
}

const filteredNotices = computed(() => {
  if (!filterType.value) return notices
  return notices.filter((n) => n.type === filterType.value)
})
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-5xl">
        <h1 class="font-serif text-3xl font-bold">Public Notices</h1>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          Official notices, advisories, and community announcements from the City of Briar Cove.
        </p>

        <!-- Type filter -->
        <div
          class="mt-8 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter notices by type"
        >
          <button
            class="cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            :class="
              !filterType ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
            "
            :aria-pressed="!filterType"
            @click="filterType = ''"
          >
            All ({{ notices.length }})
          </button>
          <button
            v-for="t in allTypes"
            :key="t"
            class="cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            :class="
              filterType === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            "
            :aria-pressed="filterType === t"
            @click="filterType = t"
          >
            {{ t }} ({{ notices.filter((n) => n.type === t).length }})
          </button>
        </div>

        <!-- Notices list -->
        <div class="mt-6 space-y-4">
          <Card v-for="n in filteredNotices" :key="n.title" class="p-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-3">
                  <Badge size="sm" :variant="noticeVariant[n.type]">
                    {{ n.type }}
                  </Badge>
                  <h3 class="font-semibold">{{ n.title }}</h3>
                </div>
                <p class="text-muted-foreground mt-1 text-xs">{{ n.date }}</p>
                <p class="mt-2 text-sm leading-relaxed">{{ n.summary }}</p>
              </div>
              <Button variant="secondary" size="sm" class="flex-shrink-0 self-start">Read</Button>
            </div>
          </Card>
        </div>

        <div v-if="filteredNotices.length === 0" class="py-12 text-center">
          <p class="text-sm">No notices of type "{{ filterType }}" right now.</p>
          <Button variant="secondary" size="sm" class="mt-2" @click="filterType = ''"
            >Show All</Button
          >
        </div>
      </div>
    </Section>

    <!-- Newsletter signup -->
    <Section variant="alternate">
      <div class="mx-auto max-w-lg text-center">
        <h2 class="font-serif text-2xl font-bold">Stay Informed</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          Get city notices, meeting reminders, and community updates delivered to your inbox.
        </p>
        <div v-if="submitted" class="mt-6 rounded-lg bg-card border border-border p-6">
          <p class="text-sm font-semibold">You are subscribed.</p>
          <p class="text-muted-foreground mt-1 text-xs">
            Expect 2–4 emails per month with city notices, meeting reminders, and community updates.
          </p>
        </div>
        <form
          v-else
          class="mt-6 flex gap-2"
          aria-label="Newsletter signup"
          @submit.prevent="submitted = true"
        >
          <Input placeholder="your@email.com" type="email" class="flex-1" />
          <Button variant="primary" type="submit">Subscribe</Button>
        </form>
        <p v-if="!submitted" class="text-muted-foreground mt-3 text-xs">
          Typically 2–4 emails per month. Unsubscribe anytime.
        </p>
      </div>
    </Section>
  </div>
</template>
