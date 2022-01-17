declare global {
	interface Window {
		opera: any
		MSStream: any
	}
}

export const userAgent = navigator.userAgent || navigator.vendor || window.opera

export const isAndroid = /android/i.test(userAgent)
export const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
