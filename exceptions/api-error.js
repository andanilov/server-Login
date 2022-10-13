module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    [this.status, this.errors] = [status, errors];
  }

  static BadRequest = (msg = 'Неправильный, некорректный запрос!', errors = []) => new ApiError(400, msg, errors);
  static UnauthorizedError = (msg = 'Не авторизован', errors = []) => new ApiError(401, msg, errors);
}
