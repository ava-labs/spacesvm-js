import { userAgentDetect } from '@/utils/userAgentDetect'

export const useIsMobile = () => {
	const { isMobile } = userAgentDetect(typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent)

	return isMobile
}
