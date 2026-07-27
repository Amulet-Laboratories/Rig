<script setup lang="ts">
import { ref } from 'vue'
import { Section, Card, Input, Button, Divider, Select } from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'

const submitted = ref(false)

const inquiryTypes: SelectOption[] = [
  { id: 'studio-visit', label: 'Studio visit' },
  { id: 'commission', label: 'Commission' },
  { id: 'press', label: 'Press / interview' },
  { id: 'purchase', label: 'Purchase inquiry' },
  { id: 'other', label: 'Other' },
]
</script>

<template>
  <div>
    <Section>
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-16 sm:grid-cols-2">
          <!-- Inquiry form -->
          <div>
            <h1 class="text-3xl font-normal italic">Inquiries</h1>
            <p class="mt-4 text-sm leading-relaxed">
              For sales inquiries and available works, please contact Brine Gallery directly. For
              studio visits, commissions, press, and reproduction rights, use the form below.
            </p>

            <div
              v-if="submitted"
              class="bg-success/12 text-success mt-8 rounded-lg p-4 text-center text-sm"
            >
              Thank you. We will be in touch within one business day.
            </div>
            <form
              v-else
              class="mt-8 space-y-5"
              aria-label="Studio inquiry"
              @submit.prevent="submitted = true"
            >
              <div>
                <label for="ml-name" class="mb-1 block text-xs uppercase">Name</label>
                <Input id="ml-name" placeholder="Your name" required />
              </div>
              <div>
                <label for="ml-email" class="mb-1 block text-xs uppercase">Email</label>
                <Input id="ml-email" type="email" placeholder="your@email.com" required />
              </div>
              <div>
                <label for="ml-type" class="mb-1 block text-xs uppercase">Inquiry type</label>
                <Select id="ml-type" :options="inquiryTypes" placeholder="Select" />
              </div>
              <div>
                <label for="ml-message" class="mb-1 block text-xs uppercase">Message</label>
                <Input
                  id="ml-message"
                  type="textarea"
                  placeholder="Your message"
                  :rows="4"
                  required
                />
              </div>
              <Button variant="primary" class="w-full" type="submit">Send</Button>
            </form>
          </div>

          <!-- Contact info -->
          <div>
            <Card class="bg-card p-6">
              <h2 class="text-xs uppercase">Gallery Representation</h2>
              <p class="mt-4 text-lg font-normal italic">Brine Gallery</p>
              <p class="mt-1 text-sm">Portland, OR</p>
              <p class="mt-2 text-sm">
                <a
                  href="https://brinegallery.com"
                  class="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
                  >brinegallery.com</a
                >
              </p>
              <p class="text-muted-foreground mt-1 text-xs">
                All sales inquiries and available works
              </p>

              <Divider class="my-6" />

              <h2 class="text-xs uppercase">Studio</h2>
              <p class="mt-4 text-sm">Dune Quarter, Briar Cove, Oregon</p>
              <p class="mt-2 text-sm">
                <a
                  href="mailto:hello@marenlys.com"
                  class="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
                >
                  hello@marenlys.com
                </a>
              </p>
              <p class="text-muted-foreground mt-1 text-xs">Studio visits by appointment only</p>

              <Divider class="my-6" />

              <h2 class="text-xs uppercase">For Press</h2>
              <p class="mt-4 text-sm leading-relaxed">
                High-resolution images, artist statement, and CV available on request. Please allow
                48 hours for image file delivery.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
