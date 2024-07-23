import {ok} from 'node:assert'
import {inspect} from 'node:util'
import {isatty} from 'node:tty'
import {
	fetchTrip,
	// fetchPosition,
	positions,
} from './index.js'

const resolveAfter = ms => new Promise(resolve => setTimeout(resolve, ms))

// You can obtain such an ID from Flix(bus) website or one of their invoices.
const RIDE_UUID = process.env.FLIX_TRIP_ID
ok(RIDE_UUID, 'missing/empty $FLIX_TRIP_ID')


console.log(inspect(
	await fetchTrip(RIDE_UUID),
	{depth: null, colors: isatty(process.stdout.fd)},
))

// console.log(await fetchPosition(RIDE_UUID))

for await (const pos of positions(RIDE_UUID)) {
	console.log(pos)
	await resolveAfter(3_000)
}
