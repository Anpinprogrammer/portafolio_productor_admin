import type {SanityClient} from '@sanity/client'
import {normalizePortfolioProject} from './normalize'
import {portfolioProjectsQuery} from './query'
import type {PortfolioProject, PortfolioProjectQueryResult} from './types'

/** No necesita tokens para un dataset público; jamás añadir un token privado a Vite. */
export async function fetchPortfolioProjects(client: SanityClient): Promise<PortfolioProject[]> {
  const result = await client.fetch<PortfolioProjectQueryResult[]>(
    portfolioProjectsQuery,
    {},
    {
      perspective: 'published',
    },
  )
  return result.map(normalizePortfolioProject)
}
