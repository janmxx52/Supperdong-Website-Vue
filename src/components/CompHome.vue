<template>
   <div>
    <p>TRANG CHỦ (HOME)</p>
    <!-- cách 1 truyền dữ liệu đi bằng router-link
    cú pháp:
    <router-link :to="{ name: 'TenRoute', params: { tenbien: giatricantruyen } }">Tên link</router-link>
     Cách 2: dùng router.push để truyền dữ liệu đi
        Cú pháp:
        this.$router.push({ name: 'TenRoute', params: { tenbien: giatricantruyen } });
     Dùng router.push thì có thể truyền dữ liệu đi trong hàm xử lý sự kiện khi click vào một sản phẩm nào đó để hiển thị chi tiết sản phẩm đó
     ví dụ
     -->
    <router-link :to="{ name: 'Product', params: { id: 1 } }">Xem chi tiết sản phẩm 1</router-link>
    <router-link :to="{ name: 'Product', params: { id: 2 } }">Xem chi tiết sản phẩm 2</router-link>
    <button @click="goToProduct(3)">Xem chi tiết sản phẩm 3</button>
    <!-- <router-link :to="{ name: 'Product', query: { id: 4,ten:'phone1' } }">Xem chi tiết sản phẩm 4</router-link> -->
   </div>
</template>

<script setup>
/**
 * Trong Vue Router có 4 cách truyền dữ liệu vào component 
 * được định nghĩa trong route đó là:
 * 1- Truyền bằng parameter (params)
 * 2- Truyền bằng query (query)
 * 3- Truyền bằng props (props)
 * 4- Truyền bằng state (state)
 * Cách 1: Truyền bằng parameter (params)
 * Khi nào dùng?
 * + truyền id của sản phẩm khi click vào sản phẩm đó để hiển thị chi tiết sản phẩm đó
 * + Khi truyền dữ liệu bắt buộc
 * + URL có dạng động
 * Cú pháp: /tenroute/:tenbien
 * Ví dụ: /product/:id
 * Cách 2: Truyền bằng query (query)
 * Khi nào dùng?
 * + Tìm kiếm
 * + Lọc dữ liệu
 * + Khi truyền dữ liệu không bắt buộc
 * Cú pháp:
 * <router-link :to="{ name: 'TenRoute', 
 * query: { tenbien1: giatricantruyen, tenbien2: giatricantruyen2 } }">Tên link</router-link>
 * c2: router.pusth({ name: 'TenRoute', query: { tenbien1: giatricantruyen, tenbien2: giatricantruyen2 } });
 * Cách 3: Truyền bằng props (props), đây được xem là chuyên nghiệp
 * Khi nào dùng?
 * + Khi muốn truyền dữ liệu vào component mà 
 * không muốn hiển thị dữ liệu đó trên URL
 * + Khi muốn truyền dữ liệu có kiểu dữ liệu phức tạp như object, array
 * Cú pháp:
 *  {
 *    path:'/tenroute/:id',
 *    name:'TenRoute',
 *   component: TenComponent,
 * // c1: props truyền theo dạng params
 *    props:true// vue sẽ tự động hiểu router.params.id thành=>props.id
 * // c2: props truyền theo dạng query
 *    props:route=>({
 *                 keyword:route.query.keyword
 *      }) //vue sẽ tự động hiểu router.query.keyword thành=>props.keyword
 * }
 * // nhận dữ liệu trong component thì dùng defineProps
 * import { defineProps } from "vue";
 * defineProps({
 *   id:kiểu dữ liệu của id
 * });
 * Cách 4: Truyền bằng state (state)
 * Khi nào dùng?
 * + Khi muốn truyền dữ liệu mà không muốn hiển thị dữ liệu đó trên URL
 * + Khi muốn truyền dữ liệu có kiểu dữ liệu phức tạp như object, array
 * cú pháp:
 *  router.push({
 *  name:'TenRoute',
 *  state:{
 *      object:{thuoctinh1: giatri,thuoctinh2: giatri},
 * }
 * })
 * // nhận dữ liệu
 * const tenbien=history.state.object;
 */
import { useRouter } from "vue-router";
const router=useRouter();
const goToProduct=(id)=>{
    router.push({ name: 'Product', params: { id: id } });
}
</script>

<style>

</style>