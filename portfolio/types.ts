import type {PortfolioIcon} from '../schemaTypes/shared/icons'
import type {VideoSourceType} from '../schemaTypes/shared/validation'

/** Contrato de salida para React + Vite. No requiere importar Sanity Studio. */
export interface PortfolioProject {
  _id: string
  title: string
  slug: string
  category: {title: string; slug: string; icon?: PortfolioIcon | null} | null
  coverImage: {url: string; alt?: string | null} | null
  video: {sourceType: VideoSourceType; url: string | null; durationSeconds: number | null} | null
  tagline?: string | null
  description: string
  services: {_id: string; title: string; slug: string}[]
  tags: string[]
  featured: boolean
  order?: number | null
  publishedAt?: string | null
}

/** Solo la consulta de transición incluye los textos del formulario anterior. */
export interface PortfolioProjectQueryResult extends PortfolioProject {
  legacyServices: string[]
}
