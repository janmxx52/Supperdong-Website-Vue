<template>
  <section class="profile-page">
    <header class="page-head profile-head">
      <div class="profile-info">
        <div class="avatar">{{ initials }}</div>
        <div class="meta">
          <h1>{{ authStore.currentUser?.fullname || 'Tài khoản' }}</h1>
          <p v-if="authStore.isLoggedIn" class="sub">{{ authStore.currentUser?.email }}</p>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn btn-ghost" @click="logout">Đăng xuất</button>
      </div>
    </header>

    <div v-if="!authStore.isLoggedIn" class="empty">
      Vui lòng đăng nhập để xem thông tin hồ sơ và đơn đặt vé.
    </div>
    
    <!-- Detailed order view -->
    <div v-if="selected" class="order-detail">
      <div class="order-head">
        <div class="order-title">
          <h3>Xác nhận đơn: {{ selected.id }}</h3>
          <p class="muted">Trạng thái: <strong>{{ statusLabel(selected.status) }}</strong> · Đặt: {{ formatDateTime(selected.createdAt) }}</p>
        </div>
        <div class="order-ops">
          <button class="ghost" @click="printOrder">In</button>
          <button class="ghost" @click="selected = null">Đóng</button>
        </div>
      </div>

      <div class="order-info">
        <div class="buyer">
          <h4>Thông tin người mua vé</h4>
          <p><strong>Họ và tên:</strong> {{ selected.contact?.name || '-' }}</p>
          <p><strong>Điện thoại:</strong> {{ selected.contact?.phone || '-' }}</p>
          <p><strong>Email:</strong> {{ selected.contact?.email || '-' }}</p>
          <div v-if="selected.contact?.invoice" class="invoice">
            <p><strong>Người mua hàng:</strong> {{ selected.contact.invoice.buyer || '-' }}</p>
            <p><strong>Công ty:</strong> {{ selected.contact.invoice.company || '-' }}</p>
            <p><strong>Mã số thuế:</strong> {{ selected.contact.invoice.tax || '-' }}</p>
            <p><strong>Địa chỉ:</strong> {{ selected.contact.invoice.address || '-' }}</p>
          </div>
        </div>

        <div class="purchase">
          <h4>Thông tin vé mua</h4>
          <table class="order-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Thông tin vé</th>
                <th>TG giữ vé</th>
                <th class="right">Giá (VND)</th>
                <th class="right">Thành tiền (VND)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in selected.items || []" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>
                  <div class="td-title">{{ it.routeLabel }}</div>
                  <div class="td-sub">{{ it.date }} · {{ it.departTime }} - {{ it.arriveTime }}</div>
                  <div class="td-sub">Hạng: {{ it.className }} · Ghế: {{ (it.passengers || []).map(p => p.seat || '-').join(', ') }}</div>
                </td>
                <td class="hold">
                  <span v-if="selected.holdExpiresAt !== undefined && holdRemaining !== null">{{ holdRemaining }} giây</span>
                  <span v-else>-</span>
                </td>
                <td class="right">{{ money(it.total || (it.price?.adult || 0)) }}</td>
                <td class="right">{{ money(it.total || (it.price?.adult || 0)) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="right strong">Tổng</td>
                <td class="right strong">{{ money(selected.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="order-note">
        <p>Quý khách vui lòng kiểm tra kỹ thông tin trước khi thực hiện giao dịch mua vé. Sau khi thực hiện giao dịch, thông tin đơn sẽ không thể thay đổi được.</p>
      </div>
    </div>

    <div v-else class="content">
      <div v-if="loading" class="empty">Đang tải danh sách đơn...</div>
      <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-else-if="!bookings.length" class="empty">
        Bạn chưa có đơn đặt vé nào.
      </div>

      <article v-for="booking in bookings" :key="booking.id" class="booking-card">
        <div class="booking-head">
          <div>
            <p class="booking-id">Mã đơn: {{ booking.id }}</p>
            <p class="booking-meta">
              Ngày đặt: {{ formatDateTime(booking.createdAt) }} |
              Khởi hành: {{ formatDateTime(firstDeparture(booking)) }}
            </p>
          </div>
          <div class="booking-actions">
            <span :class="['status', booking.status || 'confirmed']">{{ statusLabel(booking.status) }}</span>
            <div class="action-buttons">
              <button class="btn btn-ghost" @click="selectBooking(booking)">Xem</button>
              <button
                v-if="cancellationPolicy(booking).canCancel"
                class="btn btn-danger"
                @click="cancelBooking(booking)"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>

        <div class="line-grid">
          <p><strong>Tổng tiền:</strong> {{ money(booking.total) }}</p>
          <p><strong>Thanh toán:</strong> {{ paymentLabel(booking) }}</p>
          <p v-if="booking.status === 'cancelled'"><strong>Hoàn dự kiến:</strong> {{ money(booking.cancellation?.refundAmount || 0) }}</p>
          <p v-if="booking.status === 'cancelled'"><strong>Phí hủy:</strong> {{ money(booking.cancellation?.feeAmount || 0) }}</p>
        </div>

        <p v-if="booking.status !== 'cancelled'" class="policy">
          {{ cancellationPolicy(booking).message }}
        </p>

        <ul class="item-list">
          <li v-for="(item, idx) in booking.items || []" :key="`${booking.id}-${idx}`">
            {{ item.routeLabel }} | {{ item.date }} {{ item.departTime }} - {{ item.arriveTime }} |
            {{ item.className }} | Ghe:
            {{ (item.passengers || []).map((p) => p.seat || '-').join(', ') || '-' }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api, getApiErrorMessage } from '@/constraint'

const authStore = useAuthStore()
const router = useRouter()
const initials = computed(() => {
  const name = authStore.currentUser?.fullname || ''
  if (!name) return 'U'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

const logout = () => {
  authStore.logout()
  router.push('/')
}
const loading = ref(false)
const errorMessage = ref('')
const bookings = ref([])

const DAY_MS = 24 * 60 * 60 * 1000

const parseDateTime = (dateText, timeText = '00:00') => {
  if (!dateText) return null
  const candidate = new Date(`${dateText}T${timeText}:00`)
  return Number.isNaN(candidate.getTime()) ? null : candidate
}

const firstDeparture = (booking) => {
  const departures = (booking.items || [])
    .map((item) => parseDateTime(item.date, item.departTime))
    .filter(Boolean)
  if (!departures.length) return null
  return new Date(Math.min(...departures.map((d) => d.getTime())))
}

const bookingBelongsToCurrentUser = (booking) => {
  if (!authStore.currentUser) return false
  if (`${booking.accountId || ''}` === `${authStore.currentUser.id || ''}`) return true
  const bookingEmail = `${booking.contact?.email || ''}`.trim().toLowerCase()
  const currentEmail = `${authStore.currentUser.email || ''}`.trim().toLowerCase()
  return !!bookingEmail && bookingEmail === currentEmail
}

const cancellationPolicy = (booking) => {
  if (booking.status === 'cancelled') {
    return { canCancel: false, message: 'Đơn đã hủy.' }
  }

  const departure = firstDeparture(booking)
  if (!departure) {
    return { canCancel: false, message: 'Không xác định được ngày khởi hành để hủy.' }
  }

  const diffDays = (departure.getTime() - Date.now()) / DAY_MS
  if (diffDays <= 0) {
    return { canCancel: false, message: 'Đơn đã qua ngày khởi hành, không thể hủy.' }
  }

  // Không cho hủy trong vòng 2 ngày trước khởi hành (không hoàn tiền)
  if (diffDays <= 2) {
    return {
      canCancel: false,
      message: 'Không thể hủy trong vòng 2 ngày trước khởi hành (không hoàn tiền).',
    }
  }

  if (diffDays >= 7) {
    return {
      canCancel: true,
      feeRate: 0,
      refundRate: 1,
      message: 'Hủy trước từ 7 ngày: hoàn 100%, không mất phí.',
    }
  }

  // Từ >2 đến <7 ngày: được hủy, phí 50%
  return {
    canCancel: true,
    feeRate: 0.5,
    refundRate: 0.5,
    message: 'Hủy trong vòng 2–7 ngày trước khởi hành: mất phí 50%, hoàn 50%.',
  }
}

const loadBookings = async () => {
  if (!authStore.isLoggedIn) {
    bookings.value = []
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await api.get('/bookings')
    bookings.value = (res.data || [])
      .filter((booking) => bookingBelongsToCurrentUser(booking))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  } catch (err) {
    bookings.value = []
    errorMessage.value = getApiErrorMessage(err)
  } finally {
    loading.value = false
  }
}

const cancelBooking = async (booking) => {
  const policy = cancellationPolicy(booking)
  if (!policy.canCancel) return

  const total = Number(booking.total || 0)
  const feeAmount = Math.round(total * (policy.feeRate || 0))
  const refundAmount = Math.max(0, total - feeAmount)

  const accepted = window.confirm(
    `Xác nhận hủy đơn ${booking.id}?\nPhí hủy: ${money(feeAmount)}\nSố tiền hoàn: ${money(refundAmount)}`
  )
  if (!accepted) return

  try {
    await api.patch(`/bookings/${booking.id}`, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancellation: {
        feeRate: policy.feeRate || 0,
        refundRate: policy.refundRate || 0,
        feeAmount,
        refundAmount,
      },
    })

    await loadBookings()
    window.alert(`Đã hủy đơn ${booking.id}. Số tiền hoàn dự kiến: ${money(refundAmount)}`)
  } catch (err) {
    window.alert(getApiErrorMessage(err))
  }
}

const statusLabel = (status) => {
  if (status === 'cancelled') return 'Đã hủy'
  if (status === 'pending') return 'Chờ thanh toán'
  return 'Đã đặt'
}

const paymentStatusLabel = (status) => {
  if (status === 'paid') return 'Đã thanh toán'
  if (status === 'failed') return 'Thất bại'
  if (status === 'pending') return 'Chờ thanh toán'
  return 'Chưa cập nhật'
}

const paymentLabel = (booking) => {
  const provider = booking.payment?.provider || booking.payment?.method
  return provider ? `${provider} (${paymentStatusLabel(booking.payment?.status)})` : 'Chưa có thông tin'
}

const formatDateTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

const money = (value = 0) => `${Number(value || 0).toLocaleString()} đ`

const selected = ref(null)

const holdRemaining = computed(() => {
  if (!selected.value) return null
  const expires = selected.value.holdExpiresAt || selected.value.holdUntil || selected.value.holdExpires
  if (!expires) return null
  const remainingMs = new Date(expires).getTime() - Date.now()
  return remainingMs > 0 ? Math.max(0, Math.floor(remainingMs / 1000)) : 0
})

const selectBooking = (b) => {
  selected.value = b
}

const printOrder = () => {
  window.print()
}

onMounted(loadBookings)

watch(
  () => authStore.currentUser?.id,
  () => {
    loadBookings()
  }
)
</script>

<style scoped>
.profile-page {
  max-width: 1020px;
  margin: 20px auto 50px;
  padding: 0 16px;
}
.page-head h1 {
  margin: 0;
  color: #0c2b44;
}
.sub {
  margin: 6px 0 0;
  color: #475569;
}
.content {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}
.booking-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
}
.booking-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}
.booking-id {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
}
.booking-meta {
  margin: 6px 0 0;
  color: #475569;
}
.booking-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status {
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 700;
  font-size: 0.85rem;
}
.status.confirmed {
  background: #ecfdf3;
  color: #166534;
}
.status.pending {
  background: #fff7ed;
  color: #9a3412;
}
.status.cancelled {
  background: #fef2f2;
  color: #b91c1c;
}
.line-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 6px 12px;
  margin-top: 10px;
}
.line-grid p {
  margin: 0;
  color: #0f172a;
}
.policy {
  margin: 10px 0 0;
  color: #334155;
  font-weight: 600;
}
.item-list {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #334155;
}
.item-list li + li {
  margin-top: 4px;
}
.danger {
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  background: #ef4444;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.empty {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  color: #475569;
}
.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
}
/* Profile header modern compact styles */
.profile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg,#0c2b44,#0ea5a9);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.05rem;
}
.meta h1 { margin: 0; font-size: 1.15rem; color: #0c2b44 }
.profile-actions .ghost { padding: 8px 12px }

/* Compact booking card */
.booking-card { padding: 14px; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; box-shadow: 0 8px 20px rgba(2,6,23,0.04) }
.booking-head { gap: 6px }
.booking-meta { margin: 4px 0 0; color: #64748b; font-size: 0.95rem }
.line-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 6px 8px }
.item-list { padding-left: 0; margin-top: 8px }
.item-list li { font-size: 0.95rem; color: #475569 }

/* Buttons */
.btn { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; border:1px solid transparent; font-weight:700; cursor:pointer; transition:transform .08s ease, box-shadow .12s ease }
.btn-ghost { background: #fff; color: #0c2b44; border-color: #e6eef6 }
.btn-ghost:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(2,6,23,0.06) }
.btn-primary { background: linear-gradient(90deg,#0ea5a9,#0c2b44); color: #fff; border: none }
.btn-danger { background: linear-gradient(90deg,#ef4444,#dc2626); color: #fff; border: none }
.action-buttons { display:flex; gap:8px; align-items:center }

/* Status badge refinement */
.status { padding:6px 12px; border-radius:999px; font-weight:800; font-size:0.85rem }
.status.confirmed { background: #ecfdf3; color: #166534 }
.status.pending { background: #fff7ed; color: #9a3412 }
.status.cancelled { background: #fef2f2; color: #b91c1c }
/* Order detail styles */
.order-detail { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-top: 12px }
.order-head { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px }
.order-title h3 { margin:0; color:#0c2b44 }
.order-ops button { margin-left:8px }
.order-info { display:grid; grid-template-columns: 1fr 1fr; gap: 12px }
.buyer, .purchase { background:#fbfdff; padding:12px; border-radius:8px; border:1px solid #eef2ff }
.buyer h4, .purchase h4 { margin:0 0 8px 0 }
.order-table { width:100%; border-collapse: collapse; }
.order-table th, .order-table td { padding:8px; border:1px solid #e6eef6; text-align:left }
.order-table .right { text-align:right }
.td-title { font-weight:700; color:#0f172a }
.td-sub { color:#64748b; font-size:0.92rem }
.order-note { margin-top:12px; color:#334155; font-size:0.95rem }

@media (max-width: 720px) {
  .booking-head {
    flex-direction: column;
    align-items: flex-start;
  }
  .profile-head { flex-direction: column; align-items: flex-start; gap: 8px }
  .booking-card { grid-template-columns: 1fr; }
  .order-info { grid-template-columns: 1fr }
}
</style>
