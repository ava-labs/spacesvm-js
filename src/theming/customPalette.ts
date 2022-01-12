const darkCustomPalette = {}

const lightCustomPalette = {}

export type CustomPalette = {
	[Key in keyof typeof darkCustomPalette]: typeof darkCustomPalette[Key]
}

const lightCustomPaletteTyped: CustomPalette = lightCustomPalette
const darkCustomPaletteTyped: CustomPalette = darkCustomPalette

export { darkCustomPaletteTyped as darkCustomPalette, lightCustomPaletteTyped as lightCustomPalette }
