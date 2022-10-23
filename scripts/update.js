import fs from 'fs'
import { getData } from '../main.js'
import { create } from './readme.js'

fs.mkdir('output', (err) => {
  if (err) {
    return
  }

  getData().then((res) => {
    const txt = create(res)
    fs.writeFile('output/all_.json', JSON.stringify(res), () => {})
    fs.writeFile('output/README.md', txt, () => {})
  })
})
