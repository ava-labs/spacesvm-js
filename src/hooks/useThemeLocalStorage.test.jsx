import { THEME_LOCAL_STORAGE_KEY } from '../constants'
import { render } from '../test-utils'
import { useThemeLocalStorage } from './useThemeLocalStorage'

const setup = (theme) => {
	localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme)
	let returnVal = null
	const TestComponent = () => {
		returnVal = useThemeLocalStorage()
		return null
	}

	render(<TestComponent />)

	return returnVal
}

it('renders proper theme based on localstorage', () => {
	const theme = setup('"light"')

	expect(theme).toBe('light')
})

it('renders proper theme based on localstorage', () => {
	const theme = setup('"dark"')

	expect(theme).toBe('dark')
})
