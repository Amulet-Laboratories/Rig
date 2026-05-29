<script setup lang="ts">
import ShellGrid from './ShellGrid.vue'
</script>

<template>
  <Story title="ShellGrid" icon="lucide:layout-grid" group="layout">
    <Variant title="Default">
      <div style="height: 400px; border: 1px solid var(--border)">
        <ShellGrid>
          <template #titlebar>
            <div
              style="
                padding: 4px 12px;
                background: var(--muted);
                color: var(--foreground);
                font-size: 13px;
              "
            >
              Title Bar
            </div>
          </template>
          <template #activity>
            <div
              style="
                padding: 8px;
                background: var(--card);
                color: var(--muted-foreground);
                font-size: 11px;
                text-align: center;
              "
            >
              ACT
            </div>
          </template>
          <template #sidebar>
            <div style="padding: 12px; color: var(--foreground)">Sidebar</div>
          </template>
          <template #editor>
            <div style="padding: 12px; color: var(--foreground)">Editor Area</div>
          </template>
          <template #panel>
            <div style="padding: 12px; color: var(--muted-foreground)">Panel</div>
          </template>
          <template #statusbar>
            <div
              style="
                padding: 2px 12px;
                background: var(--primary);
                color: var(--primary-foreground);
                font-size: 11px;
              "
            >
              Status Bar
            </div>
          </template>
        </ShellGrid>
      </div>
    </Variant>

    <Variant title="RTL">
      <div style="height: 400px; border: 1px solid var(--border)">
        <ShellGrid direction="rtl">
          <template #titlebar>
            <div
              style="
                padding: 4px 12px;
                background: var(--muted);
                color: var(--foreground);
                font-size: 13px;
              "
            >
              RTL Layout
            </div>
          </template>
          <template #activity>
            <div
              style="
                padding: 8px;
                background: var(--card);
                color: var(--muted-foreground);
                font-size: 11px;
                text-align: center;
              "
            >
              ACT
            </div>
          </template>
          <template #sidebar>
            <div style="padding: 12px; color: var(--foreground)">Sidebar</div>
          </template>
          <template #editor>
            <div style="padding: 12px; color: var(--foreground)">Editor</div>
          </template>
          <template #panel>
            <div style="padding: 12px; color: var(--muted-foreground)">Panel</div>
          </template>
          <template #statusbar>
            <div
              style="
                padding: 2px 12px;
                background: var(--primary);
                color: var(--primary-foreground);
                font-size: 11px;
              "
            >
              Status
            </div>
          </template>
        </ShellGrid>
      </div>
    </Variant>
  </Story>
</template>
