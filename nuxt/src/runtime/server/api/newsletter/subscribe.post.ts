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
    console.warn(
      '[newsletter] Missing NUXT_NEWSLETTER_API_KEY or NUXT_CONVERTKIT_FORM_ID -- subscription not sent',
    )
    return { success: true, message: 'Subscribed (dev mode)' }
  }

  try {
    await $fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      body: {
        api_key: apiKey,
        email,
      },
    })
    return { success: true }
  } catch (err) {
    console.error('[newsletter] Subscription failed:', err)
    throw createError({ statusCode: 500, statusMessage: 'Subscription failed' })
  }
})
