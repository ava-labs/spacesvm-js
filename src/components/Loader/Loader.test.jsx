import { render } from './../../test-utils'
import { Loader } from './Loader'

it('displays a progress bar', () => {
	const { getByRole } = render(<Loader />)

	expect(getByRole('progressbar')).toBeInTheDocument()
})
