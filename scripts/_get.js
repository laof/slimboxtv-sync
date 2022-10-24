import puppeteer from 'puppeteer'

export async function createBrowserContext() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()

  return { browser, page }
}

export async function slimboxtv() {
  const { browser, page } = await createBrowserContext()
  await page.goto('https://slimboxtv.ru')
  const boxs = await page.evaluate(async () => {
    const article = document.querySelectorAll('.article-container article')
    return Array.from(article).reduce((arr, dom) => {
      const tv = dom.querySelectorAll('li').length
      if (tv) {
        const box = dom.querySelector('.entry-title a').innerHTML
        const img = dom.querySelector('.featured-image img').src
        const homepage = dom.querySelector('.more-link').href
        arr.push({ box, img, homepage })
      }
      return arr
    }, [])
  })
  await browser.close()
  return boxs
}

/**
 *
 * @param {*} arr [{box:'Vontar X2', img:'https://slimboxtv.ru/vontar-x2-800x445.jpg', homepage:'https://slimboxtv.ru/vontar-x2/'}]
 */
export async function product(url) {
  const { page, browser } = await createBrowserContext()

  /** product info page */
  // await page.setDefaultNavigationTimeout(0)

  await page.goto(url)

  /** [{type:'Lan 1000',link:[{href:"http://disk.yandex.ru/x", name:'AOSP'}]}] */
  const disk = await page.evaluate(async () => {
    const list = []
    const category = document.querySelectorAll('.has-text-align-center')

    if (category.length) {
      Array.from(category).forEach((dom) => {
        var title = dom.querySelector('strong')

        if (!title) {
          console.log(`[product] ${url} not found strong`)
          return
        }

        const link = []
        const li = dom.nextElementSibling.querySelectorAll(
          '.su-tabs-pane-open li'
        )

        if (!li.length) {
          console.log(`[product] ${url} not found .su-tabs-pane-open li`)
          return
        }

        Array.from(li).forEach((dom) => {
          const a = dom.querySelector('a')

          if (a) {
            link.push({ href: a.href, name: a.innerHTML })
          } else {
            console.log(`[product] ${url} not found download link`)
          }
        })

        if (link.length) {
          list.push({ type: title.innerHTML, link })
        }
      })
    } else {
      /** only one download link */
      const a = document.querySelector('.su-tabs-pane-open li a')

      if (a) {
        list.push({
          type: '',
          link: [{ href: a.href, name: a.innerHTML }]
        })
      } else {
        console.log(`[product] ${url} not found download target`)
      }
    }

    return list
  })

  await browser.close()

  return disk
}

export async function downloader(url) {
  const { page, browser } = await createBrowserContext()
  await page.goto(url) // http://disk.yandex.ru/x
  await page.waitForSelector('#store-prefetch') //json data

  const fs = await page.evaluate(async () => {
    let data, resource
    const obj = { error: [], files: [] }

    try {
      data = JSON.parse(document.getElementById('store-prefetch').innerHTML)
    } catch (e) {
      return obj.error.push('parse json data'), obj
    }

    try {
      resource = data.resources[data.rootResourceId].children
    } catch (e) {
      return obj.error.push('parse resource'), obj
    }

    const filename = resource.reduce((arr, id) => {
      let item
      try {
        item = data.resources[id]
      } catch (e) {
        return obj.error.push(`${id} parse json data`), arr
      }

      if (item.type == 'file') {
        const body = ''

        try {
          body = JSON.stringify({
            hash: item.path,
            sk: data.environment.sk
          })
        } catch (e) {
          return obj.error.push(`${id} set payload`), arr
        }

        const date = Number(item.modified + '000')
        arr.push({
          id,
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

    const loader = filename.map((item) => {
      const payload = item.payload
      Reflect.deleteProperty(item, 'payload')
      return new Promise((resolve) => {
        try {
          fetch('https://disk.yandex.ru/public/api/download-url', {
            method: 'post',
            body: payload
          })
            .then((res) => res.json())
            .then((res) => {
              let url = ''
              try {
                url = res.data.url
              } catch (e) {
                obj.error.push(`${item.id} res.data.url`)
                return resolve(null)
              }
              return resolve(Object.assign(item, { url }))
            })
        } catch (e) {
          obj.error.push(`${item.id} fetch download url`)
          resolve(null)
        }
      })
    })

    // [{name:"x96_x4.7z",size,modified,url:https://downloader.disk.yandex.ru/disk/a57}]
    const files = await Promise.all(loader)

    if (!obj.error.length) {
      obj.files = files
    }

    return obj
  })

  await browser.close()

  return fs
}

export async function getData() {
  const { page, browser } = await createBrowserContext()

  const m2 = [
    {
      box: 'Vontar X2',
      img: 'https://slimboxtv.ru/wp-content/uploads/2022/08/vontar-x2-800x445.jpg',
      homepage: 'https://slimboxtv.ru/vontar-x2/'
    }
  ]

  for (let item of m2) {
    console.log(`[${item.box}] (${item.homepage})`)
    /** product info page */
    // await page.setDefaultNavigationTimeout(0)

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
        console.log(`[${item.box}] => ${target.href}`)
        await page.setDefaultNavigationTimeout(0)
        await page.goto(target.href) // http://disk.yandex.ru/x
        await page.waitForSelector('#store-prefetch')

        // [{name:"sbx_x96_x4_pro_1000mb_aosp_16_4_6",size:1564242,,modified,payload,url:https://downloader.disk.yandex.ru/disk/a57}]
        const info = await page.evaluate(async () => {
          let data

          try {
            data = JSON.parse(
              document.getElementById('store-prefetch').innerHTML
            )
          } catch (e) {
            return Promise.resolve([])
          }

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

          const files = list.map((item) => {
            return new Promise((resolve) => {
              try {
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
                    return resolve(Object.assign(item, { url }))
                  })
              } catch (e) {
                resolve(Object.assign(item, { url: 'error' }))
              }
            })
          })

          return Promise.all(files)
        })

        target.info = info
      }
    }
  }

  await browser.close()

  return m2
}
