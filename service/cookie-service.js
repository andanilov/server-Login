const getPeriodByString = require('../utils/getPeriodByString');

class CookieService { // !Needed app.use(cookieParser());
  setRefreshToken = (res, refreshToken) => res.cookie('refreshToken', refreshToken, {
    maxAge: getPeriodByString(process.env.JWT_REFRESH_ALIVE),
    httpOnly: true,
    // secure: true, // if using https
  });

  deleteRefreshToken = (res) => res.clearCookie('refreshToken');
}

module.exports = new CookieService();
