import { msg } from './workerImport'
const tasksCacheName = 'api-task'

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
        console.log('cacheNames', cacheNames)
        await Promise.all(
          cacheNames
            .filter((name) => name === tasksCacheName)
            .map(async (name) => {
              const allTaskCache = await caches.open(name)
              console.log('taskCache', allTaskCache)

              const response = allTaskCache.match(
                new URL('https://crudcrud.com/api/18fa45aba9884c4d8204456e98a191c6/task/')
              )
              console.log('response', response)
              const jsonResponse = new Response(e.data.taskArguments, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              console.log('jsonResponse', jsonResponse)

              const tasksCache = await allTaskCache.keys()
              tasksCache.map((request) => {
                console.log('request', request)
                return
              })
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
