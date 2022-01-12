import { memo, PropsWithChildren } from 'react'
import { Box, Container, Fade } from '@mui/material'
import { useDocumentTitle } from '@react-hookz/web'

import { Footer } from '@/components/Footer'
import { APP_NAME } from '@/constants'

type PageProps = {
	title?: string
}

export const Page = memo(({ title, children }: PropsWithChildren<PageProps>) => {
	useDocumentTitle(title ? `${title} — ${APP_NAME}` : `${APP_NAME}`)

	return (
		<Fade in>
			<Container component="main" maxWidth="xl" disableGutters>
				<Box
					sx={{
						minHeight: 'calc(100vh - 72px)',
						flexGrow: 1,
						px: {
							xs: 0,
							sm: 2,
							md: 5,
						},
						py: {
							xs: 1,
							sm: 2,
						},
					}}
				>
					{children}
				</Box>
				<Footer />
			</Container>
		</Fade>
	)
})
