import queryString from 'query-string'
import axios, { AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'

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
  if (error.description) {
    return error.description
  } else if (defaultMessage) {
    return defaultMessage
  } else {
    return DEFAULT_ERROR_TEXT
  }
}

export const formatRes = (res: AxiosResponse) => Promise.resolve(res.data)

export const formatErr = (err: any, options: { prefix?: string } = {}) => {
  const isPrefix = !!options.prefix

  let error: any = new Error()
  if (err.response && err.response.data && err.response.data.error) {
    error = err.response.data.error
  } else if (err.response && err.response.data) {
    if (typeof err.response.data !== 'object') {
      error.data = err.response.data
    } else {
      error = err.response.data
    }
  } else if (err.response) {
    error = err.response
  } else if (!err.response && err.message === 'Network Error' && !err.status) {
    alert(err.response)
    error = err
    error.description = isPrefix
      ? options.prefix + ': нет соединения с интернетом!'
      : 'Нет соединения с интернетом!'
  }
  if (err.response !== undefined && err.response.status) {
    error.status = err.response.status
  } else {
    error.status = null
  }
  if (error.status === 401) {
    error.description = ''
  } else if (error.description) {
    error.description = isPrefix ? error.description : error.description
  } else if (err.response.data) {
    error.description = err.response.data
  } else if (!error.description) {
    error.description = isPrefix
      ? options.prefix + ': что-то пошло не так.'
      : 'Что-то пошло не так.'
  }
  const HTML = /(<([^>]+)>)/gi
  if (HTML.test(error.description)) {
    // Ошибка может приходить из Nginx в виде html, такие ошибки пользователям не показываем
    error.description = 'Что-то пошло не так.'
  }
  throw error
}
