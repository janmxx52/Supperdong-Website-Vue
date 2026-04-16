import axios from 'axios'

const DEFAULT_LOCAL_API_URL = 'http://localhost:3000'
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

function trimTrailingSlash(value = '') {
  return value.replace(/\/+$/, '')
}

function isLocalBrowser() {
  return typeof window !== 'undefined' && LOCAL_HOSTS.has(window.location.hostname)
}

function resolveApiUrl() {
  const envUrl = trimTrailingSlash(process.env.VUE_APP_APIURL || '')
  if (envUrl) return envUrl

  if (isLocalBrowser()) return DEFAULT_LOCAL_API_URL

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`
  }

  return DEFAULT_LOCAL_API_URL
}

function looksLikeHtml(data) {
  return typeof data === 'string' && /^\s*<!doctype html/i.test(data)
}

export const APIURL = resolveApiUrl()

export function getApiErrorMessage(error) {
  if (error?.userMessage) return error.userMessage

  const status = error?.response?.status
  const contentType = `${error?.response?.headers?.['content-type'] || ''}`.toLowerCase()

  if (contentType.includes('text/html') || looksLikeHtml(error?.response?.data)) {
    return `API URL "${APIURL}" đang trả về HTML thay vì JSON. Hãy kiểm tra VUE_APP_APIURL hoặc triển khai đúng dịch vụ API.`
  }

  if (error?.code === 'ECONNABORTED') {
    return `API tại "${APIURL}" phản hồi quá chậm.`
  }

  if (status) {
    return `API tại "${APIURL}" trả về lỗi ${status}. Hãy kiểm tra route và dịch vụ backend.`
  }

  if (error?.request) {
    return `Không kết nối được API tại "${APIURL}". Nếu đang chạy local, hãy mở "npm run mock:api". Nếu đã deploy, hãy đặt VUE_APP_APIURL tới URL backend chính xác.`
  }

  return error?.message || 'Không thể kết nối tới API.'
}

export const api = axios.create({
  baseURL: APIURL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    const contentType = `${response.headers?.['content-type'] || ''}`.toLowerCase()
    if (contentType.includes('text/html') || looksLikeHtml(response.data)) {
      const error = new Error(
        `API URL "${APIURL}" đang trả về HTML thay vì JSON. Hãy kiểm tra VUE_APP_APIURL hoặc triển khai đúng dịch vụ API.`
      )
      error.response = response
      error.userMessage = getApiErrorMessage(error)
      return Promise.reject(error)
    }

    return response
  },
  (error) => {
    error.userMessage = getApiErrorMessage(error)
    return Promise.reject(error)
  }
)
