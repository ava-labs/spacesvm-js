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
				// console.error(err)
				setPingSuccess(false)
			}
		}
		doPingThing()
	}, [])

	if (pingSuccess === null) {
		return <CircularProgress />
	}

	if (!pingSuccess) {
		return <Typography></Typography>
	}
	return (
		<Page>
			<Typography align="center" variant="h2">
				Ping {pingSuccess ? '' : 'NOT'} successful
			</Typography>
		</Page>
	)
}
