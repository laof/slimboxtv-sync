import { updateInfo } from './src/info.js'
import { update, box, opts } from './src/helper.js'

console.log(opts)
async function run() {
  await updateInfo(box)
  update(box)
}

try {
  await run()
} catch (e) {
  console.log('job failed!!!')
  console.log(e)
}
