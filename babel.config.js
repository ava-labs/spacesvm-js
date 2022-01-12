module.exports = {
	// Make import.meta work with jest...
	plugins: [
		() => ({
			visitor: {
				MetaProperty(path) {
					path.replaceWithSourceString('process')
				},
			},
		}),
	],
}
