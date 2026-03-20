import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/HomeComponent.vue";
import BookingDetail from "@/components/ProductDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/booking/:id",
    name: "BookingDetail",
    component: BookingDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
