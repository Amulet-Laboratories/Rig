export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const siteId = config.public.fathomSiteId as string

  if (!siteId) return

  useHead({
    script: [
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': siteId,
        'data-spa': 'auto',
        defer: true,
      },
    ],
  })
})
