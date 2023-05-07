import { msg } from './workerImport'

let counter = 1

self.onmessage = async (e) => {
  if (e.data === 'save tasks') {
    console.log('cache', await caches.keys())
  } else if (e.data === 'ping') {
    self.postMessage({ msg: `${msg} - ${counter++}` })
  } else if (e.data === 'clear') {
    counter = 1
    self.postMessage({ msg: null })
  }
}
