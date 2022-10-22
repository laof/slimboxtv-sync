import fs from 'fs'
import { getData } from '../main.js'
function today() {
  const date = new Date()
  const Y = date.getFullYear() + '-'
  const M = date.getMonth() + 1 + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()
  return Y + M + D + h + m + s
}

let table = [
  today(),
  '| 文件名 | 大小 | 發佈日期 |',
  '| ---- | ---- | ---- |'
]

fs.mkdir('output', (err) => {
  if (err) {
    return
  }

  getData().then((res) => {
    res.forEach((file) => {
      const { name, url, size, modified } = file
      table.push(` | [${name}](${url}) | ${size} | ${modified} |`)
    })

    const view = fs.readFileSync('content/view.md', 'utf-8')
    const readme = view.replace('<!--files_table-->', table.join('\n'))

    fs.writeFile('output/data.json', JSON.stringify(res), () => {})
    fs.writeFile('output/README.md', readme, () => {})
  })
})
