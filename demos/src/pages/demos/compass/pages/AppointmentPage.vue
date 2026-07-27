<script setup lang="ts">
import { ref } from 'vue'
import { Section, Card, Input, Button } from '@amulet-laboratories/rig'
const submitted = ref(false)
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold sm:text-4xl">Request an Appointment</h1>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-base leading-relaxed">
        Fill out the form below and we'll call to confirm within one business day. For urgent needs,
        call
        <a href="tel:+15415550199" class="font-medium underline transition-opacity hover:opacity-70"
          >(541) 555-0199</a
        >
        directly.
      </p>
    </div>
  </Section>

  <!-- Form + Side Info -->
  <Section>
    <div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-[1fr_280px]">
      <!-- Form -->
      <div v-if="submitted" class="space-y-4 text-center" role="status" aria-live="polite">
        <p class="text-lg font-medium text-primary">Request submitted.</p>
        <p class="text-muted-foreground">We will contact you within one business day.</p>
      </div>
      <Card v-else class="p-6">
        <form class="space-y-5" aria-label="Appointment request" @submit.prevent="submitted = true">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label for="appt-first" class="mb-1 block text-sm font-medium">First Name</label>
              <Input id="appt-first" placeholder="Dana" required />
            </div>
            <div>
              <label for="appt-last" class="mb-1 block text-sm font-medium">Last Name</label>
              <Input id="appt-last" placeholder="Park" required />
            </div>
          </div>
          <div>
            <label for="appt-email" class="mb-1 block text-sm font-medium">Email</label>
            <Input id="appt-email" type="email" placeholder="dana@example.com" required />
          </div>
          <div>
            <label for="appt-phone" class="mb-1 block text-sm font-medium">Phone Number</label>
            <Input id="appt-phone" type="tel" placeholder="(541) 555-0000" required />
          </div>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label for="appt-pet" class="mb-1 block text-sm font-medium">Pet's Name</label>
              <Input id="appt-pet" placeholder="Biscuit" />
            </div>
            <div>
              <label for="appt-species" class="mb-1 block text-sm font-medium"
                >Species &amp; Breed</label
              >
              <Input id="appt-species" placeholder="Dog — Labrador Retriever" />
            </div>
          </div>
          <div>
            <label for="appt-reason" class="mb-1 block text-sm font-medium">Reason for Visit</label>
            <Input
              id="appt-reason"
              placeholder="Annual wellness exam, dental concern, limping, etc."
            />
          </div>
          <div>
            <label for="appt-pref" class="mb-1 block text-sm font-medium"
              >Preferred Day &amp; Time</label
            >
            <Input id="appt-pref" placeholder="e.g. Tuesday morning, any weekday afternoon" />
          </div>
          <Button variant="primary" class="w-full" size="lg">Submit Request</Button>
          <p class="text-center text-xs">
            We'll call to confirm. This is a request, not a confirmed booking.
          </p>
        </form>
      </Card>

      <!-- Sidebar -->
      <div class="space-y-6">
        <Card class="p-5">
          <h3 class="text-sm font-bold">What to Expect</h3>
          <ol class="mt-3 space-y-3 text-sm">
            <li class="flex items-start gap-2">
              <span
                class="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                >1</span
              >
              Submit your request here
            </li>
            <li class="flex items-start gap-2">
              <span
                class="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                >2</span
              >
              We call within 1 business day
            </li>
            <li class="flex items-start gap-2">
              <span
                class="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                >3</span
              >
              Confirm date, time, and details
            </li>
            <li class="flex items-start gap-2">
              <span
                class="bg-primary flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
                >4</span
              >
              Arrive 10 min early with records
            </li>
          </ol>
        </Card>

        <Card class="p-5">
          <h3 class="text-sm font-bold">Hours</h3>
          <dl class="mt-3 space-y-2 text-sm">
            <div class="flex justify-between">
              <dt>Mon–Fri</dt>
              <dd>7:30 AM – 6 PM</dd>
            </div>
            <div class="flex justify-between">
              <dt>Saturday</dt>
              <dd>8 AM – 2 PM</dd>
            </div>
            <div class="flex justify-between">
              <dt>Sunday</dt>
              <dd>Closed</dd>
            </div>
          </dl>
        </Card>

        <Card class="p-5">
          <h3 class="text-sm font-bold">Urgent?</h3>
          <p class="mt-2 text-sm">
            Don't wait for a callback. Call us directly at
            <a
              href="tel:+15415550199"
              class="font-bold underline transition-opacity hover:opacity-70"
              >(541) 555-0199</a
            >. Walk-ins accepted during business hours.
          </p>
        </Card>
      </div>
    </div>
  </Section>
</template>
