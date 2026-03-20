import { defineStore } from 'pinia'
import axios from 'axios'
import { APIURL } from '@/constraint'

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
    async checkout(contact = { name: 'Guest', phone: '', email: '' }) {
      if (!this.cartItems.length) return null
      const payload = {
        contact,
        items: this.cartItems,
        total: this.cartItems.reduce((sum, i) => sum + i.total, 0),
        createdAt: new Date().toISOString(),
      }
      const res = await axios.post(`${APIURL}/bookings`, payload)
      const bookingId = res.data.id
      this.clear()
      return bookingId
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
