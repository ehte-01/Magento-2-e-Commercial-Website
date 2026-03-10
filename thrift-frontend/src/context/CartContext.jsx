import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      )
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id && i.size === action.payload.size
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.id === action.payload.id && i.size === action.payload.size)
        ),
      }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id && i.size === action.payload.size
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = useCallback(
    item => dispatch({ type: 'ADD_ITEM', payload: item }),
    []
  )
  const removeItem = useCallback(
    (id, size) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size } }),
    []
  )
  const updateQty = useCallback(
    (id, size, qty) =>
      dispatch({ type: 'UPDATE_QTY', payload: { id, size, qty } }),
    []
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ ...state, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
