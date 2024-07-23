# live-flix-website-position

Periodically **fetch a vehicle's position from Flix(bus)'s website**.

[![npm version](https://img.shields.io/npm/v/live-flix-website-position.svg)](https://www.npmjs.com/package/live-flix-website-position)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/live-flix-website-position.svg)
![minimum Node.js version](https://img.shields.io/node/v/live-flix-website-position.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me via Matrix](https://img.shields.io/badge/chat%20with%20me-via%20Matrix-000000.svg)](https://matrix.to/#/@derhuerst:matrix.org)


## Installation

```shell
npm install live-flix-website-position
```


## Usage

The Flix(bus) live tracking APIs work with trip-unique (Flix calls a trip a "ride") IDs. You must obtain the ID of your trip from another data source, e.g. the Flix(bus) website or one of their invoices.

```js
const RIDE_UUID = '3d4d1d35-e72e-4fbf-b752-7268d12d0d4d'
```

### `fetchTrip(rideUuid)`

```js
import {fetchTrip} from 'live-flix-website-position'

console.log(await fetchTrip(RIDE_UUID))
```

```js
{
	ride_uuid: '3d4d0d35-e74e-4fbf-b982-7268d00d0d4d',
	from_stop_uuid: 'dcc29b84-9603-11e6-9066-549f350fcb0c',
	to_stop_uuid: 'dcc4b4bb-9603-11e6-9066-549f350fcb0c',
	status: 'IN_PROGRESS',
	brand_name: 'FlixBus',
	trip_number: 1,
	stops: [
		{
			stop_sequence: 1,
			stop_uuid: 'dcc29b84-9603-11e6-9066-549f350fcb0c',
			arrival: {
				deviation_seconds: 224,
				deviation_class: 'NO_DELAY',
				deviation_type: 'ACTUAL',
				updated: 1721723843,
			},
			departure: {
				deviation_seconds: 442,
				deviation_class: 'NO_DELAY',
				deviation_type: 'ACTUAL',
				updated: 1721723843,
			},
		},
		{
			stop_sequence: 2,
			stop_uuid: 'f4b3784f-933c-4811-bce5-bdd30dcdedc1',
			arrival: /* … */,
			departure: /* … */,
		},
		{
			stop_sequence: 3,
			stop_uuid: 'dcc4b4bb-9603-11e6-9066-549f350fcb0c',
			arrival: /* … */,
		},
	],
}
```

### `fetchPosition(rideUuid)`

`fetchPosition()` returns a geolocation with additional metadata.

```js
import {fetchPositions} from 'live-flix-website-position'

console.log(await fetchPositions(RIDE_UUID))
```

```js
{
	ride_uuid: '3d4d1d35-e72e-4fbf-b752-7268d12d0d4d',
	coordinates: {longitude: 17.295233, latitude: 43.205303},
	updated: 1721728665,
	above_quality_threshold: true,
	to_stop_uuid: 'dcc4b4bb-9603-11e6-9066-549f350fcb0c',
	vehicle_type: 'bus',
	stale: true,
}
```

### `positions(rideUuid)`

`positions()` returns an [async iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols), with each item having the same structure as `fetchPosition(rideUuid)`'s return value.

```js
import {positions} from 'live-flix-website-position'

const resolveAfter = ms => new Promise(resolve => setTimeout(resolve, ms))

let i = 0
for await (const pos of positions(RIDE_UUID)) {
	console.log(i++, pos)
	await resolveAfter(5_000) // 5 seconds
}
```

```js
0, {
	ride_uuid: '3d4d1d35-e72e-4fbf-b752-7268d12d0d4d',
	coordinates: {longitude: 17.295233, latitude: 43.205303},
	updated: 1721728665,
	above_quality_threshold: true,
	to_stop_uuid: 'dcc4b4bb-9603-11e6-9066-549f350fcb0c',
	vehicle_type: 'bus',
	stale: true,
}
1 {
	ride_uuid: '3d4d1d35-e72e-4fbf-b752-7268d12d0d4d',
	coordinates: {longitude: 17.295243, latitude: 43.205313},
	updated: 1721728665,
	above_quality_threshold: true,
	to_stop_uuid: 'dcc4b4bb-9603-11e6-9066-549f350fcb0c',
	vehicle_type: 'bus',
	stale: true,
}
// …
```


## Contributing

If you have a question or need support using `live-flix-website-position`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/live-flix-website-position/issues).
