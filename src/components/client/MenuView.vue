<template>
  <div class="container-fluid">
    <br />
    <h1>
      РАСКЛАДКА ПРОДУКТОВ с
      <span class="text-decoration-underline">{{ dates.date_start }}</span>
      по
      <span class="text-decoration-underline">{{ dates.date_end }}</span>
    </h1>
    <br />
    <div class="row">
      <div class="col-md-4">
        <div class="input-group mb-3">
          <span class="input-group-text">Дата (с)</span>
          <input type="date" class="form-control" v-model="dates.date_start" />
        </div>
      </div>
      <div class="col-md-4">
        <div class="input-group mb-3">
          <span class="input-group-text">Дата (по)</span>
          <input type="date" class="form-control" v-model="dates.date_end" />
        </div>
      </div>

      <div class="col-md-4"></div>
    </div>

    <br /><br />

    <div v-if="menuDaysList.results.length > 0">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Наименование блюда</th>
            <th
              class="table-success"
              v-for="productGroup in getProductGroupsMain"
              :key="productGroup.id"
            >
              {{ productGroup.group_name }}
            </th>
            <th>Выход продукта</th>
            <th
              v-for="dishCategory in dishCategoriesList.results"
              :key="dishCategory.id"
            >
              {{ dishCategory.dish_category }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="menuDay in menuDaysList.results" :key="menuDay.id">
            <tr>
              <td
                :colspan="getProductGroupsMain.length + 1"
                class="text-center"
              >
                <h4>
                  <a href="#" class="link-secondary">
                    <nobr>{{ menuDay.menu_day_date }}</nobr>
                  </a>
                </h4>
              </td>
            </tr>
            <tr v-for="mealTime in mealTimeList.results" :key="mealTime.id">
              <td
                :colspan="getProductGroupsMain.length + 1"
                class="text-center align-middle"
              >
                <h5>{{ mealTime.meal_time }}</h5>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"
import { menuDaysAPI } from "@/api/menuDaysAPI"
import { productsGroupAPI } from "@/api/productsGroupAPI"
import { productsMapAPI } from "@/api/productsMapAPI"
import debounce from "lodash.debounce"
import Select2 from "vue3-select2-component"

export default {
  name: "MenuView",
  components: { Spinner, Select2 },
  data() {
    return {
      VUE_APP_BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      VUE_APP_BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      VUE_APP_BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
      dates: {
        date_start: new Date().toJSON().slice(0, 10),
        date_end: new Date().toJSON().slice(0, 10),
      },
      menuDaysList: { results: [] },
      mealTimeList: { results: [] },
      productGroupsList: { results: [] },
      dishCategoriesList: { results: [] },
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    await this.loadMenuDays()
    await this.loadMealTimes()
    await this.loadProductGroups()
    await this.loadDishCategories()
  },
  methods: {
    async loadMealTimes() {
      this.isLoading = true
      try {
        const responseMealTimes = await menuDaysAPI.getMealTimeList(
          this.userToken
        )
        this.mealTimeList = await responseMealTimes.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async loadProductGroups() {
      this.isLoading = true
      try {
        const responseProductGroups = await productsGroupAPI.getItemsList(
          this.userToken,
          { group_name: "" },
          100
        )
        this.productGroupsList = await responseProductGroups.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async loadDishCategories() {
      this.isLoading = true
      try {
        const responseDishCategory = await productsMapAPI.getDishCategoriesList(
          this.userToken
        )
        this.dishCategoriesList = await responseDishCategory.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async loadMenuDays() {
      this.isLoading = true
      try {
        const response = await menuDaysAPI.getItemsList(
          this.userToken,
          this.dates
        )
        this.menuDaysList = await response.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedDatesChange: debounce(async function () {
      await this.loadMenuDays()
    }, 500),
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    getProductGroupsMain() {
      return this.productGroupsList.results.filter(
        (item) => item.id === item.replacement_for
      )
    },
  },
  watch: {
    dates: {
      handler(newValue, oldValue) {
        this.debouncedDatesChange()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
