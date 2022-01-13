import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'

import { Page } from '@/components/Page'
import { PageSubtitle } from '@/components/PageSubtitle'
import { PageTitle } from '@/components/PageTitle'

export const SpaceDetails = memo(() => {
	const { spaceId } = useParams()

	return (
		<Page>
			<Box style={{ paddingTop: 42 }}>
				<PageTitle align="center">{spaceId}</PageTitle>
				<PageSubtitle align="center">Expires on: 21/42/2034</PageSubtitle>
			</Box>
		</Page>
	)
})
