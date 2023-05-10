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
                new URL('https://crudcrud.com/api/b437cb27126c4130804c53ed41af685e/task/')
              )
              console.log('response', response)
              const jsonResponse = new Response(e.data.taskArguments, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              console.log('jsonResponse', jsonResponse)

              const tasksCache = await allTaskCache.keys()
              tasksCache.map(async (request) => {
                if (
                  request.url === 'https://crudcrud.com/api/b437cb27126c4130804c53ed41af685e/task/'
                ) {
                  console.log('request before', await request)
                  await allTaskCache.put(request.clone(), jsonResponse)
                  console.log('request after', await allTaskCache.keys().then(console.log))
                } else {
                  await allTaskCache.delete(request)
                }
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
