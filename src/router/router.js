import { createRouter, createWebHistory } from "vue-router"

import NotFoundView from "@/components/common/NotFoundView"
import LoginView from "@/components/auth/LoginView"
import Menu from "@/components/client/Menu"
import ProductsView from "@/components/client/ProductsView"

import store from "@/store"

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "",
    name: "client",
    component: Menu,
    meta: { requiresAuth: false },
    children: [{ path: "products", name: "products", component: ProductsView }],
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
