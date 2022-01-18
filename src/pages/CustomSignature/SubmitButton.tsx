import { Button, styled } from '@mui/material'

import { purpleButton } from '@/theming/purpleButton'

export const SubmitButton = styled(Button)(({ theme }: any) => ({
	...purpleButton(theme),
}))
