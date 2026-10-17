import type {SchemaTypeDefinition} from 'sanity'
import {seo} from './objects/seo'
import {project} from './documents/project'
import {siteSettings} from './documents/site-settings'
import {category} from './documents/category'
import {service} from './documents/service'
import {projectVideo} from './objects/project-video'

export const schemaTypes: SchemaTypeDefinition[] = [
  seo,
  projectVideo,
  project,
  category,
  service,
  siteSettings,
]
