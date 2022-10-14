const userService = require('../service/user-service');
const cookieService = require('../service/cookie-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      // Validate request
      const errorsValidate = validationResult(req);
      if (!errorsValidate.isEmpty()) throw ApiError.BadRequest('Неверные данные', errorsValidate);
      // 1. Get request params by request body
      const { email, password } = req.body;
      // 2. Registrate new user by user Service
      const userData = await userService.registration(email, password);
      // 3. Save refresh token to cookie !Needed app.use(cookieParser());
      cookieService.setRefreshToken(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      // 1. Get actiovation link from request parameters
      const activationLink = req.params.link;
      // 2. Activate user by the link
      userService.activate(activationLink);
      // 3. Redirect user to client
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      // 1. Data validate
      const errorsValidate = validationResult(req);
      if (!errorsValidate.isEmpty()) throw ApiError.BadRequest('Неверные данные', errorsValidate);
      // 2. Get data from params
      const { email, password } = req.body;
      // 3. Login user by service
      const userData = await userService.login(email, password);
      // 4. Save refresh token to cookie !Needed app.use(cookieParser());
      cookieService.setRefreshToken(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      // 1. Get refresh token from cookie
      const { refreshToken } = req.cookies;
      // 2. Delete refresh token from DB by service
      const token = await userService.logout(refreshToken);
      // 3. Delete refresh token from cookies
      cookieService.deleteRefreshToken(res);
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      // 1. Get refresh token from cookie
      const { refreshToken } = req.cookies;
      // 2. Check and generate pair tokens if refresh token is ok
      const userData = await userService.updateRefreshToken(refreshToken);
      // 3. Set new refresh token to cookie
      cookieService.setRefreshToken(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
