import MyWorker from '../../my-worker?worker'
import type { Task } from '@/types'

const worker = new MyWorker()

export function useMySw() {
  const updateTasksCache = async (tasks: Task[]) => {
    worker.postMessage({
      taskType: 'save-task',
      taskArguments: JSON.stringify({ data: tasks })
    })
  }

  return {
    updateTasksCache
  }
}
