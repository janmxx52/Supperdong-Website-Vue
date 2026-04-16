import { defineStore } from 'pinia'

const USERS_KEY = 'ferry-users'
const SESSION_KEY = 'ferry-current-user'

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.localStorage
}

function readJson(key, fallback) {
  if (!canUseStorage()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.warn(`Không thể đọc ${key} từ localStorage`, err)
    return fallback
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Không thể ghi ${key} vào localStorage`, err)
  }
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase()
}

function normalizePhone(phone = '') {
  return phone.trim()
}

function sanitizeUser(user) {
  if (!user) return null
  return {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: readJson(USERS_KEY, []),
    currentUser: readJson(SESSION_KEY, null),
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.currentUser,
  },
  actions: {
    clearError() {
      this.error = null
    },
    register(payload) {
      const fullname = `${payload?.fullname || ''}`.trim()
      const email = normalizeEmail(payload?.email)
      const phone = normalizePhone(payload?.phone)
      const password = `${payload?.password || ''}`

      if (!fullname || !email || !phone || !password) {
        this.error = 'Vui lòng điền đầy đủ thông tin đăng ký.'
        return null
      }

      const emailExists = this.users.some((u) => normalizeEmail(u.email) === email)
      if (emailExists) {
        this.error = 'Email đã được đăng ký.'
        return null
      }

      const phoneExists = this.users.some((u) => normalizePhone(u.phone) === phone)
      if (phoneExists) {
        this.error = 'Số điện thoại đã được đăng ký.'
        return null
      }

      const newUser = {
        id: `${Date.now()}`,
        fullname,
        email,
        phone,
        password,
      }

      this.users.push(newUser)
      writeJson(USERS_KEY, this.users)

      this.currentUser = sanitizeUser(newUser)
      writeJson(SESSION_KEY, this.currentUser)

      this.error = null
      return this.currentUser
    },
    login(payload) {
      const account = `${payload?.account || ''}`.trim()
      const password = `${payload?.password || ''}`

      if (!account || !password) {
        this.error = 'Vui lòng nhập tài khoản và mật khẩu.'
        return null
      }

      const normalizedAccount = account.toLowerCase()
      const user = this.users.find(
        (u) =>
          normalizeEmail(u.email) === normalizedAccount ||
          normalizePhone(u.phone) === account
      )

      if (!user || user.password !== password) {
        this.error = 'Tài khoản hoặc mật khẩu không đúng.'
        return null
      }

      this.currentUser = sanitizeUser(user)
      writeJson(SESSION_KEY, this.currentUser)
      this.error = null
      return this.currentUser
    },
    logout() {
      this.currentUser = null
      writeJson(SESSION_KEY, null)
      this.error = null
    },
  },
})
