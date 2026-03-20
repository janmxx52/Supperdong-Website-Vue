<template>
  <div v-if="sailing" class="detail">
    <header class="detail-head">
      <div>
        <p class="eyebrow">Chi tiết chuyến</p>
        <h1>{{ routeLabel }}</h1>
        <p class="sub">
          {{ sailing.date }} · {{ sailing.departTime }} → {{ sailing.arriveTime }} · {{ sailing.vessel }}
        </p>
      </div>
      <button class="back" @click="goBack">← Quay lại</button>
    </header>

    <section class="panel">
      <h3>Chọn hạng ghế</h3>
      <div class="class-options">
        <label
          v-for="c in sailing.classOptions"
          :key="c.code"
          :class="['class-card', selectedClass === c.code ? 'active' : '']"
        >
          <input
            type="radio"
            name="class"
            :value="c.code"
            v-model="selectedClass"
          />
          <div class="title">{{ c.name }}</div>
          <div class="price">Người lớn: {{ c.priceAdult.toLocaleString() }} đ</div>
          <div class="price small">Trẻ em: {{ c.priceChild.toLocaleString() }} đ</div>
        </label>
      </div>
    </section>

    <section class="panel">
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
    </section>

    <section class="panel summary">
      <div>
        <p class="label">Tổng tiền</p>
        <p class="total">{{ total.toLocaleString() }} đ</p>
        <p class="note">Đã bao gồm phí dịch vụ, chưa tích hợp thanh toán.</p>
      </div>
      <button class="primary" @click="addToCart">Thêm vào giỏ đặt vé</button>
    </section>
  </div>
  <div v-else class="empty">Không tìm thấy chuyến.</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSailingStore } from '@/stores/sailing'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const sailingStore = useSailingStore()
const cartStore = useCartStore()

const sailing = ref(null)
const selectedClass = ref(null)
const pax = ref({ adult: 1, child: 0 })

const routeLabel = computed(() =>
  sailing.value ? sailingStore.routeLabel(sailing.value.routeId) : ''
)

const priceByClass = computed(() => {
  if (!sailing.value || !selectedClass.value) return { adult: 0, child: 0 }
  const cls = sailing.value.classOptions.find((c) => c.code === selectedClass.value)
  return { adult: cls.priceAdult, child: cls.priceChild }
})

const total = computed(
  () => pax.value.adult * priceByClass.value.adult + pax.value.child * priceByClass.value.child
)

const addToCart = () => {
  if (!sailing.value || !selectedClass.value) return
  cartStore.addToCart({
    sailingId: sailing.value.id,
    routeLabel: routeLabel.value,
    date: sailing.value.date,
    departTime: sailing.value.departTime,
    arriveTime: sailing.value.arriveTime,
    vessel: sailing.value.vessel,
    classCode: selectedClass.value,
    className: sailing.value.classOptions.find((c) => c.code === selectedClass.value)?.name,
    price: priceByClass.value,
    pax: { ...pax.value },
    total: total.value,
  })
  router.push({ name: 'Home' })
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  const id = route.params.id
  await sailingStore.fetchRoutes()
  await sailingStore.fetchPorts()
  sailing.value = await sailingStore.fetchSailingById(id)
  selectedClass.value = sailing.value?.classOptions?.[0]?.code || null
})
</script>

<style scoped>
.detail {
  max-width: 900px;
  margin: 30px auto 50px;
  padding: 0 16px;
}
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
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
.back {
  background: #e2e8f0;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}
.panel {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  margin-top: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.panel h3 {
  margin: 0 0 10px 0;
  color: #0c2b44;
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
.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.label {
  margin: 0;
  color: #475569;
  font-weight: 600;
}
.total {
  margin: 4px 0;
  font-size: 1.6rem;
  color: #b30404;
  font-weight: 800;
}
.note {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
}
.primary {
  background: #0c2b44;
  color: #fff;
  border: none;
  padding: 14px 18px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}
.empty {
  text-align: center;
  padding: 50px 16px;
}
@media (max-width: 720px) {
  .summary {
    flex-direction: column;
    align-items: flex-start;
  }
  .primary {
    width: 100%;
  }
}
</style>
