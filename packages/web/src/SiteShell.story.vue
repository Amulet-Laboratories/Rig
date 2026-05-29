<script setup lang="ts">
import SiteShell from './SiteShell.vue'
import { ref } from 'vue'

const pgMainId = ref('main-content')
</script>

<template>
  <Story title="SiteShell" icon="lucide:layout" group="web">
    <Variant title="Default">
      <SiteShell>
        <template #header>
          <div
            style="
              padding: 16px 24px;
              background: var(--card);
              color: var(--card-foreground);
              border-bottom: 1px solid var(--border);
            "
          >
            Site Header / Nav
          </div>
        </template>

        <div style="padding: 48px 24px; text-align: center; color: var(--foreground)">
          Main content area
        </div>

        <template #footer>
          <div
            style="
              padding: 16px 24px;
              background: var(--card);
              color: var(--muted-foreground);
              border-top: 1px solid var(--border);
              text-align: center;
            "
          >
            Site Footer
          </div>
        </template>
      </SiteShell>
    </Variant>

    <Variant title="Custom Main ID">
      <SiteShell main-id="custom-main">
        <template #header>
          <div
            style="
              padding: 16px 24px;
              background: var(--card);
              color: var(--card-foreground);
              border-bottom: 1px solid var(--border);
            "
          >
            Header (main-id="custom-main")
          </div>
        </template>

        <div style="padding: 48px 24px; text-align: center; color: var(--foreground)">
          The skip link targets #custom-main
        </div>
      </SiteShell>
    </Variant>

    <Variant title="Custom Skip Link">
      <SiteShell>
        <template #skip-link>Jump to content</template>

        <template #header>
          <div
            style="
              padding: 16px 24px;
              background: var(--card);
              color: var(--card-foreground);
              border-bottom: 1px solid var(--border);
            "
          >
            Header with custom skip link text
          </div>
        </template>

        <div style="padding: 48px 24px; text-align: center; color: var(--foreground)">
          Tab to see the custom "Jump to content" skip link
        </div>
      </SiteShell>
    </Variant>

    <Variant title="Playground">
      <SiteShell :main-id="pgMainId">
        <template #header>
          <div
            style="
              padding: 16px 24px;
              background: var(--card);
              color: var(--card-foreground);
              border-bottom: 1px solid var(--border);
            "
          >
            Site Header
          </div>
        </template>

        <div style="padding: 48px 24px; text-align: center; color: var(--foreground)">
          Main content (id="{{ pgMainId }}")
        </div>

        <template #footer>
          <div
            style="
              padding: 16px 24px;
              background: var(--card);
              color: var(--muted-foreground);
              border-top: 1px solid var(--border);
              text-align: center;
            "
          >
            Footer
          </div>
        </template>
      </SiteShell>

      <template #controls>
        <HstText v-model="pgMainId" title="Main ID" />
      </template>
    </Variant>
  </Story>
</template>
