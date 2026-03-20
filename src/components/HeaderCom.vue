<template>
  <header class="hero">
    <div class="navbar">
      <router-link to="/" class="logo">Ferry Islands</router-link>
      <nav>
        <router-link to="/" class="nav-link">Trang chủ</router-link>
        <a class="nav-link" href="#hotline">Hotline: 0297 123 456</a>
      </nav>
      <div class="cart" @click="openCart">
        <span class="icon">🛳️</span>
        <span class="badge">{{ totalPax }}</span>
        <span class="label">Giỏ vé</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { defineEmits } from 'vue'

const cartStore = useCartStore()
const emit = defineEmits(['open-cart'])

const totalPax = computed(() => {
  const t = cartStore.totalPassengers
  return t.adult + t.child
})

const openCart = () => emit('open-cart')
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
.cart {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: #10365b;
  padding: 8px 12px;
  border-radius: 12px;
  transition: background 0.12s;
}
.cart:hover {
  background: #154a7a;
}
.badge {
  background: #ff4d4f;
  color: #fff;
  border-radius: 999px;
  padding: 4px 8px;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
}
.label {
  font-weight: 700;
}
</style>
