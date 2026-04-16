<template>
  <div v-if="sailing" class="detail">
    <header class="detail-head">
      <div>
        <p class="eyebrow">Quy trình đặt chỗ</p>
        <h1>{{ routeLabel }}</h1>
        <p class="sub">
          {{ sailing.date }} | {{ sailing.departTime }} -> {{ sailing.arriveTime }} | {{ sailing.vessel }}
        </p>
      </div>
    </header>

    <div class="stepper">
      <div
        v-for="(label, idx) in steps"
        :key="label"
        :class="['step', { active: idx <= currentStep }]"
      >
        <span class="dot">{{ idx + 1 }}</span>
        <span class="label">{{ label }}</span>
      </div>
    </div>

    <section v-if="currentStep === 0" class="panel">
      <h3>Tuyến</h3>
      <div class="summary">
        <div>
          <p class="label">Tuyến</p>
          <p class="value">{{ routeLabel }}</p>
        </div>
        <div>
          <p class="label">Giờ</p>
          <p class="value">{{ sailing.departTime }} -> {{ sailing.arriveTime }}</p>
        </div>
        <div>
          <p class="label">Tàu</p>
          <p class="value">{{ sailing.vessel }}</p>
        </div>
      </div>
    </section>

    <section v-else-if="currentStep === 1" class="panel">
      <h3>Người đặt vé</h3>
      <p v-if="authStore.isLoggedIn" class="account-hint">
        Đang dùng thông tin tài khoản. Bỏ chọn "Tôi là hành khách chính" để đặt giúp và sửa thông tin.
      </p>
      <div class="form-grid">
        <label>
          <span>Tên người đặt vé *</span>
          <input
            v-model="contact.name"
            :class="{ invalid: !contact.name.trim() && tried }"
            :disabled="contactLocked"
            required
          />
        </label>
        <label>
          <span>Điện thoại liên lạc *</span>
          <input
            v-model="contact.phone"
            :class="{ invalid: !contact.phone.trim() && tried }"
            :disabled="contactLocked"
            required
          />
        </label>
        <label>
          <span>Email *</span>
          <input
            v-model="contact.email"
            :class="{ invalid: (!contact.email.trim() || !isValidEmail(contact.email)) && tried }"
            :disabled="contactLocked"
            required
          />
          <small v-if="tried && contact.email && !isValidEmail(contact.email)" class="error-text">
            Email không hợp lệ
          </small>
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="contact.isMainPassenger" /> Tôi là hành khách chính
        </label>
      </div>
      <h4>Thông tin hóa đơn tài chính (tùy chọn)</h4>
      <div class="form-grid">
        <label>
          <span>Người mua hàng</span>
          <input v-model="contact.invoice.buyer" />
        </label>
        <label>
          <span>Tên công ty</span>
          <input v-model="contact.invoice.company" />
        </label>
        <label>
          <span>Mã số thuế</span>
          <input v-model="contact.invoice.tax" />
        </label>
        <label>
          <span>Địa chỉ</span>
          <input v-model="contact.invoice.address" />
        </label>
      </div>
    </section>

    <section v-else-if="currentStep === 2" class="panel">
      <h3>Hành khách</h3>
      <div class="pax-grid">
        <div class="pax">
          <p>Người lớn</p>
          <div class="counter">
            <button @click="pax.adult = Math.max(1, pax.adult - 1)">-</button>
            <span>{{ pax.adult }}</span>
            <button @click="pax.adult += 1">+</button>
          </div>
        </div>
        <div class="pax">
          <p>Trẻ em (6-11 tuổi)</p>
          <div class="counter">
            <button @click="pax.child = Math.max(0, pax.child - 1)">-</button>
            <span>{{ pax.child }}</span>
            <button @click="pax.child += 1">+</button>
          </div>
        </div>
      </div>
      <div class="passenger-list">
        <div v-for="(p, idx) in passengers" :key="idx" class="passenger-card">
          <p class="label">Hành khách {{ idx + 1 }} ({{ p.type === 'adult' ? 'Người lớn' : 'Trẻ em' }})</p>
          <input
            v-model="p.name"
            placeholder="Họ và tên"
            :class="{ invalid: !p.name.trim() && tried }"
            required
          />
        </div>
      </div>
    </section>

    <section v-else-if="currentStep === 3" class="panel">
      <h3>Chọn ghế</h3>
      <div class="class-options">
        <label
          v-for="c in sailing.classOptions"
          :key="c.code"
          :class="['class-card', selectedClass === c.code ? 'active' : '']"
        >
          <input type="radio" :value="c.code" v-model="selectedClass" />
          <div class="title">{{ c.name }}</div>
          <div class="price">Người lớn: {{ c.priceAdult.toLocaleString() }} đ</div>
          <div class="price small">Trẻ em: {{ c.priceChild.toLocaleString() }} đ</div>
        </label>
      </div>
      <p class="seat-note">
        Chọn hành khách ở trên, sau đó nhấp vào ghế trong sơ đồ. Chỉ hạng BUS mới được phép chọn ghế VIP.
      </p>
      <SeatMapPicker
        :passengers="passengers"
        :active-passenger-index="activePassengerIndex"
        :selected-class="selectedClass"
        :occupied-seats="occupiedSeats"
        @set-active-passenger="activePassengerIndex = $event"
        @select-seat="assignSeatForActivePassenger"
      />
      <p v-if="seatWarning" class="seat-warning">{{ seatWarning }}</p>
    </section>

    <section v-else-if="currentStep === 4" class="panel">
      <h3>Thanh toán</h3>
      <div class="summary highlight">
        <div>
          <p class="label">Hạng</p>
          <p class="value">{{ selectedClassName }}</p>
        </div>
        <div>
          <p class="label">Hành khách</p>
          <p class="value">NL {{ pax.adult }} / TE {{ pax.child }}</p>
        </div>
        <div>
          <p class="label">Tổng tiền</p>
          <p class="value total">{{ total.toLocaleString() }} đ</p>
        </div>
      </div>
      <h4>Phuong thuc thanh toan</h4>
      <div class="payment-methods">
        <label
          v-for="method in paymentMethods"
          :key="method.id"
          :class="['payment-card', { active: paymentMethod === method.id }]"
        >
          <input type="radio" :value="method.id" v-model="paymentMethod" />
          <p class="name">{{ method.label }}</p>
          <p class="desc">{{ method.description }}</p>
        </label>
      </div>
      <div class="payment-guide">
        <p class="guide-title">Hướng dẫn nhanh</p>
        <p class="guide-text">
          Bạn đã chọn <strong>{{ selectedPaymentLabel }}</strong>. Sau khi đặt đơn, hệ thống sẽ tạo mã thanh toán
          (QR/chuyển khoản) để bạn quét bằng ứng dụng tương ứng.
        </p>
      </div>
    </section>

    <div class="actions">
      <button class="ghost" @click="prevStep">{{ currentStep === 0 ? 'Quay lại' : 'Trở lại' }}</button>
      <button class="primary" :disabled="!stepValid" @click="nextStepOrPay">
        {{ currentStep === steps.length - 1 ? 'Thanh toán' : 'Tiếp tục' }}
      </button>
    </div>
  </div>
  <div v-else-if="loadError" class="empty error-state">{{ loadError }}</div>
  <div v-else class="empty">Không tìm thấy chuyến.</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSailingStore } from '@/stores/sailing'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { api, getApiErrorMessage } from '@/constraint'
import SeatMapPicker from '@/components/SeatMapPicker.vue'

const steps = ['Tuyến', 'Người đặt vé', 'Hành khách', 'Chọn ghế', 'Thanh toán']

const route = useRoute()
const router = useRouter()
const sailingStore = useSailingStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const sailing = ref(null)
const selectedClass = ref(null)
const pax = ref({ adult: 1, child: 0 })
const passengers = ref([])
const currentStep = ref(0)
const tried = ref(false)
const activePassengerIndex = ref(0)
const occupiedSeats = ref([])
const seatWarning = ref('')
const paymentMethod = ref('qr-viet')

const paymentMethods = [
  {
    id: 'qr-viet',
    label: 'QRViet',
    provider: 'QRViet',
    description: 'Quét mã QR qua ứng dụng ngân hàng hỗ trợ VietQR.',
  },
  {
    id: 'zalopay',
    label: 'ZaloPay',
    provider: 'ZaloPay',
    description: 'Thanh toán bằng ví ZaloPay.',
  },
  {
    id: 'momo',
    label: 'Momo',
    provider: 'Momo',
    description: 'Thanh toán bằng ví Momo.',
  },
  {
    id: 'bank-transfer',
    label: 'Chuyển khoản',
    provider: 'Ngân hàng',
    description: 'Chuyển khoản thủ công theo mã đơn.',
  },
]

const contact = ref({
  name: '',
  phone: '',
  email: '',
  isMainPassenger: true,
  invoice: { buyer: '', company: '', tax: '', address: '' },
})

const loadError = computed(() => sailingStore.error || cartStore.error)
const contactLocked = computed(() => authStore.isLoggedIn && contact.value.isMainPassenger)
const routeLabel = computed(() =>
  sailing.value ? sailingStore.routeLabel(sailing.value.routeId) : ''
)

const selectedClassData = computed(() =>
  sailing.value?.classOptions?.find((c) => c.code === selectedClass.value)
)
const selectedClassName = computed(() => selectedClassData.value?.name || '')
const selectedPaymentData = computed(
  () => paymentMethods.find((method) => method.id === paymentMethod.value) || paymentMethods[0]
)
const selectedPaymentLabel = computed(() => selectedPaymentData.value?.label || 'QRViet')

const total = computed(() => {
  if (!selectedClassData.value) return 0
  return (
    pax.value.adult * selectedClassData.value.priceAdult +
    pax.value.child * selectedClassData.value.priceChild
  )
})

const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val)
const normalizeSeat = (seat = '') => `${seat}`.trim().toUpperCase()
const isVipSeatCode = (seat = '') => /^\d+V$/.test(normalizeSeat(seat))

const stepValid = computed(() => {
  switch (currentStep.value) {
    case 0:
      return true
    case 1:
      return (
        contact.value.name.trim().length > 0 &&
        contact.value.phone.trim().length > 0 &&
        contact.value.email.trim().length > 0 &&
        isValidEmail(contact.value.email)
      )
    case 2:
      return passengers.value.every((p) => p.name.trim().length > 0)
    case 3:
      return !!selectedClass.value && passengers.value.every((p) => `${p.seat || ''}`.trim().length > 0)
    case 4:
      return total.value > 0 && !!paymentMethod.value
    default:
      return true
  }
})

const rebuildPassengers = () => {
  const totalPax = pax.value.adult + pax.value.child
  const list = []
  for (let i = 0; i < totalPax; i++) {
    list.push({
      name: passengers.value[i]?.name || '',
      type: i < pax.value.adult ? 'adult' : 'child',
      seat: normalizeSeat(passengers.value[i]?.seat || ''),
    })
  }
  passengers.value = list
  if (activePassengerIndex.value >= list.length) {
    activePassengerIndex.value = Math.max(0, list.length - 1)
  }
}

const autofillContactFromAccount = () => {
  if (!authStore.currentUser) return
  contact.value.name = authStore.currentUser.fullname || ''
  contact.value.phone = authStore.currentUser.phone || ''
  contact.value.email = authStore.currentUser.email || ''
  contact.value.isMainPassenger = true
}

const cleanupPassengerSeatConflicts = () => {
  const occupied = new Set(occupiedSeats.value.map((seat) => normalizeSeat(seat)))
  const seen = new Set()

  passengers.value.forEach((passenger) => {
    const seat = normalizeSeat(passenger.seat)
    if (!seat) {
      passenger.seat = ''
      return
    }
    if (occupied.has(seat) || seen.has(seat)) {
      passenger.seat = ''
      return
    }
    seen.add(seat)
    passenger.seat = seat
  })
}

const loadOccupiedSeats = async () => {
  if (!sailing.value?.id) return

  try {
    const res = await api.get('/bookings')
    const seats = []

    for (const booking of res.data || []) {
      const st = `${booking.status || ''}`.toLowerCase()
      // ignore cancelled/canceled bookings so seats become available again
      if (st === 'cancelled' || st === 'canceled') continue

      for (const item of booking.items || []) {
        if (`${item.sailingId}` !== `${sailing.value.id}`) continue
        for (const passenger of item.passengers || []) {
          const seat = normalizeSeat(passenger?.seat)
          if (seat) seats.push(seat)
        }
      }
    }

    occupiedSeats.value = [...new Set(seats)]
    seatWarning.value = ''
    cleanupPassengerSeatConflicts()
  } catch (err) {
    occupiedSeats.value = []
    seatWarning.value = `Không thể tải danh sách ghế đã đặt: ${getApiErrorMessage(err)}`
  }
}

const assignSeatForActivePassenger = (seatCode) => {
  const targetIndex = activePassengerIndex.value
  if (!passengers.value[targetIndex]) return

  const nextSeat = normalizeSeat(seatCode)
  if (!nextSeat) return

    if (occupiedSeats.value.some((seat) => normalizeSeat(seat) === nextSeat)) {
    seatWarning.value = `Ghế ${nextSeat} đã được đặt hoặc đang giữ.`
    return
  }

  const duplicateIndex = passengers.value.findIndex(
    (passenger, index) =>
      index !== targetIndex && normalizeSeat(passenger.seat) === nextSeat
  )
  if (duplicateIndex !== -1) {
    seatWarning.value = `Ghế ${nextSeat} đang được gán cho hành khách ${duplicateIndex + 1}.`
    return
  }

  const currentSeat = normalizeSeat(passengers.value[targetIndex].seat)
  passengers.value[targetIndex].seat = currentSeat === nextSeat ? '' : nextSeat
  seatWarning.value = ''

  if (passengers.value[targetIndex].seat && targetIndex < passengers.value.length - 1) {
    activePassengerIndex.value = targetIndex + 1
  }
}

watch(pax, rebuildPassengers, { deep: true, immediate: true })

watch(
  () => authStore.currentUser,
  (user) => {
    if (!user) return
    autofillContactFromAccount()
  },
  { immediate: true }
)

watch(
  () => contact.value.isMainPassenger,
  (val) => {
    if (val && authStore.isLoggedIn) {
      autofillContactFromAccount()
    }
    if (val && passengers.value[0]) {
      passengers.value[0].name = contact.value.name
    }
  }
)
watch(
  () => contact.value.name,
  (val) => {
    if (contact.value.isMainPassenger && passengers.value[0]) {
      passengers.value[0].name = val
    }
  }
)

watch(
  () => selectedClass.value,
  (value) => {
    const isBus = `${value}`.toUpperCase() === 'BUS'
    if (isBus) {
      // Clear any non-VIP seats when switching to Thương gia
      passengers.value.forEach((passenger) => {
        if (!isVipSeatCode(passenger.seat)) passenger.seat = ''
      })
      return
    }

    // When switching to non-BUS classes, clear VIP seats
    passengers.value.forEach((passenger) => {
      if (isVipSeatCode(passenger.seat)) passenger.seat = ''
    })
  }
)

watch(
  () => currentStep.value,
  async (step) => {
    if (step === 3) {
      await loadOccupiedSeats()
    }
  }
)

const nextStepOrPay = async () => {
  tried.value = true
  if (!stepValid.value) return

  if (currentStep.value < steps.length - 1) {
    tried.value = false
    currentStep.value += 1
    return
  }

  const cartItem = {
    sailingId: sailing.value.id,
    routeLabel: routeLabel.value,
    date: sailing.value.date,
    departTime: sailing.value.departTime,
    arriveTime: sailing.value.arriveTime,
    vessel: sailing.value.vessel,
    classCode: selectedClass.value,
    className: selectedClassName.value,
    price: {
      adult: selectedClassData.value.priceAdult,
      child: selectedClassData.value.priceChild,
    },
    pax: { ...pax.value },
    passengers: passengers.value,
    total: total.value,
  }

  cartStore.addToCart(cartItem)
  const bookingId = await cartStore.checkout({
    accountId: authStore.currentUser?.id || null,
    contact: {
      name: contact.value.name,
      phone: contact.value.phone,
      email: contact.value.email,
      invoice: contact.value.invoice,
    },
    payment: {
      method: paymentMethod.value,
      provider: selectedPaymentData.value.provider,
      status: 'pending',
      reference: null,
    },
  })

  if (!bookingId) {
    window.alert(cartStore.error || 'Không thể tạo đơn đặt vé lúc này.')
    return
  }

  window.alert(
    `Đặt chỗ thành công!\nMã: ${bookingId}\nThanh toán bằng: ${selectedPaymentLabel.value}`
  )
  router.push({ name: 'Payment', params: { id: bookingId } })
}

const prevStep = () => {
  if (currentStep.value === 0) {
    window.history.back()
  } else {
    currentStep.value -= 1
  }
}

onMounted(async () => {
  const id = route.params.id
  await Promise.allSettled([sailingStore.fetchRoutes(), sailingStore.fetchPorts()])
  sailing.value = await sailingStore.fetchSailingById(id)
  selectedClass.value = sailing.value?.classOptions?.[0]?.code || null
  await loadOccupiedSeats()
})
</script>

<style scoped>
.detail {
  max-width: 960px;
  margin: 20px auto 50px;
  padding: 0 16px;
}
.detail-head {
  margin-bottom: 14px;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffb703;
  font-weight: 700;
  margin: 0;
}
.detail h1 {
  margin: 6px 0;
  color: #0c2b44;
}
.sub {
  margin: 0;
  color: #475569;
}
.stepper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 16px 0 12px;
}
.step {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
}
.step .dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.step.active {
  color: #0c2b44;
  font-weight: 700;
}
.step.active .dot {
  border-color: #ffb703;
  background: #ffb703;
  color: #0c2b44;
}
.panel {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  margin-top: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.panel h3 {
  margin: 0 0 10px 0;
  color: #0c2b44;
}
.account-hint {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 600;
}
.seat-note {
  margin: 12px 0 10px;
  color: #475569;
  font-weight: 600;
}
.seat-warning {
  margin: 10px 0 0;
  color: #b91c1c;
  font-weight: 700;
}
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.summary.highlight {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}
.label {
  margin: 0;
  color: #475569;
  font-weight: 600;
}
.value {
  margin: 4px 0 0;
  font-size: 1.1rem;
  color: #0c2b44;
  font-weight: 700;
}
.value.total {
  color: #b30404;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
}
input:disabled {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}
.invalid {
  border-color: #ef4444;
}
.error-text {
  color: #ef4444;
  font-size: 0.9rem;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.pax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.pax {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}
.counter {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}
.counter button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #e2e8f0;
  cursor: pointer;
}
.passenger-list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}
.passenger-card {
  background: #f8fafc;
  padding: 10px;
  border-radius: 10px;
}
.class-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.class-card {
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 6px;
  cursor: pointer;
  transition: border 0.12s, box-shadow 0.12s;
}
.class-card.active {
  border-color: #0c2b44;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.07);
}
.class-card input {
  display: none;
}
.title {
  font-weight: 700;
  color: #0c2b44;
}
.price {
  margin: 0;
  color: #b30404;
  font-weight: 700;
}
.price.small {
  color: #475569;
  font-weight: 600;
}
.payment-methods {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}
.payment-card {
  border: 1.5px solid #d1d5db;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  background: #f8fafc;
}
.payment-card.active {
  border-color: #0c2b44;
  box-shadow: 0 0 0 2px rgba(12, 43, 68, 0.1);
  background: #eff6ff;
}
.payment-card input {
  display: none;
}
.payment-card .name {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
}
.payment-card .desc {
  margin: 6px 0 0;
  color: #475569;
  font-size: 0.9rem;
}
.payment-guide {
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 10px 12px;
}
.guide-title {
  margin: 0;
  color: #0c2b44;
  font-weight: 800;
}
.guide-text {
  margin: 6px 0 0;
  color: #334155;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
.primary,
.ghost {
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}
.primary {
  background: #0c2b44;
  color: #fff;
}
.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ghost {
  background: #e2e8f0;
  color: #0c2b44;
}
.empty {
  text-align: center;
  padding: 50px 16px;
}
.error-state {
  color: #b91c1c;
}
@media (max-width: 720px) {
  .stepper {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  .primary,
  .ghost {
    width: 100%;
  }
  .panel {
    padding: 14px;
  }
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
