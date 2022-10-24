import fs from 'fs'
import { product, downloader } from './_get.js'
import { table } from './_readme.js'
import list from '../conf.js'

const update = [...new Set(list)]
const all = JSON.parse(fs.readFileSync('box.json').toString())
const box = all.filter((item) => update.includes(item.box))

fs.mkdir('output', async (err) => {
  if (err) {
    return
  }

  for (let item of box) {
    const disk = await product(item.homepage)
    for (let download of disk) {
      for (let target of download.link) {
        const { error, files } = await downloader(target.href)
        error.forEach((err) =>
          console.log(`error: ${box} ${target.href} ${err}`)
        )
        target.info = error.length ? [] : files
      }
    }
    item.disk = disk
  }

  fs.writeFile('output/1024.json', JSON.stringify(box), () => {})

  // getData().then((res) => {
  //   const txt = table(res)
  //   fs.writeFile('output/all_.json', JSON.stringify(res), () => {})
  //   fs.writeFile('output/README.md', txt, () => {})
  // })
})
