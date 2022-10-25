import { get } from './_get.js'
import { shanghaiTimeZone } from './_helper.js'

const a = [{ 33: 33 }, 4, 45]

const ac = a.find((obj) => false )

console.log(ac)
