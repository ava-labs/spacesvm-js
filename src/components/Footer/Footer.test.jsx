import { render } from './../../test-utils'
import { Footer } from './Footer'

it('renders copyright text', () => {
	const { getByText } = render(<Footer />)

	expect(getByText(/©/i)).toBeInTheDocument()
	expect(getByText(/Chain Metrics/i)).toBeInTheDocument()
})
