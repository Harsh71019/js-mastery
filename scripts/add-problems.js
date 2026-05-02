#!/usr/bin/env node
// Usage:
//   node scripts/add-problems.js <file.json>             # adds as drafts
//   node scripts/add-problems.js <file.json> --publish   # adds and immediately publishes

const fs = require('fs')
const path = require('path')

const API_BASE = process.env.API_URL ?? 'http://localhost:3001'
const filePath = process.argv[2]
const shouldPublish = process.argv.includes('--publish')

if (!filePath) {
  console.error('Usage: node scripts/add-problems.js <path-to-problems.json> [--publish]')
  process.exit(1)
}

const raw = fs.readFileSync(path.resolve(filePath), 'utf-8')
const problems = JSON.parse(raw)

if (!Array.isArray(problems) || problems.length === 0) {
  console.error('JSON file must contain a non-empty array of problems')
  process.exit(1)
}

const payload = problems.map((p) => ({
  ...p,
  status: shouldPublish ? 'published' : (p.status ?? 'draft'),
}))

async function run() {
  console.log(`\nPosting ${payload.length} problem(s) to ${API_BASE}/api/admin/problems/bulk ...\n`)

  const response = await fetch(`${API_BASE}/api/admin/problems/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    console.error(`Server error ${response.status}: ${text}`)
    process.exit(1)
  }

  const result = await response.json()
  const { inserted, duplicates, invalid, summary } = result

  console.log(`Summary: ${summary.inserted} inserted  ${summary.duplicates} duplicates  ${summary.invalid} invalid\n`)

  if (inserted.length > 0) {
    console.log('Inserted:')
    inserted.forEach((id) => console.log(`  + ${id}${shouldPublish ? ' (published)' : ' (draft)'}`))
  }

  if (duplicates.length > 0) {
    console.log('\nSkipped (duplicates):')
    duplicates.forEach((d) => console.log(`  ~ [${d.index}] ${d.id}  →  matched: ${d.matchedId}`))
  }

  if (invalid.length > 0) {
    console.log('\nRejected (invalid):')
    invalid.forEach((d) => {
      console.log(`  x [${d.index}] ${d.id ?? '(no id)'}`)
      d.errors.forEach((e) => console.log(`      ${e.field}: ${e.message}`))
    })
  }

  if (!shouldPublish && inserted.length > 0) {
    console.log(`\nDrafts are live. Review at:`)
    console.log(`  GET ${API_BASE}/api/admin/problems?status=draft`)
    console.log(`\nPublish one:`)
    console.log(`  POST ${API_BASE}/api/admin/problems/<id>/publish`)
    console.log(`\nPublish all now:`)
    console.log(`  node scripts/add-problems.js ${filePath} --publish`)
  }
}

run().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
