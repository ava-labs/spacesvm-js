import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, Grow, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { Layout } from '@/components/Layout'
import { useThemeLocalStorage } from '@/hooks/useThemeLocalStorage'
import { Routes } from '@/pages/Routes'
import { MetaMaskProvider } from '@/providers/MetaMaskProvider'
import { darkTheme, lightTheme } from '@/theming/theme'

export const App = memo(() => {
	const themeLocalStorage = useThemeLocalStorage()

	return (
		<BrowserRouter>
			<ThemeProvider theme={themeLocalStorage === 'light' ? lightTheme : darkTheme}>
				<CssBaseline />

				<SnackbarProvider
					dense
					autoHideDuration={3500}
					maxSnack={3}
					preventDuplicate
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					// @ts-ignore
					TransitionComponent={Grow}
				>
					<MetaMaskProvider>
						<Layout>
							<Routes />
						</Layout>
					</MetaMaskProvider>
				</SnackbarProvider>
			</ThemeProvider>
		</BrowserRouter>
	)
})
