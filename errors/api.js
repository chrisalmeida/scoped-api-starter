const HTTPStatus = require('http-status-codes')
const txt = err => HTTPStatus.getStatusText(err)
const errorClass = (status, description) => {
  return class extends ApiError {
    status = status
    error = txt(this.status)
    description = description
    constructor(description = '') {
      super(description)
      this.description = description || this.description
    }
  }
}

/**
 * API Base class for all errors.
 * Use caution when making changes to this class and it's properties.
 */
class ApiError extends Error {
  status = HTTPStatus.INTERNAL_SERVER_ERROR
  error = txt(this.status)
  description = 'An internal server error ocurred.'
  meta = {}

  constructor(description = '') {
    if (description) {
      super(description)
      this.description = description
    } else {
      super()
    }
  }
}

/**
 * Error class for handling unprocessable
 * request parameters to this API.
 */
const ValidationError = errorClass(
  HTTPStatus.UNPROCESSABLE_ENTITY,
  'The parameters provided failed validation.'
)

/**
 * Error class for handling bad
 * request parameters to this API.
 */
const BadRequestError = errorClass(
  HTTPStatus.BAD_REQUEST,
  'This API could not understand the request.'
)

/**
 * Error class for handling missing resources within this API.
 */
const NotFoundError = errorClass(
  HTTPStatus.NOT_FOUND,
  'The requested resource is missing.'
)

/**
 * Error class for handling unauthorized access to this API.
 */
const UnauthorizedError = errorClass(
  HTTPStatus.UNAUTHORIZED,
  'Application is unauthorized.'
)

/**
 * Error class for handling forbidden access to this API.
 */
const ForbiddenError = errorClass(
  HTTPStatus.FORBIDDEN,
  'Application is not allowed to access this resource.'
)

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError
}
