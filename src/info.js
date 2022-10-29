import { product } from './slimboxtv.js'
export async function updateInfo(box) {
  for (let item of box) {
    const { list } = await product(item.homepage)
    if (list.length) {
      item.disk = list
    }
  }
}
