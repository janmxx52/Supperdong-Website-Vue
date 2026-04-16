import { defineStore } from 'pinia'
import { api, getApiErrorMessage } from '@/constraint'

export const useSailingStore = defineStore('sailing', {
  state: () => ({
    sailings: [],
    routes: [],
    ports: [],
    currentSailing: null,
    error: null,
    filters: {
      routeId: null,
      date: null,
    },
  }),
  actions: {
    isPastSailing(s) {
      if (!s?.date || !s?.departTime) return false
      const now = new Date()
      const dt = new Date(`${s.date}T${s.departTime}:00`)
      return dt < now
    },
    async cleanupPastSailings(list) {
      const outdated = list.filter((s) => this.isPastSailing(s))
      for (const s of outdated) {
        try {
          await api.delete(`/sailings/${s.id}`)
        } catch (err) {
          console.warn(`Không thể xóa chuyến quá hạn ${s.id}: ${getApiErrorMessage(err)}`)
        }
      }
      return list.filter((s) => !outdated.find((o) => `${o.id}` === `${s.id}`))
    },
    async fetchRoutes() {
      try {
        const res = await api.get('/routes')
        this.routes = res.data
        this.error = null
        return this.routes
      } catch (err) {
        this.routes = []
        this.error = getApiErrorMessage(err)
        return []
      }
    },
    async fetchPorts() {
      try {
        const res = await api.get('/ports')
        this.ports = res.data
        this.error = null
        return this.ports
      } catch (err) {
        this.ports = []
        this.error = getApiErrorMessage(err)
        return []
      }
    },
    async fetchSailings(filters = {}) {
      this.filters = { ...this.filters, ...filters }
      const params = {}
      if (this.filters.routeId) params.routeId = Number(this.filters.routeId)
      if (this.filters.date) params.date = this.filters.date

      try {
        const res = await api.get('/sailings', { params })
        const targetRoute = this.filters.routeId ? String(this.filters.routeId) : null
        let list = res.data.filter((s) =>
          targetRoute ? String(s.routeId) === targetRoute : true
        )
        list = list.filter((s) => !this.isPastSailing(s))
        list = await this.cleanupPastSailings(list)
        this.sailings = list
        this.error = null
        return this.sailings
      } catch (err) {
        this.sailings = []
        this.error = getApiErrorMessage(err)
        return []
      }
    },
    async fetchSailingById(id) {
      try {
        const res = await api.get(`/sailings/${id}`)
        this.currentSailing = res.data
        this.error = null
        return this.currentSailing
      } catch (err) {
        this.currentSailing = null
        this.error = getApiErrorMessage(err)
        return null
      }
    },
    async init() {
      this.error = null
      await Promise.allSettled([this.fetchRoutes(), this.fetchPorts()])
    },
    routeLabel(routeId) {
      const r = this.routes.find((route) => Number(route.id) === Number(routeId))
      if (!r) return ''
      const from = this.ports.find((p) => p.code === r.fromPort)?.name || r.fromPort
      const to = this.ports.find((p) => p.code === r.toPort)?.name || r.toPort
      return `${from} -> ${to}`
    },
  },
  getters: {
    availableRoutes: (state) =>
      state.routes.map((r) => ({
        id: r.id,
        label: `${state.ports.find((p) => p.code === r.fromPort)?.name || r.fromPort} -> ${
          state.ports.find((p) => p.code === r.toPort)?.name || r.toPort
        }`,
      })),
  },
})
