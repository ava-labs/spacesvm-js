import { CircularProgress, Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { pingSpaces } from '@/utils/quarkvm'

export const PingSpaces = () => {
	const [pingSuccess, setPingSuccess] = useState<boolean | null>(null)
	useEffect(() => {
		const doPingThing = async () => {
			try {
				const pingRes = await pingSpaces()
				if (!pingRes || !pingRes?.success) {
					setPingSuccess(false)
					return
				}
				setPingSuccess(true)
			} catch (err) {
				console.error(err)
				setPingSuccess(false)
			}
		}
		doPingThing()
	}, [])

	return (
		<Page>
			<Typography align="center" variant="h2" color={pingSuccess ? 'green' : 'red'} sx={{ mt: 4 }}>
				{pingSuccess === undefined
					? 'Checking connection to Spaces VM...'
					: pingSuccess
					? 'PING SUCCESSFUL'
					: 'PING FAILED'}
			</Typography>
			{pingSuccess === undefined && <CircularProgress sx={{ margin: '0 auto', mt: 1 }} />}
		</Page>
	)
}
