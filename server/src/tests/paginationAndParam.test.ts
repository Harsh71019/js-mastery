import test, { describe } from 'node:test'
import assert from 'node:assert'
import { parsePagination } from '../utils/pagination'
import { param } from '../utils/param'
import { BadRequestError } from '../middleware/AppError'
import { type Request } from 'express'

describe('Pagination (parsePagination)', () => {
  test('uses default values when query params are absent', () => {
    const parsed = parsePagination({})
    assert.strictEqual(parsed.page, 1)
    assert.strictEqual(parsed.limit, 20)
    assert.strictEqual(parsed.skip, 0)
  })

  test('parses custom page and limit', () => {
    const parsed = parsePagination({ page: '3', limit: '15' })
    assert.strictEqual(parsed.page, 3)
    assert.strictEqual(parsed.limit, 15)
    assert.strictEqual(parsed.skip, 30)
  })

  test('clamps negative page and limit', () => {
    const parsed = parsePagination({ page: '-5', limit: '0' })
    assert.strictEqual(parsed.page, 1)
    assert.strictEqual(parsed.limit, 1)
  })

  test('caps limit at 100', () => {
    const parsed = parsePagination({ limit: '500' })
    assert.strictEqual(parsed.limit, 100)
  })
})

describe('Route Param Utility (param)', () => {
  test('returns route param when present', () => {
    const req = { params: { id: 'problem-123' } } as unknown as Request
    assert.strictEqual(param(req, 'id'), 'problem-123')
  })

  test('throws BadRequestError when param is missing', () => {
    const req = { params: {} } as unknown as Request
    assert.throws(
      () => param(req, 'id'),
      (err) => err instanceof BadRequestError && err.status === 400,
    )
  })

  test('throws BadRequestError when param is empty whitespace', () => {
    const req = { params: { id: '   ' } } as unknown as Request
    assert.throws(
      () => param(req, 'id'),
      (err) => err instanceof BadRequestError && err.status === 400,
    )
  })
})
