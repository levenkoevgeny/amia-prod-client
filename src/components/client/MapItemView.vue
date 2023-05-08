<template>
  <div
    class="modal fade"
    id="updateProductInMap"
    tabindex="-1"
    aria-hidden="true"
    ref="productInMapUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="updateProductInMap">
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
                    <label class="form-label"
                      >Продукт (<b>{{
                        currentProductInMapForUpdate.get_product_name
                      }}</b
                      >)</label
                    >
                    <Select2
                      v-model="currentProductInMapForUpdate.product"
                      :settings="{
                        ajax: {
                          url: `${VUE_APP_BACKEND_PROTOCOL}://${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}/api/products-select2/`,
                          data: function (params) {
                            var query = { product_name__icontains: params.term }
                            return query
                          },
                          dataType: 'json',
                        },
                        width: '100%',
                        dropdownParent: '#updateProductInMap',
                      }"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label"
                      >По какой норме(<b>{{
                        currentProductInMapForUpdate.get_group_name
                      }}</b
                      >)</label
                    >
                    <Select2
                      v-model="currentProductInMapForUpdate.group"
                      :settings="{
                        ajax: {
                          url: `${VUE_APP_BACKEND_PROTOCOL}://${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}/api/product-groups-select2/`,
                          data: function (params) {
                            var query = { group_name__icontains: params.term }
                            return query
                          },
                          dataType: 'json',
                        },
                        width: '100%',
                        dropdownParent: '#updateProductInMap',
                      }"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Обработка</label>
                    <Select2
                      v-model="currentProductInMapForUpdate.treatments"
                      :options="sortedTreatmentsListSelect2"
                      @change=""
                      @select=""
                      :settings="{
                        multiple: true,
                        width: '100%',
                        dropdownParent: '#updateProductInMap',
                      }"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Масса брутто</label>
                    <input
                      v-model="currentProductInMapForUpdate.product_count_gross"
                      type="number"
                      class="form-control"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Категория</label>
                    <select
                      class="form-select"
                      v-model="currentProductInMapForUpdate.dish_category"
                      required
                    >
                      <option value="">----</option>
                      <option
                        :value="dishCategory.id"
                        v-for="dishCategory in sortedDishCategoriesList"
                        :key="dishCategory.id"
                      >
                        {{ dishCategory.dish_category }}
                      </option>
                    </select>
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
              ref="closeProductInMapUpdateModal"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!--  update map number-->
  <div
    class="modal fade"
    id="updateMapNumber"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="mapNumberUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form>
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
                    <label class="form-label"
                      >Номер технологической карты</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="map.map_number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--  update map number-->

  <!--  update map name-->
  <div
    class="modal fade"
    id="updateMapName"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="mapNameUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form>
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
                    <label class="form-label"
                      >Название технологической карты</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="map.map_name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--  update map name-->

  <!--  update map description-->
  <div
    class="modal fade"
    id="updateMapDescription"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="mapNumberUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form>
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
                    <label class="form-label"
                      >Номер технологической карты</label
                    >
                    <textarea
                      cols="30"
                      rows="10"
                      class="form-control"
                      v-model="map.description"
                    >
                      {{ map.description }}
                    </textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--  update map description-->

  <div class="container">
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>
    <div v-else>
      <h3 class="mt-3">
        Технологическая карта № {{ map.map_number }}
        <a href="#updateMapNumber" data-bs-toggle="modal" class="link-secondary"
          >(ред.)</a
        >
      </h3>
      <p>на кулинарную продукцию</p>
      <h5>
        {{ map.map_name }}
        <a href="#updateMapName" data-bs-toggle="modal" class="link-secondary"
          >(ред.)</a
        >
      </h5>

      <div class="shadow-lg p-3 my-4 bg-body rounded">
        <h5>Форма для добавления</h5>
        <form @submit.prevent="addProductInMap">
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Продукт</label>
                <Select2
                  v-model="newProductInMapForm.product"
                  :settings="{
                    ajax: {
                      url: `${VUE_APP_BACKEND_PROTOCOL}://${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}/api/products-select2/`,
                      data: function (params) {
                        var query = { product_name__icontains: params.term }
                        return query
                      },
                      dataType: 'json',
                    },
                    width: '100%',
                  }"
                  required
                />
              </div>
            </div>

            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">По какой норме</label>
                <Select2
                  v-model="newProductInMapForm.group"
                  :settings="{
                    ajax: {
                      url: `${VUE_APP_BACKEND_PROTOCOL}://${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}/api/product-groups-select2/`,
                      data: function (params) {
                        var query = { group_name__icontains: params.term }
                        return query
                      },
                      dataType: 'json',
                    },
                    width: '100%',
                  }"
                  required
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Обработка</label>
                <Select2
                  v-model="newProductInMapForm.treatments"
                  :options="sortedTreatmentsListSelect2"
                  @change=""
                  @select=""
                  :settings="{ multiple: true }"
                  required
                />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="lg-3">
                <label class="form-label">Масса брутто</label>
                <input
                  v-model="newProductInMapForm.product_count_gross"
                  type="number"
                  class="form-control"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </div>
            <div class="col-lg-3">
              <div class="mb-3">
                <label class="form-label">Категория</label>
                <select
                  class="form-select"
                  v-model="newProductInMapForm.dish_category"
                  required
                >
                  <option value="">----</option>
                  <option
                    :value="dishCategory.id"
                    v-for="dishCategory in sortedDishCategoriesList"
                    :key="dishCategory.id"
                  >
                    {{ dishCategory.dish_category }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-secondary">Добавить</button>
        </form>
      </div>

      <div v-if="sortedProductInMapList.length > 0">
        <table class="table table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th rowspan="2">Наименование сырья</th>
              <th colspan="2">
                <nobr>Расход сырья на I порцию,( г)</nobr>
              </th>
              <th rowspan="2">Категория</th>
              <th rowspan="2">Вид обработки</th>
              <th rowspan="2" colspan="2">Группа продуктов</th>
            </tr>
            <tr>
              <th>Брутто, г.</th>
              <th>Нетто, г.</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="productInMap in sortedProductInMapList"
              :key="productInMap.id"
              @click="showModalForUpdate(productInMap.id)"
              style="cursor: pointer"
            >
              <td>{{ productInMap.product.product_name }}</td>
              <td>{{ productInMap.product_count_gross }}</td>
              <td>
                <template
                  v-for="treatment in productInMap.treatments.sort(
                    (a, b) => a.id - b.id
                  )"
                >
                  <nobr
                    >{{
                      productInMap.get_net_weight_treatment_array[treatment.id]
                    }}
                    /
                  </nobr>
                </template>
              </td>
              <td>{{ productInMap.dish_category.dish_category }}</td>
              <td>
                <template v-for="treatment in productInMap.treatments">
                  {{ treatment.treatment_kind }}<br />
                </template>
              </td>
              <td>
                <template
                  v-if="
                    productInMap.group.replacement_for != productInMap.group.id
                  "
                >
                  {{ productInMap.group.group_name }} замена для
                  <b>{{ productInMap.group.replacement_for.group_name }}</b> (
                  {{ productInMap.group.in_count }} на 100 г.)
                </template>
                <template v-else
                  ><b>{{ productInMap.group.group_name }}</b></template
                >
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-link link-danger p-0 m-0 text-start"
                  @click="deleteProductInMap(productInMap.id)"
                >
                  <font-awesome-icon icon="fa-solid fa-trash" v-once />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="shadow p-3 mb-5 bg-body rounded">
          <h5>
            Описание технологического процесса
            <a
              href="#updateMapDescription"
              data-bs-toggle="modal"
              class="link-secondary"
              >(ред.)</a
            >
          </h5>
          {{ map.description }}
        </div>

        <h5>Выход нетто, г.</h5>
        <b class="mb-3"
          >Всего - {{ map.get_net_weights_by_dish_category.full_net_weight }}</b
        ><br />
        По категориям:<br />

        <template v-for="dishCategory in sortedDishCategoriesList">
          <b>{{ dishCategory.dish_category }}</b> -
          {{ map.get_net_weights_by_dish_category[dishCategory.id]
          }}<br /> </template
        ><br />

        <h5>Выход брутто, г. (на 100 г. продукта)</h5>

        <table class="table">
          <thead>
            <tr>
              <th>Белки, г</th>
              <th>Жиры, г</th>
              <th>Углеводы, г</th>
              <th>Энергетическая ценность, ккал</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ map.get_values.protein }}</td>
              <td>{{ map.get_values.fats }}</td>
              <td>{{ map.get_values.carbohydrates }}</td>
              <td>{{ map.get_values.energy }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { productsMapAPI } from "@/api/productsMapAPI"
import { productsInMapAPI } from "@/api/productsInMapAPI"
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"
import debounce from "lodash.debounce"
import Select2 from "vue3-select2-component"

export default {
  name: "MapItemView",
  components: { Spinner, Select2 },
  data() {
    return {
      VUE_APP_BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      VUE_APP_BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      VUE_APP_BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
      map: {
        map_number: "",
        map_name: "",
        description: "",
        get_net_weights_by_dish_category: "",
      },
      dishCategoriesList: { results: [] },
      productsInMapList: { results: [] },
      treatmentsList: { results: [] },
      newProductInMapForm: {
        product: null,
        group: null,
        product_count_gross: null,
        dish_category: null,
        treatments: [],
      },
      currentProductInMapForUpdate: {
        product: null,
        group: null,
        product_count_gross: null,
        dish_category: null,
        treatments: [],
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
        const response = await productsMapAPI.getItemData(
          this.userToken,
          this.$route.params.id
        )
        this.map = await response.data

        const responseDishCategories =
          await productsMapAPI.getDishCategoriesList(this.userToken)
        this.dishCategoriesList = await responseDishCategories.data

        const responseProductsInMap = await productsInMapAPI.getItemsList(
          this.userToken,
          { map: this.$route.params.id }
        )
        this.productsInMapList = await responseProductsInMap.data

        const responseTreatments = await productsMapAPI.getTreatmentsList(
          this.userToken
        )
        this.treatmentsList = await responseTreatments.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addProductInMap() {
      try {
        await productsInMapAPI.addItem(this.userToken, {
          map: this.map.id,
          ...this.newProductInMapForm,
        })
        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
        this.newProductInMapForm = {
          product: null,
          group: null,
          product_count_gross: null,
          dish_category: null,
          treatments: [],
        }
      }
    },
    async showModalForUpdate(productInMapId) {
      this.isError = false
      try {
        const response = await productsInMapAPI.getItemData(
          this.userToken,
          productInMapId
        )
        this.currentProductInMapForUpdate = await response.data
        let updateModal = this.$refs.productInMapUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (event) {
        this.isError = true
      } finally {
      }
    },
    async updateProductInMap() {
      try {
        await productsInMapAPI.updateItem(
          this.userToken,
          this.currentProductInMapForUpdate
        )
        await this.loadData()
        this.$refs.closeProductInMapUpdateModal.click()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
    async deleteProductInMap(productInMapId) {
      try {
        await productsInMapAPI.deleteItem(this.userToken, productInMapId)
        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
    debouncedMapUpdate: debounce(async function () {
      try {
        await productsMapAPI.updateItem(this.userToken, this.map)
      } catch (error) {
      } finally {
      }
    }, 500),
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedProductInMapList() {
      return this.productsInMapList.results
    },
    sortedDishCategoriesList() {
      return this.dishCategoriesList.results
    },

    sortedTreatmentsListSelect2() {
      let treatmentsProperties = []
      this.treatmentsList.results
        .sort((a, b) => a.id - b.id)
        .map((item) =>
          treatmentsProperties.push({ id: item.id, text: item.treatment_kind })
        )
      return treatmentsProperties
    },
  },
  watch: {
    map: {
      handler(newValue, oldValue) {
        this.debouncedMapUpdate()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
