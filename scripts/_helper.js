import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'

import { box } from '../conf/index.js'
export * from '../conf/index.js'

const output = 'output'
const hidr = 'history'
const today = hidr + '/' + current() + '.json'

if (!existsSync(output)) {
  mkdirSync(output)
}

export function update() {
  const list = history()
  const newbox = box.filter((item) => !list.find((obj) => obj.box == item.box))
  return { history: list, box: newbox }
}

export function history() {
  if (existsSync(today)) {
    try {
      const data = readFileSync(today, 'utf-8')
      return JSON.parse(data)
    } catch (e) {
      return []
    }
  }
  writeFileSync(f, '')
  return []
}

export function current() {
  const date = new Date()
  const arr = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  return arr.join('_')
}

export function readme(data) {
  writeFileSync('output/README.md', table(data))
  mkdirSync(output + '/' + hidr)
  writeFileSync(output + '/' + today, JSON.stringify(data))
}

export function local(data) {
  writeFileSync('output/local.md', table(data))
}

export function table(list) {
  const today = new Date().toLocaleString('zh-cn', {
    timeZone: 'Asia/Shanghai'
  })

  const temp = ['更新于 ' + today]

  list.forEach((data) => {
    let item = [
      `<tr><th colspan="4">${data.box}</th></tr>`,
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

    temp.push(`<table>${item.join('')}</table>`)
  })

  if (!list.length) {
    temp.push('Oh~ Sorry, Job Failed.')
  }

  const view = readFileSync('view/README.md', 'utf-8')
  const readme = view.replace('<!--files_table-->', temp.join('<br/>'))
  return readme
}

export function md(list) {
  const today = new Date().toLocaleString('zh-cn', {
    timeZone: 'Asia/Shanghai'
  })

  const temp = ['更新于 ' + today, '---']

  list.forEach((data) => {
    let item = [
      `<img src="${data.img}" width='20%'>\n`,
      `| [${data.box}](${data.homepage}) | 大小 | 发布日期 |`,
      '| ---- | ---- | ---- |'
    ]

    for (let typeObj of data.disk) {
      const { type } = typeObj
      for (let files of typeObj.links) {
        for (let file of files.info) {
          const { name, url, size, modified } = file
          const mb = (size / 1024 / 1024).toFixed(2) + 'M'

          item.push(
            `| [${name} ${type}](https://laof.github.io/x96x4/#${url}) | ${mb} | ${modified} |`
          )
        }
      }
    }

    temp.push(item.join('\n'))
  })

  const view = readFileSync('view/README.md', 'utf-8')
  const readme = view.replace('<!--files_table-->', temp.join('\n\n'))
  return readme
}
