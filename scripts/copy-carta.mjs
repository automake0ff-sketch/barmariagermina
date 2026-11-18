import { mkdir, copyFile } from 'node:fs/promises'

await mkdir('dist/carta', { recursive: true })
await copyFile('dist/index.html', 'dist/carta/index.html')
