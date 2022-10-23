import fs from 'fs'

export function createREADME(list) {
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
