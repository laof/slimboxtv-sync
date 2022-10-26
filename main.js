import { fetch } from './src/slimboxtv.js'
import { update, box, fix } from './src/helper.js'

if (box.length) {
  if (fix) {
    box.forEach((b) => {
      try {
        if (b.disk[0].link[0].files[0].url) return
      } catch (e) {
        b.latestUpdate = 0
      }
    })
  }

  try {
    await fetch(box)
  } catch (e) {
    console.log('job failed!!!')
    console.log(e)
  }
  update(box)
} else {
  console.log('no data')
}
