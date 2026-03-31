<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const route = useRoute()
const { data: page } = await useAsyncData(`toc-${route.path}`, () =>
  queryCollection('articles').path(route.path).first(),
)

const toc = computed<TocLink[]>(() => {
  const body = page.value?.body as Record<string, unknown> | undefined
  const tocData = body?.toc as { links?: TocLink[] } | undefined
  return tocData?.links ?? []
})

const activeId = ref('')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -80% 0px' },
  )

  const headings = document.querySelectorAll('h2[id], h3[id]')
  headings.forEach((heading) => observer.observe(heading))

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <nav v-if="toc.length" aria-label="Table of contents" data-rig-toc>
    <h2 data-rig-toc-heading>On this page</h2>
    <ul data-rig-toc-list>
      <li v-for="link in toc" :key="link.id" data-rig-toc-item>
        <a :href="`#${link.id}`" data-rig-toc-link :data-active="activeId === link.id || undefined">
          {{ link.text }}
        </a>
        <ul v-if="link.children?.length" data-rig-toc-children>
          <li v-for="child in link.children" :key="child.id" data-rig-toc-item>
            <a
              :href="`#${child.id}`"
              data-rig-toc-link
              :data-active="activeId === child.id || undefined"
            >
              {{ child.text }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
