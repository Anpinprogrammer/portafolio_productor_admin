import assert from 'node:assert/strict'
import {test} from 'node:test'
import {evaluate, parse} from 'groq-js'
import {portfolioProjectsQuery} from '../portfolio/query.ts'
import {formatDuration, normalizePortfolioProject} from '../portfolio/normalize.ts'
import {validateTags, validateVideoUrl} from '../schemaTypes/shared/validation.ts'

const runQuery = async (dataset) => (await evaluate(parse(portfolioProjectsQuery), {dataset})).get()
const project = (id, fields = {}) => ({_id: id, _type: 'project', title: id, ...fields})

test('solo muestra proyectos publicados y ordena los explícitos antes que los no ordenados', async () => {
  const result = await runQuery([
    project('sin-orden', {title: 'A'}),
    project('primero', {order: 0}),
    project('b', {order: 1, title: 'Empate'}),
    project('a', {order: 1, title: 'Empate'}),
    project('drafts.oculto', {order: 0}),
    project('versions.release.oculto', {order: 0}),
    {_id: 'otra-cosa', _type: 'category'},
  ])
  assert.deepEqual(
    result.map(({_id}) => _id),
    ['primero', 'a', 'b', 'sin-orden'],
  )
})

test('resuelve categoría, portada, servicios y archivo; ignora el enlace de otro origen', async () => {
  const [result] = await runQuery([
    {_id: 'cat', _type: 'category', title: 'Viajes', slug: {current: 'viajes'}, icon: 'plane'},
    {_id: 'service', _type: 'service', title: 'Edición', slug: {current: 'edicion'}},
    {_id: 'image', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/image.webp'},
    {_id: 'file', _type: 'sanity.fileAsset', url: 'https://cdn.sanity.io/video.mp4'},
    project('completo', {
      title: 'Vlog',
      slug: {current: 'vlog'},
      category: {_ref: 'cat'},
      coverImage: {asset: {_ref: 'image'}, alt: 'Montañas'},
      video: {
        sourceType: 'upload',
        videoFile: {asset: {_ref: 'file'}},
        externalUrl: 'https://old.invalid',
        durationSeconds: 72,
      },
      serviceReferences: [{_ref: 'service'}, {_ref: 'servicio-inexistente'}],
      services: ['Anterior'],
      description: 'Un proyecto audiovisual de viajes.',
      tags: ['Cine'],
      featured: true,
    }),
  ])
  assert.deepEqual(result.category, {title: 'Viajes', slug: 'viajes', icon: 'plane'})
  assert.deepEqual(result.coverImage, {url: 'https://cdn.sanity.io/image.webp', alt: 'Montañas'})
  assert.deepEqual(result.video, {
    sourceType: 'upload',
    url: 'https://cdn.sanity.io/video.mp4',
    durationSeconds: 72,
  })
  assert.deepEqual(normalizePortfolioProject(result).services, [
    {_id: 'service', title: 'Edición', slug: 'edicion'},
  ])
  assert.equal('legacyServices' in normalizePortfolioProject(result), false)
})

test('conserva enlaces y servicios de proyectos anteriores sin modificar documentos', async () => {
  const [result] = await runQuery([
    project('antiguo', {
      videoUrl: 'https://vimeo.com/123456',
      services: [' Edición de video ', 'Color grading', 'Color grading'],
      synopsis: [{_type: 'block', children: [{_type: 'span', text: 'Sinopsis anterior.'}]}],
    }),
  ])
  const normalized = normalizePortfolioProject(result)
  assert.equal(normalized.video.url, 'https://vimeo.com/123456')
  assert.equal(normalized.description, 'Sinopsis anterior.')
  assert.deepEqual(
    normalized.services.map(({slug}) => slug),
    ['edicion-de-video', 'color-grading'],
  )
  assert.equal(normalized.category, null)
  assert.equal(normalized.coverImage, null)
  assert.deepEqual(normalized.tags, [])
  assert.equal(normalized.featured, false)
})

test('un enlace directo y uno externo resuelven solo su campo activo', async () => {
  for (const sourceType of ['external', 'direct']) {
    const [result] = await runQuery([
      project('video', {
        video: {
          sourceType,
          externalUrl: 'https://cdn.example.com/video.mp4',
          videoFile: {asset: {_ref: 'old-file'}},
        },
      }),
    ])
    assert.equal(result.video.sourceType, sourceType)
    assert.equal(result.video.url, 'https://cdn.example.com/video.mp4')
    assert.equal(result.video.durationSeconds, null)
  }
})

test('un origen nuevo sin URL no recupera accidentalmente un video anterior', async () => {
  const [result] = await runQuery([
    project('sin-video', {video: {sourceType: 'upload'}, videoUrl: 'https://vimeo.com/123'}),
  ])
  assert.equal(result.video.url, null)
})

test('etiquetas: rechaza vacías, duplicadas normalizadas, más de 10 o de más de 30 caracteres', () => {
  for (const invalid of [
    [' '],
    ['Cine', ' cine '],
    ['Café', 'Cafe\u0301'],
    ['x'.repeat(31)],
    Array.from({length: 11}, (_, i) => String(i)),
  ]) {
    assert.notEqual(validateTags(invalid), true)
  }
  assert.equal(validateTags(['Viaje', 'Cine', 'Vlog']), true)
  assert.equal(validateTags(undefined), true)
})

test('videos: valida el origen seleccionado y rechaza URLs ajenas o inseguras', () => {
  for (const url of [
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    'https://player.vimeo.com/video/12345',
    'https://vimeo.com/12345/private',
  ]) {
    assert.equal(validateVideoUrl(url, 'external'), true)
  }
  for (const url of [
    undefined,
    'javascript:alert(1)',
    'http://vimeo.com/123',
    'https://youtube.com.evil.test/watch?v=123',
    'https://youtube.com/',
    'https://user:pass@vimeo.com/123',
  ]) {
    assert.notEqual(validateVideoUrl(url, 'external'), true)
  }
  assert.equal(validateVideoUrl('https://cdn.example.com/video.MP4?token=public', 'direct'), true)
  assert.equal(validateVideoUrl('https://cdn.example.com/video.webm', 'direct'), true)
  assert.notEqual(validateVideoUrl('https://cdn.example.com/video.mp4.exe', 'direct'), true)
  assert.equal(validateVideoUrl(undefined, 'upload'), true)
  assert.equal(validateVideoUrl('old hidden value', 'upload'), true)
  assert.notEqual(validateVideoUrl(undefined, 'direct'), true)
})

test('formatea duraciones sin inventar un valor cuando faltan', () => {
  assert.equal(formatDuration(72), '1:12')
  assert.equal(formatDuration(150), '2:30')
  assert.equal(formatDuration(605), '10:05')
  assert.equal(formatDuration(null), null)
  assert.equal(formatDuration(-1), null)
})
