import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identidad', title: '🏷️ Identidad', default: true},
    {name: 'sobre', title: '👤 Sobre mí'},
    {name: 'contacto', title: '📞 Contacto y redes'},
    {name: 'seo', title: '🔍 SEO'},
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Nombre del sitio',
      type: 'string',
      group: 'identidad',
      description: 'Aparece en la pestaña del navegador y en los resultados de Google.',
      validation: (rule) => rule.required().error('El sitio necesita un nombre'),
    }),
    defineField({
      name: 'tagline',
      title: 'Lema corto',
      type: 'string',
      group: 'identidad',
      description: 'Una línea bajo el nombre. Ej: «Dirección, producción y post-producción».',
    }),
    defineField({
      name: 'heroStatement',
      title: 'Frase de portada',
      type: 'text',
      group: 'identidad',
      rows: 3,
      description: 'El texto grande que aparece al entrar en la página de inicio.',
    }),
    defineField({
      name: 'about',
      title: 'Sobre mí',
      type: 'array',
      group: 'sobre',
      description: 'Tu presentación. Puedes usar negritas, listas y enlaces.',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'email',
      title: 'Correo de contacto',
      type: 'string',
      group: 'contacto',
      description: 'Se mostrará como enlace para que te escriban directamente.',
      validation: (rule) => rule.email().error('Escribe un correo válido, ej: hola@tudominio.com'),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      group: 'contacto',
      description: 'Opcional. Incluye el prefijo internacional si quieres.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      group: 'contacto',
      description: 'Añade una fila por red. Elige la plataforma y pega el enlace completo.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Plataforma',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Vimeo', value: 'vimeo'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Behance', value: 'behance'},
                ],
              },
              validation: (rule) => rule.required().error('Elige una plataforma'),
            }),
            defineField({
              name: 'url',
              title: 'Enlace',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({scheme: ['http', 'https']}).error('Debe empezar por https://'),
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        }),
      ],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO por defecto',
      type: 'seo',
      group: 'seo',
      description: 'Se usa cuando un proyecto no tiene sus propios datos de SEO.',
    }),
  ],
  preview: {
    prepare: () => ({title: '⚙️ Configuración del Sitio'}),
  },
})
