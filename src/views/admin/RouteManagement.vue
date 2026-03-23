<template>
  <div class="card">
    <div class="card-head">
      <h2>Tuyến đi</h2>
      <div v-if="notice.text" :class="['notice', notice.type]">{{ notice.text }}</div>
    </div>
    <div class="grid">
      <form class="form" @submit.prevent="saveRoute">
        <label>Mã fromPort
          <input v-model="form.fromPort" placeholder="VD: RG" required />
        </label>
        <label>Mã toPort
          <input v-model="form.toPort" placeholder="VD: PQ" required />
        </label>
        <label>Thời gian (phút)
          <input v-model.number="form.durationMinutes" type="number" min="10" required />
        </label>
        <label>Ngày bắt đầu áp dụng
          <input v-model="form.startDate" type="date" required />
        </label>
        <button class="primary" type="submit">{{ form.id ? 'Cập nhật' : 'Thêm tuyến' }}</button>
        <button v-if="form.id" class="ghost" type="button" @click="resetForm">Hủy</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Từ</th><th>Đến</th><th>Thời gian</th><th>Bắt đầu</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in routes" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.fromPort }}</td>
            <td>{{ r.toPort }}</td>
            <td>{{ r.durationMinutes }}p</td>
            <td>{{ formatDate(r.startDate) }}</td>
            <td class="actions">
              <button class="ghost" @click="editRoute(r)">Sửa</button>
              <button class="danger" @click="removeRoute(r.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { APIURL } from '@/constraint'

const routes = ref([])
const form = reactive({ id: null, fromPort: '', toPort: '', durationMinutes: 0, startDate: '' })
const notice = reactive({ type: '', text: '' })

const load = async () => {
  const res = await axios.get(`${APIURL}/routes`)
  routes.value = res.data
}

const saveRoute = async () => {
  try {
    if (form.id) {
      await axios.put(`${APIURL}/routes/${form.id}`, { ...form })
      setNotice('success', 'Cập nhật thành công')
    } else {
      const payload = { ...form }
      delete payload.id // để json-server tự tạo id
      await axios.post(`${APIURL}/routes`, payload)
      setNotice('success', 'Thêm tuyến thành công')
    }
    await load()
    resetForm()
  } catch (err) {
    setNotice('error', 'Không lưu được tuyến')
  }
}

const editRoute = (r) => Object.assign(form, r)
const removeRoute = async (id) => {
  if (!id) {
    setNotice('error', 'Tuyến không có ID hợp lệ')
    return
  }
  if (!confirm('Xóa tuyến này?')) return
  try {
    await axios.delete(`${APIURL}/routes/${id}`)
    setNotice('warning', 'Đã xóa tuyến')
    load()
  } catch (err) {
    setNotice('error', 'Xóa thất bại')
  }
}

const resetForm = () => Object.assign(form, { id: null, fromPort: '', toPort: '', durationMinutes: 0, startDate: '' })
const setNotice = (type, text) => Object.assign(notice, { type, text })
const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-'

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
.notice {
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
}
.success { background: #ecfdf3; color: #166534; }
.error { background: #fef2f2; color: #b91c1c; }
.warning { background: #fffbeb; color: #92400e; }
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
input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}
.actions {
  display: flex;
  gap: 6px;
}
.primary, .ghost, .danger {
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.primary { background: #0c2b44; color: #fff; }
.ghost { background: #e5e7eb; }
.danger { background: #ef4444; color: #fff; }
@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
  table { font-size: 14px; }
}
</style>
