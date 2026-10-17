# Yamamoto Portfolio · Sanity Studio

Panel en español para gestionar proyectos audiovisuales. Requiere **Node >=22.12**.
Se conserva el proyecto `vrb9lndu`, el dataset `portafolio_productor`, el tema y los plugins existentes.

## Ejecutar y verificar

```sh
cd portafolio_productor_admin
nvm use 22                 # Si utilizas nvm; alternativamente usa tu instalación de Node 22+
npm ci
npm run dev               # Studio: http://localhost:3333
npm run check             # TypeScript y ESLint
npm test                  # Validaciones, consulta GROQ y compatibilidad anterior
npx sanity schemas validate
npm run typegen           # Regenera schema.json y sanity.types.ts
npm run build
```

No se necesitan nuevos plugins. `@sanity/client` se declara como dependencia directa para el consumidor tipado; `groq-js` se usa únicamente en las pruebas locales de la consulta. Los cambios del modelo son locales hasta desplegar el Studio. No se han migrado, eliminado ni publicado documentos automáticamente.

## Uso por el propietario

1. Crea y publica las **Categorías** (Viajes, Comerciales, Videoclips, Documentales, Motion Graphics, Eventos…) y los **Servicios** (Dirección, Edición, Color…). También puedes crearlos desde los selectores del proyecto.
2. En **Proyectos**, completa **Información general**: título, slug mediante «Generar» y categoría principal. Sanity comprueba por defecto la unicidad del slug dentro de cada tipo de documento.
3. En **Contenido audiovisual**, sube una portada y elige su foco con hotspot. Recomendamos al menos 1200 px de ancho. El archivo original no cambia: los recortes para cards verticales son derivados. Añade texto alternativo; su ausencia genera una advertencia.
4. En **Video principal**, selecciona YouTube/Vimeo, URL HTTPS directa a MP4/WebM o archivo MP4/WebM. Solo es obligatorio el campo del origen seleccionado. La duración es opcional y se escribe en segundos: 72 → 1:12. Cambiar el origen no borra datos del origen anterior, pero la consulta solo devuelve el activo. Para archivos pesados usa Vimeo o un CDN; Sanity no transcodifica el archivo subido ni proporciona streaming adaptativo.
5. En **Descripción y servicios**, escribe entre 20 y 500 caracteres, un texto destacado opcional y selecciona servicios relacionados.
6. En **Etiquetas**, añade hasta 10 palabras clave de hasta 30 caracteres. Se rechazan etiquetas vacías y duplicadas aunque cambien mayúsculas, espacios exteriores o composición Unicode.
7. En **Visualización y publicación**, marca destacado si corresponde y añade orden (entero no negativo) y fecha editorial opcionales. Publica el proyecto con el botón nativo **Publicar**.

La categoría clasifica el proyecto; los servicios indican trabajos realizados; los tags describen su contenido. No se intercambian esos conceptos.
`publishedAt` no programa la publicación ni oculta proyectos futuros. `featured` se devuelve para que el consumidor lo utilice; la consulta general respeta primero `order`.
El listado de proyectos ofrece orden por visualización, destacados, año y título. La vista previa muestra título, categoría, cliente/año y portada.

## Schemas y compatibilidad

- `schemaTypes/documents/project.ts`: documento existente ampliado con pestañas, validaciones y nuevas referencias.
- `schemaTypes/documents/category.ts`, `service.ts`: catálogos independientes con nombre, slug, descripción, icono y orden.
- `schemaTypes/objects/project-video.ts`: origen, URL/archivo y duración del video.
- `schemaTypes/shared/`: lista permitida de iconos y validadores.
- `schemaTypes/index.ts`: registra los tipos. La estructura existente de `sanity.config.ts` los muestra automáticamente y permite crearlos.

Se detectaron **cuatro proyectos publicados con `services` como array de strings**. Cambiarlo a un array de referencias haría incompatibles sus valores en el editor; Sanity no admite mezclar strings y referencias en un mismo array. Por eso:

- Se conserva `services` sin modificar su tipo ni sus datos, visible como «Servicios anteriores (conservados)» solo cuando tiene contenido y en modo lectura.
- El nuevo campo **`serviceReferences`** almacena referencias a `service`. El contrato público sigue llamándose **`services`**; la consulta y el normalizador resuelven esa diferencia.
- Si hay referencias válidas, se utilizan esas; mientras no las haya, el normalizador conserva los nombres antiguos y genera identificadores de presentación `legacy-service:…`. Esos identificadores **no son documentos** y nunca deben guardarse como referencias en Sanity.
- Se conserva `videoUrl` en lectura para proyectos antiguos. `video` tiene prioridad; si no está configurado, se usa el enlace anterior.
- Se mantienen cliente, año, galería, créditos, sinopsis, SEO y configuración del sitio. La descripción antigua puede leerse desde `synopsis` mientras se completa `description`.

No se escribieron datos en el dataset. Los proyectos ya publicados siguen consultables. **Para volver a publicar un proyecto anterior, completa categoría, portada y descripción si faltan**; el enlace de video antiguo sigue siendo válido. Para actualizar servicios o video usa los nuevos campos. No se han sembrado catálogos ni convertido textos automáticamente.

## Consulta y tipos para React + Vite

La implementación lista para copiar está en `portfolio/`:

- `query.ts`: consulta GROQ. Excluye `drafts.**` y `versions.**`, resuelve referencias y URLs, y ordena por presencia de `order`, `order`, título e `_id`. Un orden explícito siempre va antes que un proyecto sin orden, sin usar un número centinela.
- `types.ts`: contrato `PortfolioProject` y resultado de transición.
- `normalize.ts`: compatibilidad con servicios antiguos y `formatDuration`.
- `fetch.ts`: ejecuta con **`perspective: 'published'`**, necesario también para resolver las referencias publicadas.
- `example.json`: ejemplo completo de salida normalizada. La URL de imagen es ilustrativa.

La consulta sola devuelve además `legacyServices`, necesario durante la transición. `fetchPortfolioProjects` lo elimina y entrega exactamente el contrato `PortfolioProject[]`. Si faltan medios o referencias, devuelve `null` o arrays vacíos; no inventa una categoría. `order`, `publishedAt`, `tagline` e iconos opcionales pueden llegar como `null`, por lo que los tipos lo reflejan.

Ejemplo de consumo después de copiar la carpeta `portfolio` y los dos módulos compartidos a la landing, conservando sus rutas relativas:

```ts
import {createClient} from '@sanity/client'
import {fetchPortfolioProjects} from './portfolio/fetch'
import {formatDuration} from './portfolio/normalize'

const client = createClient({
  projectId: import.meta.env.VITE_PROJECT_ID,
  dataset: import.meta.env.VITE_DATASET,
  apiVersion: '2025-02-19',
  perspective: 'published',
  useCdn: true,
})

const projects = await fetchPortfolioProjects(client)
const duration = formatDuration(projects[0]?.video?.durationSeconds) // '1:12' o null
```

No incluyas tokens privados en variables `VITE_*`. Para un dataset público, la lectura publicada no necesita token; si el dataset es privado, consulta desde un backend autorizado. No se han cambiado permisos ni CORS. El CDN puede tardar en reflejar una publicación.

**La landing aún no está conectada a estas cards.** Su `App.tsx` solo registra una consulta en consola y pide `image.asset->url`, aunque el campo del modelo es `coverImage`. `PremiumServices` sigue usando `src/data.ts`. Esta entrega está limitada al administrador: el consumidor preparado usa `coverImage`, y no se han rediseñado ni modificado componentes del frontend.

Para conectar las cards más adelante, usa `category` para su clasificación, `tagline` para el texto destacado, `tags` para las burbujas y los títulos de `services` para los trabajos realizados. Los iconos deben resolverse mediante un mapa explícito de los valores de `schemaTypes/shared/icons.ts`; nunca con `eval` ni componentes arbitrarios. Ejemplo: `plane → Plane`, `wand-sparkles → WandSparkles`.
`video.sourceType === 'external'` requiere un reproductor embebido de YouTube/Vimeo; `direct` y `upload` son URLs para `<video>`. Una página de YouTube/Vimeo no se puede pasar directamente al `src` de `<video>`.
La URL de portada es el original: para usar hotspot/crop en derivados, amplía la proyección con esos metadatos y utiliza un constructor de URLs de imágenes en la integración visual.

## Referencias

- [Validación de campos en Sanity](https://www.sanity.io/docs/studio/validation)
- [Referencias y documentos publicados](https://www.sanity.io/docs/studio/reference-type)
- [Consultas con @sanity/client y perspectiva publicada](https://www.sanity.io/docs/apis-and-sdks/js-client-querying)
