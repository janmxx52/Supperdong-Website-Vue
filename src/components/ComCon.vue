<template>
  <div>
    <h2>Component Con</h2>
    <p>{{ studentname }}</p>
    <button @click="sendData">Gửi dữ liệu cho cha</button>
  </div>
</template>

<script setup>
import { defineProps,defineEmits } from "vue";
defineProps({
    studentname:String
});
// dùng emit để gửi dữ liệu từ con lên cha
const emit=defineEmits(["senddatatoparent"]);
const sendData=()=>{
    emit("senddatatoparent","Dữ liệu từ con gửi lên cha");
}
</script>

<style>

</style>