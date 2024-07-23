import {fetch} from 'cross-fetch'

// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const userAgent = pkg.homepage || pkg.name

const endpoint = 'https://global.api.flixbus.com/gis'

const fetchJson = async (url, opts = {}) => {
	const res = await fetch(url, {
		...opts,
		headers: {
			...(opts.headers || {}),
			'accept': 'application/json',
			'user-agent': userAgent,
		},
	})
	if (!res.ok) {
		const err = new Error(`${url}: ${res.status} ${res.statusText}`)
		err.url = url
		err.res = res
		throw err
	}
	const body = await res.json()
	return body
}

const fetchTrip = async (rideUuid, fetchOpts = {}) => {
	const url = `${endpoint}/v2/ride/${rideUuid}/trip-info/live`

	const _ = await fetchJson(url, fetchOpts)
	return _
}

const fetchPosition = async (rideUuid, fetchOpts = {}) => {
	const url = `${endpoint}/v1/ride/${rideUuid}/tracking`

	const _ = await fetchJson(url, fetchOpts)
	return _
}

const positions = async function* (rideUuid, fetchOpts = {}) {
	while (true) {
		yield await fetchPosition(rideUuid, fetchOpts)
	}
}

export {
	fetchTrip,
	fetchPosition,
	positions,
}
