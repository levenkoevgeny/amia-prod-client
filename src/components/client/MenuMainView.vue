<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark" v-once>
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Прод</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/menu"
              >Раскладка меню</a
            >
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/menu/products">Продукты</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/menu/products-groups"
              >Группы продуктов (нормы)</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/menu/products-maps"
              >Технологические карты</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view></router-view>
</template>

<script>
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"

export default {
  name: "MenuMainView",
  setup() {},
  components: { Spinner },
  data() {
    return {}
  },
  async created() {},
  methods: {
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
}
</script>

<style scoped></style>
