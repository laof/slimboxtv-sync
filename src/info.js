import { product } from './slimboxtv.js'
export async function updateInfo(box, opts) {
  let max = opts.total > box.length ? box.length : opts.total
  for (let [index, item] of box.entries()) {
    if (index >= max) {
      break
    }

    console.log(`[${++index}/${max}] ${item.box}`)
    const { error, list } = await product(item.homepage)
    if (list.length) {
      item.latestUpdate = new Date().getTime()
      item.disk = list
    }
    error.forEach((err) => console.log('[error]', err))
  }
}

export async function onlyone(box, name) {
  for (let item of box) {
    if (name === item.box) {
      const title = `[1/1]  ${name}`
      console.log(title)
      const { error, list } = await product(item.homepage)
      if (list.length) {
        item.latestUpdate = new Date().getTime()
        item.disk = list
      }
      error.forEach((err) => console.log('[error]', err))
    }
  }
}
