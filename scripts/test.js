import fs from 'fs'
import { getData, sleep, retry } from './_get.js'
import { md, table } from './_readme.js'

async function aaa() {
  const abc = { name: 22 }
  await retry(3, async (n) => {
    await sleep(2)
    abc['aa' + n] = n
    console.log(n, new Date().toLocaleString('zh'))
    return false
  })

  console.log(abc)
}

aaa()

var jsonData = JSON.parse(fs.readFileSync('all_.json').toString())

// fs.writeFile('README.md', table(jsonData), () => {})

// console.log(JSON.parse(ccc.toString()))

// getData().then((res) => {
//   console.log(res)
//   fs.writeFile('all_.json', JSON.stringify(res), () => {})
// })

// fs.writeFile('output/data.json', JSON.stringify(res), () => {})
