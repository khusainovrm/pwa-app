import { msg } from './workerImport'
const tasksCacheName = 'api-task'
const URL_TO_HANDLE = 'https://my-api-server.ru/v1/tasks'

let counter = 1

self.onmessage = async (e) => {
  if (e.data instanceof Object && 'taskType' in e.data && 'taskArguments' in e.data) {
    if (e.data.taskType === 'save-task') {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames
            .filter((name) => name === tasksCacheName)
            .map(async (name) => {
              const allTaskCache = await caches.open(name)
              const tasksRequestsCache = await allTaskCache.keys()
              const requestToHandle = tasksRequestsCache.find((r) => r.url === URL_TO_HANDLE)
              const originalResponse = await allTaskCache.match(new URL(URL_TO_HANDLE))
              if (requestToHandle && originalResponse) {
                const newResponse = new Response(e.data.taskArguments, originalResponse)
                await allTaskCache.put(requestToHandle, newResponse)
              }
            })
        )
      } catch (e) {
        console.log(e)
      }
    }
  } else if (e.data === 'ping') {
    self.postMessage({ msg: `${msg} - ${counter++}` })
  } else if (e.data === 'clear') {
    counter = 1
    self.postMessage({ msg: null })
  }
}
