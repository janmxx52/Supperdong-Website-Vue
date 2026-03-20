<template>
  <div id="app">
    <HeaderCom @open-cart="showCart = true" />
    <router-view />
    <FooterCom />
    <CardModal
      :show="showCart"
      :cart-items="cartStore.cartItems"
      @close="showCart = false"
      @remove="removeItem"
      @checkout="checkout"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderCom from './components/HeaderCom.vue'
import FooterCom from './components/FooterCom.vue'
import CardModal from './components/CardModal.vue'
import { useCartStore } from './stores/cart'

const showCart = ref(false)
const cartStore = useCartStore()

const removeItem = (key) => {
  cartStore.removeItem(key)
}

const checkout = async () => {
  if (!cartStore.cartItems.length) return
  try {
    const bookingId = await cartStore.checkout()
    showCart.value = false
    alert(`Đặt chỗ thành công (JSON Server)\nMã: ${bookingId}`)
  } catch (err) {
    alert('Thanh toán thất bại, vui lòng thử lại.')
    console.error(err)
  }
}
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
