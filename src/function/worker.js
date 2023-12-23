import { m3utojson } from "./parserFile"

self.onerror = (event) => {
  self.postMessage({ type: 'error', message: event.message })
}

self.onmessage = (event) => {
  try {
    const parsedData = m3utojson(event.data)
    self.postMessage(parsedData)
  } catch (error) {
    self.postMessage({ type: 'error', message: error.message })
  }
}
