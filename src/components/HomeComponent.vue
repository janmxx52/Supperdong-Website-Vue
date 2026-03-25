<template>
  <section class="hero-search">
    <div class="hero-text">
      <div class="pill">GDU Islands</div>
      <h1>Đặt vé tàu ra đảo<br/>nhanh – rõ – gọn</h1>
      <p class="sub">Chọn tuyến, chọn ngày, xem giá tức thì.</p>
      <div class="stats">
        <div><strong>10+</strong><span>Tuyến nội địa</span></div>
        <div><strong>24/7</strong><span>Đặt vé online</span></div>
        <div><strong>Hotline</strong><span>0297 123 456</span></div>
      </div>
    </div>
    <form class="search-card" @submit.prevent="onSearch">
      <label class="field">
        <span>Tuyến</span>
        <select v-model="form.routeId" required>
          <option value="" disabled>Chọn tuyến</option>
          <option v-for="r in routesOptions" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>
      </label>
      <label class="field">
        <span>Ngày đi</span>
        <input type="date" v-model="form.date" :min="today" required />
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
        :routes="routesData"
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
const routesOptions = ref([])
const routesData = ref([])
const today = new Date().toISOString().slice(0, 10)

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
  routesData.value = store.routes
  routesOptions.value = store.routes.map(r => ({ 
    id: r.id, 
    label: store.routeLabel(r.id) }))
  if (routesOptions.value.length) form.routeId = routesOptions.value[0].id
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
  padding: 50px 30px 30px;
  background: radial-gradient(circle at 20% 20%, #123c65 0, #0c2b44 55%, #0b2f40 100%);
  color: #fff;
}
.hero-text h1 {
  font-size: 40px;
  margin: 12px 0;
  line-height: 1.2;
}
.hero-text .sub {
  opacity: 0.9;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 209, 102, 0.18);
  color: #ffd166;
  font-weight: 700;
  border: 1px solid rgba(255, 209, 102, 0.4);
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
  border: 1px solid #edf2f7;
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
  transition: border 0.2s, box-shadow 0.2s;
}
.field select:focus,
.field input:focus {
  border-color: #0f456f;
  box-shadow: 0 0 0 3px rgba(15, 69, 111, 0.15);
  outline: none;
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
.stats {
  display: flex;
  gap: 14px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.stats div {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 12px;
  border-radius: 12px;
}
.stats strong {
  display: block;
  font-size: 18px;
}
.stats span {
  color: #cbd5e1;
  font-size: 13px;
}
@media (max-width: 900px) {
  .hero-search {
    grid-template-columns: 1fr;
    padding: 30px 18px;
  }
  .search-btn {
    grid-column: span 1;
  }
  .search-card {
    grid-template-columns: 1fr;
  }
  .sailing-list {
    grid-template-columns: 1fr;
  }
}
</style>
