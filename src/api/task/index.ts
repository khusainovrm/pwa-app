import http from '../index'
import type { Task } from '@/types'

const API_URL = 'https://crudcrud.com/api/46ce4cea444b4d738f40e46f48c4f4f8/task'

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
