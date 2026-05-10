import fs from 'fs'
import path from 'path'

const PROBLEMS_SRC = path.resolve(__dirname, '../../client/src/data/problems')
const PROBLEMS_DEST = path.resolve(__dirname, '../../server/data/problems')

const CATEGORY_FILES: Record<string, string> = {
  'array-building': 'array-building.ts',
  'basic-loops': 'basic-loops.ts',
  'for-in-for-of': 'for-in-for-of.ts',
  'nested-loops': 'nested-loops.ts',
  'object-loops': 'object-loops.ts',
  'polyfills': 'polyfills.ts',
  'prefix-suffix': 'prefix-suffix.ts',
  'reverse-loops': 'reverse-loops.ts',
  'sliding-window': 'sliding-window.ts',
  'tricky-patterns': 'tricky-patterns.ts',
  'two-pointer': 'two-pointer.ts',
}

const extractArray = (source: string): unknown[] => {
  const withoutImport = source.replace(/^import type[^\n]*\n/m, '')
  const match = withoutImport.match(/=\s*(\[[\s\S]+\])\s*$/)
  if (!match) throw new Error('Could not find array in source')
  return new Function(`return ${match[1]}`)() as unknown[]
}

const run = (): void => {
  fs.mkdirSync(PROBLEMS_DEST, { recursive: true })

  let totalConverted = 0

  for (const [slug, filename] of Object.entries(CATEGORY_FILES)) {
    const srcPath = path.join(PROBLEMS_SRC, filename)
    const destPath = path.join(PROBLEMS_DEST, `${slug}.json`)

    const source = fs.readFileSync(srcPath, 'utf-8')
    const problems = extractArray(source)

    fs.writeFileSync(destPath, JSON.stringify(problems, null, 2))
    console.log(`${slug}: ${problems.length} problems → ${destPath}`)
    totalConverted += problems.length
  }

  console.log(`\nDone. ${totalConverted} problems written to server/data/problems/`)
}

run()
