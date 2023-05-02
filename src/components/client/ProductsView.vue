<template>
  <div class="alert alert-danger" role="alert" v-if="isError">
    Ошибка приложения
  </div>
  <div class="container">
    <h3 class="mt-3">Продукты</h3>
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>
    <div v-else>
      <div v-if="sortedProductsList.length > 0" class="mt-4">
        <small
          ><b>Всего записей - ({{ productList.count }})</b></small
        >
        <table class="table">
          <thead>
            <tr>
              <th rowspan="2">Наименование</th>
              <th colspan="{{ treatmentKindList.results.length }}">
                Потери при обработке
              </th>
            </tr>
            <tr>
              <th
                v-for="treatment in treatmentKindList.results"
                :key="treatment.id"
              >
                {{ treatment.treatment_kind }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sortedProductsList" :key="product.id">
              <td>
                <b>{{ product.product_name }}</b>
                <br />
                Эн. цен - {{ product.energy_value }}<br />
                Белки -{{ product.proteins }}<br />
                Жиры - {{ product.fats }}<br />
                Углеводы - {{ product.carbohydrates }}<br />
              </td>
              <td
                v-for="treatment in treatmentKindList.results"
                :key="treatment.id"
              >
                <template
                  v-for="dateRange in dateRangesList.results"
                  :key="dateRange.id"
                >
                  <nobr
                    >{{ dateRange.get_formatted_data }}&nbsp; &nbsp;
                    <b>{{
                      getWastage(
                        product.wastage_list,
                        treatment.id,
                        dateRange.id
                      )
                    }}</b></nobr
                  >
                  <br />
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <nav>
          <ul class="pagination pagination-md">
            <li class="page-item" :class="{ disabled: !productList.previous }">
              <button
                class="page-link"
                @click="updatePaginator(productList.previous)"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="mx-2"></li>
            <li class="page-item" :class="{ disabled: !productList.next }">
              <button
                class="page-link"
                @click="updatePaginator(productList.next)"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"
import { productsAPI } from "@/api/productsAPI"
import { getFormattedDate, getFormattedTime } from "@/utils"
import debounce from "lodash.debounce"

export default {
  name: "ProductsView",
  components: { Spinner },
  data() {
    return {
      productList: { results: [] },
      treatmentKindList: { results: [] },
      dateRangesList: { results: [] },
      currentProductForUpdate: {},
      searchForm: {},
      isLoading: true,
      isError: false,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      try {
        const response = await productsAPI.getItemsList(this.userToken)
        this.productList = await response.data

        const responseTreatment = await productsAPI.getTreatmentsList(
          this.userToken
        )
        this.treatmentKindList = await responseTreatment.data

        const responseDateRanges = await productsAPI.getDateRangesList(
          this.userToken
        )
        this.dateRangesList = await responseDateRanges.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewProduct() {},
    async updateProduct() {},
    async showModalForUpdate() {},
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await productsAPI.updateList(url, this.userToken)
        this.productList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 500),
    deleteCheckedProductsHandler() {},
    checkAllHandler() {},
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    },
    getWastage(wastageList, treatment, dateRange) {
      let result = null
      wastageList.map((item) => {
        if (
          item.treatment_kind === treatment &&
          item.date_range === dateRange
        ) {
          result = item
        }
      })

      const resultReturn = result.percent !== 0 ? result.percent : ""
      return resultReturn
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedProductsList() {
      return this.productList.results
    },
    checkedForDeleteCount() {
      let counter = 0
      this.productList.results.map((item) => {
        if (item.checked_val) {
          counter++
        }
      })
      return counter
    },
  },
  watch: {
    searchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
