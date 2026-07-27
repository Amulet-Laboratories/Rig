<script setup lang="ts">
import { Section, CTABanner, Card, Badge, Button, TeamGrid } from '@amulet-laboratories/rig'
import type { TeamMember } from '@amulet-laboratories/rig'

const emit = defineEmits<{ navigate: [page: string] }>()

const staff: (TeamMember & { years: number; education: string; specialties: string[] })[] = [
  {
    id: 'sonia-reyes',
    name: 'Dr. Sonia Reyes, DVM',
    role: 'Lead Veterinarian',
    years: 16,
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    bio: 'Oregon State DVM, 2010. Specializes in small animal internal medicine. Lives in the Dune Quarter with two rescue greyhounds.',
    education: 'Oregon State University',
    specialties: ['Internal Medicine', 'Senior Pet Care', 'Preventive Medicine'],
  },
  {
    id: 'james-wren',
    name: 'Dr. James Wren, DVM',
    role: 'Associate Veterinarian',
    years: 7,
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    bio: 'UC Davis DVM. Focus on exotic and avian care. Volunteers at the Briar Cove wildlife rehabilitation center on weekends.',
    education: 'UC Davis',
    specialties: ['Exotic Animals', 'Avian Care', 'Wildlife Rehabilitation'],
  },
  {
    id: 'casey-aldric',
    name: 'Casey Aldric',
    role: 'Veterinary Technician',
    years: 11,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: "Certified vet tech since 2015. Handles surgical prep, anesthesia monitoring, and the clinic's blood bank. No relation to Aldric & Pace attorneys.",
    education: 'Portland CC Vet Tech Program',
    specialties: ['Surgical Prep', 'Anesthesia Monitoring', 'Lab Work'],
  },
  {
    id: 'maggie-ostrova',
    name: 'Maggie Ostrova',
    role: 'Client Services Manager',
    years: 5,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    bio: 'Runs the front desk with calm efficiency. Previously managed operations at Lantern House Inn before joining the clinic.',
    education: 'Southern Oregon University',
    specialties: ['Scheduling', 'Insurance Coordination', 'Client Relations'],
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-3xl font-bold sm:text-4xl">Our Team</h1>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <p class="mt-4 text-base leading-relaxed">
        Four people who chose this work because they care. Every member of our team treats your pet
        the way they'd want their own treated.
      </p>
    </div>
  </Section>

  <!-- Team Grid -->
  <Section>
    <div class="mx-auto max-w-4xl">
      <TeamGrid :members="staff" layout="card" :columns="2">
        <template #member="{ member }">
          <Card class="overflow-hidden">
            <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[160px_1fr]">
              <div class="flex flex-col items-center gap-3 text-center">
                <img
                  :src="member.img"
                  :alt="`Photo of ${member.name}`"
                  class="h-32 w-32 rounded-full object-cover ring-2 ring-accent"
                  loading="lazy"
                />
                <Badge variant="secondary"
                  >{{ (member as (typeof staff)[number]).years }} years</Badge
                >
              </div>
              <div>
                <h2 class="text-lg font-bold">{{ member.name }}</h2>
                <p class="text-sm font-medium">{{ member.role }}</p>
                <p class="mt-3 text-sm leading-relaxed">{{ member.bio }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="s in (member as (typeof staff)[number]).specialties"
                    :key="s"
                    class="bg-secondary rounded-full px-3 py-1 text-xs"
                  >
                    {{ s }}
                  </span>
                </div>
                <p class="mt-3 text-xs">
                  <span class="font-medium">Education:</span>
                  {{ (member as (typeof staff)[number]).education }}
                </p>
              </div>
            </div>
          </Card>
        </template>
      </TeamGrid>
    </div>
  </Section>

  <!-- Join Our Team -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-xl font-bold">Join Our Team</h2>
      <p class="mt-2 text-sm leading-relaxed">
        We're always interested in hearing from talented, compassionate veterinary professionals. If
        you share our values, send your CV to
        <span class="font-medium">careers@compassvet.com</span>.
      </p>
    </div>
  </Section>

  <!-- CTA -->
  <CTABanner layout="row">
    <p class="text-lg font-bold text-accent-foreground">Ready to meet us in person?</p>
    <p class="mt-1 text-sm">Book a visit and see why Briar Cove trusts Compass.</p>
    <template #action>
      <Button variant="secondary" class="bg-background" @click="emit('navigate', 'appointment')"
        >Book Appointment</Button
      >
    </template>
  </CTABanner>
</template>
