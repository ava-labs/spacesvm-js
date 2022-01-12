import { render } from './../../test-utils'
import { ErrorBoundaryFallback } from './ErrorBoundary'

it('renders ErrorBoundaryFallback error message correctly', () => {
	const resetErrorBoundary = jest.fn()
	const { getByText } = render(
		<ErrorBoundaryFallback resetErrorBoundary={resetErrorBoundary} error={{ name: 'hello', message: 'world' }} />,
	)

	//fireEvent.click(getByText(/try again/i))
	//expect(resetErrorBoundary).toHaveBeenCalled()

	//expect(getByText(/try again/i)).toBeInTheDocument()
	expect(getByText(/Error/i)).toBeInTheDocument()
	expect(getByText(/Something bad happened/i)).toBeInTheDocument()
	expect(getByText(/world/i)).toBeInTheDocument()
})
