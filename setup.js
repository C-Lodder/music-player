import { bundle } from 'lightningcss'
import { writeFile } from 'node:fs/promises'
import { build } from 'esbuild'

async function setup() {
  try {
    const { code } = bundle({
      filename: 'src/css/app.css',
      minify: true,
    })

    writeFile('app/css/app.css', code)
  } catch (error) {
    throw new Error(error)
  }

  try {
    await build({
      entryPoints: [
        'node_modules/@plist/parse/lib/esm/index.js',
      ],
      outfile: 'app/js/lib/vendor/plist.js',
      bundle: true,
      minify: true,
      format: 'esm',
    })
  } catch (error) {
    throw new Error(error)
  }
}

setup()
