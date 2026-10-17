import {defineField, defineType} from 'sanity'
import {validateVideoUrl, VIDEO_SOURCE_TYPES} from '../shared/validation'

type VideoParent = {sourceType?: string}

export const projectVideo = defineType({
  name: 'projectVideo',
  title: 'Video principal',
  type: 'object',
  fields: [
    defineField({
      name: 'sourceType',
      title: '¿Dónde está el video?',
      type: 'string',
      initialValue: 'external',
      options: {
        layout: 'radio',
        list: [
          {title: 'YouTube o Vimeo (recomendado)', value: 'external'},
          {title: 'Enlace directo a MP4 o WebM', value: 'direct'},
          {title: 'Subir un archivo corto a Sanity', value: 'upload'},
        ],
      },
      validation: (rule) =>
        rule
          .required()
          .custom(
            (value) =>
              VIDEO_SOURCE_TYPES.some((source) => source === value) ||
              'Selecciona el origen del video.',
          ),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Enlace del video',
      type: 'url',
      description:
        'YouTube/Vimeo: pega el enlace del video. Archivo directo: URL HTTPS terminada en .mp4 o .webm; puede incluir parámetros.',
      hidden: ({parent}) => (parent as VideoParent | undefined)?.sourceType === 'upload',
      validation: (rule) =>
        rule.custom((value, context) =>
          validateVideoUrl(value, (context.parent as VideoParent | undefined)?.sourceType),
        ),
    }),
    defineField({
      name: 'videoFile',
      title: 'Archivo de video',
      type: 'file',
      description:
        'Solo MP4 o WebM. Reserva esta opción para videos cortos y ligeros: Sanity almacena el archivo, pero no lo comprime ni genera streaming adaptativo. Para videos pesados, usa Vimeo o un CDN.',
      options: {accept: 'video/mp4,video/webm'},
      hidden: ({parent}) => (parent as VideoParent | undefined)?.sourceType !== 'upload',
      validation: (rule) =>
        rule.custom((value, context) => {
          if ((context.parent as VideoParent | undefined)?.sourceType !== 'upload') return true
          return Boolean(value?.asset?._ref) || 'Sube el archivo de video.'
        }),
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duración en segundos',
      type: 'number',
      description: 'Opcional. Ej.: 72 para 1:12, 150 para 2:30 o 605 para 10:05.',
      validation: (rule) =>
        rule.integer().min(1).error('Escribe una duración entera mayor que cero.'),
    }),
  ],
})
