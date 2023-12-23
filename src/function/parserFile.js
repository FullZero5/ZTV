export const m3utojson = (m3u) => {
    return m3u
      .replace('#EXTM3U', '').split('#EXTINF:0')
      .slice(1).map((str, index) => {
        const arr = str.split('\n').map(s => s.trim())
        const { img, name, title, site } = getStringData(arr[0])
        return {
          "id": index + 1,
          "file": arr[1],
          "img": img || 'https://i.ibb.co/sjwXGh4/tv-channel.png',
          "title": `${title}`,
          "group": name.split(';')[0],
          "tag": name.split(';') || [site],
          "work": true
        }
      })
  }

const getStringData = (str) => {
    const siteRegex = /tvg-id="([^"]*)"/
    const tvgLogoRegex = /tvg-logo="([^"]*)"/
    const groupTitleRegex = /group-title="([^"]*)"/
    const [, tvgLogo] = str.match(tvgLogoRegex) || []
    const [, groupTitle] = str.match(groupTitleRegex) || []
    const [, siteTitle] = str.match(siteRegex) || []
    const title = str.split(',')[1]
    return {
        img: tvgLogo,
        name: groupTitle,
        title: title,
        site: siteTitle
    }
}