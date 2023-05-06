import queryString from 'query-string'
import axios from 'axios'

const DEFAULT_ERROR_TEXT = 'Произошла ошибка...'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  paramsSerializer: {
    serialize: (params: Record<string, any>) =>
      queryString.stringify(params, { arrayFormat: 'none' })
  }
})

export default http

export const getErrorMessage = (error: any, defaultMessage?: string): string => {
  if ([400, 404].includes(error?.response?.status) && error?.response?.data?.error?.message) {
    return error.response.data.error.message
  } else if (defaultMessage) {
    return defaultMessage
  } else return DEFAULT_ERROR_TEXT
}
