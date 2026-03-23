<template>
  <div class="card">
    <div class="card-head">
      <h2>Đơn đặt vé</h2>
      <div v-if="notice.text" :class="['notice', notice.type]">{{ notice.text }}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Mã</th><th>Khách</th><th>Email</th><th>Điện thoại</th><th>Tổng</th><th>Ngày</th><th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in bookings" :key="b.id">
          <td>{{ b.id }}</td>
          <td>{{ b.contact?.name }}</td>
          <td>{{ b.contact?.email }}</td>
          <td>{{ b.contact?.phone }}</td>
          <td>{{ formatMoney(b.total) }}</td>
          <td>{{ formatDate(b.createdAt) }}</td>
          <td>
            <button class="ghost" @click="selectBooking(b)">Xem</button>
            <button class="danger" @click="removeBooking(b.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selected" class="drawer">
      <div class="drawer-head">
        <h3>Đơn {{ selected.id }}</h3>
        <button class="ghost" @click="selected=null">Đóng</button>
      </div>
      <p><strong>Khách:</strong> {{ selected.contact?.name }} | {{ selected.contact?.phone }}</p>
      <p><strong>Email:</strong> {{ selected.contact?.email }}</p>
      <p><strong>Tổng:</strong> {{ formatMoney(selected.total) }}</p>
      <h4>Hạng mục</h4>
      <ul>
        <li v-for="(it, idx) in selected.items" :key="idx">
          {{ it.routeLabel }} | {{ it.date }} {{ it.departTime }} - {{ it.arriveTime }} |
          {{ it.className }} | NL {{ it.pax.adult }} / TE {{ it.pax.child }} | {{ formatMoney(it.total) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { APIURL } from '@/constraint'

const bookings = ref([])
const selected = ref(null)
const notice = reactive({ type: '', text: '' })

const load = async () => {
  const res = await axios.get(`${APIURL}/bookings`)
  // sort desc by createdAt
  bookings.value = res.data.sort((a,b)=> new Date(b.createdAt||0) - new Date(a.createdAt||0))
}

const removeBooking = async (id) => {
  if (!confirm('Xóa đơn đặt vé này?')) return
  try {
    await axios.delete(`${APIURL}/bookings/${id}`)
    setNotice('warning', 'Đã xóa đơn')
    load()
  } catch (err) {
    setNotice('error', 'Xóa thất bại')
  }
}

const selectBooking = (b) => {
  selected.value = b
}

const setNotice = (type, text) => Object.assign(notice, { type, text })
const formatMoney = (n=0) => n.toLocaleString() + ' đ'
const formatDate = (d) => d ? new Date(d).toLocaleString() : ''

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
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}
.ghost, .danger {
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.ghost { background: #e5e7eb; }
.danger { background: #ef4444; color: #fff; }
.notice {
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
}
.success { background: #ecfdf3; color: #166534; }
.error { background: #fef2f2; color: #b91c1c; }
.warning { background: #fffbeb; color: #92400e; }
.drawer {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}
.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 900px) {
  table { font-size: 13px; }
  th, td { padding: 6px; }
}
</style>
