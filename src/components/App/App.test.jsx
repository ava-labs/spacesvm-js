import { render } from '@testing-library/react'

import { App } from './App'

it('renders document.body', () => {
	render(<App />)

	expect(document.body).toBeInTheDocument()
})
