<template>
  <p>Chi tiết sản phẩm: {{ productId }}</p>
</template>

<script setup>
// nhận dữ liệu từ router truyền qua thì dùng
//  useRoute để lấy dữ liệu đó
import { useRoute } from "vue-router";
const route = useRoute();
const productId = route.params.id;
// nếu dùng query 
// thì dùng route.query.tenbien để lấy dữ liệu đó
</script>

<style>

</style>