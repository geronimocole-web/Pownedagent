import 'dotenv/config'
import { getUnscoredItems } from '@powned/database'
import { scoreBatch } from './scorer.js'

console.log('[cli] PowNed DNA Filter — Score alle niet-gescoorde items')

const items = await getUnscoredItems(200)
console.log(`[cli] ${items.length} items te scoren`)

if (items.length === 0) {
  console.log('[cli] Niets te doen — alle items zijn al gescoord')
  process.exit(0)
}

const { scored, errors } = await scoreBatch(items, 5)
console.log(`[cli] Klaar — ${scored} gescoord, ${errors} fouten`)
