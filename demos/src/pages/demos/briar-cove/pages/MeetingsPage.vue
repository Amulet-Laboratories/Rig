<script setup lang="ts">
import { Button, Card, Badge, Divider, Section } from '@amulet-laboratories/rig'
import { upcomingMeetings, pastMeetings } from '../data'
</script>

<template>
  <div class="pb-20 sm:pb-0">
    <!-- Upcoming -->
    <Section>
      <div class="mx-auto max-w-5xl">
        <h1 class="font-serif text-3xl font-bold">Public Meetings</h1>
        <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true" />
        <p class="mt-3 text-sm">
          All meetings of the City Council, boards, and committees are open to the public. Agendas
          are posted at least 72 hours before each meeting.
        </p>

        <h2 class="mt-10 font-serif text-2xl font-bold">Upcoming</h2>
        <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />

        <div class="mt-6 space-y-4">
          <Card
            v-for="(m, i) in upcomingMeetings"
            :key="m.body + m.date"
            class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-semibold">{{ m.body }}</h3>
                <Badge v-if="i === 0" size="sm" class="bg-secondary text-primary"> Next Up </Badge>
                <Badge v-if="m.agendaAvailable" size="sm" class="bg-success/15 text-success">
                  Agenda Posted
                </Badge>
              </div>
              <p class="mt-1 text-sm">{{ m.date }} · {{ m.time }}</p>
              <p class="text-muted-foreground text-xs">{{ m.location }}</p>
            </div>
            <div class="flex gap-2 self-start sm:self-center">
              <Button v-if="m.agendaAvailable" variant="primary" size="sm">View Agenda</Button>
              <Button variant="secondary" size="sm">Add to Calendar</Button>
            </div>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Past Meetings / Minutes -->
    <Section variant="alternate">
      <div class="mx-auto max-w-5xl">
        <h2 class="font-serif text-2xl font-bold">Meeting Minutes</h2>
        <span data-rig-accent class="mt-2 block h-0.5 w-10" aria-hidden="true" />
        <p class="mt-3 text-sm">
          Approved minutes are posted within 10 business days of approval by the relevant body.
        </p>

        <div class="mt-6 space-y-3">
          <Card
            v-for="pm in pastMeetings"
            :key="pm.body + pm.date"
            class="flex items-center justify-between p-4"
          >
            <div>
              <h3 class="text-sm font-semibold">{{ pm.body }}</h3>
              <p class="text-muted-foreground text-xs">{{ pm.date }}</p>
            </div>
            <Button v-if="pm.hasMinutes" variant="secondary" size="sm">View Minutes</Button>
            <span v-else class="text-muted-foreground text-xs">Pending approval</span>
          </Card>
        </div>
      </div>
    </Section>

    <!-- Public Comment Guidelines -->
    <Section>
      <div class="mx-auto max-w-3xl">
        <h2 class="text-center font-serif text-2xl font-bold">Public Comment Guidelines</h2>
        <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true" />
        <Card class="mt-8 p-6">
          <div class="space-y-4 text-sm leading-relaxed">
            <p>
              The City of Briar Cove encourages citizen participation at all public meetings.
              Dedicated public comment periods are provided at every City Council session.
            </p>
            <Divider />
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p class="font-semibold">In-Person Comment</p>
                <ul class="mt-1 space-y-1 text-xs">
                  <li>Sign in at the podium before speaking</li>
                  <li>State your name and address for the record</li>
                  <li>Comments limited to 3 minutes per speaker</li>
                  <li>Address remarks to the Council, not the audience</li>
                </ul>
              </div>
              <div>
                <p class="font-semibold">Written Comment</p>
                <ul class="mt-1 space-y-1 text-xs">
                  <li>Submit by 5:00 PM on the day of the meeting</li>
                  <li>Email to <span class="text-primary">clerk@briarcove.gov</span></li>
                  <li>Include your name, address, and agenda item</li>
                  <li>Written comments are entered into the public record</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  </div>
</template>
