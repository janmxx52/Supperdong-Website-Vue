# GDU Booking (Vue CLI)

Demo web dat ve tau ra dao voi Vue 3 + Pinia + Vue Router + Axios.

## Chay local
```bash
npm install
npm run mock:api
npm run serve
```

Frontend se tu dong goi `http://localhost:3000` khi chay tren `localhost`.

## Cau hinh API

Dat `VUE_APP_APIURL` neu muon frontend goi backend khac:

```bash
VUE_APP_APIURL=https://ferry-api-696633279800.asia-southeast1.run.app
```

- Local: co san file `.env.development` tro toi `http://localhost:3000`
- Deploy frontend Docker: truyen `--build-arg VUE_APP_APIURL=https://ferry-api-696633279800.asia-southeast1.run.app`
- Neu khong dat bien moi truong khi deploy, frontend se fallback sang `/api`

## Kien truc nhanh
- `src/constraint.js`: cau hinh Axios dung chung va xu ly loi API
- `src/stores/sailing.js`: quan ly tuyen va chuyen tau
- `src/stores/cart.js`: gio dat ve va checkout
- `src/components/HomeComponent.vue`: tim chuyen va hien thi ket qua
- `src/components/ProductDetail.vue`: dat ve cho mot chuyen cu the
- `src/views/admin/*`: CRUD routes, sailings, bookings
