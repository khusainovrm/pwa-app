import http from '../index'
import type { Task } from '@/types'

const API_URL = `https://crudcrud.com/api/${import.meta.env.VITE_API_CRUD_CRUD_ID}/task`

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await http.get(`${API_URL}/`)
  return data
}

export async function createTask(name: string): Promise<Task> {
  const { data } = await http.post(`${API_URL}/`, { name, type: 'new' })
  return data
}

export async function deleteTask(id: number): Promise<void> {
  const { data } = await http.delete(`${API_URL}/${id}`)
  return data
}

export async function updateTaks(task: Task): Promise<void> {
  const { data } = await http.put(`${API_URL}/${task._id}`, { type: task.type, name: task.name })
  return data
}
