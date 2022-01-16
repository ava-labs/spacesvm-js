import { Navigate, useParams } from 'react-router-dom'
import { Typography } from '@mui/material'

import { Page } from '@/components/Page'
import { rainbowText } from '@/theming/rainbowText'
import { querySpaceKey } from '@/utils/spacesVM'

export const KeyDetails = () => {
	const { spaceId, key } = useParams()
	const [value, setValue] = useState<string | null>(null)
	const [isInvalidPage, setIsInvalidPage] = useState<boolean>(false)

	useEffect(() => {
		const getValue = async () => {
			if (!spaceId || !key) return
			const value = await querySpaceKey(spaceId, key)
			if (value === undefined) {
				setIsInvalidPage(true)
				return
			}
			setValue(value)
		}
		getValue()
	}, [spaceId, key])

	if (isInvalidPage) return <Navigate replace to="/404" />

	return (
		<Page>
			{value && (
				<Typography
					variant="h1"
					sx={{
						...rainbowText,
						mt: 8,
						textAlign: 'center',
					}}
				>
					{value}
				</Typography>
			)}
		</Page>
	)
}
