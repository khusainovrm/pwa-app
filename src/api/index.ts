import queryString from 'query-string'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  paramsSerializer: {
    serialize: (params: Record<string, any>) =>
      queryString.stringify(params, { arrayFormat: 'none' })
  }
})

export default http
