<template>
  <div class="admin-shell">
    <AdminSidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />
    <div class="admin-main">
      <AdminHeader />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const collapsed = ref(false)
</script>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: #f5f7fb;
}
.admin-main {
  display: flex;
  flex-direction: column;
}
.admin-content {
  padding: 18px;
}
@media (max-width: 900px) {
  .admin-shell {
    grid-template-columns: 64px 1fr;
  }
}
</style>
