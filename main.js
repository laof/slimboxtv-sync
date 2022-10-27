import { fetch, onlyone } from './src/slimboxtv.js'
import { update, box, opts } from './src/helper.js'

console.log(opts)
async function run() {
  if (opts.name) {
    const exists = box.find((o) => o.box == opts.name)
    if (exists) await onlyone(box, opts.name)
    return update(box)
  }

  await fetch(box, opts)
  update(box)
}

try {
  await run()
} catch (e) {
  console.log('job failed!!!')
  console.log(e)
}
