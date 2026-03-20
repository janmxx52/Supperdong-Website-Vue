<template>
  <div class="card">
    <div class="card-header">
      <div class="route">{{ routeLabel }}</div>
      <div class="date">{{ sailing.date }}</div>
    </div>
    <div class="times">
      <div class="time">
        <span class="label">Khởi hành</span>
        <strong>{{ sailing.departTime }}</strong>
      </div>
      <div class="arrow">→</div>
      <div class="time">
        <span class="label">Đến nơi</span>
        <strong>{{ sailing.arriveTime }}</strong>
      </div>
    </div>
    <div class="meta">
      <span>Tàu: {{ sailing.vessel }}</span>
      <span>Thời gian: ~{{ durationLabel }}</span>
    </div>
    <div class="price-row">
      <div>
        <p class="from">Giá từ</p>
        <p class="price">{{ minPrice.toLocaleString() }} đ</p>
      </div>
      <button class="btn" @click="gotoDetail">Chọn chuyến</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { findRouteById } from '@/data/ferryData'

const router = useRouter()
const props = defineProps({
  sailing: { type: Object, required: true },
  routeLabel: { type: String, required: true },
})

const gotoDetail = () => {
  router.push({ name: 'BookingDetail', params: { id: props.sailing.id } })
}

const minPrice = computed(() =>
  Math.min(...props.sailing.classOptions.map((c) => c.priceAdult))
)

const durationLabel = computed(() => {
  const route = findRouteById(props.sailing.routeId)
  if (!route || !route.durationMinutes) return '—'
  const h = Math.floor(route.durationMinutes / 60)
  const m = route.durationMinutes % 60
  return `${h}h${m ? m : ''}`
})
</script>

<style scoped>
.card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #0c2b44;
  font-weight: 700;
}
.route {
  font-size: 1.05rem;
}
.date {
  background: #e8eef5;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 600;
}
.times {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  color: #0c2b44;
}
.label {
  font-size: 0.85rem;
  color: #64748b;
}
.time strong {
  font-size: 1.3rem;
}
.arrow {
  font-size: 1.5rem;
  color: #ffb703;
  font-weight: 700;
}
.meta {
  display: flex;
  justify-content: space-between;
  color: #475569;
  font-size: 0.95rem;
}
.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.from {
  margin: 0;
  color: #64748b;
  font-weight: 600;
}
.price {
  margin: 0;
  font-size: 1.4rem;
  color: #b30404;
  font-weight: 800;
}
.btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #0c2b44;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}
</style>
