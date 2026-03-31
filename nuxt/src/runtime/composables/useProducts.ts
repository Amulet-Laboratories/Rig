export interface Product {
  slug: string
  name: string
  brand: string
  category: string
  niche: string
  tags: string[]
  price_range: string
  amazon: {
    asin: string
    url: string
    commission_rate: string
  }
  alt_retailers?: {
    name: string
    url: string
    commission_rate: string
  }[]
  rating: number
  one_liner: string
  image_url?: string
  image_alt?: string
  pros: string[]
  cons: string[]
  last_verified: string
  status: string
}

const productCache = new Map<string, Product>()

export function useProducts() {
  const getProduct = async (slug: string): Promise<Product | null> => {
    if (productCache.has(slug)) {
      return productCache.get(slug)!
    }

    try {
      const product = await $fetch<Product>(`/api/products/${slug}`)
      productCache.set(slug, product)
      return product
    } catch {
      return null
    }
  }

  const getAllProducts = async (): Promise<Product[]> => {
    try {
      return await $fetch<Product[]>('/api/products')
    } catch {
      return []
    }
  }

  return { getProduct, getAllProducts }
}
