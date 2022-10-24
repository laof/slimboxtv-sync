import { readFileSync } from 'fs'
import list from './box.js'

function data(file) {
  return JSON.parse(readFileSync(file).toString())
}

export const metadata = data('conf/metadata.json')

export const box = metadata.filter((item) => list.includes(item.box))
export const skip = metadata.filter((item) => !list.includes(item.box))
