<script setup lang="ts">
import {
  Section,
  Card,
  Divider,
  MenuList,
  ContactForm,
  MapPlaceholder,
  Gallery,
  FlankedHeading,
  SectionDivider,
  Ornament,
} from '@amulet-laboratories/rig'
import { barMenu, spaceGallery, contactFields } from '../data'
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl text-center">
      <FlankedHeading>
        <h1 class="font-serif text-3xl font-bold">Visit Us</h1>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed">
        A converted net shed on the harbor. Come for the coffee, stay for the view of the fishing
        boats.
      </p>
    </div>
  </Section>

  <!-- Location + hours -->
  <Section>
    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
      <Card class="p-6">
        <h2 class="font-serif text-lg font-bold">Location</h2>
        <Divider class="my-3" />
        <address class="not-italic text-sm leading-relaxed">
          <strong>Fogline Coffee Roasters</strong><br />
          18 Harbor Road<br />
          Briar Cove, OR 97420
        </address>
        <p class="mt-3 text-sm">
          <a href="tel:+15415550188" class="text-primary font-medium hover:underline">
            (541) 555-0188
          </a>
        </p>
        <p class="mt-1 text-sm">
          <a href="mailto:hello@foglinecoffee.com" class="text-primary font-medium hover:underline">
            hello@foglinecoffee.com
          </a>
        </p>
        <Divider class="my-3" />
        <h3 class="text-xs font-bold uppercase tracking-wider">Getting Here</h3>
        <p class="mt-2 text-xs leading-relaxed">
          We are at the south end of Harbor Road, past the boat launch. Look for the brick building
          with the copper roasting chimney. Street parking along Harbor Road. Additional parking at
          the marina lot (2 minute walk).
        </p>
      </Card>

      <Card class="p-6">
        <h2 class="font-serif text-lg font-bold">Tasting Bar Hours</h2>
        <Divider class="my-3" />
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between">
            <dt>Wednesday &ndash; Friday</dt>
            <dd class="font-mono font-medium">7am &ndash; 2pm</dd>
          </div>
          <div class="flex justify-between">
            <dt>Saturday &ndash; Sunday</dt>
            <dd class="font-mono font-medium">8am &ndash; 4pm</dd>
          </div>
          <div class="flex justify-between">
            <dt>Monday &ndash; Tuesday</dt>
            <dd class="text-muted-foreground font-mono">Closed</dd>
          </div>
        </dl>
        <Divider class="my-3" />
        <h3 class="text-xs font-bold uppercase tracking-wider">Roastery Tours</h3>
        <p class="mt-2 text-xs leading-relaxed">
          Walk-in tours Saturday mornings at 10am. See the 1974 Probat in action, sample current
          roasts, and learn about our sourcing. Free, no reservation needed. About 20 minutes.
        </p>
      </Card>
    </div>
  </Section>

  <!-- Map -->
  <Section variant="alternate">
    <div class="mx-auto max-w-3xl">
      <MapPlaceholder
        address="18 Harbor Road, Briar Cove, OR 97420"
        description="South end of Harbor Road, past the boat launch"
      />
    </div>
  </Section>

  <SectionDivider variant="organic" />

  <!-- Tasting bar menu -->
  <Section>
    <div class="mx-auto max-w-3xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Tasting Bar Menu</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Simple drinks, made well. No syrups, no blenders — just coffee.
      </p>
      <MenuList :items="barMenu" class="mt-8" />
    </div>
  </Section>

  <SectionDivider variant="organic" flip />

  <!-- The space — Gallery -->
  <Section variant="alternate">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center font-serif text-2xl font-bold">The Space</h2>
      <Ornament variant="diamond" size="sm" class="mx-auto mt-2" />
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        A 1940s net-mending shed with the original timber frame, concrete floors, and sliding barn
        doors. The Probat sits where the nets used to hang. It still smells faintly of rope and salt
        air.
      </p>
      <Gallery :items="spaceGallery" layout="alternating" class="mt-10" />
    </div>
  </Section>

  <!-- Contact form -->
  <Section>
    <div class="mx-auto max-w-2xl">
      <FlankedHeading>
        <h2 class="font-serif text-2xl font-bold">Get in Touch</h2>
      </FlankedHeading>
      <p class="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed">
        Questions about wholesale, subscriptions, events, or anything else? Drop us a line.
      </p>
      <ContactForm
        form-name="fogline-contact"
        :fields="contactFields"
        submit-label="Send Message"
        honeypot
        class="mt-8"
        @submit="() => {}"
      />
    </div>
  </Section>
</template>
