const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  try {
    // 1. Get header "Authorization" from request headers
    const authorizationHeader = req.headers?.authorization;
    if (!authorizationHeader) throw ApiError.UnauthorizedError();

    // 2. Get access token from authorization header
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) throw ApiError.UnauthorizedError();

    const userData = tokenService.validateAccsessToken(accessToken);
    if (!userData) throw ApiError.UnauthorizedError();

    req.user = userData;
    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
}