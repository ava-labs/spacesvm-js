import { memo } from 'react'

import { Page } from '@/components/Page'
import { PageTitle } from '@/components/PageTitle'

export const Home = memo(() => (
	<Page>
		<PageTitle>Hello world</PageTitle>
	</Page>
))
