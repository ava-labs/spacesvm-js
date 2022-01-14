import { THEME_LOCAL_STORAGE_KEY } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export const useThemeLocalStorage = () => {
	const [themeLocalStorage] = useLocalStorage(THEME_LOCAL_STORAGE_KEY, 'dark') // track theme in localStorage

	useEffect(() => {
		// change scrollbar/browser color based on theme
		document.documentElement.setAttribute('style', `color-scheme: ${themeLocalStorage}`)
		document.documentElement.setAttribute('class', themeLocalStorage)
	}, [themeLocalStorage])

	return themeLocalStorage
}
