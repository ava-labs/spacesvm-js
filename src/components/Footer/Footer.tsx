import { memo } from 'react'
import { Typography } from '@mui/material'

import { APP_NAME } from '@/constants'

export const Footer = memo(() => (
	<Typography component="footer" sx={{ width: '100%', opacity: 0.5, py: 1 }} align="center">
		{`© ${new Date().getFullYear()} — ${APP_NAME}`}
	</Typography>
))
