import fs from 'fs'

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

  const view = fs.readFileSync('view/README.md', 'utf-8')
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

  const view = fs.readFileSync('view/README.md', 'utf-8')
  const readme = view.replace('<!--files_table-->', temp.join('\n\n'))
  return readme
}
