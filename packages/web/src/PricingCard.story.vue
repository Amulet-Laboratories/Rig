<script setup lang="ts">
import PricingCard from './PricingCard.vue'
import { ref } from 'vue'

const pgFeatured = ref(false)
</script>

<template>
  <Story title="PricingCard" icon="lucide:credit-card" group="web">
    <Variant title="Default">
      <div style="max-width: 360px">
        <PricingCard>
          <template #title>Starter</template>
          <template #price>
            <span style="font-size: 36px; font-weight: 700; color: var(--foreground)">$9</span>
          </template>
          <template #period>/ month</template>
          <template #description>Perfect for individuals and small projects.</template>
          <template #features>
            <ul style="list-style: none; padding: 0; margin: 0; color: var(--foreground)">
              <li style="padding: 4px 0">5 projects</li>
              <li style="padding: 4px 0">10 GB storage</li>
              <li style="padding: 4px 0">Email support</li>
            </ul>
          </template>
          <template #cta>
            <button
              style="
                width: 100%;
                padding: 10px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Get Started
            </button>
          </template>
        </PricingCard>
      </div>
    </Variant>

    <Variant title="Featured">
      <div style="max-width: 360px">
        <PricingCard featured>
          <template #badge>
            <span
              style="
                padding: 2px 10px;
                font-size: 12px;
                font-weight: 600;
                background: var(--primary);
                color: var(--primary-foreground);
                border-radius: 9999px;
              "
            >
              Most Popular
            </span>
          </template>
          <template #title>Pro</template>
          <template #price>
            <span style="font-size: 36px; font-weight: 700; color: var(--foreground)">$29</span>
          </template>
          <template #period>/ month</template>
          <template #description>For growing teams that need more power.</template>
          <template #features>
            <ul style="list-style: none; padding: 0; margin: 0; color: var(--foreground)">
              <li style="padding: 4px 0">Unlimited projects</li>
              <li style="padding: 4px 0">100 GB storage</li>
              <li style="padding: 4px 0">Priority support</li>
              <li style="padding: 4px 0">Advanced analytics</li>
            </ul>
          </template>
          <template #cta>
            <button
              style="
                width: 100%;
                padding: 10px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Upgrade to Pro
            </button>
          </template>
        </PricingCard>
      </div>
    </Variant>

    <Variant title="With Footer">
      <div style="max-width: 360px">
        <PricingCard>
          <template #title>Enterprise</template>
          <template #price>
            <span style="font-size: 36px; font-weight: 700; color: var(--foreground)">$99</span>
          </template>
          <template #period>/ month</template>
          <template #features>
            <ul style="list-style: none; padding: 0; margin: 0; color: var(--foreground)">
              <li style="padding: 4px 0">Everything in Pro</li>
              <li style="padding: 4px 0">SSO / SAML</li>
              <li style="padding: 4px 0">Dedicated support</li>
              <li style="padding: 4px 0">Custom integrations</li>
            </ul>
          </template>
          <template #cta>
            <button
              style="
                width: 100%;
                padding: 10px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Contact Sales
            </button>
          </template>
          <template #footer>
            <p style="margin: 0; font-size: 12px; color: var(--muted-foreground)">
              30-day money-back guarantee. No questions asked.
            </p>
          </template>
        </PricingCard>
      </div>
    </Variant>

    <Variant title="Tier Comparison">
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start">
        <div style="flex: 1; min-width: 260px">
          <PricingCard>
            <template #title>Free</template>
            <template #price>
              <span style="font-size: 36px; font-weight: 700; color: var(--foreground)">$0</span>
            </template>
            <template #period>/ month</template>
            <template #features>
              <ul style="list-style: none; padding: 0; margin: 0; color: var(--foreground)">
                <li style="padding: 4px 0">1 project</li>
                <li style="padding: 4px 0">1 GB storage</li>
              </ul>
            </template>
            <template #cta>
              <button
                style="
                  width: 100%;
                  padding: 10px;
                  background: transparent;
                  color: var(--foreground);
                  border: 1px solid var(--border);
                  border-radius: 6px;
                  cursor: pointer;
                "
              >
                Sign Up Free
              </button>
            </template>
          </PricingCard>
        </div>
        <div style="flex: 1; min-width: 260px">
          <PricingCard featured>
            <template #badge>
              <span
                style="
                  padding: 2px 10px;
                  font-size: 12px;
                  font-weight: 600;
                  background: var(--primary);
                  color: var(--primary-foreground);
                  border-radius: 9999px;
                "
              >
                Best Value
              </span>
            </template>
            <template #title>Pro</template>
            <template #price>
              <span style="font-size: 36px; font-weight: 700; color: var(--foreground)">$29</span>
            </template>
            <template #period>/ month</template>
            <template #features>
              <ul style="list-style: none; padding: 0; margin: 0; color: var(--foreground)">
                <li style="padding: 4px 0">Unlimited projects</li>
                <li style="padding: 4px 0">100 GB storage</li>
                <li style="padding: 4px 0">Priority support</li>
              </ul>
            </template>
            <template #cta>
              <button
                style="
                  width: 100%;
                  padding: 10px;
                  background: var(--primary);
                  color: var(--primary-foreground);
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                "
              >
                Get Pro
              </button>
            </template>
          </PricingCard>
        </div>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="max-width: 360px">
        <PricingCard :featured="pgFeatured">
          <template v-if="pgFeatured" #badge>
            <span
              style="
                padding: 2px 10px;
                font-size: 12px;
                font-weight: 600;
                background: var(--primary);
                color: var(--primary-foreground);
                border-radius: 9999px;
              "
            >
              Recommended
            </span>
          </template>
          <template #title>Playground Tier</template>
          <template #price>
            <span style="font-size: 36px; font-weight: 700; color: var(--foreground)">$19</span>
          </template>
          <template #period>/ month</template>
          <template #description>Toggle featured to see the highlighted state.</template>
          <template #features>
            <ul style="list-style: none; padding: 0; margin: 0; color: var(--foreground)">
              <li style="padding: 4px 0">Feature one</li>
              <li style="padding: 4px 0">Feature two</li>
              <li style="padding: 4px 0">Feature three</li>
            </ul>
          </template>
          <template #cta>
            <button
              style="
                width: 100%;
                padding: 10px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
              "
            >
              Choose Plan
            </button>
          </template>
        </PricingCard>
      </div>

      <template #controls>
        <HstCheckbox v-model="pgFeatured" title="Featured" />
      </template>
    </Variant>
  </Story>
</template>
