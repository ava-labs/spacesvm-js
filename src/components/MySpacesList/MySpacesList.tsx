import { Twemoji } from 'react-emoji-render'
import { NavLink } from 'react-router-dom'
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'

export const MySpacesList = memo(({ noMarginOnTitle, onClose, spaces }: any) => (
	<>
		{spaces && spaces?.length > 0 && (
			<>
				<Typography variant="h4" sx={{ fontFamily: 'DM Serif Display', mt: noMarginOnTitle ? 0 : 3 }}>
					Your spaces
				</Typography>

				<List sx={{ mt: 2, ml: -2 }}>
					{spaces.map((space: any, i: number) => (
						<ListItem
							component={NavLink}
							// @ts-ignore
							button
							to={`/${space}`}
							onClick={onClose}
							key={`${space}-${i}`}
							sx={{ mb: 1, borderRadius: 4, height: 52 }}
						>
							<ListItemIcon sx={{ fontSize: 32 }}>
								<Twemoji svg text="🔭" className="emoji" />
							</ListItemIcon>

							<ListItemText
								primary={
									<Typography noWrap variant="h5">
										{space}
									</Typography>
								}
							/>
						</ListItem>
					))}
				</List>
			</>
		)}
	</>
))
