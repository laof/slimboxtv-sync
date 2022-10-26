import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'

import { box } from '../conf/index.js'
export * from '../conf/index.js'

export const dev = process.argv[2] != '--prod'

const jsonfile = 'conf/data.json'

export function bootstrap() {
  const jsf = cache()
  const arr = box.filter((item) => !jsf.find((o) => o.box == item.box))
  return { history: jsf, box: arr }
}

export function cache() {
  if (existsSync(jsonfile)) {
    const data = readFileSync(jsonfile, 'utf-8')
    return JSON.parse(data)
  }
  return []
}

export function update(data) {
  data.sort((a, b) => b.latestUpdate - a.latestUpdate)
  writeFileSync('output/README.md', table(data))
  writeFileSync('output/' + jsonfile, JSON.stringify(data))
}

export function table(list) {
  const arr = []

  list.forEach((data) => {
    if (!data.disk || !data.disk.length) {
      return
    }

    let ref = '--'
    if (data.latestUpdate) {
      // const sh = shanghaiTimeZone(new Date(data.latestUpdate))
      ref = formatShanghai(new Date(data.latestUpdate))
    }

    let item = [
      `<tr><th colspan="4">${data.box}  (同步于 ${ref})</th></tr>`,
      `<tr><th>型号</th><th>文件</th><th>大小</th><th>发布日期</th></tr>`
    ]

    for (let category of data.disk) {
      const { type } = category
      for (let link of category.link) {
        for (let file of link.files) {
          const { name, url, size, modified } = file
          const mb = (size / 1024 / 1024).toFixed(2) + 'M'

          item.push(
            [
              `<tr><td>${type}</td>`,
              `<td><a href="https://laof.github.io/x96x4/#${url}">${name}</a></td>`,
              `<td>${mb}</td>`,
              `<td>${modified}</td></tr>`
            ].join('')
          )
        }
      }
    }

    arr.push(`<table>${item.join('')}</table>`)
  })

  if (!list.length) {
    arr.push('Oh~ Sorry, Job Failed.')
  }

  let temp = readFileSync('view/README.md', 'utf-8')
  temp = temp.replace('<!--last_date-->', formatShanghai())
  temp = temp.replace('<!--files_table-->', arr.join('<br/>'))
  return temp
}

export function formatShanghai(date = new Date()) {
  return date.toLocaleString('zh-cn', {
    timeZone: 'Asia/Shanghai'
  })
}

export function shanghaiTimeZone(date = new Date()) {
  if (dev) {
    return new Date(date)
  }
  const currTimestamp = date.getTime()
  const targetTimestamp = currTimestamp + 8 * 3600 * 1000
  return new Date(targetTimestamp)
}

export function fixTimezoneOffset(time = new Date()) {
  const date = new Date(time)
  date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
  return date
}

if (!existsSync('output')) {
  mkdirSync('output')
  mkdirSync('output/conf')
}
