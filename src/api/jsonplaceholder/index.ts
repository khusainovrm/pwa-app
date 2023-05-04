import http from '../index'
import type { Photo } from '@/types'

const API_URL = 'https://jsonplaceholder.typicode.com'

export async function fetchPhotos(quantity: number): Promise<Photo[]> {
  const { data } = await http.get(`${API_URL}/photos/?_start=0&_end=${quantity}`)
  return data
}
