<script setup lang="ts">
import ConfigProvider from './ConfigProvider.vue'
import Button from './Button.vue'
import Input from './Input.vue'
</script>

<template>
  <Story title="ConfigProvider" icon="lucide:settings" group="core">
    <Variant title="RTL">
      <ConfigProvider dir="rtl">
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
          <Button @click="() => {}">RTL Button</Button>
          <Input placeholder="RTL text input" />
        </div>
      </ConfigProvider>
    </Variant>

    <Variant title="Locale">
      <ConfigProvider locale="ar-SA" dir="rtl">
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
          <Button @click="() => {}">Arabic Locale</Button>
          <Input placeholder="Arabic locale input" />
        </div>
      </ConfigProvider>
    </Variant>

    <Variant title="Defaults Cascade">
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
        <div>
          <div style="font-size: 12px; color: var(--muted-foreground); margin-bottom: 4px">
            Without ConfigProvider:
          </div>
          <Button @click="() => {}">Default Variant</Button>
        </div>
        <div>
          <div style="font-size: 12px; color: var(--muted-foreground); margin-bottom: 4px">
            With ConfigProvider defaults:
          </div>
          <ConfigProvider :defaults="{ Button: { variant: 'primary' } }">
            <Button @click="() => {}">Inherits Primary</Button>
          </ConfigProvider>
        </div>
      </div>
    </Variant>
  </Story>
</template>
