import fs from 'fs'
import { getData } from '../all.js'

getData().then((res) => {
  console.log(res)
  fs.writeFile('all_.json', JSON.stringify(res), () => {})
})
