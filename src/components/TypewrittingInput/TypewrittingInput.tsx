import { PureComponent, ReactNode } from 'react'

import { randomizeTimeout, TimeoutRange } from '@/utils/typewritting'

enum Tick {
	INIT,
	WRITE,
	DELETE,
	START_DELETE,
}

const DEFAULTS = {
	WRITE_SPEED_MS: 100,
	DELETE_SPEED_MS: 60,
	WAIT_BEFORE_DELETE_MS: 9000,
}

interface RenderArgs {
	currentText: string
	fullCurrentText: string
}

interface Props {
	strings: string[]
	waitBeforeDeleteMs?: number
	writeSpeedMs?: TimeoutRange
	deleteSpeedMs?: TimeoutRange
	children: (args: RenderArgs) => ReactNode
}

interface State {
	currentStringIdx: number
	currentCharPos: number
	isDeleting: boolean
}

const moveToNextString = (
	prevState: State,
	props: Props,
): Pick<State, 'isDeleting' | 'currentCharPos' | 'currentStringIdx'> => {
	const nextStringIdx = prevState.currentStringIdx + 1
	return {
		isDeleting: false,
		currentCharPos: 0,
		currentStringIdx: nextStringIdx < props.strings.length ? nextStringIdx : 0,
	}
}

const moveCharPos =
	(change: number) =>
	(prevState: State): Pick<State, 'currentCharPos'> => ({
		currentCharPos: prevState.currentCharPos + change,
	})

const startDeleting = (): Pick<State, 'isDeleting'> => ({
	isDeleting: true,
})

export class TypewrittingInput extends PureComponent<Props, State> {
	private tickTimeout: number | null = null

	state = {
		currentStringIdx: 0,
		currentCharPos: 0,
		isDeleting: false,
	}

	componentDidMount() {
		this.queueTick(Tick.INIT)
	}

	componentWillUnmount() {
		if (this.tickTimeout != null) {
			clearTimeout(this.tickTimeout)
		}
	}

	private queueTick(tickType: Tick) {
		const { writeSpeedMs, deleteSpeedMs, waitBeforeDeleteMs } = this.props

		const timeout =
			tickType === Tick.INIT
				? 0
				: tickType === Tick.WRITE
				? randomizeTimeout(writeSpeedMs != null ? writeSpeedMs : DEFAULTS.WRITE_SPEED_MS)
				: tickType === Tick.DELETE
				? randomizeTimeout(deleteSpeedMs != null ? deleteSpeedMs : DEFAULTS.DELETE_SPEED_MS)
				: tickType === Tick.START_DELETE
				? waitBeforeDeleteMs != null
					? waitBeforeDeleteMs
					: DEFAULTS.WAIT_BEFORE_DELETE_MS
				: 0 // ¯\_(ツ)_/¯

		this.tickTimeout = window.setTimeout(() => this.tick(), timeout)
	}

	private tick() {
		const { currentStringIdx, currentCharPos, isDeleting } = this.state
		const currentText = this.props.strings[currentStringIdx]

		if (!isDeleting) {
			if (currentCharPos >= currentText.length) {
				this.setState(startDeleting, () => this.queueTick(Tick.START_DELETE))
			} else {
				this.setState(moveCharPos(1), () => this.queueTick(Tick.WRITE))
			}
		} else {
			if (currentCharPos <= 0) {
				this.setState(moveToNextString, () => this.queueTick(Tick.WRITE))
			} else {
				this.setState(moveCharPos(-1), () => this.queueTick(Tick.DELETE))
			}
		}
	}

	render() {
		const { strings } = this.props
		const { currentStringIdx, currentCharPos } = this.state

		const fullCurrentText = strings[currentStringIdx]
		const currentText = fullCurrentText.slice(0, currentCharPos)

		return this.props.children({ currentText, fullCurrentText }) as any
	}
}
