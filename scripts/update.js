import fs from 'fs'
import { getData } from '../main.js'
const today = new Date().toLocaleString('zh-cn', { timeZone: 'Asia/Shanghai' })

let table = [
  '文件每天与官网同步，当前更新于 ' + today,
  '| 文件名 | 大小 | 发布日期 |',
  '| ---- | ---- | ---- |'
]

fs.mkdir('output', (err) => {
  if (err) {
    return
  }

  getData().then((res) => {
    res.forEach((file) => {
      const { name, url, size, modified } = file
      const mb = (size / 1024 / 1024).toFixed(2) + 'M'
      table.push(` | [${name}](https://laof.github.io/x96x4/#${url}) | ${mb} | ${modified} |`)
    })

    const view = fs.readFileSync('content/view.md', 'utf-8')
    const readme = view.replace('<!--files_table-->', table.join('\n'))

    fs.writeFile('output/data.json', JSON.stringify(res), () => {})
    fs.writeFile('output/README.md', readme, () => {})
  })
})
