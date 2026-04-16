<template>
  <div class="card">
    <div class="card-head">
      <h2>Quản lý chuyến</h2>
      <div v-if="notice.text" :class="['notice', notice.type]">{{ notice.text }}</div>
    </div>
    <div class="grid">
      <form class="form" @submit.prevent="saveSailing">
        <label>Tuyến
          <select v-model="form.routeId" required>
            <option value="" disabled>Chọn tuyến</option>
            <option v-for="r in routes" :key="r.id" :value="r.id">
              {{ routeLabel(r) }}
            </option>
          </select>
        </label>
        <label>Ngày
          <input v-model="form.date" type="date" :min="today" required />
        </label>
        <label>Giờ đi
          <input v-model="form.departTime" type="time" required />
        </label>
        <label>Giờ đến
          <input v-model="form.arriveTime" type="time" required />
        </label>
        <label>Tàu
          <input v-model="form.vessel" placeholder="Tên tàu" required />
        </label>
        <label>Giá Phổ thông (NL)
          <input v-model.number="form.ecoAdult" type="number" min="0" required />
        </label>
        <label>Giá Phổ thông (TE)
          <input v-model.number="form.ecoChild" type="number" min="0" required />
        </label>
        <label>Giá Thương gia (NL)
          <input v-model.number="form.busAdult" type="number" min="0" required />
        </label>
        <label>Giá Thương gia (TE)
          <input v-model.number="form.busChild" type="number" min="0" required />
        </label>
        <button class="primary" type="submit">{{ form.id ? 'Cập nhật' : 'Thêm chuyến' }}</button>
        <button v-if="form.id" class="ghost" type="button" @click="resetForm">Hủy</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Tuyến</th><th>Ngày</th><th>Giờ</th><th>Tàu</th><th>Giá từ</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in sailings" :key="s.id">
            <td>{{ s.id }}</td>
            <td>{{ routeLabelById(s.routeId) }}</td>
            <td>{{ s.date }}</td>
            <td>{{ s.departTime }} -> {{ s.arriveTime }}</td>
            <td>{{ s.vessel }}</td>
            <td>{{ minPrice(s).toLocaleString() }} đ</td>
            <td class="actions">
              <button class="ghost" @click="editSailing(s)">Sửa</button>
              <button class="danger" @click="removeSailing(s.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api, getApiErrorMessage } from '@/constraint'

const routes = ref([])
const sailings = ref([])
const notice = reactive({ type: '', text: '' })
const today = new Date().toISOString().slice(0, 10)
const form = reactive({
  id: null,
  routeId: '',
  date: '',
  departTime: '',
  arriveTime: '',
  vessel: '',
  ecoAdult: 0,
  ecoChild: 0,
  busAdult: 0,
  busChild: 0,
})

const load = async () => {
  try {
    const [r, s] = await Promise.all([
      api.get('/routes'),
      api.get('/sailings'),
    ])
    routes.value = r.data
    sailings.value = s.data
  } catch (err) {
    routes.value = []
    sailings.value = []
    setNotice('error', getApiErrorMessage(err))
  }
}

const saveSailing = async () => {
  if (!form.date || form.date < today) {
    setNotice('error', 'Ngày phải từ hôm nay trở đi')
    return
  }
  const payload = {
    routeId: Number(form.routeId),
    date: form.date,
    departTime: form.departTime,
    arriveTime: form.arriveTime,
    vessel: form.vessel,
    classOptions: [
      { code: 'ECO', name: 'Phổ thông', priceAdult: form.ecoAdult, priceChild: form.ecoChild },
      { code: 'BUS', name: 'Thương gia', priceAdult: form.busAdult, priceChild: form.busChild },
    ],
  }
  try {
    if (form.id) {
      await api.put(`/sailings/${form.id}`, { ...payload, id: form.id })
      setNotice('success', 'Cập nhật chuyến thành công')
    } else {
      await api.post('/sailings', payload)
      setNotice('success', 'Thêm chuyến thành công')
    }
    await load()
    resetForm()
  } catch (err) {
    setNotice('error', getApiErrorMessage(err))
  }
}

const editSailing = (s) => {
  form.id = s.id
  form.routeId = s.routeId
  form.date = s.date
  form.departTime = s.departTime
  form.arriveTime = s.arriveTime
  form.vessel = s.vessel
  const eco = s.classOptions?.find((c) => c.code === 'ECO') || {}
  const bus = s.classOptions?.find((c) => c.code === 'BUS') || {}
  form.ecoAdult = eco.priceAdult || 0
  form.ecoChild = eco.priceChild || 0
  form.busAdult = bus.priceAdult || 0
  form.busChild = bus.priceChild || 0
}

const removeSailing = async (id) => {
  if (!id) {
    setNotice('error', 'Chuyến không có ID hợp lệ')
    return
  }
  if (!confirm('Xóa chuyến này?')) return
  try {
    await api.delete(`/sailings/${id}`)
    setNotice('warning', 'Đã xóa chuyến')
    await load()
  } catch (err) {
    setNotice('error', getApiErrorMessage(err))
  }
}

const resetForm = () => Object.assign(form, {
  id: null, routeId: '', date: '', departTime: '', arriveTime: '', vessel: '',
  ecoAdult: 0, ecoChild: 0, busAdult: 0, busChild: 0,
})

const routeLabel = (r) => `${r.fromPort} -> ${r.toPort}`
const routeLabelById = (id) => {
  const r = routes.value.find((x) => `${x.id}` === `${id}`)
  return r ? routeLabel(r) : id
}
const minPrice = (s) => Math.min(...(s.classOptions || []).map((c) => c.priceAdult || 0))
const setNotice = (type, text) => Object.assign(notice, { type, text })

onMounted(load)
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 12px;
}
.form {
  display: grid;
  gap: 10px;
}
label {
  display: grid;
  gap: 4px;
  font-weight: 600;
}
input, select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
.actions { display: flex; gap: 6px; }
.primary, .ghost, .danger {
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.primary { background: #0c2b44; color: #fff; }
.ghost { background: #e5e7eb; }
.danger { background: #ef4444; color: #fff; }
.notice { padding: 6px 10px; border-radius: 8px; font-weight: 600; }
.success { background: #ecfdf3; color: #166534; }
.error { background: #fef2f2; color: #b91c1c; }
.warning { background: #fffbeb; color: #92400e; }
@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
  table { font-size: 14px; }
}
</style>
