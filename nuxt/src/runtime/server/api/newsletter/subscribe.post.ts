import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

/**
 * Newsletter subscription.
 *
 * When the ConvertKit credentials were missing this returned
 * `{ success: true, message: 'Subscribed (dev mode)' }` — an HTTP 200 — in
 * every environment, production included. All six content sites ship with
 * `newsletterApiKey: ''` and `convertkitFormId: ''` hardcoded in
 * `nuxt.config.ts` and no env vars set, so the `/free/*` lead-magnet pages
 * took a visitor's email, discarded it, and rendered "Check your inbox. Your
 * download link is on its way."
 *
 * Nothing was stored, nothing was sent, and no such download exists. A form
 * that fails closed loses a lead; this one failed *open* and made a promise
 * on the site's behalf, which is a trust problem rather than a plumbing one.
 *
 * So unconfigured is now an error in production, and stays a pass-through in
 * development so local work isn't blocked on credentials. The dev response is
 * explicitly flagged `delivered: false` — no caller can read success as
 * "sent" any more.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = body?.email?.trim()

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email required' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.newsletterApiKey
  const formId = config.convertkitFormId

  if (!apiKey || !formId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[newsletter] No NUXT_NEWSLETTER_API_KEY / NUXT_CONVERTKIT_FORM_ID — accepted in dev, nothing was sent.',
      )
      return { success: true, delivered: false, message: 'dev mode — not delivered' }
    }
    console.error(
      '[newsletter] Refusing a subscription in production: NUXT_NEWSLETTER_API_KEY / NUXT_CONVERTKIT_FORM_ID are unset.',
    )
    throw createError({ statusCode: 503, statusMessage: 'Newsletter is not configured' })
  }

  try {
    await $fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      body: {
        api_key: apiKey,
        email,
      },
    })
    return { success: true, delivered: true }
  } catch (err) {
    console.error('[newsletter] Subscription failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Subscription failed' })
  }
})
