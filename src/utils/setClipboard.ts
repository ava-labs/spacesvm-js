export const setClipboard = async ({ value, onSuccess, onFailure }: any) => {
	try {
		const type = 'text/plain'
		const blob = new Blob([value], { type })
		const data = [new ClipboardItem({ [type]: blob })]

		await navigator.clipboard.write(data)

		if (onSuccess) {
			onSuccess()
		}
	} catch (err) {
		if (onFailure) {
			onFailure()
		}
	}
}
