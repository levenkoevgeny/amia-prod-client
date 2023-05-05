<template>
  <!--map update modal-->
  <!--  <div-->
  <!--      class="modal fade"-->
  <!--      id="updateProductGroupModal"-->
  <!--      tabindex="-1"-->
  <!--      aria-labelledby="exampleModalLabel"-->
  <!--      aria-hidden="true"-->
  <!--      ref="productGroupUpdate"-->
  <!--  >-->
  <!--    <div class="modal-dialog modal-dialog-centered">-->
  <!--      <div class="modal-content">-->
  <!--        <form @submit.prevent="updateProductGroup">-->
  <!--          <div class="modal-header">-->
  <!--            <h5 class="modal-title" id="exampleModalLabel">Редактирование</h5>-->
  <!--            <button-->
  <!--                type="button"-->
  <!--                class="btn-close"-->
  <!--                data-bs-dismiss="modal"-->
  <!--                aria-label="Close"-->
  <!--            ></button>-->
  <!--          </div>-->
  <!--          <div class="modal-body">-->
  <!--            <div class="container-fluid">-->
  <!--              <div class="row">-->
  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label"-->
  <!--                    >Наименование (название группы)</label-->
  <!--                    >-->
  <!--                    <input-->
  <!--                        type="text"-->
  <!--                        class="form-control"-->
  <!--                        v-model="currentProductGroupForUpdate.group_name"-->
  <!--                        required-->
  <!--                    />-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--              </div>-->
  <!--              <div class="row">-->
  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Норма на день</label>-->
  <!--                    <input-->
  <!--                        type="text"-->
  <!--                        class="form-control"-->
  <!--                        v-model="currentProductGroupForUpdate.norm_per_day"-->
  <!--                        required-->
  <!--                    />-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--              </div>-->
  <!--              <div-->
  <!--                  class="row"-->
  <!--                  v-if="-->
  <!--                  currentProductGroupForUpdate.id !==-->
  <!--                  currentProductGroupForUpdate.replacement_for-->
  <!--                "-->
  <!--              >-->
  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label"-->
  <!--                    >Норма замены на 100 г. осн. нормы</label-->
  <!--                    >-->
  <!--                    <input-->
  <!--                        type="number"-->
  <!--                        step="0.01"-->
  <!--                        class="form-control"-->
  <!--                        v-model="currentProductGroupForUpdate.in_count"-->
  <!--                        required-->
  <!--                    />-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--              </div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="modal-footer">-->
  <!--            <button-->
  <!--                type="button"-->
  <!--                class="btn btn-secondary"-->
  <!--                data-bs-dismiss="modal"-->
  <!--                ref="closeProductGroupUpdateModal"-->
  <!--            >-->
  <!--              Закрыть-->
  <!--            </button>-->
  <!--            <button type="submit" class="btn btn-primary">Сохранить</button>-->
  <!--          </div>-->
  <!--        </form>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <!--map update modal-->

  <div class="alert alert-danger" role="alert" v-if="isError">
    Ошибка приложения
  </div>
  <div class="container">
    <h3 class="mt-3" v-once>Технологические карты</h3>

    <div class="shadow-lg p-3 my-4 bg-body rounded">
      <h5>Поиск</h5>
      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label class="form-label">Номер карты</label>
            <input
              type="text"
              class="form-control"
              v-model="searchForm.map_number"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label class="form-label">Название карты</label>
            <input
              type="text"
              class="form-control"
              v-model="searchForm.map_name"
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
        <form @submit.prevent="addNewProductMap">
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="newProductMapForm.is_on_parent"
            />
            <label class="form-check-label">На основе родительской карты</label>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <Select2
                  v-model="newProductMapForm.map_parent"
                  :settings="{
                    ajax: {
                      url: `${VUE_APP_BACKEND_PROTOCOL}://${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}/api/maps-select2/`,
                      data: function (params) {
                        var query = { map_name__icontains: params.term }
                        return query
                      },
                      dataType: 'json',
                    },
                    width: '100%',
                  }"
                  :disabled="!newProductMapForm.is_on_parent"
                  required
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Номер карты</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="newProductMapForm.map_number"
                />
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Название карты</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="newProductMapForm.map_name"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-secondary">Добавить</button>
          </div>
        </form>
      </div>

      <div v-if="sortedProductMapList.length > 0" class="mt-4">
        <small
          ><b>Всего записей - ({{ productMapList.count }})</b></small
        >
        <table class="table mt-2">
          <thead>
            <tr>
              <th scope="col" class="text-center">Номер карты</th>
              <th scope="col">Название карты</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="productMap in sortedProductMapList" :key="productMap.id">
              <td class="text-center">{{ productMap.map_number }}</td>
              <td>
                <div
                  class="d-flex flex-row align-items-start justify-content-start"
                >
                  <router-link
                    :to="'/menu/products-maps/' + productMap.id"
                    class="btn btn-link link-secondary p-0 m-0 text-start"
                  >
                    {{ productMap.map_name }}</router-link
                  >&nbsp;&nbsp;&nbsp;
                  <button
                    type="button"
                    class="btn btn-link link-danger p-0 m-0 text-start"
                    @click="deleteProductsMap(productMap.id)"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash" v-once />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <nav>
          <ul class="pagination pagination-md">
            <li
              class="page-item"
              :class="{ disabled: !productMapList.previous }"
            >
              <button
                class="page-link"
                @click="updatePaginator(productMapList.previous)"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="mx-2"></li>
            <li class="page-item" :class="{ disabled: !productMapList.next }">
              <button
                class="page-link"
                @click="updatePaginator(productMapList.next)"
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
import { productsMapAPI } from "@/api/productsMapAPI"
import { getFormattedDate, getFormattedTime } from "@/utils"
import debounce from "lodash.debounce"
import Select2 from "vue3-select2-component"

export default {
  name: "ProductsMapView",
  components: { Spinner, Select2 },
  data() {
    return {
      VUE_APP_BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      VUE_APP_BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      VUE_APP_BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
      productMapList: { results: [] },
      newProductMapForm: {
        is_on_parent: false,
        map_number: "",
        map_name: "",
        description: "",
        map_parent: null,
      },
      currentProductMapForUpdate: {
        map_number: "",
        map_name: "",
        description: "",
        map_parent: null,
      },
      searchForm: {
        map_number: "",
        map_name: "",
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
        const response = await productsMapAPI.getItemsList(
          this.userToken,
          this.searchForm
        )
        this.productMapList = await response.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewProductMap() {
      this.isLoading = true

      if (!this.newProductMapForm.is_on_parent) {
        this.newProductMapForm.map_parent = null
      }
      try {
        if (!this.newProductMapForm.is_on_parent) {
          await productsMapAPI.addItem(this.userToken, this.newProductMapForm)
        } else {
          await productsMapAPI.addItemClone(
            this.userToken,
            this.newProductMapForm
          )
        }

        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
        this.newProductMapForm = {
          is_on_parent: false,
          map_number: "",
          map_name: "",
          description: "",
          map_parent: null,
        }
        this.isLoading = false
      }
    },
    async showModalForUpdate(productMapId) {
      this.isError = false
      try {
        const response = await productsMapAPI.getItemData(
          this.userToken,
          productMapId
        )
        this.currentProductMapForUpdate = await response.data
        let updateModal = this.$refs.productMapUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (event) {
        this.isError = true
      } finally {
      }
    },
    async updateProductMap() {
      try {
        await productsMapAPI.updateItem(
          this.userToken,
          this.currentProductMapForUpdate
        )
        await this.loadData()
        this.$refs.closeProductMapUpdateModal.click()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await productsMapAPI.updateList(url, this.userToken)
        this.productMapList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 500),
    async deleteProductsMap(productMapId) {
      this.isLoading = true
      try {
        await productsMapAPI.deleteItem(this.userToken, productMapId)
        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    deleteCheckedProductsHandler() {},
    checkAllHandler() {},
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedProductMapList() {
      return this.productMapList.results
    },
    checkedForDeleteCount() {
      let counter = 0
      this.productMapList.results.map((item) => {
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
