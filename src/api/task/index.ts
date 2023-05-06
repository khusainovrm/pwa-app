import http from '../index'
import type { Task } from '@/types'

const API_URL = 'https://crudcrud.com/api/30ce38b308e946b581496ada91ff6be1'

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await http.get(`${API_URL}/task`)
  return data
}

export async function createTask(name: string): Promise<Task> {
  const { data } = await http.post(`${API_URL}/task`, { name, type: 'common' })
  return data
}

export async function deleteTask(id: number): Promise<void> {
  const { data } = await http.delete(`${API_URL}/task/${id}`)
  return data
}
