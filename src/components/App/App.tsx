import { memo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { Layout } from '@/components/Layout'
import { useThemeLocalStorage } from '@/hooks/useThemeLocalStorage'
import { Routes } from '@/pages/Routes'
import { darkTheme, lightTheme } from '@/theming/theme'

export const App = memo(() => {
	const themeLocalStorage = useThemeLocalStorage()

	return (
		<BrowserRouter>
			<ThemeProvider theme={themeLocalStorage === 'light' ? lightTheme : darkTheme}>
				<CssBaseline />

				<Layout>
					<Routes />
				</Layout>
			</ThemeProvider>
		</BrowserRouter>
	)
})
