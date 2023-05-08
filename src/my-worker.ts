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
              const taskCache = await caches.open(name)
              console.log('taskCache', taskCache)
              // @ts-ignore
              taskCache[2].then((response: any) => console.log('response', response))
              // const tasksCache = await oldRequest.keys()
              // console.log('tasksCache', tasksCache)
              // tasksCache.map(request => {
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
