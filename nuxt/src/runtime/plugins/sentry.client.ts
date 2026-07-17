import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const dsn = config.public.sentryDsn as string

  if (!dsn) return

  // One Sentry project serves the whole network, so `environment` carries which
  // site an event came from — keeping them filterable in the shared project. This
  // is a client plugin, so the live hostname is the most reliable per-site signal
  // and needs no per-site config (works even where siteUrl isn't in runtimeConfig).
  const environment = import.meta.dev ? 'development' : window.location.hostname

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn,
    environment,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
})
