<script setup lang="ts">
import { Badge, Divider, MenuList, Section } from '@amulet-laboratories/rig'
import { tapList, food, merch, nonAlcoholicDrinks as drinks } from '../data'
</script>

<template>
  <h1 class="sr-only">Menu</h1>

  <!-- Header -->
  <Section
    variant="alternate"
    title="Menu"
    subtitle="Ten taps, a full kitchen, and no televisions."
  />

  <!-- Tap List -->
  <Section
    title="What's Pouring"
    subtitle="Updated weekly · Pints $7 / Half-pints $4 / Flights $14"
  >
    <div class="mx-auto max-w-4xl">
      <div class="mt-10 overflow-x-auto">
        <table class="w-full">
          <caption class="sr-only">
            Current tap list
          </caption>
          <thead>
            <tr class="mb-3 hidden text-xs font-bold uppercase tracking-wider sm:table-row">
              <th scope="col" class="pb-3 text-left font-bold">Beer</th>
              <th scope="col" class="pb-3 text-left font-bold">Notes</th>
              <th scope="col" class="pb-3 text-left font-bold">ABV</th>
              <th scope="col" class="pb-3 text-left font-bold">IBU</th>
              <th scope="col" class="pb-3 text-left font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="beer in tapList"
              :key="beer.name"
              class="block border-b py-4 transition-colors hover:bg-secondary sm:table-row"
            >
              <td class="block sm:table-cell sm:py-4 sm:pr-4">
                <span class="font-bold">{{ beer.name }}</span>
                <span class="ml-2 text-xs">{{ beer.style }}</span>
                <span class="mt-1 block text-xs italic sm:hidden">{{ beer.note }}</span>
              </td>
              <td class="hidden sm:table-cell sm:py-4 sm:pr-4">
                <span class="text-xs italic">{{ beer.note }}</span>
              </td>
              <td class="inline-block py-1 pr-3 text-sm tabular-nums sm:table-cell sm:py-4 sm:pr-4">
                {{ beer.abv }}
              </td>
              <td class="inline-block py-1 pr-3 text-sm tabular-nums sm:table-cell sm:py-4 sm:pr-4">
                {{ beer.ibu }}
              </td>
              <td class="inline-block py-1 sm:table-cell sm:py-4">
                <Badge :variant="beer.status === 'Pouring' ? 'default' : 'secondary'" size="sm">
                  {{ beer.status }}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Section>

  <Divider class="mx-auto max-w-4xl" />

  <!-- Food Menu -->
  <Section title="Kitchen Menu" subtitle="Kitchen open until 9 PM · All day weekends">
    <div class="mx-auto max-w-3xl">
      <MenuList :items="food" class="mt-10" />
    </div>
  </Section>

  <!-- Non-alcoholic drinks -->
  <Section variant="alternate" title="Non-Alcoholic">
    <div class="mx-auto max-w-3xl">
      <MenuList :items="drinks" class="mt-10" />
    </div>
  </Section>

  <!-- Merch -->
  <Section title="Merch">
    <div class="mx-auto max-w-3xl">
      <MenuList :items="merch" class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <template #item="{ item }">
          <div
            class="bg-secondary rounded p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <p class="text-sm font-bold">{{ item.name }}</p>
            <p class="mt-1 text-xs">{{ item.description }}</p>
            <p class="mt-2 text-sm font-bold tabular-nums">{{ item.price }}</p>
          </div>
        </template>
      </MenuList>
    </div>
  </Section>

  <!-- Note -->
  <Section variant="alternate">
    <p class="text-center text-xs">
      Menu items subject to change. We source locally when possible — cod from the harbor, hazelnuts
      from the Willamette Valley, bread from Salt &amp; Signal down the street.
    </p>
  </Section>
</template>
