// @ts-nocheck
import cheerio from 'cheerio'

export const getMeta = function (input) {
	const $ = cheerio.load(input)
	const meta = {}
	$('meta').each(function (i, tag) {
		const k = $(this).attr('name') || $(this).attr('property')
		const v = $(this).attr('content')
		if (k && v) meta[k] = v
	})
	return meta
}
