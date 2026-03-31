/**
 * Replaces placeholder affiliate tags in product Amazon URLs
 * with the real tag from environment config.
 */
export function injectAffiliateTag(product: Record<string, unknown>): Record<string, unknown> {
  const config = useRuntimeConfig()
  const amazonTag = config.amazonAffiliateTag || ''

  if (!amazonTag || !product.amazon) return product

  const amazon = product.amazon as Record<string, string>
  if (amazon.url && amazon.url.includes('YOURTAG-20')) {
    amazon.url = amazon.url.replace('YOURTAG-20', amazonTag)
  }

  return { ...product, amazon }
}
