class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Unauthorized', statusCode: number = 401) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = statusCode;
  }
}

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string = 'Forbidden', statusCode: number = 403) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = statusCode;
  }
}

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string = 'Unauthorized', statusCode: number = 404) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = statusCode;
  }
}

class SessionInitializationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'SessionInitializationError';
    this.statusCode = statusCode;
  }
}

class SessionDestructionError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'SessionDestructionError';
    this.statusCode = statusCode;
  }
}

export {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  SessionInitializationError,
  SessionDestructionError,
};
