import { fireEvent, render } from './../../test-utils'
import { AppBar } from './AppBar'

it('renders app name', () => {
	const { getByText } = render(<AppBar />)

	expect(getByText(/Chain/)).toBeInTheDocument()
	expect(getByText(/Metrics/)).toBeInTheDocument()
})

it('renders menu button', () => {
	const { queryByRole, getByRole } = render(<AppBar />)

	const menuButton = getByRole('button')
	const nav1 = queryByRole('navigation')

	expect(menuButton).toBeInTheDocument()
	expect(nav1).not.toBeInTheDocument()

	// Opening the nav by clicking on menu button
	fireEvent.click(menuButton)
	const nav2 = getByRole('navigation')
	expect(nav2).toBeInTheDocument()
})
