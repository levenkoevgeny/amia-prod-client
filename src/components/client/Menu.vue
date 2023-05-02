<template>
  <router-view></router-view>
</template>

<script>
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"

export default {
  name: "Menu",
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
