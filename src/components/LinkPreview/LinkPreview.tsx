import axios from 'axios'
import getMeta from 'lets-get-meta'

export const LinkPreview = memo(({ url, render }: any) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [preview, setPreviewData] = useState<any>({})
	const api = `https://cors-proxy.htmldriven.com/?url=${url}`

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			console.log('YOOO')
			/*const response = await axios.get(api).then((res) => {
				console.log(res)
				return res
			})*/

			fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
				.then((response) => {
					if (response.ok) return response.json()
					throw new Error('Network response was not ok.')
				})
				.then((data) => {
					console.log(getMeta(data.contents))
					setPreviewData(getMeta(data.contents))
					setLoading(false)
				})
		}
		fetchData()
	}, [url])

	return render({
		loading: loading,
		preview: preview,
	})
})
