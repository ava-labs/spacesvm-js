import { parseJSON } from './parseJSON'

it('parse json', () => {
	expect(parseJSON('{"hello":"world"}')).toEqual({ hello: 'world' })
})

it('returns undefined when passed "undefined"', () => {
	expect(parseJSON('undefined')).toEqual(undefined)
})

it('returns undefined when passed an empty string', () => {
	expect(parseJSON('')).toEqual(undefined)
})

it('returns undefined on error json', () => {
	expect(parseJSON({})).toEqual(undefined)
})
