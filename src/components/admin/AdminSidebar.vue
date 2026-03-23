<template>
  <aside :class="['sidebar', { collapsed }]">
    <div class="brand">
      <span class="logo">GDU</span>
      <span v-if="!collapsed" class="text">Admin</span>
    </div>
    <nav>
      <router-link to="/admin/routes" class="item" active-class="active">
        <span>Quản lý tuyến</span>
      </router-link>
      <router-link to="/admin/sailings" class="item" active-class="active">
        <span>Quản lý chuyến</span>
      </router-link>
      <router-link to="/admin/bookings" class="item" active-class="active">
        <span>Đơn đặt vé</span>
      </router-link>
    </nav>
    <button class="collapse" @click="$emit('toggle')">
      {{ collapsed ? '›' : '‹' }}
    </button>
  </aside>
</template>

<script setup>
// import macros for eslint compatibility
import { defineProps, defineEmits } from 'vue'
defineProps({ collapsed: { type: Boolean, default: false } })
defineEmits(['toggle'])
</script>

<style scoped>
.sidebar {
  background: #0c2b44;
  color: #fff;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 240px;
  transition: width 0.2s;
}
.collapsed {
  width: 64px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-weight: 800;
}
.logo {
  background: #ffd166;
  color: #0c2b44;
  border-radius: 10px;
  padding: 6px 10px;
}
.text {
  white-space: nowrap;
}
nav {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}
.item {
  color: #dbeafe;
  text-decoration: none;
  padding: 10px 16px;
}
.item.active {
  background: #10365b;
  color: #ffd166;
}
.collapse {
  margin: 12px;
  border: 1px solid #1f3c5c;
  border-radius: 8px;
  background: #10365b;
  color: #ffd166;
  padding: 6px;
  cursor: pointer;
}
@media (max-width: 900px) {
  .sidebar {
    width: 64px;
  }
}
</style>
