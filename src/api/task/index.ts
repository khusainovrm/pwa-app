import http, { formatErr, formatRes } from '../index'
import type { Task } from '@/types'

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`

export function fetchTasks(): Promise<Task[]> {
  return http
    .get(`${API_URL}/`)
    .then(formatRes)
    .catch((err) => {
      return formatErr(err, { prefix: 'Ошибка получения задач' })
    })
}

export function createTask(name: string): Promise<Task> {
  return http
    .post(`${API_URL}/create`, { name, type: 'new' })
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
      return formatErr(err, { prefix: 'Ошибка удаления задачи' })
    })
}

export function updateTaks(task: Task): Promise<void> {
  return http
    .patch(`${API_URL}/${task.id}`, { type: task.type, name: task.name })
    .then(formatRes)
    .catch((err) => {
      return formatErr(err, { prefix: 'Ошибка обновления задачи' })
    })
}
