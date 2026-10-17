import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'
import {iconOptions} from '../shared/icons'

export const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
      type: 'string',
      description: 'Clasificación principal. Ej.: Viajes, Comerciales, Videoclips o Documentales.',
      validation: (rule) => rule.required().min(1).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      description: 'Pulsa «Generar» a partir del nombre. Debe ser único entre las categorías.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required().error('Genera el identificador de la categoría.'),
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      type: 'string',
      options: {list: [...iconOptions]},
      description: 'Opcional. Elige un icono de la lista para representarla en el portafolio.',
      validation: (rule) =>
        rule.custom(
          (value) =>
            !value ||
            iconOptions.some((icon) => icon.value === value) ||
            'Selecciona un icono de la lista.',
        ),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(500),
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
