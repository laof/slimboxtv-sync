import { readFileSync } from 'fs'
import ks, { blacklist } from './keys.js'

// export const data = jsonf('conf/data.json')
export const table = jsonf('conf/table.json')

const list = Array.from(new Set(ks)).filter((k) => !blacklist.includes(k))

export const box = list.reduce((arr, k) => {
  const obj = table.find((o) => o.box == k)

  if (obj) {
    arr.push(obj)
  }

  return arr
}, [])

// box.forEach((b) => {
//   try {
//     if (b.disk[0].link[0].files[0].url) return
//   } catch (e) {
//     b.latestUpdate = 0
//   }
// })

// box.sort((a, b) => a.latestUpdate - b.latestUpdate)

// export const skip = mapping.filter((item) => !list.includes(item.box))

function jsonf(file) {
  return JSON.parse(readFileSync(file).toString())
}
