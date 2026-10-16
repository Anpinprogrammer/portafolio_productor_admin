import {defineConfig} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {studioTheme} from './studio/theme'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {esESLocale} from '@sanity/locale-es-es'
import {schemaTypes} from './schemaTypes'

const singletonTypes = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Estudio creativo',

  projectId: 'vrb9lndu',
  dataset: 'portafolio_productor',

  theme: studioTheme,

  plugins: [
    structureTool({
      title: 'Contenido',
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('Configuración del sitio')
              .icon(CogIcon)
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() as string),
            ),
          ]),
    }),
    // Galería visual de archivos para el productor
    media(),
    // Consola GROQ para depurar consultas
    visionTool({title: 'Consultas GROQ'}),
    // Interfaz del Studio en español
    esESLocale(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => !singletonTypes.has(template.templateId))
      }
      return prev
    },
    actions: (prev, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({action}) => !['unset', 'duplicate', 'delete'].includes(action ?? ''))
        : prev,
  },
})
