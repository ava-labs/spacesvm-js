import { FIRST_NAMES } from './firstNames'

import { shuffleArray } from '@/utils/shuffleArray'

// localStorage keys
export const THEME_LOCAL_STORAGE_KEY = 'spaces-theme'

// api
export const API_DOMAIN = 'https://memeshowdown.com/public'

// Overview
export const APP_NAME = 'Spaces'
export const APP_SLOGAN = 'Claim your space on the Avalanche blockchain'

// units
export const ONE_MINUTES_IN_MS = 60000
export const TEN_MINUTES_IN_MS = 600000
export const PRICE_PER_SPC = 0.05 // $0.05 per SPC, bogus for now

// regexes
export const USERNAME_REGEX = /^[\w\s.]{1,256}$/
export const USERNAME_REGEX_QUERY = /[^\w\s.]/gi

// variables
export const USERNAMES = shuffleArray(FIRST_NAMES)
