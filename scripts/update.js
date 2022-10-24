import { get } from './_get.js'
import { readme, update } from './_helper.js'

const { history, box } = update()

const now = await get(box)
const data = history.concat(...now)
readme(data)
