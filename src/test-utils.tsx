/* istanbul ignore file */

import { FC } from 'react'
import { QueryClient, QueryClientProvider, setLogger } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { render } from '@testing-library/react'
import { QueryParamProvider } from 'use-query-params'

import { darkTheme } from '@/theming/theme'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			cacheTime: Infinity,
		},
	},
})

setLogger({
	log: console.log, // eslint-disable-line no-console
	warn: console.warn, // eslint-disable-line no-console
	error: () => {}, // suppress network errors when testing
})

const AllTheProviders: FC = ({ children }) => (
	<ThemeProvider theme={darkTheme}>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<QueryParamProvider>{children}</QueryParamProvider>
			</BrowserRouter>
		</QueryClientProvider>
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
