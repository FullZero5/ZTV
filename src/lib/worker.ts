import { m3utojson } from "./parserM3uFile"

interface WorkerGlobalScope {
    onerror: ((this: WorkerGlobalScope, ev: ErrorEvent) => any) | null
    onmessage: ((this: WorkerGlobalScope, ev: MessageEvent) => any) | null
    postMessage: (message: any) => void
}

declare const self: WorkerGlobalScope

export type WorkerMessage = {
    type: 'data' | 'error'
    data?: unknown
    message?: string
}

self.onerror = (event: ErrorEvent) => {
    const errorMessage: WorkerMessage = {
        type: 'error',
        message: event.message
    }
    self.postMessage(errorMessage)
}

self.onmessage = (event: MessageEvent<string>) => {
    try {
        const parsedData = m3utojson(event.data)
        const successMessage: WorkerMessage = {
            type: 'data',
            data: parsedData
        }
        self.postMessage(successMessage)
    } catch (error) {
        const errorMessage: WorkerMessage = {
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
        self.postMessage(errorMessage)
    }
}
