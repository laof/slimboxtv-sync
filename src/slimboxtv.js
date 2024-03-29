import puppeteer from 'puppeteer'

function expire(time) {
  if (!time) return true
  try {
    const n = new Date().getTime() - time
    return n / (1000 * 60 * 60) > 24 * 2 // 2 days
  } catch (e) {
    return true
  }
}

export async function fetch(box, opts) {
  let max = opts.total > box.length ? box.length : opts.total
  for (let [i, item] of box.entries()) {
    if (i >= max) break
    const title = `[${++i}/${max}]  ${item.box}`
    await homepage(title, item)
  }
}

export async function onlyone(box, name) {
  for (let item of box) {
    if (name === item.box) {
      const title = `[1/1]  ${item.box}`
      await homepage(title, item)
    }
  }
}

export async function homepage(title, item) {
  console.log(title, item.homepage)

  // await sleep(3)
  const { error, list } = await product(item.homepage)

  error.forEach((err) => console.log('[error]', err))

  const info = {
    category: 0,
    files: 0,
    homepageError: error.length,
    downloaderError: 0
  }

  for (const category of list) {
    info.category += 1
    for (const target of category.link) {
      console.log(title, `Disk ${target.href}`)
      // await sleep(3)
      const { error, files } = await downloader(target.href)
      error.forEach((err) => console.log('[error]', err))

      if (files.length) {
        target.files = files
        // 1666695142524
        item.latestUpdate = new Date().getTime()
      } else {
        target.files = []
      }

      info.files += files.length
      info.downloaderError += error.length
    }
  }

  if (info.files) {
    item.disk = list
  }

  const view = [
    `Category: ${info.category} Files: ${info.files}`,
    `Disk error: ${info.downloaderError} Homepage error: ${info.homepageError}`
  ]

  console.log(view.join('\n'))
}

export function sleep(ms = 1) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms * 1000))
}

export async function retry(max, cb) {
  let i = 0
  while (i < max) {
    if (await cb(i)) return
    i += 1
  }
}

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
  const box = await page.evaluate(async () => {
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
  return box
}

/**
 *
 * @param {*} arr [{box:'Vontar X2', img:'https://slimboxtv.ru/vontar-x2-800x445.jpg', homepage:'https://slimboxtv.ru/vontar-x2/'}]
 */
export async function product(url) {
  const { page, browser } = await createBrowserContext()

  /** product info page  */
  // await page.setDefaultNavigationTimeout(0)

  await page.goto(url)

  try {
    await page.waitForSelector('.su-tabs-pane-open li') //download target
  } catch (err) {
    try {
      await browser.close()
    } catch (e) {}

    return { error: [err], list: [] }
  }

  /** [{type:'Lan 1000',link:[{href:"http://disk.yandex.ru/x", name:'AOSP'}]}] */
  const data = await page.evaluate(async () => {
    const obj = { error: [], list: [] }
    const category = document.querySelectorAll('.has-text-align-center')

    if (category.length) {
      Array.from(category).forEach((dom) => {
        const link = []
        const title = dom.querySelector('strong')

        if (!title) {
          obj.error.push(`category not found strong`)
          return obj
        }

        const li = dom.nextElementSibling.querySelectorAll(
          '.su-tabs-pane-open li'
        )

        if (!li.length) {
          obj.error.push(`category not found .su-tabs-pane-open li`)
          return obj
        }

        Array.from(li).forEach((dom) => {
          const a = dom.querySelector('a')
          if (a) {
            link.push({ href: a.href, name: a.innerHTML })
          } else {
            obj.error.push(`category not found download target`)
          }
        })

        if (link.length) {
          obj.list.push({ type: title.innerHTML, link })
        }
      })
    } else {
      /** only one download link */
      const a = document.querySelector('.su-tabs-pane-open li a')

      if (a) {
        obj.list.push({
          type: '',
          link: [{ href: a.href, name: a.innerHTML }]
        })
      } else {
        obj.error.push(`only-one not found download target`)
      }
    }

    return obj
  })

  await browser.close()

  return data
}

export async function downloader(diskLink) {
  const { page, browser } = await createBrowserContext()
  await page.goto(diskLink) // http://disk.yandex.ru/x

  // await page.setDefaultNavigationTimeout(30000)
  // await page.waitForNavigation({ timeout: 1000 * 10 })

  try {
    await page.waitForSelector('#store-prefetch') //json data
  } catch (err) {
    try {
      await browser.close()
    } catch (e) {}

    return { error: [err], files: [] }
  }

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
        let body = ''

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
      return new Promise((resolve) => {
        const payload = item.payload
        Reflect.deleteProperty(item, 'payload')
        const timer = setTimeout(() => resolve(null), 5 * 1000)

        fetch('https://disk.yandex.ru/public/api/download-url', {
          method: 'post',
          body: payload
        })
          .then((res) => res.json())
          .then((res) => {
            clearTimeout(timer)
            const url = res.data.url
            resolve(Object.assign(item, { url }))
          })
          .catch((e) => {
            clearTimeout(timer)
            obj.error.push(`${item.id} fetch download url`)
            resolve(null)
          })
      })
    })

    if (obj.error.length) {
      obj.files = []
    } else {
      // [{name:"x96_x4.7z",url:https://downloader.disk.yandex.ru/disk/a57}]
      const f = await Promise.all(loader)
      obj.files = f.filter((o) => o)
    }

    return obj
  })

  await browser.close()

  return fs
}
