import MyWorker from '../../my-worker?worker'

import type { Task } from '@/types'
const worker = new MyWorker()
export function useMySw() {
  const saveTasks = async (taskList: Task[]) => {
    console.log('taskList', taskList)
    worker.postMessage('save tasks')
  }

  return {
    saveTasks
  }
}
