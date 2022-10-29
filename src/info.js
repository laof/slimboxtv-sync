import { product } from './slimboxtv.js'
export async function updateInfo(box) {
  for (let [index, item] of box.entries()) {
    console.log(`[${++index}/${box.length}] ${item.box}`)
    const { error, list } = await product(item.homepage)
    if (list.length) {
      item.disk = list
    }
    error.forEach((err) => console.log('[error]', err))
  }
}
