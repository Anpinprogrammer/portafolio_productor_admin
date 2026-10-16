import {color} from '@sanity/color'
import {buildTheme} from '@sanity/ui/theme'

/**
 * Las escalas completas permiten que Sanity genere los estados de interacción
 * en ambos modos, incluidos menús, diálogos, botones y campos de los plugins.
 * Azul petróleo: navegación y acciones. Verde, ámbar y rojo: estados de contenido.
 */
export const studioTheme = buildTheme({
  palette: {
    ...color,
    black: '#101820',
    white: '#ffffff',
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#263442',
      900: '#1c2833',
      950: '#16212b',
    },
    blue: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#0f8177',
      600: '#0f766e',
      700: '#115e59',
      800: '#134e4a',
      900: '#123d3b',
      950: '#042f2e',
    },
  },
  color: {
    base: {
      '*': {focusRing: ['blue/700', 'blue/300']},
      default: {
        fg: ['gray/900', 'gray/100'],
        muted: {fg: ['gray/600', 'gray/400']},
      },
      transparent: {
        fg: ['gray/900', 'gray/100'],
        muted: {fg: ['gray/600', 'gray/400']},
      },
    },
    input: {
      default: {
        enabled: {
          bg: ['white', 'gray/900'],
          border: ['gray/500', 'gray/500'],
          fg: ['gray/900', 'gray/100'],
          placeholder: ['gray/600', 'gray/400'],
        },
        hovered: {
          bg: ['white', 'gray/900'],
          border: ['blue/700', 'blue/300'],
          fg: ['gray/900', 'gray/100'],
          placeholder: ['gray/600', 'gray/400'],
        },
      },
    },
    // Texto blanco legible en la acción principal también en modo claro.
    button: {
      default: {
        primary: {
          enabled: {bg: ['blue/700', 'blue/300'], fg: ['white', 'blue/950']},
          hovered: {bg: ['blue/800', 'blue/200'], fg: ['white', 'blue/950']},
          pressed: {bg: ['blue/900', 'blue/100'], fg: ['white', 'blue/950']},
        },
      },
    },
  },
  radius: [0, 3, 6, 9, 12, 16, 24],
})
