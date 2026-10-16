import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portafolio Productor Audiovisual',

  projectId: 'vrb9lndu',
  dataset: 'portafolio_productor',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
