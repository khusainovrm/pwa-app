import { msg } from './workerImport'
const tasksCacheName = 'api-task'
const URL_TO_HANDLE = 'https://crudcrud.com/api/b437cb27126c4130804c53ed41af685e/task/'

let counter = 1

self.onmessage = async (e) => {
  if (
    e.data instanceof Object &&
    // eslint-disable-next-line no-prototype-builtins
    e.data.hasOwnProperty('taskType') &&
    // eslint-disable-next-line no-prototype-builtins
    e.data.hasOwnProperty('taskArguments')
  ) {
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

              // tasksRequestsCache.map(async (request) => {
              //   if (
              //     request.url === 'https://crudcrud.com/api/b437cb27126c4130804c53ed41af685e/task/'
              //   ) {
              //     // await allTaskCache.delete(request)
              //     await allTaskCache.put(request, newResponse)
              //     console.log('check', await allTaskCache.keys())
              //   } else {
              //     // await allTaskCache.delete(request)
              //   }
              //   return
              // })
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
