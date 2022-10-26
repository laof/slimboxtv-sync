import { fetch } from './src/slimboxtv.js'
import { update, box } from './src/helper.js'

if (box.length) {
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
