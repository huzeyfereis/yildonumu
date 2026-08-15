const modules = import.meta.glob('../../public/images/main/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

function buildYears() {
  const map = new Map()

  for (const path in modules) {
    const filename = path.split('/').pop()
    const match = filename.match(/^(\d{4})(?:-(\d+))?\.jpg$/i)
    if (!match) continue
    const year = match[1]
    const order = match[2] ? parseInt(match[2], 10) : 0
    if (!map.has(year)) map.set(year, [])
    map.get(year).push({ src: modules[path], order })
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, photos]) => ({
      year,
      photos: photos.sort((a, b) => a.order - b.order).map((p) => p.src),
    }))
}

export const years = buildYears()

export const yearId = (year) => `year-${year}`

export const CLOSING_ID = 'closing'
