import {ok, equal} from 'node:assert/strict'
import test from 'node:test'
import {
	fetchTrip,
	fetchPosition,
	positions,
} from '../index.js'

// You can obtain such an ID from Flix(bus) website or one of their invoices.
const RIDE_UUID = process.env.FLIX_TRIP_ID
ok(RIDE_UUID, 'missing/empty $FLIX_TRIP_ID')

const validatePosition = (pos, n = 'pos') => {
	ok(pos.ride_uuid, `missing/empty ${n}.ride_uuid`)
	ok(pos.to_stop_uuid, `missing/empty ${n}.to_stop_uuid`)
	// `bus`, …
	ok(pos.vehicle_type, `missing/empty ${n}.vehicle_type`)
	ok(Number.isFinite(pos.coordinates.longitude), `${n}.coordinates.longitude must be an integer`)
	ok(Number.isFinite(pos.coordinates.latitude), `${n}.coordinates.latitude must be an integer`)
	equal(typeof pos.stale, 'boolean', `${n}.stale must be a boolean`)
	equal(typeof pos.above_quality_threshold, 'boolean', `${n}.above_quality_threshold must be a boolean`)
}

test('fetchTrip() seems to work', async (t) => {
	const trip = await fetchTrip(RIDE_UUID)

	ok(trip.ride_uuid, 'missing/empty trip.ride_uuid')
	ok(trip.from_stop_uuid, 'missing/empty trip.from_stop_uuid')
	ok(trip.to_stop_uuid, 'missing/empty trip.to_stop_uuid')
	ok(trip.status, 'missing/empty trip.status')
	ok(trip.brand_name, 'missing/empty trip.brand_name')
	ok(Number.isInteger(trip.trip_number), 'trip.trip_number must be an integer')

	ok(Array.isArray(trip.stops), 'trip.stops must be an array')
	ok(trip.stops.length > 0, 'trip.stops must not be empty')
	for (let i = 0; i < trip.stops.length; i++) {
		const stopover = trip.stops[i]
		const n = `trip.stops[${i}]`

		ok(Number.isInteger(stopover.stop_sequence), `${n}.stop_sequence must be an integer`)
		ok(stopover.stop_uuid, `missing/empty ${n}.stop_uuid`)

		ok(stopover.departure || stopover.arrival, `${n} must have .departure or .arrival`)
		for (const kind in ['departure', 'arrival']) {
			if (!stopover[kind]) continue
			const _n = `n[${kind}]`

			// `ESTIMATED`, …
			ok(stopover.arrival.deviation_type, `missing/empty ${_n}.arrival.deviation_type`)
			// `NO_DELAY`, …
			ok(stopover.arrival.deviation_class, `missing/empty ${_n}.arrival.deviation_class`)
			// todo: can it be null?
			ok(Number.isInteger(stopover[kind].deviation_seconds), `${_n}.deviation_seconds must be an integer`)
			ok(Number.isInteger(stopover[kind].updated), `${_n}.updated must be an integer`)
		}
	}
})

test('fetchPosition() seems to work', async (t) => {
	const pos = await fetchPosition(RIDE_UUID)
	validatePosition(pos)
})

test('positions() seems to work', async (t) => {
	let i = 0
	for await (const pos of positions(RIDE_UUID)) {
		validatePosition(pos, `positions[${i++}]`)

		if (i >= 2) break
		await new Promise(resolve => setTimeout(resolve, 3_000))
	}
})
