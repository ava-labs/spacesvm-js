/* istanbul ignore file */

import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { render } from '@testing-library/react'

import { darkTheme } from '@/theming/theme'

const AllTheProviders: FC = ({ children }) => (
	<ThemeProvider theme={darkTheme}>
		<BrowserRouter>{children}</BrowserRouter>
	</ThemeProvider>
)

// Wrapper the usual `render` method with our upgraded providers
const customRender = (ui: any, options?: any) => render(ui, { wrapper: AllTheProviders, ...options })

// When you want to easily render a component with a specific URL
const renderWithRouter = (ui: any, { route = '/' } = {}) => {
	window.history.pushState({}, 'Test page', route)

	return render(ui, { wrapper: AllTheProviders })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render, renderWithRouter }
