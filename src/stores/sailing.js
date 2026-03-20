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
      if (this.filters.routeId) params.routeId = this.filters.routeId
      if (this.filters.date) params.date = this.filters.date
      const res = await axios.get(`${APIURL}/sailings`, { params })
      this.sailings = res.data
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
