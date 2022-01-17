export const setClipboard = async ({ value, onSuccess, onFailure }: any) => {
	const type = 'text/plain'
	const blob = new Blob([value], { type })
	const data = [new ClipboardItem({ [type]: blob })]

	navigator.clipboard.write(data).then(
		() => {
			if (onSuccess) {
				onSuccess()
			}
		},
		() => {
			if (onFailure) {
				onFailure()
			}
		},
	)
}
