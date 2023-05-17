<template>
  <div
    class="modal fade"
    id="updateMenuDay"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="menuDayUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="updateProduct">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Редактирование</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!--          <div class="modal-body">-->
          <!--            <div class="container-fluid">-->
          <!--              <div class="row">-->
          <!--                <div class="col-12">-->
          <!--                  <div class="mb-3">-->
          <!--                    <label class="form-label">Название продукта</label>-->
          <!--                    <input-->
          <!--                      type="text"-->
          <!--                      class="form-control"-->
          <!--                      v-model="currentProductForUpdate.product_name"-->
          <!--                      required-->
          <!--                    />-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->

          <!--              <div class="row">-->
          <!--                <div class="col-12">-->
          <!--                  <div class="mb-3">-->
          <!--                    <label class="form-label"-->
          <!--                      >Эн. цен. (кКал), 100 г. (Брутто)</label-->
          <!--                    >-->
          <!--                    <input-->
          <!--                      type="text"-->
          <!--                      class="form-control"-->
          <!--                      v-model="currentProductForUpdate.energy_value"-->
          <!--                      required-->
          <!--                    />-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="row">-->
          <!--                <div class="col-12">-->
          <!--                  <div class="mb-3">-->
          <!--                    <label class="form-label">Жиры, 100 г. (Нетто)</label>-->
          <!--                    <input-->
          <!--                      type="text"-->
          <!--                      class="form-control"-->
          <!--                      v-model="currentProductForUpdate.fats"-->
          <!--                      required-->
          <!--                    />-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="row">-->
          <!--                <div class="col-12">-->
          <!--                  <div class="mb-3">-->
          <!--                    <label class="form-label">Углеводы, 100 г. (Нетто)</label>-->
          <!--                    <input-->
          <!--                      type="text"-->
          <!--                      class="form-control"-->
          <!--                      v-model="currentProductForUpdate.carbohydrates"-->
          <!--                      required-->
          <!--                    />-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="row">-->
          <!--                <div class="col-12">-->
          <!--                  <div class="mb-3">-->
          <!--                    <label class="form-label">Белки, 100 г. (Нетто)</label>-->
          <!--                    <input-->
          <!--                      type="text"-->
          <!--                      class="form-control"-->
          <!--                      v-model="currentProductForUpdate.proteins"-->
          <!--                      required-->
          <!--                    />-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="closeMenuDayUpdateModal"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>

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

    <div v-if="menuDaysList.results.length > 0 && productGroupsWithProducts">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Наименование блюда</th>
            <template
              v-for="productGroup in productGroupsWithProducts.groups_products"
              :key="productGroup.group_id"
            >
              <th class="table-success">
                {{ productGroup.group_name }}
              </th>
              <td
                v-for="product in productGroup.products"
                :key="product.product_id"
              >
                {{ product.product_name }}
              </td>
            </template>

            <th>Выход продукта</th>
            <th
              v-for="dishCategory in dishCategoriesList.results"
              :key="dishCategory.id"
            >
              {{ dishCategory.dish_category }}
            </th>
            <th>Энергетическая ценность</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="menuDay in menuDaysList.results" :key="menuDay.id">
            <tr>
              <td :colspan="getCollSpan" class="text-start">
                <h4>
                  <button
                    type="button"
                    class="btn btn-link link-secondary p-0 m-0 text-start"
                    @click="showModalForUpdate(menuDay.id)"
                  >
                    <nobr
                      ><b>{{ menuDay.menu_day_date }}</b></nobr
                    >
                  </button>
                </h4>
              </td>
            </tr>
            <template
              v-for="mealTime in mealTimeList.results"
              :key="mealTime.id"
            >
              <tr>
                <td :colspan="getCollSpan" class="text-start align-middle">
                  <h5>{{ mealTime.meal_time }}</h5>
                </td>
              </tr>
              <tr
                v-for="item in getMapsByDateAndMealTime(
                  menuDay.menu_day_date,
                  mealTime.id
                )"
                :key="item.map_id"
              >
                <td>{{ item.map_name }}</td>
                <template
                  v-for="productGroup in productGroupsWithProducts.groups_products"
                  :key="productGroup.id"
                >
                  <td class="table-success text-center">
                    <template
                      v-if="
                        item.get_product_group_value_obj[
                          productGroup.group_id
                        ] !== 0
                      "
                    >
                      {{
                        item.get_product_group_value_obj[productGroup.group_id]
                      }}
                    </template>
                    <template v-else></template>
                  </td>
                  <td
                    v-for="product in productGroup.products"
                    :key="product.product_id"
                    class="text-center"
                  >
                    <template
                      v-if="
                        item.get_product_count_obj[product.product_id] !== 0
                      "
                    >
                      {{ item.get_product_count_obj[product.product_id] }}
                    </template>
                    <template v-else></template>
                  </td>
                </template>
                <td class="text-center align-middle">
                  {{ item["get_net_weights"]["full_net_weight"] }}
                </td>
                <td
                  v-for="dishCategory in dishCategoriesList.results"
                  :key="dishCategory.id"
                >
                  {{ item["get_net_weights"][dishCategory.id] }}
                </td>
                <td class="text-center align-middle">
                  {{ item["get_values"]["energy_full"] }}
                </td>
              </tr>
            </template>
            <tr>
              <td><b>Итого за день</b></td>
              <template
                v-for="productGroup in productGroupsWithProducts.groups_products"
                :key="productGroup.group_id"
              >
                <th class="table-success text-center">
                  {{
                    getInTotalDayGroup(
                      menuDay.menu_day_date,
                      productGroup.group_id
                    )
                  }}
                </th>
                <td
                  v-for="product in productGroup.products"
                  :key="product.product_id"
                  class="text-center"
                >
                  {{
                    getInTotalDayProduct(
                      menuDay.menu_day_date,
                      product.product_id
                    )
                  }}
                </td>
              </template>
              <td></td>
              <td
                v-for="dishCategory in dishCategoriesList.results"
                :key="dishCategory.id"
              ></td>
              <td></td>
            </tr>
          </template>
          <tr>
            <td><b>Итого за период</b></td>
            <template
              v-for="productGroup in productGroupsWithProducts.groups_products"
              :key="productGroup.group_id"
            >
              <th class="table-success text-center">
                {{ getInTotalPeriodGroup(productGroup.group_id) }}
              </th>
              <td
                v-for="product in productGroup.products"
                :key="product.product_id"
                class="text-center"
              >
                {{ getInTotalPeriodProduct(product.product_id) }}
              </td>
            </template>
            <td></td>
            <td
              v-for="dishCategory in dishCategoriesList.results"
              :key="dishCategory.id"
            ></td>
            <td></td>
          </tr>
          <tr>
            <td><b>По норме</b></td>
            <template
              v-for="productGroup in productGroupsWithProducts.groups_products"
              :key="productGroup.group_id"
            >
              <th class="table-success text-center">
                <b>{{
                  (
                    productGroup.norm_per_day *
                    productGroupsWithProducts.day_count
                  ).toFixed(1)
                }}</b>
              </th>
              <td
                v-for="product in productGroup.products"
                :key="product.product_id"
                class="text-center"
              ></td>
            </template>
            <td></td>
            <td
              v-for="dishCategory in dishCategoriesList.results"
              :key="dishCategory.id"
            ></td>
            <td></td>
          </tr>
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
      productGroupsWithProducts: {},
      dishCategoriesList: { results: [] },
      isLoading: true,
      isError: false,
      currentMenuDayForUpdate: { menu_day_date: "" },
    }
  },
  async created() {
    // await this.loadProductGroups()
    await this.loadMenuDays()
    await this.loadMealTimes()
    await this.loadDishCategories()
    await this.loadProducts()
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
    async loadProducts() {
      this.isLoading = true
      try {
        const response = await menuDaysAPI.getProducts(
          this.userToken,
          this.dates
        )
        this.productGroupsWithProducts = await response.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },

    async showModalForUpdate(menuDayId) {
      this.isError = false
      try {
        const response = await menuDaysAPI.getItemData(
          this.userToken,
          menuDayId
        )
        this.currentMenuDayForUpdate = await response.data
        let updateModal = this.$refs.menuDayUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (event) {
        this.isError = true
      } finally {
      }
    },

    debouncedDatesChange: debounce(async function () {
      await this.loadMenuDays()
      await this.loadMealTimes()
      await this.loadDishCategories()
      await this.loadProducts()
    }, 500),
    getMapsByDateAndMealTime(date, mealTimeId) {
      if (Object.keys(this.productGroupsWithProducts).length > 0) {
        if (date in this.productGroupsWithProducts.maps) {
          if (mealTimeId in this.productGroupsWithProducts.maps[date]) {
            return this.productGroupsWithProducts.maps[date][mealTimeId]
          } else return ""
        } else return ""
      } else return ""
    },
    getInTotalDayGroup(date, group) {
      let total = 0
      if (Object.keys(this.productGroupsWithProducts).length > 0) {
        this.mealTimeList.results.forEach((meal) => {
          if (date in this.productGroupsWithProducts.maps) {
            if (meal.id in this.productGroupsWithProducts.maps[date]) {
              this.productGroupsWithProducts.maps[date][meal.id].forEach(
                (item) => {
                  total = total + item["get_product_group_value_obj"][group]
                }
              )
            }
          }
        })
      }

      return total
    },
    getInTotalDayProduct(date, product) {
      let total = 0

      if (Object.keys(this.productGroupsWithProducts).length > 0) {
        this.mealTimeList.results.forEach((meal) => {
          if (date in this.productGroupsWithProducts.maps) {
            if (meal.id in this.productGroupsWithProducts.maps[date]) {
              this.productGroupsWithProducts.maps[date][meal.id].forEach(
                (item) => {
                  total = total + item["get_product_count_obj"][product]
                }
              )
            }
          }
        })
      }

      return total
    },
    getInTotalPeriodGroup(group) {
      let total = 0

      for (const property in this.productGroupsWithProducts.maps) {
        this.mealTimeList.results.forEach((meal) => {
          if (meal.id in this.productGroupsWithProducts.maps[property]) {
            this.productGroupsWithProducts.maps[property][meal.id].forEach(
              (item) =>
                (total = total + item.get_product_group_value_obj[group])
            )
          }
        })
      }

      return total
    },
    getInTotalPeriodProduct(product) {
      let total = 0

      for (const property in this.productGroupsWithProducts.maps) {
        this.mealTimeList.results.forEach((meal) => {
          if (meal.id in this.productGroupsWithProducts.maps[property]) {
            this.productGroupsWithProducts.maps[property][meal.id].forEach(
              (item) => (total = total + item.get_product_count_obj[product])
            )
          }
        })
      }

      return total
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    getCollSpan() {
      let arraysSumLength = 0

      if (Object.keys(this.productGroupsWithProducts).length == 0) {
        return 0
      } else {
        this.productGroupsWithProducts.groups_products.forEach(
          (pGWP) => (arraysSumLength = arraysSumLength + pGWP.products.length)
        )
        return (
          this.productGroupsWithProducts.groups_products.length +
          arraysSumLength +
          this.dishCategoriesList.results.length +
          3
        )
      }
    },
    // getProductGroupsMain() {
    //   return this.productGroupsList.results.filter(
    //     (item) => item.id === item.replacement_for
    //   )
    // },
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
