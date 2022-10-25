import { get } from './_get.js'
import { update, bootstrap, box } from './_helper.js'

const { history } = bootstrap()

const list = []

try {
  await get([box[0]])
} catch (e) {
  console.log('job failed!!!')
  console.log(e)
}

;[box[0]].forEach((item) => {
  try {
    const uri = item.disk[0].link[0].files[0].url
    if (uri.startsWith('https://')) {
      list.push(item)
    }
  } catch (e) {
    console.log('update failed:' + item.box)
    console.log(e)
  }
})

// const data = history.concat(...list)
// console.log(list)
update(list)
