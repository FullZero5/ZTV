interface ChannelData {
    id: number
    file: string
    img: string
    title: string
    group: string
    tag: string[]
    work: boolean
}

interface StringData {
    img?: string
    name?: string
    title?: string
    site?: string
}

export const m3utojson = (m3u: string): ChannelData[] => {
    return m3u
        .replace('#EXTM3U', '').split('#EXTINF')
        .slice(1).map((str, index) => {
            const arr = str.split('\n').map(s => s.trim())            
            // Удаляем пустые элементы
            const validLines = arr.filter(line => line.length > 0)            
            // Если нет хотя бы двух элементов, возвращаем null
            if (validLines.length < 2) return null

            const { img, name, title, site } = getStringData(validLines[0])
            
            return {
                "id": index + 1,
                "file": validLines[1],
                "img": img || 'https://i.ibb.co/sjwXGh4/tv-channel.png',
                "title": title || 'Неизвестный',
                "group": name || 'Без группы',
                "tag": name ? name.split(';') : [site || ''],
                "work": true
            } as ChannelData
        })
        .filter((item): item is ChannelData => item !== null) 
}

const getStringData = (str: string): StringData => {
    const siteRegex = /tvg-id="([^"]*)"/
    const tvgLogoRegex = /tvg-logo="([^"]*)"/
    const groupTitleRegex = /group-title="([^"]*)"/
    
    const [, tvgLogo] = str.match(tvgLogoRegex) || []
    const [, groupTitle] = str.match(groupTitleRegex) || []
    const [, siteTitle] = str.match(siteRegex) || []
    
    const title = str.split(',')[1] ? str.split(',')[1].trim() : ''

    return {
        img: tvgLogo,
        name: groupTitle,
        title: title,
        site: siteTitle
    }
}