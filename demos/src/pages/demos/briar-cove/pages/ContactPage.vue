<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Button,
  Card,
  Icon,
  Input,
  Textarea,
  Divider,
  Section,
  Select,
  MapPlaceholder,
} from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'
import { departments } from '../data'

const emit = defineEmits<{ navigate: [page: string] }>()
const submitted = ref(false)

const departmentOptions = computed<SelectOption[]>(() =>
  departments.map((d) => ({ id: d.id, label: d.title })),
)
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <!-- Contact Form -->
          <div class="lg:col-span-3">
            <h1 class="font-serif text-3xl font-bold">Contact Us</h1>
            <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
            <p class="mt-3 text-sm">
              Questions, comments, or service requests? Fill out the form below or contact a
              department directly.
            </p>

            <!-- Confirmation -->
            <div
              v-if="submitted"
              class="bg-card border border-border mt-8 rounded-lg p-5 text-center sm:p-8"
            >
              <div
                class="bg-success/12 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
              >
                <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
              </div>
              <h3 class="mt-3 font-serif text-lg font-semibold">Message Sent</h3>
              <p class="mt-2 text-sm leading-relaxed">
                Thank you. We will be in touch within one business day.
              </p>
              <div class="mt-4 flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="sm" @click="emit('navigate', 'services')"
                  >Browse Services</Button
                >
                <Button variant="secondary" size="sm" @click="emit('navigate', 'meetings')"
                  >View Meetings</Button
                >
              </div>
            </div>

            <form
              v-else
              class="mt-8 space-y-4"
              aria-label="Contact City Hall"
              @submit.prevent="submitted = true"
            >
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" placeholder="Your name" required />
                <Input label="Email" placeholder="you@example.com" type="email" required />
              </div>
              <Input label="Phone" placeholder="(541) 555-0000" type="tel" />
              <div>
                <label for="contact-dept" class="mb-1 block text-xs font-medium">Department</label>
                <Select
                  id="contact-dept"
                  :options="departmentOptions"
                  placeholder="General Inquiry"
                />
              </div>
              <div>
                <label for="contact-message" class="mb-1 block text-xs font-medium">Message</label>
                <Textarea id="contact-message" placeholder="How can we help?" />
              </div>
              <Button variant="primary" class="w-full" type="submit">Send Message</Button>
              <p class="text-muted-foreground text-xs">
                Messages are typically answered within 2 business days.
              </p>
            </form>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6 lg:col-span-2">
            <!-- City Hall info -->
            <Card class="p-6">
              <h2 class="font-serif text-lg font-semibold">City Hall</h2>
              <address class="mt-3 not-italic text-sm leading-relaxed">
                100 Main Street<br />
                Briar Cove, OR 97420
              </address>
              <Divider class="my-3" />
              <div class="space-y-2 text-sm">
                <p>
                  <a href="tel:+15415550100" class="text-primary transition-colors hover:underline">
                    (541) 555-0100
                  </a>
                </p>
                <p class="text-muted-foreground text-xs">Monday–Friday, 8:00 AM – 5:00 PM</p>
              </div>

              <MapPlaceholder
                address="100 Main Street, Briar Cove"
                aspect="aspect-[16/10]"
                class="mt-4"
              />
            </Card>

            <!-- Emergency contacts -->
            <Card class="bg-destructive text-white p-6">
              <h2 class="font-serif text-lg font-bold">Emergency</h2>
              <p class="mt-2 text-2xl font-bold">911</p>
              <Divider class="border-white/20 my-3" />
              <p class="text-sm">
                Non-emergency police:
                <a href="tel:+15415550911" class="underline transition-opacity hover:opacity-70"
                  >(541) 555-0911</a
                >
              </p>
              <p class="mt-1 text-sm">
                Fire (non-emergency):
                <a href="tel:+15415550106" class="underline transition-opacity hover:opacity-70"
                  >(541) 555-0106</a
                >
              </p>
              <p class="mt-3 text-xs opacity-80">
                For water/sewer emergencies after hours, call Public Works dispatch.
              </p>
            </Card>

            <!-- Tsunami / Disaster Preparedness -->
            <Card class="p-6">
              <h2 class="font-serif text-lg font-semibold">Disaster Preparedness</h2>
              <p class="mt-2 text-sm leading-relaxed">
                Briar Cove is in a Cascadia Subduction Zone tsunami inundation area. Know your
                evacuation routes.
              </p>
              <Divider class="my-3" />
              <div class="space-y-2 text-xs">
                <div class="flex items-start gap-2">
                  <span class="text-destructive mt-0.5 font-bold">1</span>
                  <p>
                    Move immediately to high ground (Ridgeline, Salal Creek areas) if you feel
                    strong shaking lasting 20+ seconds.
                  </p>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-destructive mt-0.5 font-bold">2</span>
                  <p>
                    Do not wait for an official alert. Natural warning signs (shaking, ocean
                    withdrawal) mean evacuate now.
                  </p>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-destructive mt-0.5 font-bold">3</span>
                  <p>
                    Assembly points: Salal Creek Elementary, Ridgeline Community Church, Briar Cove
                    Golf Club.
                  </p>
                </div>
              </div>
              <Divider class="my-3" />
              <p class="text-muted-foreground text-xs">
                Tsunami sirens are tested the first Wednesday of each month at noon. Printed
                evacuation maps available at City Hall and all fire stations.
              </p>
            </Card>

            <!-- Department directory -->
            <Card class="p-6">
              <h2 class="font-serif text-lg font-semibold">Department Directory</h2>
              <div class="mt-4 space-y-3">
                <div v-for="d in departments" :key="d.id">
                  <p class="text-sm font-medium">{{ d.title }}</p>
                  <p class="text-xs">
                    <a
                      :href="`tel:${d.phone}`"
                      class="text-primary transition-colors hover:underline"
                      >{{ d.phone }}</a
                    >
                    · {{ d.director }}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
