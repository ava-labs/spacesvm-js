import { render } from './../../test-utils'
import { PageTitle } from './PageTitle'

it('renders children', () => {
	const { getByText } = render(<PageTitle>hello</PageTitle>)

	expect(getByText(/hello/i)).toBeInTheDocument()
})
