import { mkdirSync } from 'fs'
import { sleep, retry } from './_get.js'
import { history } from './_helper.js'

// console.log(skip)

// await new Promise((resolve) => {
//   // return resolve('fdasf')
// })
//   .then((res) => {
//     console.log('res1')
//     console.log(res)
//     return 'e'
//   })
//   .then((res) => {
//     console.log('res2')
//     console.log(re3s)
//   })
//   .catch((e) => {
//     console.log('e===', e)
//   })

// let f = await Promise.all([null, Promise.resolve(undefined), null])
// f = f.filter((o) => o)
// console.log(f)

for (let i of [3, 3]) {
  const aa = 22
  console.log(aa)
  for (let i of [3, 3]) {
    const aa = 23
    console.log(aa)
    for (let i of [3, 3]) {
      const aa = 24
      console.log(aa)
    }
  }
}
