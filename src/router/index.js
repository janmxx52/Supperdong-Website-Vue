import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/HomeComponent.vue";
import BookingDetail from "@/components/ProductDetail.vue";
import AdminLayout from "@/views/admin/AdminLayout.vue";
import RouteManagement from "@/views/admin/RouteManagement.vue";
import BookingManagement from "@/views/admin/BookingManagement.vue";
import SailingManagement from "@/views/admin/SailingManagement.vue";

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
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "routes", name: "AdminRoutes", component: RouteManagement },
      { path: "bookings", name: "AdminBookings", component: BookingManagement },
      { path: "sailings", name: "AdminSailings", component: SailingManagement },
      { path: "", redirect: { name: "AdminRoutes" } },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
export default router;
