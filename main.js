import fs from 'fs'
import puppeteer from 'puppeteer'

const download = 'https://disk.yandex.ru/public/api/download-url'
// palyload:
// %7B%22hash%22%3A%22X7RmxaQDlo32xE7MgGwez%2F250YHfgd2XGtuj4kLZA%2Fq0ro%2B8lE56dyOEu6s%2Bccl%2Fq%2FJ6bpmRyOJonT3VoXnDag%3D%3D%3A%2Fsbx_x96_x4_pro_1000mb_aosp_16_4_6.7z%22%2C%22sk%22%3A%22y4195f637758b945d7772d98905f1af1b%22%7D

const cc = {
  hash: 'X7RmxaQDlo32xE7MgGwez/250YHfgd2XGtuj4kLZA/q0ro+8lE56dyOEu6s+ccl/q/J6bpmRyOJonT3VoXnDag==:/sbx_x96_x4_pro_1000mb_aosp_16_4_6.7z',
  sk: 'y4195f637758b945d7772d98905f1af1b'
}

async function getData() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto('https://disk.yandex.ru/d/VH3yKBEWBc1xyg')

  // Extract the results from the page.
  const links = await page.evaluate(async () => {
    const data = JSON.parse(document.getElementById('store-prefetch').innerHTML)
    const idArr = data.resources[data.rootResourceId].children

    const getDate = (d) => {
      const date = new Date(d)
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    }

    const list = idArr.reduce((arr, id) => {
      const item = data.resources[id]
      if (item.type == 'file') {
        const body = JSON.stringify({
          hash: item.path,
          sk: data.environment.sk
        })
        arr.push({
          name: item.name,
          size: item.meta.size,
          payload: encodeURIComponent(body),
          modified: getDate(Number(item.modified + '000'))
        })
      }
      return arr
    }, [])

    const files = list.map(
      (item) =>
        fetch('https://disk.yandex.ru/public/api/download-url', {
          method: 'post',
          body: item.payload
        })
          .then((res) => res.json())
          .then((res) => {
            let url = ''
            try {
              url = res.data.url
            } catch (e) {}
            return Object.assign(item, { url })
          })
      // .then((file) => {
      //   return file

      //   if (file.url) {
      //     return fetch(file.url).then((res) =>
      //       Object.assign(file, { download: res.headers })
      //     )
      //   }
      //   return Promise.resolve(file)
      // })
    )

    return Promise.all(files)
  })

  await browser.close()

  return links
}

const url =
  'https://downloader.disk.yandex.ru/disk/35684361fe4fcd8045e7ae9f9ef43b8358b27b97fe2ae06a7d178b202a8d5b3a/6353e2b3/Arlo4ikbYaCSRCfmCwxQEWG7oCVBTRMUPqKBChuzih1mSJ-ITMr4s9ZlPJSFUMKAPE_jKCkuxrBxAsvQccy56A%3D%3D?uid=0&filename=sbx_x96_x4_pro_1000mb_aosp_16_4_6.7z&disposition=attachment&hash=X7RmxaQDlo32xE7MgGwez/250YHfgd2XGtuj4kLZA/q0ro%2B8lE56dyOEu6s%2Bccl/q/J6bpmRyOJonT3VoXnDag%3D%3D%3A/sbx_x96_x4_pro_1000mb_aosp_16_4_6.7z&limit=0&content_type=application%2Fx-7z-compressed&owner_uid=40520828&fsize=755127679&hid=732dfaae3bd762b88c242ed7e4a300b4&media_type=compressed&tknv=v2'

async function origin() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(new URL(url).origin)

  // Extract the results from the page.
  const links = await page.evaluate(async (download) => {
    return fetch(download).then((res) => res.url)
  }, url)

  await browser.close()

  return links
}

// origin().then((res) => {
//   console.log(res)
// })

fs.mkdir('output', (err) => {
  getData().then((res) => {
    fs.writeFile('./output/data.json', JSON.stringify(res), () => {})
  })
})
