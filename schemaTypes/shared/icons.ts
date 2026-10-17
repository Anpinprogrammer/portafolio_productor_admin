/** Identificadores permitidos: la landing debe usar un mapa explícito de Lucide. */
export const iconOptions = [
  {title: 'Avión · Viajes', value: 'plane'},
  {title: 'Claqueta · Cine', value: 'clapperboard'},
  {title: 'Megáfono · Publicidad', value: 'megaphone'},
  {title: 'Música · Videoclips', value: 'music'},
  {title: 'Cámara · Fotografía', value: 'camera'},
  {title: 'Video · Producción', value: 'video'},
  {title: 'Tijeras · Edición', value: 'scissors'},
  {title: 'Paleta · Color', value: 'palette'},
  {title: 'Varita · Animación', value: 'wand-sparkles'},
  {title: 'Calendario · Eventos', value: 'calendar'},
  {title: 'Micrófono · Audio', value: 'mic'},
  {title: 'Reproducir · General', value: 'play'},
] as const

export type PortfolioIcon = (typeof iconOptions)[number]['value']
