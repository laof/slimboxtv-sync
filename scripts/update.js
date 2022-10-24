import fs from 'fs'
import { product, downloader, retry, sleep } from './_get.js'
import { table } from './_readme.js'
import list from '../conf.js'

const update = [...new Set(list)]
const all = JSON.parse(fs.readFileSync('box.json').toString())
const box = all.filter((item) => update.includes(item.box))

fs.mkdir('output', async (err) => {
  if (err) {
    return
  }

  for (const item of box) {
    console.log(item.box, item.homepage)
    const disk = await product(item.homepage)
    for (const download of disk) {
      for (const target of download.link) {
        await sleep(3)
        await retry(3, async (i) => {
          const log = `downloader retry ${i}: ${item.box} ${target.href}`
          console.log(log)
          const { error, files } = await downloader(target.href)
          error.forEach((err) => console.log(log + ' error:' + err))
          target.info = error.length ? [] : files
          return error.length
        })
      }
    }
    item.disk = disk
  }

  fs.writeFile('output/10241.json', JSON.stringify(box), () => {})

  // getData().then((res) => {
  //   const txt = table(res)
  //   fs.writeFile('output/all_.json', JSON.stringify(res), () => {})
  //   fs.writeFile('output/README.md', txt, () => {})
  // })
})
