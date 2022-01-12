import { useIsMobile } from './useIsMobile'

it('returns true or false based on the useragent', () => {
	expect(useIsMobile()).toBe(false)

	// Setting user agent to iPhone
	Object.defineProperty(global.navigator, 'userAgent', { value: 'iPhone', configurable: true })
	expect(useIsMobile()).toBe(true)

	// Setting navigator to undefined
	Object.defineProperty(global, 'navigator', { value: undefined, configurable: true })
	expect(useIsMobile()).toBe(false)
})
