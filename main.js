import { updateInfo, onlyone } from './src/info.js'
import { update, box, opts } from './src/helper.js'

console.log(opts)
async function run() {
  if (opts.name) {
    await onlyone(box, opts.name)
  } else {
    await updateInfo(box, opts)
  }
  update(box)
}

try {
  await run()
} catch (e) {
  console.log('job failed!!!')
  console.log(e)
}
