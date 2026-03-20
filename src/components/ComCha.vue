<template>
  <div>
    <h2>Component Cha</h2>
    <ComCon :studentname="name" @senddatatoparent="XuLyDuLieu"/>
    
  </div>
</template>

<script setup>
    import ComCon from "./ComCon.vue";
    import { ref } from "vue";
    // khai bao biến được quản lý bởi composition API của vue3 thì phải khai báo bằng ref
    const name=ref("Vue3");
    // hàm xử lý sự kiện khi nhận dữ liệu từ con gửi lên cha
    const XuLyDuLieu=(data)=>{
        name.value=data;
    }
/**
 * Truyền dữ liệu từ componet cha sang component thì dùng biến :tenbien=giatricantruyen
 * Con dùng props để nhận dữ liệu từ cha truyền xuống
 * Cú pháp:
 *  props: {
      tenbien: {
        type: kieu,
        required: true/false,
        default: giatrimacdinh,
      },
    },
    props: ["tenbien1", "tenbien2",...],
    Con nhận dữ liều từ cha thì không được quyền thay đổi dữ liệu đó, 
    nếu muốn thay đổi thì phải dùng biến trung gian để lưu dữ liệu đó rồi mới thay đổi được
    hoặc dùng emit để gửi dữ liệu từ con lên cha rồi cha mới thay đổi được dữ liệu đó
     Cú pháp dùng emit:
     Con: this.$emit("tensukien",giatricantruyen);
     Cha: <ComCon @tensukien="hamxuly"/>
     
 */

</script>

<style>

</style>