export const VIDEO_SOURCE_TYPES = ['external', 'direct', 'upload'] as const
export type VideoSourceType = (typeof VIDEO_SOURCE_TYPES)[number]

export function validateVideoUrl(value: unknown, sourceType: unknown): true | string {
  // Los campos ocultos pueden conservar valores de un origen anterior.
  if (sourceType !== 'external' && sourceType !== 'direct') return true
  if (typeof value !== 'string' || !value.trim()) return 'Añade el enlace del video.'
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return 'Escribe una URL completa y válida.'
  }
  if (url.protocol !== 'https:' || url.username || url.password) {
    return 'Utiliza un enlace seguro que empiece por https://, sin credenciales.'
  }
  if (sourceType === 'direct') {
    return (
      /\.(mp4|webm)$/i.test(url.pathname) || 'El enlace debe apuntar a un archivo .mp4 o .webm.'
    )
  }
  const host = url.hostname.toLowerCase()
  const youtube = ['youtube.com', 'www.youtube.com', 'm.youtube.com']
  const embed = ['youtube-nocookie.com', 'www.youtube-nocookie.com']
  const isYouTube =
    (youtube.includes(host) &&
      ((url.pathname === '/watch' && Boolean(url.searchParams.get('v'))) ||
        /^\/(embed|shorts|live)\/[\w-]+\/?$/.test(url.pathname))) ||
    (embed.includes(host) && /^\/embed\/[\w-]+\/?$/.test(url.pathname)) ||
    (['youtu.be', 'www.youtu.be'].includes(host) && /^\/[\w-]+\/?$/.test(url.pathname))
  const isVimeo =
    (['vimeo.com', 'www.vimeo.com'].includes(host) && /^\/\d+(\/[^/]+)?\/?$/.test(url.pathname)) ||
    (host === 'player.vimeo.com' && /^\/video\/\d+\/?$/.test(url.pathname))
  return isYouTube || isVimeo || 'Pega el enlace de un video de YouTube o Vimeo.'
}

export function validateTags(value: unknown): true | string {
  if (value === undefined) return true
  if (!Array.isArray(value)) return 'Añade las etiquetas una a una.'
  if (value.length > 10) return 'Puedes añadir hasta 10 etiquetas.'
  const normalized = new Set<string>()
  for (const tag of value) {
    if (typeof tag !== 'string' || !tag.trim()) return 'Las etiquetas no pueden estar vacías.'
    if (tag.length > 30) return 'Cada etiqueta puede tener hasta 30 caracteres.'
    const key = tag.trim().normalize('NFC').toLocaleLowerCase('es')
    if (normalized.has(key)) return 'No repitas etiquetas, aunque cambies espacios o mayúsculas.'
    normalized.add(key)
  }
  return true
}
