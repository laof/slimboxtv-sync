import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'

import { box } from '../conf/index.js'
export * from '../conf/index.js'

const { readme, daily, history, template } = _init()

export function bootstrap() {
  const jsf = jsonfile()
  const arr = box.filter((item) => !jsf.find((o) => o.box == item.box))
  return { history: jsf, box: arr }
}

export function jsonfile() {
  if (existsSync(history)) {
    const data = readFileSync(history, 'utf-8')
    return JSON.parse(data)
  }
  return []
}

export function update(data) {
  writeFileSync(readme, table(data))
  writeFileSync(daily, JSON.stringify(data))
}

export function table(list) {
  const arr = []

  list.forEach((data) => {
    let item = [
      `<tr><th colspan="4">${data.box}  (更新于${localTime()})</th></tr>`,
      `<tr><th>型号</th><th>文件</th><th>大小</th><th>发布日期</th></tr>`
    ]

    for (let typeObj of data.disk) {
      const { type } = typeObj
      for (let files of typeObj.link) {
        for (let file of files.files) {
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

  const temp = readFileSync(template, 'utf-8')
  return temp.replace('<!--files_table-->', arr.join('<br/>'))
}

export function localTime() {
  return new Date().toLocaleString('zh-cn', {
    timeZone: 'Asia/Shanghai'
  })
}

function _init() {
  const d = new Date()
  const today = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('_')

  const output = 'output',
    _history = 'history',
    sep = '/',
    history = _history + sep + today + '.json',
    readme = output + sep + 'README.md',
    template = 'view/README.md',
    daily = output + sep + _history

  if (!existsSync(output)) {
    mkdirSync(output)
    mkdirSync(output + sep + _history)
  }

  return {
    template,
    readme,
    output,
    history,
    daily
  }
}
