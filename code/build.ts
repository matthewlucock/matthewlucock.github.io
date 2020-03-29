import path from 'path'

import { emptyDir, copy, readFile, writeFile } from 'fs-extra'

import { staticallyRenderComponent } from './util/statically-render-component'

import { CSS_FILE_PATH, PHOTO_PATH, PUBLIC_DIRECTORY } from './globals'
import { Page } from './page'

const FILES_TO_COPY = ['CNAME', PHOTO_PATH]

const build = async (): Promise<void> => {
  await emptyDir(PUBLIC_DIRECTORY)

  let { html, css } = staticallyRenderComponent(Page)

  await Promise.all([
    ...FILES_TO_COPY.map(async (fileName): Promise<void> => (
      await copy(fileName, path.join(PUBLIC_DIRECTORY, fileName))
    )),

    writeFile(path.join(PUBLIC_DIRECTORY, 'index.html'), html),

    (async (): Promise<void> => {
      const reset = await readFile('node_modules/ress/dist/ress.min.css', 'utf8')
      css = reset + css
      await writeFile(path.join(PUBLIC_DIRECTORY, CSS_FILE_PATH), css)
    })()
  ])
}

build().catch((error): void => {
  console.error(error)
  process.exit(1)
})
