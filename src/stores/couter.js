// tạo kho lưu trữ
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
    // trạng thái, dùng để lưu trữ dữ liệu(khai báo thuộc tính), giống data, khai báo dưới dạng
    //  function trả về object
    state: () => ({
        count:0,
    }),
    // hành động, giống methods
    actions: {
        increment() {
            this.count++
        },
        decrement() {
            this.count--
        }
    },
    // getters, giống computed
    getters: {
        doubleCount:(state) => state.count * 2
    }
})