import fs from 'fs'
import { getData } from '../all.js'
const today = new Date().toLocaleString('zh-cn', { timeZone: 'Asia/Shanghai' })

let table = [
  '当前同步于 ' + today,
  '| 文件名 | 大小 | 发布日期 |',
  '| ---- | ---- | ---- |'
]

fs.mkdir('output', (err) => {
  if (err) {
    return
  }

  getData().then((res) => {
    fs.writeFile('output/all_.json', JSON.stringify(res), () => {})
  })
})

// getData().then((res) => {
//   fs.writeFile('all_.json', JSON.stringify(res), () => {})
// })
