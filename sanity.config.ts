import {buildLegacyTheme, defineConfig} from 'sanity'
import type {ThemeColorScheme} from '@sanity/ui/theme'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {esESLocale} from '@sanity/locale-es-es'
import {schemaTypes} from './schemaTypes'

// 1. Paleta cinematográfica (inspirada en DaVinci Resolve / Final Cut)
const palette = {
  page: '#0a0a0c', // Fondo de la aplicación
  panel: '#141417', // Tarjetas, paneles y cajas
  panelHover: '#1c1c21', // Panel al pasar el ratón
  field: '#1e1e24', // Fondo de los campos (más claro que el panel)
  fieldHover: '#26262d', // Campo al pasar el ratón
  border: '#32323c', // Bordes de paneles
  fieldBorder: '#4a4a55', // Bordes de campos (bien visibles)
  text: '#fafafa', // Texto principal
  muted: '#9a9aa5', // Placeholders y textos secundarios
  accent: '#e11d48', // Rojo "REC"
  success: '#10b981', // Verde esmeralda (Publicar)
} as const

// 2. Tema oscuro cinematográfico
const legacyTheme = buildLegacyTheme({
  '--black': palette.page,
  '--white': palette.text,
  '--gray': '#a1a1aa',
  '--gray-base': palette.panel,
  '--component-bg': palette.panel,
  '--component-text-color': palette.text,

  /* Acento principal y foco */
  '--brand-primary': palette.accent,
  '--focus-color': palette.accent,

  /* Botones de acción */
  '--default-button-color': '#52525b',
  '--default-button-primary-color': palette.accent,
  '--default-button-success-color': palette.success,

  /* Navegación lateral */
  '--main-navigation-color': palette.page,
  '--main-navigation-color--inverted': palette.text,
})

/**
 * `buildLegacyTheme` sólo traduce variables antiguas: genera el fondo oscuro
 * pero deja los campos y las cajas pintados *del mismo color que el fondo*
 * (`input.bg` y `card.bg` heredan `--black`), así que los inputs resultan
 * invisibles. Aquí se corrigen únicamente esos tokens sobre el tema generado.
 */
const field = <T extends object>(state: T, overrides: Record<string, string> = {}): T =>
  ({...state, bg: palette.field, bg2: palette.fieldHover, border: palette.fieldBorder, fg: palette.text, placeholder: palette.muted, ...overrides}) as T

const invalidField = <T extends object>(
  state: T,
  overrides: Record<string, string> = {},
): T =>
  ({...state, bg: '#2a1418', bg2: '#331a1f', border: palette.accent, fg: '#ffd9dd', placeholder: '#e0566e', ...overrides}) as T

function fixScheme(scheme: ThemeColorScheme): ThemeColorScheme {
  const tone = scheme.default

  return {
    ...scheme,
    default: {
      ...tone,
      input: {
        ...tone.input,
        default: {
          ...tone.input.default,
          enabled: field(tone.input.default.enabled),
          hovered: field(tone.input.default.hovered, {border: palette.accent}),
          readOnly: field(tone.input.default.readOnly, {
            bg: palette.panel,
            bg2: palette.panel,
            border: palette.border,
          }),
          disabled: field(tone.input.default.disabled, {
            bg: palette.panel,
            bg2: palette.panel,
            border: palette.border,
            fg: palette.muted,
          }),
        },
        invalid: {
          ...tone.input.invalid,
          enabled: invalidField(tone.input.invalid.enabled),
          hovered: invalidField(tone.input.invalid.hovered),
          readOnly: invalidField(tone.input.invalid.readOnly, {bg: '#2a1418', border: '#5c2027'}),
          disabled: invalidField(tone.input.invalid.disabled, {
            bg: '#1a0f12',
            border: '#3a1a1f',
            fg: '#8a5a5f',
          }),
        },
      },
      card: {
        ...tone.card,
        enabled: field(tone.card.enabled, {
          bg: palette.panel,
          bg2: palette.panel,
          border: palette.border,
          fg: palette.text,
        }),
        hovered: field(tone.card.hovered, {
          bg: palette.panelHover,
          bg2: palette.panelHover,
          border: palette.fieldBorder,
          fg: palette.text,
        }),
        selected: field(tone.card.selected, {
          bg: palette.panelHover,
          bg2: palette.panelHover,
          border: palette.accent,
          fg: palette.text,
        }),
      },
    },
  }
}

const schemes = legacyTheme.color as unknown as {
  light: ThemeColorScheme
  dark: ThemeColorScheme
}

export const cinematicTheme = {
  ...legacyTheme,
  color: {
    dark: fixScheme(schemes.dark),
    light: fixScheme(schemes.light),
  },
}

const singletonTypes = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: '🎬 ESTUDIO CREATIVO — PANEL',

  projectId: 'vrb9lndu',
  dataset: 'portafolio_productor',

  theme: cinematicTheme,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('⚙️ Configuración del Sitio')
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
    visionTool(),
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
