<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Card,
  Icon,
  Input,
  Textarea,
  Divider,
  Section,
  Select,
  ServiceGrid,
} from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'
import { quickServices, departments, faqItems } from '../data'

const reportSubmitted = ref(false)

const issueTypes: SelectOption[] = [
  { id: 'pothole', label: 'Pothole or road damage' },
  { id: 'streetlight', label: 'Streetlight outage' },
  { id: 'water-sewer', label: 'Water or sewer issue' },
  { id: 'parks', label: 'Parks or trails' },
  { id: 'noise', label: 'Noise complaint' },
  { id: 'other', label: 'Other' },
]

const openFaq = ref<number | null>(null)
const toggleFaq = (i: number) => {
  openFaq.value = openFaq.value === i ? null : i
}
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Services Grid -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h1 class="font-serif text-3xl font-bold">City Services</h1>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          Online services and resources for Briar Cove residents and businesses.
        </p>

        <ServiceGrid :items="quickServices" layout="grid" :columns="4" class="mt-10">
          <template #item="{ item }">
            <Card
              interactive
              class="p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <p class="text-sm font-semibold">{{ item.title }}</p>
              <p
                v-if="item.description"
                class="text-muted-foreground mt-1.5 text-xs leading-relaxed"
              >
                {{ item.description }}
              </p>
            </Card>
          </template>
        </ServiceGrid>
      </div>
    </Section>

    <!-- Departments overview -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-bold">Departments</h2>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">Six departments serving the City of Briar Cove.</p>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card v-for="d in departments" :key="d.id" class="p-5">
            <h3 class="font-serif text-lg font-semibold">{{ d.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed">{{ d.description }}</p>
            <Divider class="my-3" />
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span class="font-medium">{{ d.director }}</span>
              <a :href="`tel:${d.phone}`" class="text-primary transition-colors hover:underline">{{
                d.phone
              }}</a>
              <a
                :href="`mailto:${d.email}`"
                class="text-primary transition-colors hover:underline"
                >{{ d.email }}</a
              >
            </div>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span
                v-for="r in d.responsibilities"
                :key="r"
                class="bg-secondary rounded-md px-2 py-0.5 text-xs"
              >
                {{ r }}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Utility Rates -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-bold">Utility Rates</h2>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          Current monthly rates for City of Briar Cove utility services. Rates effective July 1,
          2025.
        </p>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card class="p-5">
            <p class="text-xs font-medium uppercase tracking-wider">Water</p>
            <p class="text-primary mt-2 font-serif text-2xl font-bold">$42.50</p>
            <p class="text-muted-foreground text-xs">Base rate (first 500 cu ft)</p>
            <Divider class="my-3" />
            <p class="text-xs">$3.85 per 100 cu ft over base. Senior discount: 15%.</p>
          </Card>
          <Card class="p-5">
            <p class="text-xs font-medium uppercase tracking-wider">Sewer</p>
            <p class="text-primary mt-2 font-serif text-2xl font-bold">$38.00</p>
            <p class="text-muted-foreground text-xs">Flat rate, residential</p>
            <Divider class="my-3" />
            <p class="text-xs">Commercial rates vary by meter size. Contact Finance for details.</p>
          </Card>
          <Card class="p-5">
            <p class="text-xs font-medium uppercase tracking-wider">Stormwater</p>
            <p class="text-primary mt-2 font-serif text-2xl font-bold">$12.75</p>
            <p class="text-muted-foreground text-xs">Per ERU, residential</p>
            <Divider class="my-3" />
            <p class="text-xs">
              1 ERU = 2,500 sq ft impervious surface. Credits available for rain gardens.
            </p>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Parks & Trails -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-bold">Parks & Trails</h2>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          8 city parks and 14 miles of maintained trails across Briar Cove.
        </p>

        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card class="p-5">
            <h3 class="font-semibold">Trail System</h3>
            <ul class="mt-3 space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5 text-xs font-bold">5.2 mi</span>
                <div>
                  <p class="font-medium">Salal Creek Trail</p>
                  <p class="text-muted-foreground text-xs">
                    Paved, ADA accessible. Creek to library loop.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5 text-xs font-bold">3.8 mi</span>
                <div>
                  <p class="font-medium">Ridge Trail</p>
                  <p class="text-muted-foreground text-xs">
                    Moderate. Cedar Point Overlook to Ridgeline.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5 text-xs font-bold">2.4 mi</span>
                <div>
                  <p class="font-medium">Harbor Walk</p>
                  <p class="text-muted-foreground text-xs">
                    Flat waterfront path. Marina to Cannery district.
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary mt-0.5 text-xs font-bold">2.6 mi</span>
                <div>
                  <p class="font-medium">Dune Loop</p>
                  <p class="text-muted-foreground text-xs">
                    Sandy. Beach access at three points. Seasonal closures for nesting.
                  </p>
                </div>
              </li>
            </ul>
          </Card>
          <Card class="p-5">
            <h3 class="font-semibold">Park Reservations</h3>
            <p class="mt-2 text-sm leading-relaxed">
              Shelters, picnic areas, and the Community Center are available for reservation.
              Bookings open 60 days in advance.
            </p>
            <Divider class="my-3" />
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span>Shelter (half day)</span>
                <span class="text-primary font-medium">$50</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Shelter (full day)</span>
                <span class="text-primary font-medium">$85</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Community Center Room A</span>
                <span class="text-primary font-medium">$75/hr</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Community Center Room B</span>
                <span class="text-primary font-medium">$50/hr</span>
              </div>
            </div>
            <Divider class="my-3" />
            <p class="text-muted-foreground text-xs">
              Contact Parks & Recreation at (541) 555-0104 or submit a reservation request online.
            </p>
          </Card>
        </div>
      </div>
    </Section>

    <!-- City Code & Ordinances -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-bold">City Code & Ordinances</h2>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">Commonly referenced sections of the Briar Cove Municipal Code.</p>

        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="code in [
              {
                title: 'Noise Ordinance',
                ref: 'BCMC 8.20',
                desc: 'Quiet hours 10 PM – 7 AM. Construction limited to 7 AM – 6 PM weekdays.',
              },
              {
                title: 'Parking Regulations',
                ref: 'BCMC 10.12',
                desc: '72-hour limit on public streets. No overnight parking Nov–Mar on posted routes.',
              },
              {
                title: 'Short-Term Rentals',
                ref: 'BCMC 17.45',
                desc: 'STR license required. Max 120 rental nights/year in residential zones.',
              },
              {
                title: 'Tree Removal',
                ref: 'BCMC 15.08',
                desc: 'Permit required for trees over 8 inches DBH on any lot within city limits.',
              },
              {
                title: 'Yard Debris Burning',
                ref: 'BCMC 8.30',
                desc: 'Seasonal permits required. Zones 1–3 residential only. Check fire conditions.',
              },
              {
                title: 'Animal Control',
                ref: 'BCMC 6.04',
                desc: 'Dogs must be leashed in public. Limit of 3 dogs or 4 cats per household.',
              },
            ]"
            :key="code.ref"
            class="p-4"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-semibold">{{ code.title }}</h3>
              <span class="text-muted-foreground flex-shrink-0 text-xs font-mono">{{
                code.ref
              }}</span>
            </div>
            <p class="mt-2 text-xs leading-relaxed">{{ code.desc }}</p>
          </Card>
        </div>
      </div>
    </Section>

    <!-- FAQ / How Do I -->
    <Section variant="alternate">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-center font-serif text-2xl font-bold">Frequently Asked Questions</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true" />

        <div class="mt-8 space-y-2">
          <Card v-for="(faq, i) in faqItems" :key="faq.question" class="overflow-hidden">
            <button
              class="cursor-pointer flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-card"
              :aria-expanded="openFaq === i"
              :aria-controls="`faq-panel-${i}`"
              @click="toggleFaq(i)"
            >
              <span class="text-sm font-semibold">{{ faq.question }}</span>
              <Icon
                icon="heroicons:chevron-down"
                size="sm"
                aria-hidden="true"
                class="flex-shrink-0 transition-transform"
                :class="{ 'rotate-180': openFaq === i }"
              />
            </button>
            <div
              v-if="openFaq === i"
              :id="`faq-panel-${i}`"
              role="region"
              class="border-border border-t px-5 pb-5 pt-3"
            >
              <p class="text-sm leading-relaxed">{{ faq.answer }}</p>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Report an Issue -->
    <Section>
      <div class="mx-auto max-w-lg">
        <h2 class="text-center font-serif text-2xl font-bold">Report a Non-Emergency Issue</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-center text-sm">
          Potholes, streetlight outages, graffiti, or other non-emergency concerns.
        </p>

        <div
          v-if="reportSubmitted"
          class="bg-card border border-border mt-8 rounded-lg p-5 text-center sm:p-8"
        >
          <div
            class="bg-success/12 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          >
            <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
          </div>
          <h3 class="mt-3 font-serif text-lg font-semibold">Report Submitted</h3>
          <p class="mt-2 text-sm leading-relaxed">
            A city staff member will follow up within 2 business days. For urgent matters, call the
            non-emergency line.
          </p>
          <p class="mt-4 text-sm font-medium">
            <a href="tel:+15415550911" class="text-primary transition-colors hover:underline"
              >(541) 555-0911</a
            >
          </p>
        </div>

        <form
          v-else
          class="mt-8 space-y-4"
          aria-label="Report a non-emergency issue"
          @submit.prevent="reportSubmitted = true"
        >
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Your Name" placeholder="Name" />
            <Input label="Phone or Email" placeholder="How to reach you" />
          </div>
          <div>
            <label for="issue-type" class="mb-1 block text-xs font-medium">Issue Type</label>
            <Select id="issue-type" :options="issueTypes" placeholder="Select a category" />
          </div>
          <Input label="Location" placeholder="Address or nearest intersection" />
          <div>
            <label for="issue-description" class="mb-1 block text-xs font-medium"
              >Description</label
            >
            <Textarea id="issue-description" placeholder="Describe the issue..." />
          </div>
          <Button variant="primary" class="w-full" type="submit">Submit Report</Button>
          <p class="text-muted-foreground text-center text-xs">
            For emergencies, call 911. For non-emergency police matters, call (541) 555-0911.
          </p>
        </form>
      </div>
    </Section>
  </div>
</template>
