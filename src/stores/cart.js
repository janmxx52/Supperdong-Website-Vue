import { defineStore } from 'pinia'
import { api, getApiErrorMessage } from '@/constraint'

const STORAGE_KEY = 'ferry-cart'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Không thể đọc localStorage', err)
    return []
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.warn('Không thể lưu localStorage', err)
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: loadFromStorage(),
    error: null,
  }),
  actions: {
    addToCart(cartItem) {
      const key = `${cartItem.sailingId}-${cartItem.classCode}`
      const idx = this.cartItems.findIndex((i) => i.key === key)
      if (idx === -1) {
        this.cartItems.push({ ...cartItem, key })
      } else {
        this.cartItems[idx].pax.adult += cartItem.pax.adult
        this.cartItems[idx].pax.child += cartItem.pax.child
        this.cartItems[idx].total += cartItem.total
      }
      saveToStorage(this.cartItems)
    },
    removeItem(key) {
      this.cartItems = this.cartItems.filter((i) => i.key !== key)
      saveToStorage(this.cartItems)
    },
    clear() {
      this.cartItems = []
      saveToStorage(this.cartItems)
    },
    async checkout(options = {}) {
      if (!this.cartItems.length) return null

      const isLegacyContactPayload =
        options &&
        typeof options === 'object' &&
        ('name' in options || 'phone' in options || 'email' in options)
      const normalized = isLegacyContactPayload ? { contact: options } : options

      const contact = normalized.contact || { name: 'Guest', phone: '', email: '' }
      const payment = normalized.payment || {}
      const accountId = normalized.accountId || null

      const payload = {
        accountId,
        contact,
        items: this.cartItems,
        payment: {
          method: payment.method || 'qr-viet',
          provider: payment.provider || 'QRViet',
          status: payment.status || 'pending',
          reference: payment.reference || null,
        },
        status: 'confirmed',
        total: this.cartItems.reduce((sum, i) => sum + i.total, 0),
        createdAt: new Date().toISOString(),
      }

      try {
        const res = await api.post('/bookings', payload)
        const bookingId = res.data.id
        this.error = null
        this.clear()
        return bookingId
      } catch (err) {
        this.error = getApiErrorMessage(err)
        return null
      }
    },
  },
  getters: {
    totalAmount: (state) => state.cartItems.reduce((sum, i) => sum + i.total, 0),
    totalPassengers: (state) =>
      state.cartItems.reduce(
        (acc, i) => ({
          adult: acc.adult + i.pax.adult,
          child: acc.child + i.pax.child,
        }),
        { adult: 0, child: 0 }
      ),
  },
})
