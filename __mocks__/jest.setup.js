import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import 'whatwg-fetch'

import React from 'react'

import { API_DOMAIN } from '@/constants'

import genericMetricDataMock from './api/genericMetricDataMock.json'
import metrics from './api/metrics.json'

global.React = React

const getMetricDataMock = (url) => {
	const metricId = url.replace(`${API_DOMAIN}/metrics/`, '')
	const metricDataMock = {}
	Object.keys(genericMetricDataMock).forEach((timestamp) => {
		metricDataMock[timestamp] = genericMetricDataMock[timestamp].map((datum) => ({
			...datum,
			valueName: metricId,
		}))
	})
	return metricDataMock
}

const fetchResponses = {
	[`${API_DOMAIN}/metrics`]: metrics,
	'/anything': { value: 42 },
}

global.fetch = (url) =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve(fetchResponses[url] ?? getMetricDataMock(url)),
	})
