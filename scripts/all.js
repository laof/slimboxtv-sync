import fs from 'fs'
import { getData } from '../all.js'
import { createREADME } from './_readme.js'

fs.mkdir('output', (err) => {
  if (err) {
    return
  }

  getData().then((res) => {
    const txt = createREADME(res)
    fs.writeFile('output/all_.json', JSON.stringify(res), () => {})
    fs.writeFile('output/README.md', txt, () => {})
  })
})
