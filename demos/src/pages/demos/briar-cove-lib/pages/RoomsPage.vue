<script setup lang="ts">
import { Section, Card, Badge, Icon } from '@amulet-laboratories/rig'

const rooms = [
  {
    name: 'Compass Room',
    capacity: 'Up to 40 people',
    description:
      'Our largest meeting space with a projector, screen, whiteboard, and microphone system. Ideal for presentations, workshops, and community meetings.',
    amenities: [
      'Projector & screen',
      'Whiteboard',
      'Microphone system',
      'Wi-Fi',
      'Adjustable lighting',
    ],
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Salal Creek Room',
    capacity: 'Up to 12 people',
    description:
      'A smaller conference-style room with a large table, whiteboard, and display screen. Perfect for study groups, committee meetings, and small workshops.',
    amenities: [
      'Conference table',
      'Display screen',
      'Whiteboard',
      'Wi-Fi',
      'Power outlets at table',
    ],
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Study Carrels',
    capacity: '4 individual carrels',
    description:
      'Semi-private workspaces on the second floor for quiet individual study. Each carrel has a desk lamp, power outlet, and task chair.',
    amenities: ['Desk lamp', 'Power outlet', 'Task chair', 'Wi-Fi', 'Quiet zone'],
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
  },
]

const equipment = [
  {
    name: 'Projector & Screen',
    available: 'Compass Room only',
    note: 'HDMI and VGA inputs. Bring your own adapters for USB-C.',
  },
  {
    name: 'Microphone System',
    available: 'Compass Room only',
    note: 'Wireless handheld and lapel mic. Speakers built in.',
  },
  {
    name: 'Whiteboard & Markers',
    available: 'All rooms',
    note: 'Dry-erase markers and eraser provided. Extra markers at desk.',
  },
  {
    name: 'Display Screen',
    available: 'Salal Creek Room',
    note: '55-inch display with HDMI input for presentations.',
  },
]
</script>

<template>
  <!-- Header -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-serif text-3xl font-bold">Meeting Rooms</h1>
      <p class="mt-2 text-sm leading-relaxed">
        All rooms are free for community use with a valid library card. Reserve up to 2 weeks in
        advance at the circulation desk or by phone.
      </p>
    </div>
  </Section>

  <!-- Rooms -->
  <Section>
    <div class="mx-auto max-w-4xl space-y-8">
      <Card
        v-for="rm in rooms"
        :key="rm.name"
        class="overflow-hidden transition-all duration-300 hover:shadow-lg"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2">
          <img
            :src="rm.img"
            :alt="rm.name"
            class="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h2 class="text-xl font-bold">{{ rm.name }}</h2>
            <Badge variant="secondary" class="mt-2">{{ rm.capacity }}</Badge>
            <p class="mt-3 text-sm leading-relaxed">{{ rm.description }}</p>
            <div class="mt-4">
              <p class="text-xs font-bold uppercase tracking-wider">Amenities</p>
              <ul class="mt-2 space-y-1">
                <li v-for="a in rm.amenities" :key="a" class="flex items-center gap-2 text-sm">
                  <Icon icon="heroicons:check" size="sm" aria-hidden="true" />
                  {{ a }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </Section>

  <!-- Equipment -->
  <Section variant="alternate">
    <div class="mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold">Available Equipment</h2>
      <span data-rig-accent class="mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card v-for="eq in equipment" :key="eq.name" class="p-5">
          <h3 class="font-bold">{{ eq.name }}</h3>
          <Badge variant="secondary" class="mt-2">{{ eq.available }}</Badge>
          <p class="mt-2 text-sm leading-relaxed">{{ eq.note }}</p>
        </Card>
      </div>
    </div>
  </Section>

  <!-- Booking Policy -->
  <Section>
    <div class="mx-auto max-w-2xl">
      <h2 class="text-center text-2xl font-bold">Booking Policy</h2>
      <span data-rig-accent class="mx-auto mt-3 block h-0.5 w-12" aria-hidden="true"></span>
      <Card class="mt-8 p-6">
        <ul class="space-y-3 text-sm leading-relaxed">
          <li class="flex gap-3">
            <Icon
              icon="heroicons:clock"
              size="sm"
              class="mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span
              >Rooms may be reserved up to <strong>2 weeks in advance</strong>. Walk-in use is
              available when rooms are not reserved.</span
            >
          </li>
          <li class="flex gap-3">
            <Icon icon="heroicons:user" size="sm" class="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span
              >A <strong>valid library card</strong> is required to reserve a room. One reservation
              per card per day.</span
            >
          </li>
          <li class="flex gap-3">
            <Icon
              icon="heroicons:currency-dollar"
              size="sm"
              class="mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span
              >All rooms are <strong>free of charge</strong>. No rental fees for community,
              nonprofit, or educational use.</span
            >
          </li>
          <li class="flex gap-3">
            <Icon
              icon="heroicons:x-circle"
              size="sm"
              class="mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span
              >Rooms may not be used for
              <strong>commercial sales, political fundraising, or events with admission fees</strong
              >.</span
            >
          </li>
        </ul>
      </Card>
      <p class="mt-4 text-center text-xs">
        To reserve a room, visit the circulation desk or call (541) 555-0142 during library hours.
      </p>
    </div>
  </Section>
</template>
