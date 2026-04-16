<template>
  <div class="payment-page">
    <div v-if="loading" class="loading">Đang tải...</div>

    <div v-else>
      <div v-if="error" class="api-error">{{ error }}</div>

      <div v-else-if="!booking">Không tìm thấy đơn.</div>

      <div v-else class="content">
        <header class="head">
          <h2>Thanh toán đơn: {{ booking.id }}</h2>
          <p>Trạng thái: <strong>{{ booking.status || 'N/A' }}</strong></p>
          <p>Tổng tiền: <strong>{{ formatMoney(booking.total) }}</strong></p>
        </header>

        <section class="methods">
          <label v-for="m in methods" :key="m.id" class="method">
            <input type="radio" v-model="method" :value="m.id" /> {{ m.label }}
          </label>
        </section>

        <section class="qr-section">
          <div class="qr-box">
            <div v-if="qrDataUrl">
              <img :src="qrDataUrl" alt="QR Code" class="qr-image" />
              <div class="payload">{{ payload }}</div>
              <div class="qr-actions">
                <button @click="downloadQr">Tải QR</button>
                <button @click="copyPayload">Sao chép payload</button>
                <button v-if="method === 'momo' || method === 'zalopay'" @click="openDeepLink">Mở ứng dụng</button>
              </div>
            </div>
            <div v-else class="hint">Đang tạo QR...</div>
          </div>
          <div class="instructions">
            <h4>Hướng dẫn</h4>
            <p v-if="method === 'momo'">Quét mã bằng ứng dụng Momo hoặc bấm "Mở ứng dụng" để mở Momo.</p>
            <p v-else-if="method === 'zalopay'">Quét mã bằng ZaloPay hoặc mở ứng dụng ZaloPay để thanh toán.</p>
            <p v-else-if="method === 'bank'">Chuyển khoản đến số tài khoản: <strong>{{ merchantAccount }}</strong> - <strong>{{ merchantBank }}</strong></p>
            <p v-else>Quét QR từ camera hoặc ứng dụng thanh toán hỗ trợ QR.</p>
          </div>
        </section>

        <section class="simulate">
          <button class="danger" @click="simulatePaid" >Tôi đã thanh toán</button>
        </section>

        <div v-if="isPaid" class="paid">Đơn đã được thanh toán. Cảm ơn bạn!</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, getApiErrorMessage } from '@/constraint'
import { buildPaymentPayload, generateQrDataUrl, formatMoney } from '@/utils/payment'

const route = useRoute()
const id = route.params.id

const booking = ref(null)
const loading = ref(true)
const error = ref('')
const methods = [
  { id: 'qr', label: 'Mã QR (chung)' },
  { id: 'momo', label: 'Momo' },
  { id: 'zalopay', label: 'ZaloPay' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng' },
]
const method = ref('qr')
const payload = ref('')
const qrDataUrl = ref('')
let pollTimer = null

const merchantAccount = process.env.VUE_APP_MERCHANT_ACCOUNT || '000000000'
const merchantBank = process.env.VUE_APP_MERCHANT_BANK || 'Local Bank'

const isPaid = computed(() => booking.value && `${booking.value.status || ''}`.toLowerCase() === 'paid')

async function loadBooking() {
  loading.value = true
  try {
    const res = await api.get(`/bookings/${id}`)
    booking.value = res.data
    error.value = ''
  } catch (err) {
    booking.value = null
    error.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

async function makeQr() {
  if (!booking.value) return
  payload.value = buildPaymentPayload(booking.value, method.value)
  try {
    qrDataUrl.value = await generateQrDataUrl(payload.value)
  } catch (err) {
    qrDataUrl.value = ''
    error.value = `Không thể tạo QR: ${err?.message || err}`
  }
}

function downloadQr() {
  if (!qrDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = `payment-${booking.value?.id || id}-${method.value}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

async function copyPayload() {
  try {
    await navigator.clipboard.writeText(payload.value)
    window.alert('Đã sao chép payload vào clipboard')
  } catch (err) {
    window.alert('Không thể sao chép payload')
  }
}

function openDeepLink() {
  if (!payload.value) return
  const link = method.value === 'momo'
    ? `momo://qr?payload=${encodeURIComponent(payload.value)}`
    : `zalopay://pay?payload=${encodeURIComponent(payload.value)}`
  // try to open deep link
  window.location.href = link
}

async function simulatePaid() {
  try {
    await api.patch(`/bookings/${id}`, {
      status: 'paid',
      payment: { ...(booking.value.payment || {}), status: 'paid' },
      paidAt: new Date().toISOString(),
    })
    await loadBooking()
  } catch (err) {
    window.alert(getApiErrorMessage(err))
  }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(async () => {
    try {
      const res = await api.get(`/bookings/${id}`)
      if (res.data) {
        booking.value = res.data
        if (`${booking.value.status || ''}`.toLowerCase() === 'paid') {
          stopPolling()
        }
      }
    } catch (err) {
      // ignore polling errors
    }
  }, 3000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

onMounted(async () => {
  await loadBooking()
  await makeQr()
  startPolling()
})

watch(method, makeQr)

</script>

<style scoped>
.payment-page { max-width: 760px; margin: 24px auto; padding: 12px; }
.head h2 { margin: 0 0 8px 0; color: #0c2b44 }
.head p { margin: 2px 0; color: #475569 }
.methods { display: flex; gap: 12px; margin: 12px 0; flex-wrap: wrap }
.method { display: inline-flex; gap: 8px; align-items: center; padding: 8px 12px; border-radius: 10px; background: #f1f5f9; cursor: pointer; border: 1px solid #e5e7eb }
.method input { margin-right: 6px }
.method:has(input:checked) { border-color: #0c2b44; background: #eff6ff; box-shadow: 0 6px 14px rgba(12,43,68,0.06) }
.qr-section { display: grid; grid-template-columns: 320px 1fr; gap: 14px; align-items: start }
.qr-box { border: 1px solid #e5e7eb; padding: 16px; border-radius: 12px; text-align: center; background: linear-gradient(180deg,#ffffff,#fbfcff); box-shadow: 0 6px 18px rgba(2,6,23,0.04) }
.qr-image { width: 100%; max-width: 280px; height: auto; object-fit: contain; margin: 0 auto; display:block }
.payload { margin-top: 8px; font-size: 0.9rem; color: #334155; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace }
.qr-actions { display: flex; gap: 8px; justify-content: center; margin-top: 12px }
.qr-actions button { padding: 8px 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-weight:700 }
.qr-actions button:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(2,6,23,0.06) }
.qr-actions button.primary { background: #0c2b44; color: #fff; border: none }
.instructions { border: 1px solid #e5e7eb; padding: 14px; border-radius: 12px; background: #fff }
.instructions h4 { margin: 0 0 8px 0; color: #0c2b44 }
.simulate { margin-top: 12px; display:flex; justify-content:center }
.danger { background: linear-gradient(90deg,#ef4444,#dc2626); color: #fff; padding: 10px 14px; border: none; border-radius: 10px; cursor: pointer; font-weight:800 }
.paid { margin-top: 12px; padding: 10px; background: #ecfdf3; color: #166534; border-radius: 8px }
.api-error { color: #b91c1c; padding: 10px; border: 1px solid #fecaca; border-radius: 8px }
.loading { text-align: center; padding: 20px }

@media (max-width: 720px) {
  .qr-section { grid-template-columns: 1fr; }
  .qr-box { padding: 12px }
  .methods { gap: 8px }
  .method { padding: 8px 10px; font-size: 0.95rem }
  .qr-actions { flex-direction: column }
  .qr-actions button { width: 100% }
}
</style>
