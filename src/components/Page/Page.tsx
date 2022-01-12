import { memo, PropsWithChildren } from 'react'
import { Box, Container, Fade } from '@mui/material'
import { useDocumentTitle } from '@react-hookz/web'

import { APP_NAME } from '@/constants'

type PageProps = {
	title?: string
}

export const Page = memo(({ title, children }: PropsWithChildren<PageProps>) => {
	useDocumentTitle(title ? `${title} — ${APP_NAME}` : `${APP_NAME}`)

	return (
		<Fade in>
			<Container component="main" maxWidth="xl" disableGutters sx={{ display: 'flex', flex: 1 }}>
				<Box
					sx={{
						minHeight: 'calc(100vh - 380px)',
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						px: {
							xs: 0,
							sm: 2,
							md: 5,
						},
						pt: 0,
						pb: 8,
					}}
				>
					{children}
				</Box>
			</Container>
		</Fade>
	)
})
