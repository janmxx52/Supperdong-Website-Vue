import { defineStore } from 'pinia'
import axios from 'axios'
import { APIURL } from '@/constraint'

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
      const dateStr = s.date
      const dt = new Date(`${dateStr}T${s.departTime}:00`)
      return dt < now
    },
    async cleanupPastSailings(list) {
      const outdated = list.filter((s) => this.isPastSailing(s))
      for (const s of outdated) {
        try {
          await axios.delete(`${APIURL}/sailings/${s.id}`)
        } catch (err) {
          console.warn('Không thể xóa chuyến quá hạn', s.id)
        }
      }
      return list.filter((s) => !outdated.find((o) => `${o.id}` === `${s.id}`))
    },
    async fetchRoutes() {
      const res = await axios.get(`${APIURL}/routes`)
      this.routes = res.data
      return this.routes
    },
    async fetchPorts() {
      const res = await axios.get(`${APIURL}/ports`)
      this.ports = res.data
      return this.ports
    },
    async fetchSailings(filters = {}) {
      this.filters = { ...this.filters, ...filters }
      const params = {}
      if (this.filters.routeId) params.routeId = Number(this.filters.routeId)
      if (this.filters.date) params.date = this.filters.date
      const res = await axios.get(`${APIURL}/sailings`, { params })
      // đảm bảo khớp khi routeId trong db là string/number
      const targetRoute = this.filters.routeId ? String(this.filters.routeId) : null
      let list = res.data.filter((s) =>
        targetRoute ? String(s.routeId) === targetRoute : true
      )
      // lọc bỏ chuyến quá khứ
      list = list.filter((s) => !this.isPastSailing(s))
      // tự động xóa các chuyến quá giờ trong ngày / ngày cũ
      list = await this.cleanupPastSailings(list)
      this.sailings = list
      return this.sailings
    },
    async fetchSailingById(id) {
      const res = await axios.get(`${APIURL}/sailings/${id}`)
      this.currentSailing = res.data
      return this.currentSailing
    },
    async init() {
      // nạp routes + ports song song
      await Promise.all([this.fetchRoutes(), this.fetchPorts()])
    },
    routeLabel(routeId) {
      const r = this.routes.find((r) => Number(r.id) === Number(routeId))
      if (!r) return ''
      const from = this.ports.find((p) => p.code === r.fromPort)?.name || r.fromPort
      const to = this.ports.find((p) => p.code === r.toPort)?.name || r.toPort
      return `${from} → ${to}`
    },
  },
  getters: {
    availableRoutes: (state) =>
      state.routes.map((r) => ({
        id: r.id,
        label: `${state.ports.find((p) => p.code === r.fromPort)?.name || r.fromPort} → ${
          state.ports.find((p) => p.code === r.toPort)?.name || r.toPort
        }`,
      })),
  },
})
