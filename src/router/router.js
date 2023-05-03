import { createRouter, createWebHistory } from "vue-router"

import NotFoundView from "@/components/common/NotFoundView"
import LoginView from "@/components/auth/LoginView"
import MenuMainView from "@/components/client/MenuMainView"
import MenuView from "@/components/client/MenuView"
import ProductsView from "@/components/client/ProductsView"
import ProductsGroupView from "@/components/client/ProductsGroupView"
import ProductsMapView from "@/components/client/ProductsMapView"
import MapItemView from "@/components/client/MapItemView"

import store from "@/store"

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  { path: "/", redirect: { name: "products" } },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/menu",
    name: "menu-main",
    component: MenuMainView,
    meta: { requiresAuth: false },
    children: [
      { path: "", name: "menu", component: MenuView },
      { path: "products", name: "products", component: ProductsView },
      {
        path: "products-groups",
        name: "products-groups",
        component: ProductsGroupView,
      },
      {
        path: "products-maps",
        name: "products-maps",
        component: ProductsMapView,
      },
      {
        path: "products-maps/:id",
        name: "products-maps-item",
        component: MapItemView,
      },
    ],
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }

  const user = store.getters["auth/getUser"]
  if (user) {
    const isStaff = user.is_staff
    if (to.meta.requiresStaff && !isStaff) {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      }
    }
  }
})

export default router
