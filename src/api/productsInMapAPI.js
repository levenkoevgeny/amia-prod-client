import axios from "axios"
import { authHeaders } from "@/api/authAPI"

let base_url = "products-in-map"

export const productsInMapAPI = {
  async getItemsList(token, searchForm = { map: "" }, limit = 10000) {
    let { map } = searchForm
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?limit=${limit}&map=${map}`,
      authHeaders(token)
    )
  },
  async updateList(url, token) {
    return axios.get(url, authHeaders(token))
  },

  async getItemData(token, itemId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}`,
      authHeaders(token)
    )
  },

  async addItem(token, itemData) {
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/`,
      itemData,
      authHeaders(token)
    )
  },

  async updateItem(token, itemData) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemData.id}/`,
      itemData,
      authHeaders(token)
    )
  },

  async deleteItem(token, itemId) {
    return axios.delete(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}/`,
      authHeaders(token)
    )
  },
}
