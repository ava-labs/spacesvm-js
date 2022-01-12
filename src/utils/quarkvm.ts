export const mine = () => {}

export const setValue = (key: any) => {}

export const checkKeyClaimed = async (key: any) => {
	const response = await fetch(
		'http://3.80.126.27:37549/ext/bc/PWapoqFxsYJosghkRx5eBVZizvp9fPyKPGvdTBkoZYNdKj8Au/public',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)

	const reader = response.body?.getReader()

	const data = await reader?.read()
	console.log(`data`, data)
}

// curl --location --request POST 'http://3.80.126.27:37549/ext/bc/PWapoqFxsYJosghkRx5eBVZizvp9fPyKPGvdTBkoZYNdKj8Au/public' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "jsonrpc": "2.0",
//     "method": "quarkvm.prefixInfo",
//     "params":{
//         "prefix":"cGF0cmljay5hdmF4"
//     },
//     "id": 1
// }'
