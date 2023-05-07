import http, { formatErr, formatRes } from '../index'
import type { Task } from '@/types'

const API_URL = `https://crudcrud.com/api/${import.meta.env.VITE_API_CRUD_CRUD_ID}/task`

export function fetchTasks(): Promise<Task[]> {
  return http
    .get(`${API_URL}/`)
    .then(formatRes)
    .catch((err) => {
      return formatErr(err, { prefix: 'Ошибка загрузки списка задач' })
    })
}

export function createTask(name: string): Promise<Task> {
  return http
    .post(`${API_URL}/`, { name, type: 'new' })
    .then(formatRes)
    .catch((err) => {
      return formatErr(err, { prefix: 'Ошибка создания задачи' })
    })
}

export function deleteTask(id: number): Promise<void> {
  return http
    .delete(`${API_URL}/${id}`)
    .then(formatRes)
    .catch((err) => {
      return formatErr(err, { prefix: 'Ошибка создания задачи' })
    })
}

export function updateTaks(task: Task): Promise<void> {
  return http
    .put(`${API_URL}/${task._id}`, { type: task.type, name: task.name })
    .then(formatRes)
    .catch((err) => {
      return formatErr(err, { prefix: 'Ошибка создания задачи' })
    })
}
