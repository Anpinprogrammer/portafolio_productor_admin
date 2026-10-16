import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vrb9lndu',
    dataset: 'portafolio_productor',
  },
  typegen: {
    // El sitio público vive en OTRO repositorio, así que este Studio no tiene
    // frontend que tipar. Cuando exista, apunta aquí a ese repo, por ejemplo:
    //   path: '../mi-frontend/src/**/*.{ts,tsx,js,jsx}',
    //   generates: '../mi-frontend/sanity.types.ts',
    enabled: true,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
