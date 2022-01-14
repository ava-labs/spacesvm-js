import { FIRST_NAMES } from './firstNames'

import { shuffleArray } from '@/utils/shuffleArray'

// localStorage keys
export const THEME_LOCAL_STORAGE_KEY = 'spaces-theme'

// api
export const API_DOMAIN = 'https://memeshowdown.com/ext/bc/2F2ayy26TEJzwYn9zJhp7196VvBe4UaAAGEErbjPmsFnui4Zy2'

// Overview
export const APP_NAME = 'Spaces'

// units
export const ONE_MINUTES_IN_MS = 60000
export const TEN_MINUTES_IN_MS = 600000
export const PRICE_PER_SPC = 0.05 // $0.05 per SPC, bogus for now

// regexes
export const USERNAME_REGEX = /^[\w\s.]{1,256}$/
export const USERNAME_REGEX_QUERY = /[^\w\s.]/gi

// variables
export const USERNAMES = shuffleArray(FIRST_NAMES)
