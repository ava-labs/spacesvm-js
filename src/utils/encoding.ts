export const utf8_to_b64 = (str: string) => btoa(unescape(encodeURIComponent(str)))

export const b64_to_utf8 = (str: string) => decodeURIComponent(escape(atob(str)))
