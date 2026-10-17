import {WrenchIcon} from '@sanity/icons/Wrench'
import {defineField, defineType} from 'sanity'
import {iconOptions} from '../shared/icons'
import {validateVideoUrl} from '../shared/validation'

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
      type: 'string',
      description:
        'Trabajo realizado. Ej.: Dirección audiovisual, Edición de video o Color grading.',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      description: 'Pulsa «Generar» a partir del nombre. Debe ser único entre los servicios.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required().error('Genera el identificador del servicio.'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      description: 'Opcional. Explica brevemente qué incluye este servicio.',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'demoVideoUrl',
      title: 'Video de demostración',
      type: 'url',
      description:
        'Enlace de YouTube o Vimeo para el modal del servicio. Si lo dejas vacío, se utiliza un video de un proyecto publicado que tenga este servicio asociado.',
      validation: (rule) => rule.custom((value) => !value || validateVideoUrl(value, 'external')),
    }),
    defineField({
      name: 'workflow',
      title: 'Flujo de trabajo',
      type: 'text',
      rows: 5,
      description: 'Explica cómo trabajas este servicio, desde las referencias hasta la entrega final.',
      validation: (rule) => rule.max(1500),
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      type: 'string',
      options: {list: [...iconOptions]},
      validation: (rule) =>
        rule.custom(
          (value) =>
            !value ||
            iconOptions.some((icon) => icon.value === value) ||
            'Selecciona un icono de la lista.',
        ),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Opcional. Los números más pequeños aparecen primero.',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Orden de visualización',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {title: 'Nombre, A → Z', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'description'}},
})
