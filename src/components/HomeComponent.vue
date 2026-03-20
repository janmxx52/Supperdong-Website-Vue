<template>
  <section class="hero-search">
    <div class="hero-text">
      <p class="eyebrow">Ferry Booking</p>
      <h1>Đặt vé tàu ra đảo nhanh gọn</h1>
      <p class="sub">
        Chọn tuyến – chọn giờ – xác nhận. Dữ liệu mẫu Superdong / Côn Đảo Express.
      </p>
    </div>
    <form class="search-card" @submit.prevent="onSearch">
      <label class="field">
        <span>Tuyến</span>
        <select v-model="form.routeId" required>
          <option value="" disabled>Chọn tuyến</option>
          <option v-for="r in routes" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>
      </label>
      <label class="field">
        <span>Ngày đi</span>
        <input type="date" v-model="form.date" required />
      </label>
      <button type="submit" class="search-btn">Tìm chuyến</button>
    </form>
  </section>

  <section class="results">
    <div class="results-head">
      <h2>Chuyến phù hợp</h2>
      <div class="hint" v-if="!sailings.length">Hãy chọn tuyến và ngày để xem chuyến</div>
    </div>
    <div class="sailing-list">
      <SailingCard
        v-for="s in sailings"
        :key="s.id"
        :sailing="s"
        :route-label="store.routeLabel(s.routeId)"
      />
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import SailingCard from './ProductList.vue'
import { useSailingStore } from '@/stores/sailing'

const store = useSailingStore()
const sailings = ref([])
const routes = ref([])

const form = reactive({
  routeId: '',
  date: '',
})

const onSearch = async () => {
  sailings.value = await store.fetchSailings({
    routeId: form.routeId,
    date: form.date,
  })
}

onMounted(async () => {
  await store.init()
  routes.value = store.availableRoutes
  if (routes.value.length) form.routeId = routes.value[0].id
  // gợi ý: hôm nay hoặc ngày có sẵn trong db.json (2026-03-21)
  const today = new Date().toISOString().slice(0, 10)
  form.date = today
  await onSearch()
})
</script>

<style>
.hero-search {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 30px;
  align-items: center;
  padding: 50px 30px 20px;
  background: linear-gradient(135deg, #0c2b44 0%, #0f456f 100%);
  color: #fff;
}
.hero-text h1 {
  font-size: 36px;
  margin: 10px 0;
}
.hero-text .sub {
  opacity: 0.9;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: #ffd166;
  margin: 0;
}
.search-card {
  background: #fff;
  color: #0c2b44;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  align-items: end;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}
.field select,
.field input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
}
.search-btn {
  grid-column: span 2;
  padding: 12px 14px;
  border: none;
  background: #ffb703;
  color: #0c2b44;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
}
.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.results {
  padding: 30px 20px 50px;
}
.results-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.results h2 {
  margin: 0;
  color: #0c2b44;
}
.hint {
  color: #888;
  font-style: italic;
}
.sailing-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
@media (max-width: 900px) {
  .hero-search {
    grid-template-columns: 1fr;
  }
  .search-btn {
    grid-column: span 1;
  }
}
</style>
