const userService = require('../service/user-service');
const cookieService = require('../service/cookie-service');

class UserController {
  async registration(req, res, next) {
    try {
      // 1. Get request params by request body
      const { email, password } = req.body;
      // 2. Registrate new user by user Service
      const userData = await userService.registration(email, password);
      // 3. Save refresh token to cookie !Needed app.use(cookieParser());
      cookieService.setRefreshToken(res, userData.refreshToken)

      return res.json(userData);
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
