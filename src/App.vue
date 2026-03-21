<template>
  <div id="app">
    <HeaderCom @open-login="showLogin = true" @open-register="showRegister = true" />
    <router-view />
    <FooterCom />
    <LoginModal :show="showLogin" @close="showLogin = false" />
    <RegisterModal :show="showRegister" @close="showRegister = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderCom from './components/HeaderCom.vue'
import FooterCom from './components/FooterCom.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'

const showLogin = ref(false)
const showRegister = ref(false)
</script>

<style>
body {
  margin: 0;
  background: #f5f7fa;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}
#app {
  min-height: 100vh;
}
</style>
