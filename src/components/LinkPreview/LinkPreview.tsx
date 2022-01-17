import { getMeta } from '@/utils/getMeta'

export const LinkPreview = memo(({ url, render }: any) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [preview, setPreviewData] = useState<any>({})

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)

			fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
				.then((response) => {
					if (response.ok) return response.json()
					throw new Error('Network response was not ok.')
				})
				.then((data) => {
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
