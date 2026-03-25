<script setup lang="ts">
/**
 * TeamGrid — staff/team showcase grid.
 *
 * Layouts:
 *   card       — vertical cards with photo on top (default)
 *   compact    — smaller cards, name and role only
 *   horizontal — photo left, info right (wide cards)
 *
 * Slots allow full customization of each member's photo, info, and credentials.
 */
export interface TeamMember {
  /** Unique identifier. */
  id: string
  /** Full name. */
  name: string
  /** Role or job title. */
  role?: string
  /** Biography or description. */
  bio?: string
  /** Photo URL. */
  img?: string
}

defineProps<{
  /** Team members to display. */
  members: TeamMember[]
  /** Layout variant. */
  layout?: 'card' | 'compact' | 'horizontal'
  /** Grid columns at sm+ breakpoint. */
  columns?: 2 | 3 | 4
}>()

defineSlots<{
  member?(props: { member: TeamMember; index: number }): unknown
  photo?(props: { member: TeamMember }): unknown
  name?(props: { member: TeamMember }): unknown
  role?(props: { member: TeamMember }): unknown
  bio?(props: { member: TeamMember }): unknown
  credentials?(props: { member: TeamMember }): unknown
}>()
</script>

<template>
  <div data-rig-team-grid :data-layout="layout ?? 'card'" :data-columns="columns ?? 3">
    <article v-for="(m, i) in members" :key="m.id" data-rig-team-grid-member>
      <slot name="member" :member="m" :index="i">
        <div v-if="m.img || $slots.photo" data-rig-team-grid-photo>
          <slot name="photo" :member="m">
            <img
              v-if="m.img"
              :src="m.img"
              :alt="`Photo of ${m.name}`"
              loading="lazy"
              data-rig-team-grid-img
            />
          </slot>
        </div>

        <div data-rig-team-grid-info>
          <div data-rig-team-grid-name>
            <slot name="name" :member="m">{{ m.name }}</slot>
          </div>

          <div v-if="m.role || $slots.role" data-rig-team-grid-role>
            <slot name="role" :member="m">{{ m.role }}</slot>
          </div>

          <div v-if="m.bio || $slots.bio" data-rig-team-grid-bio>
            <slot name="bio" :member="m">{{ m.bio }}</slot>
          </div>

          <div v-if="$slots.credentials" data-rig-team-grid-credentials>
            <slot name="credentials" :member="m" />
          </div>
        </div>
      </slot>
    </article>
  </div>
</template>
