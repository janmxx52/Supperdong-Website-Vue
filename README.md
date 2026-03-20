# GDU Booking (Vue CLI)

Demo web đặt vé tàu ra đảo (Rạch Giá/Phú Quốc, Hà Tiên, Sóc Trăng/Côn Đảo) dùng Vue 3 + Pinia + Vue Router + Axios (data tĩnh).

## Chạy dự án
```bash
npm install
# chạy API giả lập (cổng 3000)
npm run mock:api
# tab khác chạy frontend (cổng 8080)
npm run serve
```

## Kiến trúc nhanh
- `src/data/ferryData.js`: dữ liệu mẫu (tuyến, cảng, chuyến, giá).
- `src/stores/sailing.js`: quản lý tuyến/chuyến, gọi JSON Server.
- `src/stores/cart.js`: giỏ đặt vé (localStorage) + checkout POST /bookings.
- `src/components/HomeComponent.vue`: tìm chuyến + danh sách kết quả.
- `src/components/ProductDetail.vue`: chi tiết chuyến, chọn hạng ghế & số khách.
- `src/components/ProductList.vue`: thẻ chuyến (SailingCard).
- `src/components/CardModal.vue`: modal giỏ vé (chưa gắn vào header).

Bạn có thể thay JSON Server bằng API thật bằng cách chỉnh `APIURL` trong `src/constraint.js`.
