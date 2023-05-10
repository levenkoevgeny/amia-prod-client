<template>
  <!--group update modal-->
  <div
    class="modal fade"
    id="updateProductGroupModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="productGroupUpdate"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form @submit.prevent="updateProductGroup">
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
                      >Наименование (название группы)</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductGroupForUpdate.group_name"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Норма на день</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentProductGroupForUpdate.norm_per_day"
                      required
                    />
                  </div>
                </div>
              </div>
              <div
                class="row"
                v-if="
                  currentProductGroupForUpdate.id !==
                  currentProductGroupForUpdate.replacement_for
                "
              >
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label"
                      >Норма замены на 100 г. осн. нормы</label
                    >
                    <input
                      type="number"
                      step="0.01"
                      class="form-control"
                      v-model="currentProductGroupForUpdate.in_count"
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
              ref="closeProductGroupUpdateModal"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--group update modal-->

  <div class="alert alert-danger" role="alert" v-if="isError">
    Ошибка приложения
  </div>
  <div class="container">
    <h3 class="mt-3" v-once>Нормы обеспечения продовольствием</h3>

    <div class="shadow-lg p-3 my-4 bg-body rounded">
      <h5>Поиск</h5>
      <div class="row">
        <div class="col-12">
          <div class="mb-3">
            <label class="form-label">Название группы</label>
            <input
              type="text"
              class="form-control"
              v-model="searchForm.group_name"
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
        <form @submit.prevent="addNewProductGroup">
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="newProductGroupForm.is_main"
            />
            <label class="form-check-label"> Является основной </label>
          </div>
          <div class="row">
            <div class="col-lg-8">
              <div class="mb-3">
                <label class="form-label">Наименование (название группы)</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="newProductGroupForm.group_name"
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="mb-3">
                <label class="form-label">Норма на день</label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  required
                  v-model="newProductGroupForm.norm_per_day"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-8">
              <div class="mb-3">
                <label class="form-label">Замена для</label>

                <Select2
                  v-model="newProductGroupForm.replacement_for"
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
                  :disabled="newProductGroupForm.is_main"
                  required
                />
              </div>
            </div>
            <div class="col-lg-4">
              <div class="mb-3">
                <label class="form-label"
                  >Норма замены на 100 г. осн. нормы</label
                >
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  v-model="newProductGroupForm.in_count"
                  :disabled="newProductGroupForm.is_main"
                  required
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-secondary">Добавить</button>
          </div>
        </form>
      </div>

      <div v-if="sortedProductGroupList.length > 0" class="mt-4">
        <small
          ><b>Всего записей - ({{ productGroupList.count }})</b></small
        >
        <table class="table mt-2">
          <thead>
            <tr>
              <th scope="col">Название группы</th>
              <th scope="col">Норма в сутки, г.</th>
              <th scope="col">Замены</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="productGroup in sortedProductGroupList"
              :key="productGroup.id"
            >
              <td>
                <div
                  class="d-flex flex-row align-items-start justify-content-start"
                >
                  <button
                    type="button"
                    class="btn btn-link link-secondary p-0 m-0 text-start"
                    @click="showModalForUpdate(productGroup.id)"
                  >
                    <b>{{ productGroup.group_name }}</b></button
                  >&nbsp;&nbsp;&nbsp;
                  <button
                    type="button"
                    class="btn btn-link link-danger p-0 m-0 text-start"
                    @click="deleteProductsGroup(productGroup.id)"
                  >
                    <font-awesome-icon icon="fa-solid fa-trash" v-once />
                  </button>
                </div>
              </td>
              <td>{{ productGroup.norm_per_day }}</td>
              <td>
                <template v-for="replacement in productGroup.replacements">
                  <template v-if="replacement.id !== productGroup.id">
                    <div
                      class="d-flex flex-row align-items-start justify-content-start"
                    >
                      <button
                        type="button"
                        class="btn btn-link link-secondary p-0 m-0 text-start"
                        @click="showModalForUpdate(replacement.id)"
                      >
                        {{ replacement.group_name }} -
                        {{ replacement.in_count }} г.</button
                      >&nbsp;&nbsp;&nbsp;
                      <button
                        type="button"
                        class="btn btn-link link-danger p-0 m-0 text-start"
                        @click="deleteProductsGroup(productGroup.id)"
                      >
                        <font-awesome-icon icon="fa-solid fa-trash" v-once />
                      </button>
                    </div>

                    <br />
                  </template>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <nav>
          <ul class="pagination pagination-md">
            <li
              class="page-item"
              :class="{ disabled: !productGroupList.previous }"
            >
              <button
                class="page-link"
                @click="updatePaginator(productGroupList.previous)"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="mx-2"></li>
            <li class="page-item" :class="{ disabled: !productGroupList.next }">
              <button
                class="page-link"
                @click="updatePaginator(productGroupList.next)"
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
import { productsGroupAPI } from "@/api/productsGroupAPI"
import debounce from "lodash.debounce"
import Select2 from "vue3-select2-component"

export default {
  name: "ProductsGroupView",
  components: { Spinner, Select2 },
  data() {
    return {
      VUE_APP_BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      VUE_APP_BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      VUE_APP_BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
      productGroupList: { results: [] },
      newProductGroupForm: {
        group_name: "",
        norm_per_day: "",
        replacement_for: null,
        in_count: null,
        is_main: true,
      },
      currentProductGroupForUpdate: {
        group_name: "",
        norm_per_day: "",
        replacement_for: null,
        in_count: null,
      },
      searchForm: {
        group_name: "",
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
        const response = await productsGroupAPI.getItemsList(
          this.userToken,
          this.searchForm
        )
        this.productGroupList = await response.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewProductGroup() {
      this.isLoading = true
      if (this.newProductGroupForm.is_main === true) {
        this.newProductGroupForm.replacement_for = null
        this.newProductGroupForm.in_count = null
      }
      try {
        await productsGroupAPI.addItem(this.userToken, this.newProductGroupForm)
        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
        this.newProductGroupForm = {
          group_name: "",
          norm_per_day: "",
          replacement_for: null,
          in_count: null,
          is_main: true,
        }
        this.isLoading = false
      }
    },
    async showModalForUpdate(productGroupId) {
      this.isError = false
      try {
        const response = await productsGroupAPI.getItemData(
          this.userToken,
          productGroupId
        )
        this.currentProductGroupForUpdate = await response.data
        let updateModal = this.$refs.productGroupUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (event) {
        this.isError = true
      } finally {
      }
    },
    async updateProductGroup() {
      try {
        await productsGroupAPI.updateItem(
          this.userToken,
          this.currentProductGroupForUpdate
        )
        await this.loadData()
        this.$refs.closeProductGroupUpdateModal.click()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await productsGroupAPI.updateList(url, this.userToken)
        this.productGroupList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 500),
    async deleteProductsGroup(productGroupId) {
      this.isLoading = true
      try {
        await productsGroupAPI.deleteItem(this.userToken, productGroupId)
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
    sortedProductGroupList() {
      return this.productGroupList.results.filter(
        (item) => item.id === item.replacement_for
      )
    },
    checkedForDeleteCount() {
      let counter = 0
      this.productGroupList.results.map((item) => {
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
