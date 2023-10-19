import Hls from 'hls.js'

export async function loadVideo(url, videoElement) {

    const getHlsConfig = () => {
        const config = {
            autoStartLoad: true,
            debug: false,
            lowLatencyMode: false,
            enableWorker: true,
            backBufferLength: 90
        }
        return config
    }

    const isHlsSupported = Hls.isSupported()
    const isMpegUrlSupported = videoElement.canPlayType('application/vnd.apple.mpegurl')

    if (isHlsSupported) {
        const hls = new Hls(getHlsConfig())
        hls.loadSource(url)
        hls.attachMedia(videoElement);
        await hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("fatal network error encountered, try to recover")
                        hls.startLoad()
                        break
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("fatal media error encountered, try to recover")
                        hls.recoverMediaError()
                        break
                    default:
                        hls.destroy()
                        break
                }
            }
        });
    } else if (isMpegUrlSupported) {
        videoElement.src = url
        await videoElement.play()
    }
}
