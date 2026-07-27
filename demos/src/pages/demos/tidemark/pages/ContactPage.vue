<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Button,
  Card,
  Icon,
  Input,
  Divider,
  Section,
  Select,
  ToggleGroup,
} from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'
import { agent } from '../data'

const props = defineProps<{ context?: string }>()
const emit = defineEmits<{ navigate: [page: string] }>()
const submitted = ref(false)

const inquiryType = ref<'buying' | 'selling' | ''>('')
const budgetRange = ref('')
const timeline = ref('')

const budgetOptions: SelectOption[] = [
  { id: 'under-500', label: 'Under $500k' },
  { id: '500-750', label: '$500k – $750k' },
  { id: '750-1m', label: '$750k – $1M' },
  { id: 'over-1m', label: 'Over $1M' },
]

const timelineOptions: SelectOption[] = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '1-3', label: '1–3 months' },
  { id: '3-6', label: '3–6 months' },
  { id: 'exploring', label: 'Just exploring' },
]

const contextLabel = computed(() => {
  if (!props.context) return ''
  if (props.context.startsWith('agent:')) return `Working with ${props.context.substring(6)}`
  if (props.context.startsWith('property:')) return `Inquiry about ${props.context.substring(9)}`
  return ''
})

const handleSubmit = () => {
  submitted.value = true
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <!-- Form -->
          <div class="lg:col-span-3">
            <h1 class="font-serif text-3xl font-bold">
              Start Your Search
              <span data-rig-accent class="mt-3 block h-0.5 w-12" />
            </h1>
            <p class="mt-3 text-sm">
              Tell us what you are looking for. Dana will follow up within one business day.
            </p>

            <!-- Context banner -->
            <div
              v-if="contextLabel"
              class="bg-primary/8 text-primary mt-6 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium"
            >
              <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
              {{ contextLabel }}
            </div>

            <!-- Confirmation state -->
            <div
              v-if="submitted"
              class="bg-card border-border mt-8 rounded-lg border p-5 text-center sm:p-8"
            >
              <div
                class="bg-primary/12 mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              >
                <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
              </div>
              <h3 class="mt-4 font-serif text-xl font-semibold">Inquiry Received</h3>
              <p class="mt-2 text-sm leading-relaxed">
                Dana will follow up within one business day. In the meantime, browse the latest
                listings or explore Briar Cove neighborhoods.
              </p>
              <div class="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="sm" @click="emit('navigate', 'listings')"
                  >Browse Listings</Button
                >
                <Button variant="secondary" size="sm" @click="emit('navigate', 'neighborhoods')"
                  >Explore Areas</Button
                >
              </div>
            </div>

            <form
              v-else
              class="mt-8 space-y-5"
              aria-label="Property inquiry form"
              @submit.prevent="handleSubmit"
            >
              <!-- Buying / Selling toggle -->
              <fieldset>
                <legend class="mb-2 text-xs font-medium uppercase tracking-wider">
                  I am interested in
                </legend>
                <ToggleGroup
                  v-model="inquiryType"
                  :items="[
                    { value: 'buying', label: 'Buying' },
                    { value: 'selling', label: 'Selling' },
                  ]"
                />
              </fieldset>

              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Name" placeholder="Your name" required />
                <Input label="Email" placeholder="you@example.com" type="email" required />
                <Input label="Phone" placeholder="(541) 555-0000" type="tel" required />

                <!-- Budget range -->
                <div>
                  <label for="budget" class="mb-1 block text-xs font-medium">Budget Range</label>
                  <Select
                    id="budget"
                    v-model="budgetRange"
                    :options="budgetOptions"
                    placeholder="Select range"
                  />
                </div>
              </div>

              <!-- Timeline -->
              <div>
                <label for="timeline" class="mb-1 block text-xs font-medium">Timeline</label>
                <Select
                  id="timeline"
                  v-model="timeline"
                  :options="timelineOptions"
                  placeholder="When are you looking to move?"
                />
              </div>

              <Input
                label="Tell us more"
                placeholder="3-bed oceanview, walkable to town, needs a workshop..."
              />

              <Button variant="primary" class="w-full" type="submit">Send Inquiry</Button>
            </form>
          </div>

          <!-- Sidebar: office info + agents -->
          <div class="lg:col-span-2">
            <Card class="p-6">
              <h2 class="font-serif text-lg font-semibold">Dana Whitfield</h2>
              <p class="text-primary mt-1 text-sm font-medium">{{ agent.role }}</p>
              <address class="mt-3 not-italic text-sm leading-relaxed">
                120 Harbor Street, Suite 200<br />
                Briar Cove, OR 97420
              </address>
              <p class="mt-2 text-sm">
                <a href="tel:+15415550189" class="text-primary transition-colors hover:underline">
                  {{ agent.phone }}
                </a>
              </p>
              <p class="mt-1 text-sm">
                <a
                  :href="`mailto:${agent.email}`"
                  class="text-primary transition-colors hover:underline"
                >
                  {{ agent.email }}
                </a>
              </p>
              <p class="mt-1 text-xs">Mon–Fri 9am–5pm · Sat 10am–3pm</p>

              <Divider class="my-5" />

              <div class="flex items-center gap-3">
                <img
                  v-if="agent.img"
                  :src="agent.img"
                  :alt="`Photo of ${agent.name}`"
                  class="h-14 w-14 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p class="text-sm leading-relaxed">
                    {{ agent.years }} years helping buyers and sellers on the Oregon coast.
                  </p>
                  <button
                    class="text-primary cursor-pointer mt-1 text-xs transition-colors hover:underline"
                    @click="emit('navigate', 'about')"
                  >
                    Learn more about Dana
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
