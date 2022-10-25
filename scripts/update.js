import { get } from './_get.js'
import { update, box, dev } from './_helper.js'

// const list = []

if (box.length) {
  try {
    await get(box)
  } catch (e) {
    console.log('job failed!!!')
    console.log(e)
  }

  // box.forEach((item) => {
  //   try {
  //     const uri = item.disk[0].link[0].files[0].url
  //     if (uri.startsWith('https://')) {
  //       item.update = new Date().getTime()
  //       list.push(item)
  //     }
  //   } catch (e) {
  //     console.log('update failed:' + item.box)
  //     console.log(e)
  //   }
  // })

  // const data = history.concat(...list)
  update(box)
} else {
  console.log('no data')
}
