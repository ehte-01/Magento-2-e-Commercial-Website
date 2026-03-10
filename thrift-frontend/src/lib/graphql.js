import { useState, useEffect, useCallback } from 'react'

/* ─── raw fetch helper ─── */
async function gqlFetch(query, variables = {}) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

/* ─── query strings ─── */
const PRODUCT_FIELDS = `
  id sku name url_key stock_status
  short_description { html }
  description { html }
  price_range {
    minimum_price {
      regular_price { value currency }
      final_price { value currency }
      discount { amount_off percent_off }
    }
  }
  small_image { url label }
  image { url label }
  media_gallery { url label }
`

/* ─── hooks ─── */
export function useProducts({ search = '', pageSize = 20, currentPage = 1, sort } = {}) {
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sortStr = sort ? Object.entries(sort).map(([k, v]) => `${k}: ${v}`).join(', ') : ''
  const sortArg = sort ? `, sort: {${sortStr}}` : ''

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    gqlFetch(`{
      products(search: "${search}", pageSize: ${pageSize}, currentPage: ${currentPage}${sortArg}) {
        total_count
        items { ${PRODUCT_FIELDS} }
      }
    }`)
      .then(data => {
        if (!cancelled) {
          setProducts(data.products.items)
          setTotalCount(data.products.total_count)
          setLoading(false)
        }
      })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [search, pageSize, currentPage, sortStr])

  return { products, totalCount, loading, error }
}

export function useProductsByCategory(categoryId, { pageSize = 20, currentPage = 1, sort } = {}) {
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sortStr = sort ? Object.entries(sort).map(([k, v]) => `${k}: ${v}`).join(', ') : ''
  const sortArg = sort ? `, sort: {${sortStr}}` : ''

  useEffect(() => {
    if (!categoryId) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    gqlFetch(`{
      products(filter: { category_id: { eq: "${categoryId}" } }, pageSize: ${pageSize}, currentPage: ${currentPage}${sortArg}) {
        total_count
        items { ${PRODUCT_FIELDS} }
      }
    }`)
      .then(data => {
        if (!cancelled) {
          setProducts(data.products.items)
          setTotalCount(data.products.total_count)
          setLoading(false)
        }
      })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [categoryId, pageSize, currentPage, sortStr])

  return { products, totalCount, loading, error }
}

export function useProduct(urlKey) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!urlKey) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    gqlFetch(`{
      products(filter: { url_key: { eq: "${urlKey}" } }) {
        items { ${PRODUCT_FIELDS} }
      }
    }`)
      .then(data => {
        if (!cancelled) {
          setProduct(data.products.items[0] || null)
          setLoading(false)
        }
      })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [urlKey])

  return { product, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    gqlFetch(`{
      categoryList(filters: { parent_id: { eq: "2" } }) {
        id name url_path product_count
        children { id name url_path product_count }
      }
    }`)
      .then(data => {
        if (!cancelled) {
          setCategories(data.categoryList[0]?.children || [])
          setLoading(false)
        }
      })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}

/* ─── helpers ─── */
export function formatPrice(priceObj) {
  if (!priceObj) return ''
  const { value, currency } = priceObj
  if (currency === 'INR') return `₹${value.toLocaleString('en-IN')}`
  return `${currency} ${value}`
}

export function getProductPrice(product) {
  const mp = product?.price_range?.minimum_price
  return {
    regular: mp?.regular_price,
    final: mp?.final_price,
    discount: mp?.discount,
    hasDiscount: mp?.discount?.amount_off > 0,
  }
}

export function getProductImage(product, type = 'small_image') {
  const img = product?.[type] || product?.small_image
  return img?.url || ''
}

/** Format a plain number as INR — useful in Cart where prices are stored as numbers */
export function formatPriceValue(value) {
  if (value == null) return ''
  return `₹${Number(value).toLocaleString('en-IN')}`
}

/** Slug → Magento category ID mapping */
export const CATEGORY_MAP = {
  women: '20',
  men: '11',
  gear: '3',
  training: '9',
}
