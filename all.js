import puppeteer from 'puppeteer'
import fs from 'fs'

var jsonData = fs.readFileSync('conf.json')

export async function getData() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  // await page.goto('https://slimboxtv.ru')

  // // [{ box, img, homepage }....]
  // const products = await page.evaluate(async () => {
  //   const article = document.querySelectorAll('.article-container article')
  //   return Array.from(article).reduce((arr, dom) => {
  //     const tv = dom.querySelectorAll('li').length
  //     if (tv) {
  //       const box = dom.querySelector('.entry-title a').innerHTML
  //       const img = dom.querySelector('.featured-image img').src
  //       const homepage = dom.querySelector('.more-link').href
  //       arr.push({ box, img, homepage })
  //     }
  //     return arr
  //   }, [])
  // })

  // console.log(`found product:` + products.length)

  const m2 = JSON.parse(jsonData.toString()) || [
    {
      box: 'Vontar X2',
      img: 'https://slimboxtv.ru/wp-content/uploads/2022/08/vontar-x2-800x445.jpg',
      homepage: 'https://slimboxtv.ru/vontar-x2/'
    }
  ]

  for (let item of m2) {
    console.log('goto ' + `: ${item.box} homepage ${item.homepage}`)
    /** product info page */
    await page.goto(item.homepage)

    /** [{type:'Lan 1000',links:[{href:"http://disk.yandex.ru/x", name:'AOSP'}]}] */
    const downlink = await page.evaluate(async () => {
      const list = []
      const typeName = document.querySelectorAll('.has-text-align-center')

      if (typeName.length) {
        Array.from(typeName).forEach((dom) => {
          var type = dom.querySelector('strong').innerHTML

          const links = []
          const li = dom.nextElementSibling.querySelectorAll(
            '.su-tabs-pane-open li'
          )

          Array.from(li).forEach((dom) => {
            const a = dom.querySelector('a')
            links.push({ href: a.href, name: a.innerHTML })
          })

          list.push({ type, links })
        })
      } else {
        /** only one download link */
        const a = document.querySelector('.su-tabs-pane-open li a')
        list.push({
          type: '',
          links: [{ href: a.href, name: a.innerHTML }]
        })
      }

      return list
    })

    item.disk = downlink

    for (let file of downlink) {
      for (let target of file.links) {
        console.log('goto:disk.yandex.ru pan= > ', target.href)
        await page.goto(target.href) // http://disk.yandex.ru/x

        // [{name:"sbx_x96_x4_pro_1000mb_aosp_16_4_6",size:1564242,,modified,payload,url:https://downloader.disk.yandex.ru/disk/a57}]
        const info = await page.evaluate(async () => {
          const data = JSON.parse(
            document.getElementById('store-prefetch').innerHTML
          )
          const idArr = data.resources[data.rootResourceId].children

          const list = idArr.reduce((arr, id) => {
            const item = data.resources[id]
            if (item.type == 'file') {
              const body = JSON.stringify({
                hash: item.path,
                sk: data.environment.sk
              })
              const date = Number(item.modified + '000')
              arr.push({
                name: item.name,
                size: item.meta.size,
                payload: encodeURIComponent(body),
                modified: new Date(date).toLocaleString('Zh', {
                  timeZone: 'Asia/Shanghai'
                })
              })
            }
            return arr
          }, [])

          const files = list.map((item) =>
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
          )

          return Promise.all(files)
        })

        target.info = info
      }
    }
  }

  await browser.close()

  return m2
}
