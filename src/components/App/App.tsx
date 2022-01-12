import { memo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryParamProvider } from 'use-query-params'

import { Layout } from '@/components/Layout'
import { RouteAdapter } from '@/components/RouteAdapter'
import { useThemeLocalStorage } from '@/hooks/useThemeLocalStorage'
import { Routes } from '@/pages/Routes'
import { darkTheme, lightTheme } from '@/theming/theme'

const isDev = import.meta.env.DEV

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: !isDev,
			staleTime: isDev ? 60000 : 2000,
		},
	},
})

export const App = memo(() => {
	const themeLocalStorage = useThemeLocalStorage()

	return (
		<BrowserRouter>
			<ThemeProvider theme={themeLocalStorage === 'light' ? lightTheme : darkTheme}>
				<CssBaseline />

				<QueryClientProvider client={queryClient}>
					<QueryParamProvider ReactRouterRoute={RouteAdapter}>
						<Layout>
							<Routes />
						</Layout>
					</QueryParamProvider>
				</QueryClientProvider>
			</ThemeProvider>
		</BrowserRouter>
	)
})
