import assert from 'node:assert/strict'
import {test} from 'node:test'
import {evaluate, parse} from 'groq-js'
import {servicesQuery} from '../../portafolio_productor_landing/src/lib/services.ts'

const run = async (dataset) => (await evaluate(parse(servicesQuery), {dataset})).get()
const service = (_id, fields = {}) => ({_id, _type: 'service', title: _id, ...fields})
const project = (_id, serviceId, url, fields = {}) => ({
  _id,
  _type: 'project',
  serviceReferences: [{_ref: serviceId}],
  video: {sourceType: 'external', externalUrl: url},
  ...fields,
})

test('el video y flujo propios del servicio prevalecen sobre los proyectos relacionados', async () => {
  const [result] = await run([
    service('edicion', {demoVideoUrl: 'https://vimeo.com/123456789', workflow: 'Referencias, edición y revisión.'}),
    project('ejemplo', 'edicion', 'https://youtu.be/l9WJ6PspaW4', {featured: true}),
  ])
  assert.equal(result.demoVideoUrl, 'https://vimeo.com/123456789')
  assert.equal(result.workflow, 'Referencias, edición y revisión.')
})

test('la demo alternativa pertenece al servicio y solo usa proyectos publicados, priorizando destacados', async () => {
  const result = await run([
    service('edicion'),
    service('sin-demo'),
    service('drafts.servicio'),
    project('drafts.oculto', 'edicion', 'https://vimeo.com/111111111', {featured: true, order: 0}),
    project('versions.release.oculto', 'edicion', 'https://vimeo.com/222222222', {featured: true, order: 0}),
    project('normal', 'edicion', 'https://vimeo.com/333333333', {order: 0}),
    project('destacado', 'edicion', 'https://vimeo.com/444444444', {featured: true, order: 1}),
    project('otro-servicio', 'otro', 'https://vimeo.com/555555555', {featured: true}),
  ])
  assert.equal(result.length, 2)
  assert.equal(result.find(service => service._id === 'edicion').demoVideoUrl, 'https://vimeo.com/444444444')
  assert.equal(result.find(service => service._id === 'sin-demo').demoVideoUrl, null)
  assert.equal(result.find(service => service._id === 'sin-demo').workflow, '')
})
