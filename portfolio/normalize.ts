import type {PortfolioProject, PortfolioProjectQueryResult} from './types'

export function normalizePortfolioProject(result: PortfolioProjectQueryResult): PortfolioProject {
  const {legacyServices, ...project} = result
  // Una vez seleccionadas referencias, son la fuente principal de los servicios.
  if (project.services.length) return project
  const titles = [...new Set((legacyServices ?? []).map((title) => title.trim()).filter(Boolean))]
  return {
    ...project,
    services: titles.map((title) => ({
      // Identificador de presentación, nunca se debe guardar como referencia en Sanity.
      _id: `legacy-service:${title}`,
      title,
      slug: title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    })),
  }
}

export function formatDuration(seconds: number | null | undefined): string | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
