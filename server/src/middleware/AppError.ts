export class AppError extends Error {
  status: number
  isOperational: boolean

  constructor(status: number, message: string) {
    super(message)
    this.status        = status
    this.isOperational = true
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(404, message)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(422, message)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, message)
  }
}
