<template>
  <header class="hero">
    <div class="navbar">
      <router-link to="/" class="logo">GDU Islands</router-link>
      <nav>
        <router-link to="/" class="nav-link">Trang chủ</router-link>
        <router-link v-if="authStore.isLoggedIn" to="/profile" class="nav-link">Hồ sơ</router-link>
        <a class="nav-link" href="#hotline">Hotline: 089 667 3828</a>
      </nav>
      <div class="auth-buttons" v-if="!authStore.isLoggedIn">
        <button class="ghost" @click="$emit('open-login')">Đăng nhập</button>
        <button class="primary" @click="$emit('open-register')">Đăng ký</button>
      </div>
      <div class="auth-buttons" v-else>
        <span class="welcome">{{ userLabel }}</span>
        <button class="ghost" @click="logout">Đăng xuất</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const userLabel = computed(() => `Xin chào, ${authStore.currentUser?.fullname || 'bạn'}`)

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
}
.navbar {
  background: #0c2b44;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
}
.logo {
  font-size: 24px;
  font-weight: 800;
  color: #ffd166;
  text-decoration: none;
}
nav {
  display: flex;
  gap: 18px;
  align-items: center;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
.nav-link:hover {
  color: #ffd166;
}
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}
.welcome {
  font-weight: 700;
  color: #dbeafe;
}
.ghost,
.primary {
  padding: 9px 14px;
  border-radius: 10px;
  border: 2px solid #ffd166;
  font-weight: 700;
  cursor: pointer;
}
.ghost {
  background: transparent;
  color: #ffd166;
}
.primary {
  background: #ffd166;
  color: #0c2b44;
}
@media (max-width: 720px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 18px;
  }
  nav {
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }
  .auth-buttons {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
