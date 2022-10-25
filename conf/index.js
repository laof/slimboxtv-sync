import { readFileSync } from 'fs'
import list from './box.js'

function jsonfile(file) {
  return JSON.parse(readFileSync(file).toString())
}

export const data = jsonfile('conf/data.json')
export const metadata = jsonfile('conf/metadata.json')

const old = data.filter((item) => list.includes(item.box))

export const box = list.reduce((arr, name) => {
  if (arr.find((item) => item.box == name)) {
    return arr
  }

  const obj = metadata.find((item) => item.box == name)

  if (obj) {
    arr.push(obj)
  }

  return arr
}, old)

console.log(box)

// export const skip = metadata.filter((item) => !list.includes(item.box))
