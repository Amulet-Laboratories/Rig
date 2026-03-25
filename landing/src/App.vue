<script setup lang="ts">
import SiteNav from '@/components/SiteNav.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ArchSection from '@/components/sections/ArchSection.vue'
import CodeSection from '@/components/sections/CodeSection.vue'
import PackagesSection from '@/components/sections/PackagesSection.vue'
import ThemesSection from '@/components/sections/ThemesSection.vue'
import ComposablesSection from '@/components/sections/ComposablesSection.vue'
import DiffSection from '@/components/sections/DiffSection.vue'
import PrinciplesSection from '@/components/sections/PrinciplesSection.vue'
import QuickStartSection from '@/components/sections/QuickStartSection.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import SiteFooter from '@/components/sections/SiteFooter.vue'
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-bg focus:outline-none"
  >
    Skip to content
  </a>
  <SiteNav />
  <main id="main-content">
    <HeroSection />
    <ArchSection />
    <CodeSection />
    <PackagesSection />
    <ThemesSection />
    <ComposablesSection />
    <DiffSection />
    <PrinciplesSection />
    <QuickStartSection />
    <CtaSection />
  </main>
  <SiteFooter />
</template>
