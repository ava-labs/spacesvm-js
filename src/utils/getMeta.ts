export const getMeta = (input: string) => {
	const meta: { [key: string]: string } = {}

	const el = document.createElement('html')
	el.innerHTML = input

	Array.from(el.getElementsByTagName('meta')).forEach((item) => {
		const k = item.getAttribute('name') || item.getAttribute('property')
		const v = item.getAttribute('content')
		if (k && v) meta[k] = v
	})

	return {
		...meta,
	}
}
