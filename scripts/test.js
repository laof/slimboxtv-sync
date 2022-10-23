import fs from 'fs'
import { getData } from '../all.js'
import { md, table } from './_readme.js'

var jsonData = JSON.parse(fs.readFileSync('all_.json').toString())

fs.writeFile('README.md', table(jsonData), () => {})

// console.log(JSON.parse(ccc.toString()))

// getData().then((res) => {
//   console.log(res)
//   fs.writeFile('all_.json', JSON.stringify(res), () => {})
// })

// fs.writeFile('output/data.json', JSON.stringify(res), () => {})
