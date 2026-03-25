<script setup lang="ts">
import SiteFooter from './SiteFooter.vue'
import { ref } from 'vue'

const pgColumns = ref(3)
</script>

<template>
  <Story title="SiteFooter" icon="lucide:panel-bottom" group="web">
    <Variant title="Default (3 Columns)">
      <SiteFooter :columns="3">
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Company</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">About</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Careers</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Blog</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Product</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Features</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Pricing</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Docs</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Legal</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Privacy</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Terms</a>
            </li>
          </ul>
        </div>
      </SiteFooter>
    </Variant>

    <Variant title="4 Columns">
      <SiteFooter :columns="4">
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Company</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">About</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Careers</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Product</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Features</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Pricing</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Resources</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none"
                >Documentation</a
              >
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Guides</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Support</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none"
                >Help Center</a
              >
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Contact</a>
            </li>
          </ul>
        </div>
      </SiteFooter>
    </Variant>

    <Variant title="With Pre-Footer">
      <SiteFooter :columns="3">
        <template #pre-footer>
          <div
            style="
              padding: 12px 24px;
              text-align: center;
              background: var(--primary);
              color: var(--primary-foreground);
              font-size: 14px;
            "
          >
            Subscribe to our newsletter for the latest updates.
          </div>
        </template>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Company</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">About</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Blog</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Product</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Features</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Pricing</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Legal</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Privacy</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Terms</a>
            </li>
          </ul>
        </div>
      </SiteFooter>
    </Variant>

    <Variant title="With Post-Footer">
      <SiteFooter :columns="3">
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Company</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">About</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Product</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Features</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Legal</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Privacy</a>
            </li>
          </ul>
        </div>
        <template #post-footer>
          <div
            style="
              padding: 16px 24px;
              text-align: center;
              font-size: 13px;
              color: var(--muted-foreground);
              border-top: 1px solid var(--border);
            "
          >
            &copy; 2026 Acme Corp. All rights reserved.
          </div>
        </template>
      </SiteFooter>
    </Variant>

    <Variant title="Playground">
      <SiteFooter :columns="pgColumns">
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Column 1</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link A</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link B</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Column 2</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link C</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link D</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Column 3</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link E</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link F</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 style="margin: 0 0 12px; color: var(--foreground)">Column 4</h4>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link G</a>
            </li>
            <li style="padding: 4px 0">
              <a href="#" style="color: var(--muted-foreground); text-decoration: none">Link H</a>
            </li>
          </ul>
        </div>
        <template #post-footer>
          <div
            style="
              padding: 16px 24px;
              text-align: center;
              font-size: 13px;
              color: var(--muted-foreground);
              border-top: 1px solid var(--border);
            "
          >
            &copy; 2026 Acme Corp. All rights reserved.
          </div>
        </template>
      </SiteFooter>

      <template #controls>
        <HstSlider v-model="pgColumns" title="Columns" :min="1" :max="5" :step="1" />
      </template>
    </Variant>
  </Story>
</template>
