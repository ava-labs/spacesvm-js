import { render } from './../../test-utils'
import { PageSubtitle } from './PageSubtitle'

it('renders children', () => {
	const { getByText } = render(<PageSubtitle>hello</PageSubtitle>)

	expect(getByText(/hello/i)).toBeInTheDocument()
})
