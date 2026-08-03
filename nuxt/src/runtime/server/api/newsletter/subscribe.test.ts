import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * The handler used to answer HTTP 200 with `{ success: true }` whenever the
 * ConvertKit credentials were missing — in production as well as in dev. Every
 * content site ships with those credentials empty, so the live `/free/*` pages
 * accepted an email, dropped it, and told the visitor to check their inbox.
 *
 * The first test below is the one that matters: in production, unconfigured
 * must be an error, never a success.
 */

const mocks = vi.hoisted(() => ({ config: {} as Record<string, unknown> }))

vi.mock('h3', () => ({
  defineEventHandler: (fn: unknown) => fn,
  readBody: vi.fn(async (event: { body?: unknown }) => event?.body),
  createError: (opts: { statusCode: number; statusMessage: string }) => {
    const e = new Error(opts.statusMessage) as Error & { statusCode: number }
    e.statusCode = opts.statusCode
    return e
  },
}))

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: () => mocks.config,
}))

const load = async () =>
  (await import('./subscribe.post')).default as (e: unknown) => Promise<unknown>

const env = process.env.NODE_ENV

beforeEach(() => {
  vi.resetModules()
  mocks.config = {}
  vi.stubGlobal(
    '$fetch',
    vi.fn(async () => ({})),
  )
})

afterEach(() => {
  process.env.NODE_ENV = env
  vi.unstubAllGlobals()
})

describe('newsletter subscribe', () => {
  it('refuses in production when ConvertKit is not configured', async () => {
    process.env.NODE_ENV = 'production'
    mocks.config = { newsletterApiKey: '', convertkitFormId: '' }
    const handler = await load()

    await expect(handler({ body: { email: 'reader@example.com' } })).rejects.toMatchObject({
      statusCode: 503,
    })
  })

  it('never reports success in production without delivering', async () => {
    process.env.NODE_ENV = 'production'
    mocks.config = { newsletterApiKey: 'key', convertkitFormId: '' }
    const handler = await load()

    await expect(handler({ body: { email: 'reader@example.com' } })).rejects.toMatchObject({
      statusCode: 503,
    })
  })

  it('accepts in development but flags that nothing was delivered', async () => {
    process.env.NODE_ENV = 'development'
    mocks.config = { newsletterApiKey: '', convertkitFormId: '' }
    const handler = await load()

    const res = (await handler({ body: { email: 'reader@example.com' } })) as {
      success: boolean
      delivered: boolean
    }
    expect(res.success).toBe(true)
    expect(res.delivered).toBe(false)
  })

  it('delivers and reports delivered when configured', async () => {
    process.env.NODE_ENV = 'production'
    mocks.config = { newsletterApiKey: 'key', convertkitFormId: 'form' }
    const handler = await load()

    const res = (await handler({ body: { email: 'reader@example.com' } })) as {
      success: boolean
      delivered: boolean
    }
    expect(res).toEqual({ success: true, delivered: true })
    expect($fetch).toHaveBeenCalledOnce()
  })

  it('rejects a malformed address before touching config', async () => {
    process.env.NODE_ENV = 'production'
    mocks.config = { newsletterApiKey: 'key', convertkitFormId: 'form' }
    const handler = await load()

    await expect(handler({ body: { email: 'not-an-email' } })).rejects.toMatchObject({
      statusCode: 400,
    })
    expect($fetch).not.toHaveBeenCalled()
  })

  it('surfaces a ConvertKit failure as a 500, not a success', async () => {
    process.env.NODE_ENV = 'production'
    mocks.config = { newsletterApiKey: 'key', convertkitFormId: 'form' }
    vi.stubGlobal(
      '$fetch',
      vi.fn(async () => {
        throw new Error('convertkit down')
      }),
    )
    const handler = await load()

    await expect(handler({ body: { email: 'reader@example.com' } })).rejects.toMatchObject({
      statusCode: 500,
    })
  })
})
