<template>Products group</template>

<script>
import Spinner from "@/components/common/Spinner"
import { mapGetters } from "vuex"
import { productsAPI } from "@/api/productsAPI"
import { productsGroupAPI } from "@/api/productsGroupAPI"
import { getFormattedDate, getFormattedTime } from "@/utils"
import debounce from "lodash.debounce"
export default {
  name: "ProductsGroupView",
  components: { Spinner },
  data() {
    return {
      productGroupList: { results: [] },
      newProductGroupForm: {
        group_name: "",
        norm_per_day: "",
        replacement_for: null,
        in_count: "",
      },
      currentProductGroupForUpdate: {
        group_name: "",
        norm_per_day: "",
        replacement_for: null,
        in_count: "",
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
    async addNewProduct() {
      this.isLoading = true
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
          in_count: "",
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
    async updateProduct() {
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
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedProductGroupList() {
      return this.productGroupList.results
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
