import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {validateTags} from '../shared/validation'

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'general', title: 'ℹ️ Información General', default: true},
    {name: 'media', title: '🎬 Contenido audiovisual'},
    {name: 'content', title: '📝 Descripción y servicios'},
    {name: 'classification', title: '🏷️ Etiquetas'},
    {name: 'publishing', title: '📌 Visualización y publicación'},
    {name: 'cast', title: '👥 Créditos y sinopsis'},
    {name: 'seo', title: '🔍 SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'general',
      description: 'El nombre del proyecto tal como quieres que aparezca. Ej: «Luz de Invierno».',
      validation: (rule) =>
        rule.required().max(100).error('Escribe un título de hasta 100 caracteres.'),
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
      name: 'category',
      title: 'Categoría principal',
      type: 'reference',
      group: 'general',
      to: [{type: 'category'}],
      description:
        'Elige una sola clasificación: Viajes, Comerciales, Videoclips… Puedes crearla desde aquí; publícala antes de publicar el proyecto.',
      validation: (rule) => rule.required().error('Selecciona la categoría principal.'),
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
      validation: (rule) => rule.integer().min(1900).max(2100).error('Escribe un año de 4 cifras'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción para la tarjeta',
      type: 'text',
      group: 'content',
      rows: 4,
      description: 'Resume el proyecto en 20 a 500 caracteres. Aparece debajo de la portada.',
      validation: (rule) =>
        rule.required().min(20).max(500).error('Escribe una descripción de 20 a 500 caracteres.'),
    }),
    defineField({
      name: 'tagline',
      title: 'Texto destacado',
      type: 'string',
      group: 'content',
      description: 'Opcional. Ej.: EXPLORA · DESCUBRE · CUENTA TU HISTORIA.',
      validation: (rule) =>
        rule.max(120).error('El texto destacado puede tener hasta 120 caracteres.'),
    }),
    defineField({
      name: 'serviceReferences',
      title: 'Servicios relacionados',
      type: 'array',
      group: 'content',
      description:
        'Selecciona los trabajos realizados (Dirección, Edición, Color…). Puedes crear nuevos servicios desde aquí. Publica los servicios antes que el proyecto.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      validation: (rule) => rule.unique().error('Selecciona cada servicio una sola vez.'),
    }),
    defineField({
      name: 'services',
      title: 'Servicios anteriores (conservados)',
      type: 'array',
      group: 'content',
      description:
        'Estos textos pertenecen al formulario anterior y se conservan para no perder información. Selecciona sus equivalentes en «Servicios relacionados»; la consulta prioriza las referencias nuevas.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      readOnly: true,
      hidden: ({value}) => !Array.isArray(value) || value.length === 0,
    }),
    defineField({
      name: 'tags',
      title: 'Palabras clave',
      type: 'array',
      group: 'classification',
      description:
        'Hasta 10 etiquetas, de 30 caracteres cada una. Ej.: Viaje, Cine, Vlog. Son palabras descriptivas, no categorías ni servicios.',
      of: [
        defineArrayMember({type: 'string', validation: (rule) => rule.required().min(1).max(30)}),
      ],
      options: {layout: 'tags'},
      validation: (rule) => rule.max(10).unique().custom(validateTags),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'image',
      group: 'media',
      description:
        'Usa una imagen de alta resolución (ideal: 1200 px de ancho o más). Selecciona el punto de enfoque para las tarjetas verticales: el archivo original se conserva.',
      validation: (rule) => rule.required().assetRequired().error('Sube una imagen de portada.'),
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
      name: 'video',
      title: 'Video principal',
      type: 'projectVideo',
      group: 'media',
      description: 'Elige YouTube/Vimeo, un enlace directo o un archivo corto.',
      validation: (rule) =>
        rule.custom((value, context) =>
          value || context.document?.videoUrl ? true : 'Añade el video principal.',
        ),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Enlace del video anterior (conservado)',
      readOnly: true,
      hidden: ({value}) => !value,
      type: 'url',
      group: 'media',
      description:
        'Se conserva el enlace anterior. Para cambiarlo, utiliza «Video principal»; la consulta usa este enlace si aún no has configurado el nuevo campo.',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).error('Debe empezar por http:// o https://'),
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
      group: 'publishing',
      description: 'Actívalo para que este proyecto salga primero en la página de inicio.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Orden de visualización',
      type: 'number',
      group: 'publishing',
      description:
        'Opcional. Los números más pequeños aparecen primero. Los proyectos sin orden van al final.',
      validation: (rule) =>
        rule.integer().min(0).error('Usa un número entero igual o mayor que cero.'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'publishing',
      description:
        'Fecha editorial opcional. No programa ni sustituye la publicación: pulsa «Publicar» para que el proyecto sea visible.',
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
      title: 'Orden de visualización',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Destacados primero',
      name: 'featuredDesc',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'title', direction: 'asc'},
      ],
    },
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
      category: 'category.title',
      client: 'client',
      year: 'year',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare: ({title, category, client, year, featured, media}) => ({
      title: `${featured ? '⭐ ' : ''}${title || 'Proyecto sin título'}`,
      subtitle: [category || 'Sin categoría', client, year].filter(Boolean).join(' • '),
      media,
    }),
  },
})
