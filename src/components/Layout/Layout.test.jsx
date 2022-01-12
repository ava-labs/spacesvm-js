import { render } from './../../test-utils'
import { Layout } from './Layout'

it('renders children', () => {
	const { getByText } = render(<Layout>hello</Layout>)

	expect(getByText(/hello/i)).toBeInTheDocument()
})
