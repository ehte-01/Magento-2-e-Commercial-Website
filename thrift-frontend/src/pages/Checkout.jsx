import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPriceValue } from '../lib/graphql'
import { Loader2, CheckCircle, ChevronLeft } from 'lucide-react'

const RAZORPAY_KEY = 'rzp_test_S8Wg3fplOboThw'

const INDIAN_STATES = [
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'CG', name: 'Chhattisgarh' },
  { code: 'DN', name: 'Dadra and Nagar Haveli' },
  { code: 'DD', name: 'Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OD', name: 'Odisha' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
]

async function gql(query, variables = {}) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

const SET_SHIPPING_ADDRESS = `
  mutation SetShipping($cartId: String!, $firstname: String!, $lastname: String!, $street: String!, $city: String!, $postcode: String!, $phone: String!, $regionCode: String!) {
    setShippingAddressesOnCart(input: {
      cart_id: $cartId
      shipping_addresses: [{
        address: {
          firstname: $firstname
          lastname: $lastname
          street: [$street]
          city: $city
          region: $regionCode
          country_code: "IN"
          postcode: $postcode
          telephone: $phone
          save_in_address_book: false
        }
      }]
    }) {
      cart {
        shipping_addresses {
          available_shipping_methods {
            carrier_code
            method_code
            carrier_title
            method_title
            amount { value currency }
          }
        }
      }
    }
  }
`

const SET_SHIPPING_METHOD = `
  mutation SetShippingMethod($cartId: String!, $carrierCode: String!, $methodCode: String!) {
    setShippingMethodsOnCart(input: {
      cart_id: $cartId
      shipping_methods: [{
        carrier_code: $carrierCode
        method_code: $methodCode
      }]
    }) {
      cart { selected_payment_method { code } }
    }
  }
`

const SET_EMAIL_ON_CART = `
  mutation SetEmail($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: {
      cart_id: $cartId
      email: $email
    }) {
      cart { email }
    }
  }
`

const SET_PAYMENT_METHOD = `
  mutation SetPayment($cartId: String!) {
    setPaymentMethodOnCart(input: {
      cart_id: $cartId
      payment_method: { code: "razorpay" }
    }) {
      cart { selected_payment_method { code } }
    }
  }
`

const PLACE_ORDER = `
  mutation PlaceOrder($cartId: String!) {
    placeOrder(input: { cart_id: $cartId }) {
      order { order_number }
    }
  }
`

const PLACE_RAZORPAY_ORDER = `
  mutation PlaceRzpOrder($orderId: String!, $referrer: String!) {
    placeRazorpayOrder(order_id: $orderId, referrer: $referrer) {
      success
      rzp_order_id
      order_id
      amount
      currency
      message
    }
  }
`

const SET_RZP_PAYMENT = `
  mutation SetRzpPayment($orderId: String!, $paymentId: String!, $signature: String!) {
    setRzpPaymentDetailsForOrder(input: {
      order_id: $orderId
      rzp_payment_id: $paymentId
      rzp_signature: $signature
    }) {
      order { order_id }
    }
  }
`

export default function Checkout() {
  const { items: cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const cartId = localStorage.getItem('mage_cart_id')

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const [shippingMethods, setShippingMethods] = useState([])
  const [selectedShipping, setSelectedShipping] = useState(null)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', street: '', city: '', pincode: '', state: ''
  })

  const shipping = totalPrice >= 999 ? 0 : 99
  const total = totalPrice + shipping

  useEffect(() => {
    if (!cartId || cart.length === 0) {
      navigate('/cart')
    }
  }, [cartId, cart, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleShippingSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await gql(SET_EMAIL_ON_CART, {
        cartId,
        email: form.email
      })

      const data = await gql(SET_SHIPPING_ADDRESS, {
        cartId,
        firstname: form.firstName,
        lastname: form.lastName,
        street: form.street,
        city: form.city,
        postcode: form.pincode,
        phone: form.phone,
        regionCode: form.state,
      })

      const methods = data.setShippingAddressesOnCart.cart.shipping_addresses[0]?.available_shipping_methods || []
      setShippingMethods(methods)

      if (methods.length > 0) {
        setSelectedShipping(methods[0])
      }

      setStep(2)
    } catch (e) {
      setError('Failed to save shipping details. Please try again.')
      console.error(e)
    }
    setLoading(false)
  }

  const handlePayment = async () => {
    if (!selectedShipping) {
      setError('Please select a shipping method.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await gql(SET_SHIPPING_METHOD, {
        cartId,
        carrierCode: selectedShipping.carrier_code,
        methodCode: selectedShipping.method_code
      })

      await gql(SET_PAYMENT_METHOD, { cartId })

      const orderData = await gql(PLACE_ORDER, { cartId })
      const magentoOrderId = orderData?.placeOrder?.order?.order_number

      if (!magentoOrderId) {
        localStorage.removeItem('mage_cart_id')
        setError('Cart expired. Please add items again.')
        navigate('/cart')
        return
      }

      const rzpData = await gql(PLACE_RAZORPAY_ORDER, {
        orderId: magentoOrderId,
        referrer: window.location.href
      })

      const { rzp_order_id, amount, currency } = rzpData.placeRazorpayOrder

      const options = {
        key: RAZORPAY_KEY,
        amount: amount,
        currency: currency || 'INR',
        order_id: rzp_order_id,
        name: 'Thrift',
        description: `Order #${magentoOrderId}`,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone
        },
        theme: { color: '#7c3aed' },
        handler: async (response) => {
          try {
            await gql(SET_RZP_PAYMENT, {
              orderId: magentoOrderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
            clearCart()
            localStorage.removeItem('mage_cart_id')
            setOrderId(magentoOrderId)
            setStep(3)
          } catch (e) {
            setError('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled. Please try again.')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      setError('Something went wrong. Please try again.')
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-semibold text-warm-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-warm-500 mb-2">Order ID: <span className="font-semibold text-warm-900">#{orderId}</span></p>
          <p className="text-warm-500 text-sm mb-8">You will receive a confirmation email shortly.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-full transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart" className="text-warm-500 hover:text-warm-900 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display text-3xl font-semibold text-warm-900">Checkout</h1>
        </div>

        <div className="flex items-center gap-3 mb-10">
          {['Shipping', 'Payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm font-medium ${step > i + 1 ? 'text-green-600' : step === i + 1 ? 'text-brand-600' : 'text-warm-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-green-100 text-green-600' : step === i + 1 ? 'bg-brand-100 text-brand-600' : 'bg-warm-100 text-warm-400'}`}>
                  {i + 1}
                </span>
                {s}
              </div>
              {i < 1 && <div className="w-8 h-px bg-warm-200" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">

            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="space-y-5">
                <h2 className="font-semibold text-warm-900 text-lg">Shipping Details</h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="firstName" value={form.firstName} onChange={handleChange}
                    placeholder="First Name" required
                    className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input
                    name="lastName" value={form.lastName} onChange={handleChange}
                    placeholder="Last Name" required
                    className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <input
                  name="email" value={form.email} onChange={handleChange}
                  placeholder="Email Address" type="email" required
                  className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />

                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="Phone Number" required
                  className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />

                <textarea
                  name="street" value={form.street} onChange={handleChange}
                  placeholder="Street Address" required rows={2}
                  className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="city" value={form.city} onChange={handleChange}
                    placeholder="City" required
                    className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input
                    name="pincode" value={form.pincode} onChange={handleChange}
                    placeholder="Pincode" required
                    className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <select
                  name="state" value={form.state} onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white text-warm-700"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-warm-400">🇮🇳 Currently shipping within India only</p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? 'Saving...' : 'Continue to Payment'}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold text-warm-900 text-lg mb-4">Shipping Method</h2>
                  <div className="space-y-3">
                    {shippingMethods.length > 0 ? shippingMethods.map(method => (
                      <label
                        key={`${method.carrier_code}_${method.method_code}`}
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${selectedShipping?.method_code === method.method_code ? 'border-brand-400 bg-brand-50' : 'border-warm-300 hover:border-warm-400'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.method_code === method.method_code}
                            onChange={() => setSelectedShipping(method)}
                            className="accent-brand-600"
                          />
                          <div>
                            <p className="text-sm font-medium text-warm-900">{method.carrier_title}</p>
                            <p className="text-xs text-warm-500">{method.method_title}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-warm-900">
                          {method.amount.value === 0 ? 'Free' : formatPriceValue(method.amount.value)}
                        </span>
                      </label>
                    )) : (
                      <div className="p-4 bg-warm-50 rounded-xl text-sm text-warm-500">
                        No shipping methods available for your address.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-warm-900 text-lg mb-4">Payment</h2>
                  <div className="p-4 border border-brand-200 rounded-xl bg-brand-50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
                    <div>
                      <p className="text-sm font-medium text-warm-900">Razorpay</p>
                      <p className="text-xs text-warm-500">Pay securely with UPI, Cards, Net Banking & more</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-warm-300 text-warm-700 font-medium rounded-full hover:bg-warm-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading || !selectedShipping}
                    className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {loading ? 'Processing...' : `Pay ${formatPriceValue(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-warm-50 rounded-2xl p-6 sticky top-28">
              <h2 className="font-semibold text-warm-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-warm-600">
                    <span className="flex-1 pr-2">{item.name} × {item.qty}</span>
                    <span className="shrink-0">{formatPriceValue(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="border-t border-warm-200 pt-3 flex justify-between text-warm-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : formatPriceValue(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-warm-900 text-base pt-1">
                  <span>Total</span>
                  <span>{formatPriceValue(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}