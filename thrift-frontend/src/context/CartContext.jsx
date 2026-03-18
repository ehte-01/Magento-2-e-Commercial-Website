import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

const GQL = '/graphql'

async function gql(query, variables = {}) {
  const res = await fetch(GQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

// ─── GraphQL Mutations ───

const CREATE_CART = `mutation { createGuestCart { cart { id } } }`

const GET_CART = `
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      items {
        id
        quantity
        product {
          name sku
          small_image { url }
          price_range {
            minimum_price {
              final_price { value }
            }
          }
        }
      }
    }
  }
`

const ADD_TO_CART = `
  mutation AddToCart($cartId: String!, $sku: String!, $qty: Float!) {
    addSimpleProductsToCart(input: {
      cart_id: $cartId
      cart_items: [{ data: { quantity: $qty, sku: $sku } }]
    }) {
      cart {
        items {
          id quantity
          product {
            name sku
            small_image { url }
            price_range { minimum_price { final_price { value } } }
          }
        }
      }
    }
  }
`

const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: String!, $itemId: Int!) {
    removeItemFromCart(input: {
      cart_id: $cartId
      cart_item_id: $itemId
    }) {
      cart { items { id } }
    }
  }
`

const UPDATE_CART_ITEM = `
  mutation UpdateCartItem($cartId: String!, $itemId: Int!, $qty: Float!) {
    updateCartItems(input: {
      cart_id: $cartId
      cart_items: [{ cart_item_id: $itemId, quantity: $qty }]
    }) {
      cart { items { id quantity } }
    }
  }
`

// ─── Helper: normalize Magento cart items to our format ───
function normalizeItems(magentoItems = []) {
  return magentoItems.map(item => ({
    id: item.product.sku,
    cartItemId: item.id,
    name: item.product.name,
    price: item.product.price_range.minimum_price.final_price.value,
    image: item.product.small_image?.url || '',
    qty: item.quantity,
  }))
}

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem('mage_cart_id') || null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  // ─── Get or create cart ID ───
  const getCartId = useCallback(async () => {
    if (cartId) return cartId
    const data = await gql(CREATE_CART)
    const id = data.createGuestCart.cart.id
    localStorage.setItem('mage_cart_id', id)
    setCartId(id)
    return id
  }, [cartId])

  // ─── Fetch cart items from Magento ───
  const fetchCart = useCallback(async (id) => {
    if (!id) return
    try {
      const data = await gql(GET_CART, { cartId: id })
      setItems(normalizeItems(data.cart.items))
    } catch (e) {
      // Cart expired — create new one
      localStorage.removeItem('mage_cart_id')
      setCartId(null)
      setItems([])
    }
  }, [])

  // ─── Load cart on mount ───
  useEffect(() => {
    if (cartId) fetchCart(cartId)
  }, [cartId, fetchCart])

  // ─── Add item ───
  const addItem = useCallback(async (product) => {
    setLoading(true)
    try {
      const id = await getCartId()
      const data = await gql(ADD_TO_CART, {
        cartId: id,
        sku: product.id,
        qty: 1,
      })
      setItems(normalizeItems(data.addSimpleProductsToCart.cart.items))
    } catch (e) {
      console.error('Add to cart failed:', e)
    }
    setLoading(false)
  }, [getCartId])

  // ─── Remove item ───
  const removeItem = useCallback(async (id, size) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    setLoading(true)
    try {
      await gql(REMOVE_FROM_CART, {
        cartId: cartId,
        itemId: item.cartItemId,
      })
      setItems(prev => prev.filter(i => i.cartItemId !== item.cartItemId))
    } catch (e) {
      console.error('Remove from cart failed:', e)
    }
    setLoading(false)
  }, [cartId, items])

  // ─── Update quantity ───
  const updateQty = useCallback(async (id, size, qty) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    if (qty < 1) { removeItem(id, size); return }
    setLoading(true)
    try {
      const data = await gql(UPDATE_CART_ITEM, {
        cartId: cartId,
        itemId: item.cartItemId,
        qty: qty,
      })
      setItems(prev => prev.map(i =>
        i.cartItemId === item.cartItemId ? { ...i, qty } : i
      ))
    } catch (e) {
      console.error('Update qty failed:', e)
    }
    setLoading(false)
  }, [cartId, items, removeItem])

  // ─── Clear cart ───
  const clearCart = useCallback(async () => {
    for (const item of items) {
      await gql(REMOVE_FROM_CART, {
        cartId: cartId,
        itemId: item.cartItemId,
      })
    }
    setItems([])
  }, [cartId, items])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items, totalItems, totalPrice, loading,
      addItem, removeItem, updateQty, clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)