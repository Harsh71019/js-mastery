import test, { describe } from 'node:test'
import assert from 'node:assert'
import {
  ArticleQuerySchema,
  ArticleNoteSchema,
  ArticleQuizSubmissionSchema,
} from '../types/schemas/articleSchemas'

describe('Article Schemas & Validation', () => {
  test('validates valid Article query parameters', () => {
    const valid = {
      domain: 'javascript-v8',
      difficulty: 'Intermediate',
      region: 'Global',
      search: 'V8 Hidden Classes',
    }
    const result = ArticleQuerySchema.parse(valid)
    assert.strictEqual(result.domain, 'javascript-v8')
    assert.strictEqual(result.search, 'V8 Hidden Classes')
  })

  test('rejects invalid article domain', () => {
    const invalid = { domain: 'invalid-domain' }
    assert.throws(() => ArticleQuerySchema.parse(invalid))
  })

  test('validates article notes within limit', () => {
    const note = { note: 'Key idea: Use idempotency keys with atomic locks.' }
    const res = ArticleNoteSchema.parse(note)
    assert.strictEqual(res.note, note.note)
  })

  test('rejects oversized article notes', () => {
    const oversized = { note: 'a'.repeat(25000) }
    assert.throws(() => ArticleNoteSchema.parse(oversized))
  })

  test('validates article quiz answers', () => {
    const submission = { answers: [0, 2, 1] }
    const res = ArticleQuizSubmissionSchema.parse(submission)
    assert.deepStrictEqual(res.answers, [0, 2, 1])
  })

  test('rejects empty quiz answers array or negative answer index', () => {
    assert.throws(() => ArticleQuizSubmissionSchema.parse({ answers: [] }))
    assert.throws(() => ArticleQuizSubmissionSchema.parse({ answers: [-1] }))
  })
})
