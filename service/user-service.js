const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt'); // For password hashing
const uuid = require('uuid'); // For random string (activation link)
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserService {
  async registration(email, password, name = undefined) {
    // 1. Check if user allready exists
    const applicant = await UserModel.findOne({ email });
    if (applicant) throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует!`);
    // 2. Hash password
    const hashPsswrd = await bcrypt.hash(password, +process.env.PSWD_HASH_SALT);
    // 3. Generate activate link (random string by uuid)
    const actiovationLink = uuid.v4();
    // 4. Create a new user
    const user = await UserModel.create({ email, password: hashPsswrd, name, actiovationLink })
    // 5. Send activate link to the new user by mail-service
    await mailService.sendActiovationMail(email, `${process.env.API_URL}${process.env.API_ROUTE}/activate/${actiovationLink}`);
    // 6. Generate pair tokens with user dto information
    const userDto = new UserDto(user); // email, id, isActivated
    const tokens = await tokenService.generatePairTokens({ ...userDto });
    // 7. Save refresh token to DB
    await tokenService.saveRefreshTokenToDB(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(actiovationLink) {
    // 1. Check if exist user with the activationLink
    const user = await UserModel.findOne({ actiovationLink });
    if (!user) throw ApiError.BadRequest('Данная ссылка не действительна!');
    // 2. Activate user
    user.isActivated = true;
    return user.save();
  }

  async login(email, password) {
    // 1. Check if user exist
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiError.BadRequest('Пользователь не найден или данные неверные!');
    // 2. Compare password
    const isPassSimilar = await bcrypt.compare(password, user.password);
    if (!isPassSimilar) throw ApiError.BadRequest('Пользователь не найден или данные неверные!');
    // 3. Generate pair tokens with user dto information
    const userDto = new UserDto(user); // email, id, isActivated
    const tokens = await tokenService.generatePairTokens({ ...userDto }); 
    // 4. Save refresh token to DB
    await tokenService.saveRefreshTokenToDB(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    // Delete refresh token from DB if exists
    return await tokenService.deleteRefreshToken(refreshToken);  
  }

}

module.exports = new UserService();
