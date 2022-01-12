import { memo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { Layout } from '@/components/Layout'
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
					<Layout>
						<Routes />
					</Layout>
				</QueryClientProvider>
			</ThemeProvider>
		</BrowserRouter>
	)
})
