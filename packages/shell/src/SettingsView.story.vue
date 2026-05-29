<script setup lang="ts">
import SettingsView from './SettingsView.vue'
import { ref } from 'vue'

const pgTitle = ref('Settings')
</script>

<template>
  <Story title="SettingsView" icon="lucide:settings" group="shell">
    <Variant title="Default">
      <div style="height: 400px; border: 1px solid var(--border)">
        <SettingsView title="Settings">
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 20px">
            <section>
              <h3
                style="font-size: 14px; font-weight: 600; color: var(--foreground); margin: 0 0 8px"
              >
                Appearance
              </h3>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <label
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--foreground);
                    font-size: 13px;
                  "
                >
                  Theme
                  <select
                    style="
                      padding: 4px 8px;
                      background: var(--input);
                      color: var(--foreground);
                      border: 1px solid var(--border);
                      border-radius: 4px;
                      font-size: 12px;
                    "
                  >
                    <option>Dark</option>
                    <option>Light</option>
                  </select>
                </label>
                <label
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--foreground);
                    font-size: 13px;
                  "
                >
                  Font Size
                  <input
                    type="number"
                    value="14"
                    style="
                      width: 60px;
                      padding: 4px 8px;
                      background: var(--input);
                      color: var(--foreground);
                      border: 1px solid var(--border);
                      border-radius: 4px;
                      font-size: 12px;
                    "
                  />
                </label>
              </div>
            </section>
            <section>
              <h3
                style="font-size: 14px; font-weight: 600; color: var(--foreground); margin: 0 0 8px"
              >
                Editor
              </h3>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <label
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--foreground);
                    font-size: 13px;
                  "
                >
                  Tab Size
                  <input
                    type="number"
                    value="2"
                    style="
                      width: 60px;
                      padding: 4px 8px;
                      background: var(--input);
                      color: var(--foreground);
                      border: 1px solid var(--border);
                      border-radius: 4px;
                      font-size: 12px;
                    "
                  />
                </label>
              </div>
            </section>
          </div>
        </SettingsView>
      </div>
    </Variant>

    <Variant title="With Footer">
      <div style="height: 400px; border: 1px solid var(--border)">
        <SettingsView title="Settings">
          <div style="padding: 16px; color: var(--foreground); font-size: 13px">
            Settings content here.
          </div>
          <template #footer>
            <div
              style="
                padding: 12px 16px;
                color: var(--muted-foreground);
                font-size: 11px;
                border-top: 1px solid var(--border);
              "
            >
              Rig v0.1.0 — Headless Vue 3 Components
            </div>
          </template>
        </SettingsView>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 400px; border: 1px solid var(--border)">
        <SettingsView :title="pgTitle">
          <div style="padding: 16px; color: var(--foreground); font-size: 13px">
            Playground settings content.
          </div>
        </SettingsView>
      </div>

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
      </template>
    </Variant>
  </Story>
</template>
