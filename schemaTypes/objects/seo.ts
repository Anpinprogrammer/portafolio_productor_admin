import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título para buscadores',
      description: 'Si lo dejas vacío se usa el título del proyecto. Máximo 60 caracteres.',
      type: 'string',
      validation: (rule) => rule.max(60).warning('A partir de 60 caracteres Google lo corta'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción para buscadores',
      description: 'El resumen que aparece en Google. Ideal entre 120 y 160 caracteres.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('A partir de 160 caracteres Google lo corta'),
    }),
    defineField({
      name: 'image',
      title: 'Imagen al compartir',
      description:
        'La miniatura que se ve al compartir el enlace en WhatsApp, Instagram o LinkedIn. Recomendado 1200×630 px.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Ocultar en buscadores',
      description: 'Actívalo para que Google no muestre esta página en sus resultados.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
