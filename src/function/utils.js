export function groupBy(items, key) {
    const map = new Map()
    items.forEach((item) => {
      const keyValue = item[key]
      const currArr = map.has(keyValue) ? map.get(keyValue) : []
      currArr.push(item)
      map.set(keyValue, currArr)
    })
    return map
  }
  