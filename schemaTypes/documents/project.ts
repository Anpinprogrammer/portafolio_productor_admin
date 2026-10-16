import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'general', title: 'ℹ️ Información General', default: true},
    {name: 'media', title: '🎬 Media y Video'},
    {name: 'cast', title: '👥 Créditos y Destacados'},
    {name: 'seo', title: '🔍 SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'general',
      description:
        'El nombre del proyecto tal como quieres que aparezca. Ej: «Luz de Invierno».',
      validation: (rule) => rule.required().error('Ponle un título al proyecto'),
    }),
    defineField({
      name: 'slug',
      title: 'URL del proyecto',
      type: 'slug',
      group: 'general',
      description:
        'Se genera solo a partir del título. Pulsa «Generar» y evita cambiarlo después de publicar.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required().error('Genera la URL antes de publicar'),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
      group: 'general',
      description: 'Para quién se hizo. Déjalo vacío si es un proyecto propio o personal.',
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      group: 'general',
      description: 'Año de entrega o publicación. Ej: 2026.',
      validation: (rule) =>
        rule.integer().min(1900).max(2100).error('Escribe un año de 4 cifras'),
    }),
    defineField({
      name: 'services',
      title: 'Servicios realizados',
      type: 'array',
      group: 'general',
      description:
        'Escribe un servicio y pulsa Enter para añadirlo. Ej: Dirección, Cámara, Montaje, Color.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      group: 'media',
      description:
        'La foto principal del proyecto. Aparece en el listado y al compartir el enlace. Arrastra el punto para elegir el encuadre.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description:
            'Describe la imagen en una frase. Sirve para personas con lector de pantalla y para Google.',
          validation: (rule) =>
            rule.required().warning('Sin texto alternativo pierdes accesibilidad y SEO'),
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Enlace del vídeo',
      type: 'url',
      group: 'media',
      description:
        'Pega la URL de inserción de YouTube o Vimeo (la de «Compartir → Insertar»). No subas el vídeo a Sanity.',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https']})
          .error('Debe empezar por http:// o https://'),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de imágenes',
      type: 'array',
      group: 'media',
      description: 'Fotos adicionales del proyecto. Arrastra las tarjetas para reordenarlas.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Describe brevemente la imagen.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featured',
      title: '⭐ Destacado',
      type: 'boolean',
      group: 'cast',
      description: 'Actívalo para que este proyecto salga primero en la página de inicio.',
      initialValue: false,
    }),
    defineField({
      name: 'credits',
      title: 'Créditos',
      type: 'array',
      group: 'cast',
      description: 'Añade una fila por persona: primero el rol, después el nombre.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'credit',
          fields: [
            defineField({
              name: 'role',
              title: 'Rol',
              type: 'string',
              description: 'Ej: Dirección, Fotografía, Montaje.',
            }),
            defineField({name: 'name', title: 'Nombre', type: 'string'}),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role'},
          },
        }),
      ],
    }),
    defineField({
      name: 'synopsis',
      title: 'Sinopsis',
      type: 'array',
      group: 'cast',
      description:
        'De qué va el proyecto. Puedes usar negritas, listas y enlaces desde la barra de herramientas.',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO y redes sociales',
      type: 'seo',
      group: 'seo',
      description: 'Opcional. Si lo dejas vacío se usan el título y la portada del proyecto.',
    }),
  ],
  orderings: [
    {
      title: 'Año, más reciente',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
    {
      title: 'Título, A → Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      year: 'year',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare: ({title, client, year, featured, media}) => ({
      title: `${featured ? '⭐ ' : ''}${title || 'Proyecto sin título'}`,
      subtitle: [client, year].filter(Boolean).join(' • ') || 'Sin cliente ni año',
      media,
    }),
  },
})
