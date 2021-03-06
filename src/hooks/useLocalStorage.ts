import { Dispatch, SetStateAction } from 'react'
import isEqual from 'lodash/isEqual'

import { useEventListener } from './useEventListener'

import { parseJSON } from '@/utils/parseJSON'

type SetValue<T> = Dispatch<SetStateAction<T>>

export const useLocalStorage = <T>(key: string, initialValue: T): [T, SetValue<T>] => {
	const prevValueRef = useRef(initialValue)

	// Get from local storage then
	// parse stored json or return initialValue
	const readValue = (): T => {
		// Prevent build error "window is undefined" but keep keep working
		if (typeof window === 'undefined') {
			return initialValue
		}

		try {
			const item = window.localStorage.getItem(key)
			return item ? (parseJSON(item) as T) : initialValue
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn(`Error reading localStorage key “${key}”:`, error)
			return initialValue
		}
	}

	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(readValue)

	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue: SetValue<T> = (value) => {
		// Prevent build error "window is undefined" but keeps working
		if (typeof window == 'undefined') {
			// eslint-disable-next-line no-console
			console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`)
		}

		try {
			// Allow value to be a function so we have the same API as useState
			const newValue = value instanceof Function ? value(storedValue) : value

			// Save to local storage
			window.localStorage.setItem(key, JSON.stringify(newValue))

			// Save state
			setStoredValue(newValue)

			// We dispatch a custom event so every useLocalStorage hook are notified
			window.dispatchEvent(new Event('local-storage'))
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn(`Error setting localStorage key “${key}”:`, error)
		}
	}

	useEffect(() => {
		const newValue = readValue()
		setStoredValue(newValue)
		prevValueRef.current = newValue
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleStorageChange = () => {
		const newValue = readValue()

		if (isEqual(newValue, prevValueRef.current)) return
		setStoredValue(newValue)
		prevValueRef.current = newValue
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}

	// this only works for other documents, not the current one
	useEventListener('storage', handleStorageChange)

	// this is a custom event, triggered in writeValueToLocalStorage
	// See: useLocalStorage()
	useEventListener('local-storage', handleStorageChange)

	return [storedValue, setValue]
}
