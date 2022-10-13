const userService = require('../service/user-service');

class UserController {
  async registration(req, res, next) {
    try {
      // 1. Get request params by request body
      const { email, password } = req.body;
      // 2. Registrate new user by user Service
      const userData = await userService.registration(email, password);
      // 3. Save refresh token to cookie !Needed app.use(cookieParser());
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true, // if using https
      });

      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async activate(req, res, next) {
    try {
      
    } catch (e) {

    }
  }

  async login(req, res, next) {
    try {
      
    } catch (e) {

    }
  }

  async logout(req, res, next) {
    try {
      
    } catch (e) {

    }
  }

  async refresh(req, res, next) {
    try {
      
    } catch (e) {

    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(['123', '456']);
    } catch (e) {

    }
  }
}

module.exports = new UserController();
