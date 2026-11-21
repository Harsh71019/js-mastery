import test, { describe } from 'node:test'
import assert from 'node:assert'
import { errorHandler } from '../middleware/errorHandler'
import { NotFoundError, BadRequestError } from '../middleware/AppError'
import { type Request, type Response, type NextFunction } from 'express'

describe('Error Handler Middleware (errorHandler)', () => {
  const createMockRes = () => {
    let statusCode = 200
    let jsonBody: unknown = null
    const res = {
      headersSent: false,
      status(code: number) {
        statusCode = code
        return this
      },
      json(body: unknown) {
        jsonBody = body
        return this
      },
      getStatusCode: () => statusCode,
      getJsonBody: () => jsonBody,
    } as unknown as Response & { getStatusCode: () => number; getJsonBody: () => unknown }
    return res
  }

  const dummyReq = { id: 'req-1' } as unknown as Request
  const dummyNext = (() => undefined) as NextFunction

  test('formats AppError with correct status and message', () => {
    const res = createMockRes()
    const err = new NotFoundError('Problem not found')

    errorHandler(err, dummyReq, res, dummyNext)

    assert.strictEqual(res.getStatusCode(), 404)
    assert.deepStrictEqual(res.getJsonBody(), { error: 'Problem not found' })
  })

  test('formats BadRequestError with 400', () => {
    const res = createMockRes()
    const err = new BadRequestError('Invalid input')

    errorHandler(err, dummyReq, res, dummyNext)

    assert.strictEqual(res.getStatusCode(), 400)
    assert.deepStrictEqual(res.getJsonBody(), { error: 'Invalid input' })
  })

  test('formats Mongoose CastError with 400', () => {
    const res = createMockRes()
    const castErr = { name: 'CastError', message: 'Cast to ObjectId failed' }

    errorHandler(castErr, dummyReq, res, dummyNext)

    assert.strictEqual(res.getStatusCode(), 400)
    assert.deepStrictEqual(res.getJsonBody(), { error: 'Invalid identifier or resource format' })
  })

  test('formats Mongo duplicate key error (code 11000) with 409', () => {
    const res = createMockRes()
    const dupErr = { code: 11000, message: 'E11000 duplicate key error' }

    errorHandler(dupErr, dummyReq, res, dummyNext)

    assert.strictEqual(res.getStatusCode(), 409)
    assert.deepStrictEqual(res.getJsonBody(), { error: 'Resource conflict or duplicate entry' })
  })

  test('formats Mongoose ValidationError with 422', () => {
    const res = createMockRes()
    const valErr = { name: 'ValidationError', message: 'Path `difficulty` is invalid' }

    errorHandler(valErr, dummyReq, res, dummyNext)

    assert.strictEqual(res.getStatusCode(), 422)
    assert.deepStrictEqual(res.getJsonBody(), { error: 'Path `difficulty` is invalid' })
  })

  test('formats unexpected generic error with 500', () => {
    const res = createMockRes()
    const genericErr = new Error('Database connection unexpectedly dropped')

    errorHandler(genericErr, dummyReq, res, dummyNext)

    assert.strictEqual(res.getStatusCode(), 500)
    assert.deepStrictEqual(res.getJsonBody(), { error: 'Internal server error' })
  })

  test('delegates to next if headersSent is true', () => {
    const res = createMockRes()
    res.headersSent = true
    let calledNextWith: unknown = null
    const next: NextFunction = (err) => {
      calledNextWith = err
    }

    const err = new Error('Too late')
    errorHandler(err, dummyReq, res, next)

    assert.strictEqual(calledNextWith, err)
  })
})
