import { APP_NAME } from './../../constants'
import { render, waitFor } from './../../test-utils'
import { Page } from './Page'

it('renders children', () => {
	const { getByText } = render(<Page title="bonjour">hello</Page>)

	expect(getByText(/hello/i)).toBeInTheDocument()
})

it('set document title', async () => {
	render(<Page title="bonjour">hello</Page>)

	await waitFor(() => expect(document.title).toEqual(`bonjour — ${APP_NAME}`))
})
