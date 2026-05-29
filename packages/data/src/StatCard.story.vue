<script setup lang="ts">
import StatCard from './StatCard.vue'
import { ref } from 'vue'

const pgLabel = ref('Revenue')
const pgValue = ref('$48,200')
const pgTrend = ref<'up' | 'down' | 'neutral'>('up')
const pgTrendValue = ref('+12.5%')
const pgDescription = ref('Compared to last month')
</script>

<template>
  <Story title="StatCard" icon="lucide:trending-up" group="data">
    <Variant title="Default">
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <StatCard label="Revenue" value="$48,200" trend="up" trend-value="+12.5%" />
        <StatCard label="Users" value="1,842" trend="up" trend-value="+8.2%" />
        <StatCard label="Bounce Rate" value="32.1%" trend="down" trend-value="-3.4%" />
        <StatCard label="Sessions" value="5,621" trend="neutral" trend-value="0%" />
      </div>
    </Variant>

    <Variant title="With Description">
      <StatCard
        label="Monthly Revenue"
        value="$48,200"
        trend="up"
        trend-value="+12.5%"
        description="Compared to last month"
      />
    </Variant>

    <Variant title="With Action">
      <StatCard label="Active Users" value="1,842" trend="up" trend-value="+8%">
        <template #actions>
          <button
            style="
              padding: 4px 8px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
              font-size: 11px;
            "
          >
            View Details
          </button>
        </template>
      </StatCard>
    </Variant>

    <Variant title="Playground">
      <StatCard
        :label="pgLabel"
        :value="pgValue"
        :trend="pgTrend"
        :trend-value="pgTrendValue"
        :description="pgDescription"
      />

      <template #controls>
        <HstText v-model="pgLabel" title="Label" />
        <HstText v-model="pgValue" title="Value" />
        <HstSelect v-model="pgTrend" title="Trend" :options="['up', 'down', 'neutral']" />
        <HstText v-model="pgTrendValue" title="Trend Value" />
        <HstText v-model="pgDescription" title="Description" />
      </template>
    </Variant>
  </Story>
</template>
