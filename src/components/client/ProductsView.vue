<template>
  <!--product update modal-->
  <div
    class="modal fade"
    id="updateProductModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="productUpdate"
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
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Название продукта</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductForUpdate.product_name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label"
                      >Эн. цен. (кКал), 100 г. (Брутто)</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductForUpdate.energy_value"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Жиры, 100 г. (Нетто)</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductForUpdate.fats"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Углеводы, 100 г. (Нетто)</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductForUpdate.carbohydrates"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Белки, 100 г. (Нетто)</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductForUpdate.proteins"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="closeProductUpdateModal"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--product update modal-->

  <!--wastage update modal-->
  <div
    class="modal fade"
    id="updateWastageModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="wastageUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="updateWastage">
          <div class="modal-header">
            <h5 class="modal-title">Редактирование</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Потеря, %</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="currentWastageForUpdate.percent"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="closeWastageUpdateModal"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--wastage update modal-->

  <div class="alert alert-danger" role="alert" v-if="isError">
    Ошибка приложения
  </div>
  <div class="container">
    <h3 class="mt-3" v-once>Продукты</h3>

    <div class="shadow-lg p-3 my-4 bg-body rounded">
      <h5>Поиск</h5>
      <div class="row">
        <div class="col-12">
          <div class="mb-3">
            <label class="form-label">Название продукта</label>
            <input
              type="text"
              class="form-control"
              v-model="searchForm.product_name"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>
    <div v-else>
      <div class="shadow-lg p-3 my-4 bg-body rounded">
        <h5>Форма для добавления</h5>
        <form @submit.prevent="addNewProduct">
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label class="form-label">Название продукта</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newProductForm.product_name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
              <div class="mb-3">
                <label class="form-label"
                  >Эн. цен. (кКал), 100 г. (Брутто)</label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="newProductForm.energy_value"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="mb-3">
                <label class="form-label">Белки, 100 г. (Нетто)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="newProductForm.proteins"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="mb-3">
                <label class="form-label">Жиры, 100 г. (Нетто)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="newProductForm.fats"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="mb-3">
                <label class="form-label">Углеводы, 100 г. (Нетто)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="newProductForm.carbohydrates"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-secondary">Добавить</button>
        </form>
      </div>

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
                <button
                  type="button"
                  class="btn btn-link link-secondary p-0 m-0 text-start"
                  @click="showModalForUpdate(product.id)"
                >
                  <b>{{ product.product_name }}</b>
                </button>
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
                <p
                  v-for="dateRange in dateRangesList.results"
                  :key="dateRange.id"
                  class="p-0 m-0"
                >
                  <nobr
                    ><button
                      type="button"
                      class="btn btn-link link-secondary p-0 m-0 text-start"
                      @click="
                        showModalForWastageUpdate(
                          getWastage(
                            product.wastage_list,
                            treatment.id,
                            dateRange.id
                          ).id
                        )
                      "
                    >
                      {{ dateRange.get_formatted_data }}&nbsp;
                    </button>

                    <b>
                      {{
                        getWastage(
                          product.wastage_list,
                          treatment.id,
                          dateRange.id
                        ).percent
                      }}%</b
                    >
                  </nobr>
                  <br />
                </p>
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
      <div v-else class="mt-3"><h5>Список пуст</h5></div>
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
      newProductForm: {
        product_name: "",
        energy_value: "",
        proteins: "",
        fats: "",
        carbohydrates: "",
      },
      currentProductForUpdate: {
        product_name: "",
        energy_value: "",
        proteins: "",
        fats: "",
        carbohydrates: "",
      },
      currentWastageForUpdate: { percent: "" },
      searchForm: {
        product_name: "",
      },
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
        const response = await productsAPI.getItemsList(
          this.userToken,
          this.searchForm
        )
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
    async addNewProduct() {
      this.isLoading = true
      try {
        await productsAPI.addItem(this.userToken, this.newProductForm)
        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
        this.newProductForm = {
          product_name: "",
          energy_value: "",
          proteins: "",
          fats: "",
          carbohydrates: "",
        }
        this.isLoading = false
      }
    },
    async showModalForUpdate(productId) {
      this.isError = false
      try {
        const response = await productsAPI.getItemData(
          this.userToken,
          productId
        )
        this.currentProductForUpdate = await response.data
        let updateModal = this.$refs.productUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (event) {
        this.isError = true
      } finally {
      }
    },
    async showModalForWastageUpdate(wastageId) {
      this.isError = false
      try {
        const response = await productsAPI.getWastageItem(
          this.userToken,
          wastageId
        )
        this.currentWastageForUpdate = await response.data
        let updateModal = this.$refs.wastageUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (event) {
        this.isError = true
      } finally {
      }
    },
    async updateProduct() {
      try {
        await productsAPI.updateItem(
          this.userToken,
          this.currentProductForUpdate
        )
        await this.loadData()
        this.$refs.closeProductUpdateModal.click()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
    async updateWastage() {
      try {
        await productsAPI.updateWastageItem(
          this.userToken,
          this.currentWastageForUpdate
        )
        await this.loadData()
        this.$refs.closeWastageUpdateModal.click()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
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
    getWastage(wastageList, treatment, dateRange) {
      let result
      wastageList.map((item) => {
        if (
          item.treatment_kind === treatment &&
          item.date_range === dateRange
        ) {
          result = item
        }
      })
      return result
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
