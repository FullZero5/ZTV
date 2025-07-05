import Hls, { type ErrorData, type HlsConfig } from "hls.js"

export const VIDEO_HLS_INITIALIZED_ATTRIBUTE = "data-livepeer-video-hls-initialized"

export type HlsError = ErrorData

export type VideoConfig = { autoplay?: boolean }
export type HlsVideoConfig = Partial<HlsConfig> & {
  autoPlay?: boolean
}

/**
 * Checks if hls.js can play in the browser.
 */
export const isHlsSupported = () => typeof Hls !== 'undefined' && (Hls?.isSupported?.() ?? false)

/**
 * Create an hls.js instance and attach to the provided media element.
 */
export const createNewHls = <TElement extends HTMLMediaElement>({
  source,
  element,
  callbacks,
  aspectRatio,
  config,
  initialQuality,
}: {
  source: string
  element: TElement
  initialQuality: number
  aspectRatio: number
  callbacks: {
    onLive?: (v: boolean) => void
    onPlaybackOffsetUpdated?: (d: number) => void
    onDuration?: (v: number) => void
    onCanPlay?: () => void
    onError?: (data: HlsError) => void
    onRedirect?: (url: string | null) => void
    onQualityAvailable?: (qualities: number[]) => void // Добавлен новый колбэк
  }
  config: HlsVideoConfig
}): {
  setQuality: (quality: number) => void
  destroy: () => void
  getAvailableQualities: () => number[] // Добавлен новый метод
} => {
  // do not attach twice
  if (element.getAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE) === "true") {
    return {
      setQuality: () => {
        //
      },
      destroy: () => {
        //
      },
      getAvailableQualities: () => [] // Добавлено для consistency
    }
  }

  element.setAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE, "true")

  const hls = new Hls({
    backBufferLength: 60 * 1.5,
    manifestLoadingMaxRetry: 0,
    fragLoadingMaxRetry: 0,
    levelLoadingMaxRetry: 0,
    appendErrorMaxRetry: 0,
    ...config,
    ...(config?.liveSyncDurationCount
      ? {
          liveSyncDurationCount: config.liveSyncDurationCount,
        }
      : {
          liveMaxLatencyDurationCount: 7,
          liveSyncDurationCount: 3,
        }),
  })

  const onDestroy = () => {
    hls?.destroy?.()
    element?.removeAttribute?.(VIDEO_HLS_INITIALIZED_ATTRIBUTE)
  }

  if (element) {
    hls.attachMedia(element)
  }

  let redirected = false

  hls.on(Hls.Events.LEVEL_LOADED, async (_e, data) => {
    const { live, totalduration: duration, url } = data.details

    if (!redirected) {
      callbacks?.onRedirect?.(url ?? null)
      redirected = true
    }

    callbacks?.onLive?.(Boolean(live))
    callbacks?.onDuration?.(duration ?? 0)
  })

  hls.on(Hls.Events.MEDIA_ATTACHED, async () => {
    hls.loadSource(source)

    hls.on(Hls.Events.MANIFEST_PARSED, (_event, _data) => {
      setQuality({
        hls: hls ?? null,
        quality: initialQuality,
        aspectRatio,
      })

      // Вызываем колбэк с доступными качествами
      const qualities = hls.levels?.map(level => level.height) || []
      callbacks?.onQualityAvailable?.(qualities)
      
      callbacks?.onCanPlay?.()
      if (config.autoPlay) element?.play?.()
    })
  })

  hls.on(Hls.Events.ERROR, async (_event, data) => {
    const { details, fatal } = data

    const isManifestParsingError = details === "manifestParsingError"

    if (!fatal && !isManifestParsingError) return
    callbacks?.onError?.(data)

    if (fatal) {
      console.error(`Fatal error : ${data.details}`)
      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError()
          break
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.error(`A network error occurred: ${data.details}`)
          break
        default:
          console.error(`An unrecoverable error occurred: ${data.details}`)
          hls.destroy()
          break
      }
    }
  })

  function updateOffset() {
    const currentDate = Date.now()
    const newDate = hls.playingDate

    if (newDate && currentDate) {
      callbacks?.onPlaybackOffsetUpdated?.(currentDate - newDate.getTime())
    }
  }

  const updateOffsetInterval = setInterval(updateOffset, 2000)

  return {
    destroy: () => {
      onDestroy?.()
      clearInterval?.(updateOffsetInterval)
      element?.removeAttribute?.(VIDEO_HLS_INITIALIZED_ATTRIBUTE)
    },
    setQuality: (videoQuality) => {
      setQuality({
        hls: hls ?? null,
        quality: videoQuality,
        aspectRatio,
      })
    },
    getAvailableQualities: () => {
      return hls.levels?.map(level => level.height) || []
    }
  }
}

const setQuality = ({
  hls,
  quality,
  aspectRatio,
}: {
  hls: Hls | null
  quality: number
  aspectRatio: number
}) => {
  if (hls) {
    const width = quality * aspectRatio

    if (!width || quality === -1) {
      hls.currentLevel = -1
      return
    }

    if (hls.levels && hls.levels.length > 0) {
      const sortedLevels = hls.levels
        .map((level, index) => ({ ...level, index }))
        .sort(
          (a, b) =>
            Math.abs((width ?? 0) - a.width) - Math.abs((width ?? 0) - b.width),
        )

      const bestMatchLevel = sortedLevels?.[0]

      if ((bestMatchLevel?.index ?? -1) >= 0) {
        hls.currentLevel = bestMatchLevel.index
      } else {
        hls.currentLevel = -1
      }
    }
  }
}