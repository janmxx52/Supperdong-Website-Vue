<template>
  <h2>Hiển thị  biến Count: {{counterStore.count}}</h2>
  <h2>Hiển thị double Count: {{counterStore.doubleCount}}</h2>
  <button @click="counterStore.increment()">Tăng</button>
  <button @click="counterStore.decrement()">Giảm</button>
</template>

<script setup>
// muốn xài store nào thì import store đó vào
import { useCounterStore } from '../stores/couter.js'
// tạo 1 biến để lưu store,không cho phép sử dụng trực tiếp store mà phải thông qua biến này
const counterStore = useCounterStore()
</script>

<style>

</style>