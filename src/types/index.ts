export interface Photo {
  albumId: number
  id: number
  thumbnailUrl: string
  title: string
  url: string
}

export interface Task {
  id: number
  name: string
  type: 'new' | 'doing' | 'done'
}
