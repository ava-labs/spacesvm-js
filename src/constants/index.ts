import { FIRST_NAMES } from './firstNames'

import { shuffleArray } from '@/utils/shuffleArray'

// localStorage keys
export const THEME_LOCAL_STORAGE_KEY = 'spaces-theme'

// api
export const API_DOMAIN = 'https://api.tryspaces.xyz/public'

// Overview
export const APP_NAME = 'Spaces'
export const APP_SLOGAN = 'Claim your space on the Avalanche blockchain'

// units
export const ONE_MINUTES_IN_MS = 60000
export const TEN_MINUTES_IN_MS = 600000
export const PRICE_PER_SPC = 0.05 // $0.05 per SPC, bogus for now

// regexes
export const VALID_KEY_REGEX = /^[a-z0-9]{1,256}$/
export const USERNAME_REGEX_QUERY = /[^\w\s]/gi
export const URL_REGEX = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
export const IMAGE_REGEX = /^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim

// variables
export const USERNAMES = shuffleArray(FIRST_NAMES)
