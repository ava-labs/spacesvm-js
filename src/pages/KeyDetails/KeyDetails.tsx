import { Navigate, useParams } from 'react-router-dom'
import { Typography, useTheme } from '@mui/material'

import { Page } from '@/components/Page'
import { getQuarkValue } from '@/utils/quarkvm'

export const KeyDetails = () => {
	const { spaceId, key } = useParams()
	const theme = useTheme()
	const [value, setValue] = useState<string | null>(null)
	const [isInvalidPage, setIsInvalidPage] = useState<boolean>(false)

	useEffect(() => {
		const getValue = async () => {
			if (!spaceId || !key) return
			const value = await getQuarkValue(spaceId, key)
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
						mt: 8,
						textAlign: 'center',
						backgroundSize: '400% 100%',
						backgroundClip: 'text',
						textFillColor: 'transparent',
						backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'unset',
						animation: 'hue 5s infinite alternate',
						caretColor: '#523df1',
						backgroundImage:
							'linear-gradient(60deg,rgba(239,0,143,.5),rgba(110,195,244,.5),rgba(112,56,255,.5),rgba(255,186,39,.5))',
					}}
				>
					{value}
				</Typography>
			)}
		</Page>
	)
}
