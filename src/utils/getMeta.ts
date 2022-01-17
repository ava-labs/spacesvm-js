// @ts-nocheck
import cheerio from 'cheerio'

export const getMeta = (input) => {
	const $ = cheerio.load(input)
	const meta = {}
	$('meta').each(function () {
		const k = $(this).attr('name') || $(this).attr('property')
		const v = $(this).attr('content')
		if (k && v) meta[k] = v
	})

	return meta
}
