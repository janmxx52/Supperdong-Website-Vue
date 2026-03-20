// tạo ra kho dữ liệu để lưu trữ thông tin sản phẩm
import { defineStore } from 'pinia'
import { APIURL } from '../constraint'
import axios from 'axios'
export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        productid: null,
        sizes: [],
        toppings: [],
        error: null
    }),
    actions: {
        // lấy dữ liệu sản phẩm từ json server
        /**
         * async: bất đồng bộ, khi gọi hàm này thì sẽ không chờ đợi kết quả trả về mà sẽ tiếp tục thực hiện các lệnh khác
         * await: chờ đợi kết quả trả về từ một hàm bất đồng bộ trước khi tiếp tục thực hiện các lệnh khác
         * axios.get: gửi yêu cầu GET đến địa chỉ APIURL + '/products' để lấy dữ liệu sản phẩm
         * this.products = response.data: gán dữ liệu sản phẩm lấy được vào biến products trong state
         * async tenham(){
         * try {'
         *   const response = await axios.get(`${APIURL}/products`);
         * }
         * catch (error) {
         *  console.error('Lỗi khi lấy dữ liệu sản phẩm:', error)
         * }
         */
        async fetchProducts() {
            try {
                const response = await axios.get(`${APIURL}/products`);
                this.products = response.data;
            } catch (error) {
                this.error = 'Lỗi khi lấy dữ liệu sản phẩm';
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', this.error);
            }
        },
        // phương thức  từ id trả ra thông tin của 1 sản phẩm
        async fetchProductById(id) {
            try {
                const response = await axios.get(`${APIURL}/products/${id}`);
                this.productid = response.data;
            } catch (error) {
                this.error = 'Lỗi khi lấy dữ liệu sản phẩm';
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', this.error);
            }
        },
        // phương thức lấy size từ API về
        async fetchSizes() {
            try {
                const response = await axios.get(`${APIURL}/sizes`);
                this.sizes = response.data;
            } catch (error) {
                this.error = 'Lỗi khi lấy dữ liệu size';
                console.error('Lỗi khi lấy dữ liệu size:', this.error);
            }
        },
        // phương thức lấy topping từ API về
        async fetchToppings() {
            try {
                const response = await axios.get(`${APIURL}/toppings`);
                this.toppings = response.data;
            } catch (error) {
                this.error = 'Lỗi khi lấy dữ liệu topping';
                console.error('Lỗi khi lấy dữ liệu topping:', this.error);
            }
        }
    }
})