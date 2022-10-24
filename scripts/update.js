import { get } from './_get.js'
import { localTime, readme, update } from './_helper.js'

const { history, box } = update()

const list = []

try {
  await get(box)
} catch (e) {
  console.log('job failed!!!')
}

box.forEach((item) => {
  try {
    const uri = item.disk[0].link[0].files[0].url
    if (uri.startsWith('https://')) {
      item.update = localTime()
      list.push(item)
    }
  } catch (e) {
    console.log('update failed:' + item.box)
  }
})

const data = history.concat(...list)
readme(data)
