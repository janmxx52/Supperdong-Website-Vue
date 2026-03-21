<template>
  <header class="hero">
    <div class="navbar">
      <router-link to="/" class="logo">GDU Islands</router-link>
      <nav>
        <router-link to="/" class="nav-link">Trang chủ</router-link>
        <a class="nav-link" href="#hotline">Hotline: 089 667 3828</a>
      </nav>
      <div class="auth-buttons">
        <button class="ghost" @click="$emit('open-login')">Đăng nhập</button>
        <button class="primary" @click="$emit('open-register')">Đăng ký</button>
      </div>
    </div>
  </header>
</template>

<script setup>
// Header chỉ phát sự kiện mở modal đăng nhập/đăng ký
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
  padding: 12px 40px;
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
  gap: 10px;
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
</style>
