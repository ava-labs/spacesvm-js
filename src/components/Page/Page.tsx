import { PropsWithChildren } from 'react'
import { Box, Container, Fade } from '@mui/material'
import { useDocumentTitle } from '@react-hookz/web'

import { Footer } from '../Footer'

import Bg from '@/assets/bg.jpg'
import { APP_NAME, APP_SLOGAN } from '@/constants'

type PageProps = {
	title?: string
	showFooter?: boolean
	noPadding?: boolean
	showBgImage?: boolean
}

export const Page = memo(
	({ title, showFooter = true, children, noPadding = false, showBgImage = false }: PropsWithChildren<PageProps>) => {
		useDocumentTitle(title ? `${title} — ${APP_NAME}` : `${APP_NAME} — ${APP_SLOGAN}`)

		return (
			<Fade in>
				<div style={{ height: '100%' }}>
					<Container
						component="main"
						maxWidth="xl"
						disableGutters
						sx={{
							display: 'flex',
							flex: 1,
							height: '100%',
							flexDirection: 'column',
							...(showBgImage && {
								backgroundImage: `url(${Bg})`,
								backgroundSize: 'cover',
								backgroundPosition: '0px 64px',
							}),
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								flexGrow: 1,
								px: {
									xs: 0,
									sm: noPadding ? 0 : 2,
									md: noPadding ? 0 : 5,
								},
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
	},
)
