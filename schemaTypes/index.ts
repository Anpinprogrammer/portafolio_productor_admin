import type {SchemaTypeDefinition} from 'sanity'
import {seo} from './objects/seo'
import {project} from './documents/project'
import {siteSettings} from './documents/site-settings'

export const schemaTypes: SchemaTypeDefinition[] = [seo, project, siteSettings]
