import { PropsWithChildren } from 'react'
import { Box, Container, Fade } from '@mui/material'
import { useDocumentTitle } from '@react-hookz/web'

import { Footer } from '@/components/Footer'
import { APP_NAME, APP_SLOGAN } from '@/constants'

type PageProps = {
	title?: string
	showFooter?: boolean
	noPadding?: boolean
}

export const Page = memo(({ title, showFooter = true, children, noPadding = false }: PropsWithChildren<PageProps>) => {
	useDocumentTitle(title ? `${title} — ${APP_NAME}` : `${APP_NAME} — ${APP_SLOGAN}`)

	return (
		<Fade in>
			<div style={{ height: '100%' }}>
				<Container
					component="main"
					maxWidth="xl"
					sx={{
						display: 'flex',
						flex: 1,
						height: '100%',
						flexDirection: 'column',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							flexGrow: 1,
							py: noPadding ? 0 : 8,
						}}
					>
						{children}
					</Box>
					{showFooter && <Footer />}
				</Container>
			</div>
		</Fade>
	)
})
