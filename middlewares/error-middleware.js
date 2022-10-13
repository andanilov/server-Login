const ApiError = require('../exceptions/api-error');

module.exports = function errorMiddleware(err, req, res, next) {
  console.log('Ошибка:', err);
  return err instanceof ApiError
    ? res.status(err.status).json({ message: err.message, ...err.errors })
    : res.status(500).json({ message: 'Server Error!' });
}
