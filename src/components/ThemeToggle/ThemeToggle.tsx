import { FiMoon, FiSun } from 'react-icons/fi'
import { Grid, IconButton, Tooltip, Typography } from '@mui/material'

import { THEME_LOCAL_STORAGE_KEY } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export const ThemeToggle = () => {
	const [themeLocalStorage, setThemeLocalStorage] = useLocalStorage(THEME_LOCAL_STORAGE_KEY, 'dark') // track theme in localStorage

	return (
		<Grid container spacing={1} alignItems="center" wrap="nowrap">
			<Grid item>
				<Tooltip title="Dark Theme">
					<IconButton
						aria-label="Dark theme toggle"
						sx={{ opacity: themeLocalStorage === 'dark' ? 1 : 0.5 }}
						size="small"
						onClick={() => setThemeLocalStorage('dark')}
					>
						<FiMoon />
					</IconButton>
				</Tooltip>
			</Grid>
			<Grid item>
				<Typography component="p" variant="subtitle2" color="textSecondary">
					/
				</Typography>
			</Grid>
			<Grid item>
				<Tooltip title="Light Theme">
					<IconButton
						aria-label="Light theme toggle"
						sx={{ opacity: themeLocalStorage === 'light' ? 1 : 0.5 }}
						size="small"
						onClick={() => setThemeLocalStorage('light')}
					>
						<FiSun />
					</IconButton>
				</Tooltip>
			</Grid>
		</Grid>
	)
}
