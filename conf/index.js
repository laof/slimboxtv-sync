import { readFileSync } from 'fs'
import ks, { blacklist } from './keys.js'

export const data = jsonf('conf/data.json')
export const table = jsonf('conf/table.json')

const list = Array.from(new Set(ks)).filter((k) => !blacklist.includes(k))

export const box = list.reduce((arr, k) => {
  const obj = data.find((o) => o.box == k) || table.find((o) => o.box == k)

  if (obj) {
    arr.push(obj)
  }

  return arr
}, [])

// export const skip = mapping.filter((item) => !list.includes(item.box))

function jsonf(file) {
  return JSON.parse(readFileSync(file).toString())
}
