import fs from 'fs'
import { getData } from '../all.js'

var ccc = fs.readFileSync('conf.json')

console.log(JSON.parse(ccc.toString()))

// getData().then((res) => {
//   console.log(res)
//   fs.writeFile('all_.json', JSON.stringify(res), () => {})
// })
