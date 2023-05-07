import MyWorker from '../../my-worker?worker'
import { useTaskStore } from '@/stores'

const worker = new MyWorker()

export function useMySw() {
  const updateTasksCache = async () => {
    const taskStore = useTaskStore()
    worker.postMessage({
      taskType: 'save-task',
      taskArguments: JSON.stringify(taskStore.tasks)
    })
  }

  return {
    updateTasksCache
  }
}
