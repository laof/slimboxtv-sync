import fs from 'fs'
import { getData } from '../all.js'
import { create } from './readme.js'

var jsonData = JSON.parse(fs.readFileSync('all_.json').toString())
create(jsonData)

// console.log(JSON.parse(ccc.toString()))

// getData().then((res) => {
//   console.log(res)
//   fs.writeFile('all_.json', JSON.stringify(res), () => {})
// })

// fs.writeFile('output/data.json', JSON.stringify(res), () => {})
