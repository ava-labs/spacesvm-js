import { THEME_LOCAL_STORAGE_KEY } from './../../constants'
import { fireEvent, render } from './../../test-utils'
import { ThemeToggle } from './ThemeToggle'

it('renders theme toggle buttons and changes theme on click', () => {
	const { getByLabelText } = render(<ThemeToggle />)

	const darkThemeButton = getByLabelText('Dark theme toggle')
	const lightThemeButton = getByLabelText('Light theme toggle')

	expect(darkThemeButton).toBeInTheDocument()
	expect(lightThemeButton).toBeInTheDocument()

	// Changing to dark theme
	fireEvent.click(darkThemeButton)
	expect(localStorage.getItem(THEME_LOCAL_STORAGE_KEY)).toBe('"dark"')

	// Changing to light theme
	fireEvent.click(lightThemeButton)
	expect(localStorage.getItem(THEME_LOCAL_STORAGE_KEY)).toBe('"light"')
})
