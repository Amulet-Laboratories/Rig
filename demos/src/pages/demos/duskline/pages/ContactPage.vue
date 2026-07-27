<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button, Card, Input, Textarea, Divider, Section, Select } from '@amulet-laboratories/rig'
import type { SelectOption } from '@amulet-laboratories/rig'

const submitted = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  type: '',
  description: '',
})

const investigationTypes: SelectOption[] = [
  { id: 'surveillance', label: 'Surveillance' },
  { id: 'background-check', label: 'Background Check' },
  { id: 'asset-tracing', label: 'Asset Tracing' },
  { id: 'litigation-support', label: 'Litigation Support' },
  { id: 'missing-persons', label: 'Missing Persons' },
  { id: 'insurance-investigation', label: 'Insurance Investigation' },
  { id: 'other', label: 'Other' },
]
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <Section>
      <div class="mx-auto max-w-3xl">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <!-- Form -->
          <div class="lg:col-span-3">
            <p class="text-xs font-medium uppercase tracking-widest text-primary">Contact</p>
            <div data-rig-accent class="mt-2 h-px w-8" aria-hidden="true" />
            <h1 class="mt-6 text-3xl font-extralight uppercase tracking-widest">Get in Touch</h1>
            <p class="mt-4 text-sm leading-relaxed">
              All inquiries are confidential. Initial consultations are by phone or in person — no
              charge, no obligation.
            </p>

            <!-- Confirmation -->
            <div
              v-if="submitted"
              class="mt-8 rounded-sm bg-card border border-border p-5 text-center sm:p-8"
            >
              <div data-rig-accent class="mx-auto h-px w-12" aria-hidden="true" />
              <p class="mt-4 text-xs font-medium uppercase tracking-widest text-primary">
                Received
              </p>
              <p class="mt-4 text-sm leading-relaxed">
                Your inquiry has been received. We will be in touch within 24 hours by phone.
              </p>
              <p class="mt-2 text-xs text-muted-foreground">
                Do not include sensitive case details in follow-up emails. We will discuss specifics
                by phone.
              </p>
              <div data-rig-accent class="mx-auto mt-4 h-px w-12" aria-hidden="true" />
            </div>

            <form
              v-else
              class="mt-8 space-y-5"
              aria-label="Contact inquiry"
              @submit.prevent="submitted = true"
            >
              <div>
                <label for="dk-name" class="mb-1 block text-xs uppercase tracking-wider"
                  >Your name</label
                >
                <Input id="dk-name" placeholder="Name" required />
              </div>
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label for="dk-phone" class="mb-1 block text-xs uppercase tracking-wider"
                    >Phone number</label
                  >
                  <Input id="dk-phone" type="tel" placeholder="Phone number" required />
                </div>
                <div>
                  <label for="dk-email" class="mb-1 block text-xs uppercase tracking-wider"
                    >Email
                    <span class="normal-case tracking-normal text-muted-foreground"
                      >(optional)</span
                    ></label
                  >
                  <Input id="dk-email" type="email" placeholder="Email address" />
                </div>
              </div>
              <div>
                <label for="dk-type" class="mb-1 block text-xs uppercase tracking-wider"
                  >Investigation type</label
                >
                <Select id="dk-type" :options="investigationTypes" placeholder="Select a service" />
              </div>
              <div>
                <label for="dk-description" class="mb-1 block text-xs uppercase tracking-wider"
                  >Brief description</label
                >
                <Textarea
                  id="dk-description"
                  v-model="form.description"
                  name="description"
                  placeholder="Brief description of your inquiry"
                  :rows="3"
                />
              </div>
              <Button variant="primary" class="w-full" type="submit">Send Inquiry</Button>
            </form>
            <p class="mt-6 text-xs text-muted-foreground">
              Response within 24 hours. Do not include sensitive details in this form — we will
              discuss specifics by phone.
            </p>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-2">
            <Card class="p-6">
              <p class="text-xs font-medium uppercase tracking-eyebrow text-primary">Direct Line</p>
              <p class="mt-3 font-mono text-lg text-primary">
                <a href="tel:+15415550177" class="transition-colors hover:underline"
                  >(541) 555-0177</a
                >
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                Phone is the preferred first contact method.
              </p>
              <!-- TODO: Add email contact (e.g. inquiries@duskline.com) once client provides one -->

              <div class="py-6"><Divider /></div>

              <p class="text-xs font-medium uppercase tracking-eyebrow text-primary">Office</p>
              <address class="mt-3 not-italic text-sm leading-relaxed">
                Briar Cove, Oregon<br />
                <span class="text-xs text-muted-foreground">
                  By appointment only. No walk-ins.
                </span>
              </address>

              <div class="py-6"><Divider /></div>

              <p class="text-xs font-medium uppercase tracking-eyebrow text-primary">
                Jurisdiction
              </p>
              <p class="mt-3 text-sm leading-relaxed">
                Licensed in Oregon. Primary coverage: Coos, Curry, Douglas, and Lane counties.
                Portland metro and statewide cases accepted.
              </p>

              <div class="py-6"><Divider /></div>

              <p class="text-xs font-medium uppercase tracking-eyebrow text-primary">
                For Attorneys
              </p>
              <p class="mt-3 text-sm leading-relaxed">
                Retainer agreements and litigation support rates provided on request. Available for
                deposition and trial testimony statewide.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  </div>
</template>
