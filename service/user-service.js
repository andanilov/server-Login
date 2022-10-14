const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt'); // For password hashing
const uuid = require('uuid'); // For random string (activation link)
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user-dto');
const userModel = require('../models/user-model');

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
    const tokens = await tokenService.generateAndSavePairTokens(userDto);
    // const tokens = tokenService.generatePairTokens({ ...userDto });
    // // 7. Save refresh token to DB
    // await tokenService.saveRefreshTokenToDB(userDto.id, tokens.refreshToken);

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
    const tokens = await tokenService.generateAndSavePairTokens(userDto);
    // 4. Save refresh token to DB
    // await tokenService.saveRefreshTokenToDB(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    // Delete refresh token from DB if exists
    return await tokenService.deleteRefreshToken(refreshToken);  
  }

  async updateRefreshToken(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError();
    // 1. Check if the refresh token exists in DB
    const token = await tokenService.checkIfRefreshTokenExists(refreshToken);
    // 2. Validate refresh token
    const isTokenGood = tokenService.validateRefreshToken(refreshToken);
    if (!token || !isTokenGood) throw ApiError.UnauthorizedError();
    // 3. Get new data of the user and generate and save pair tokens
    const user = await UserModel.findById(token.user);
    const userDto = new UserDto(user); // email, id, isActivated
    const tokens = await tokenService.generateAndSavePairTokens(userDto);
    return { ...tokens, user: userDto };
  }

  async getAllUsers() {
    return await userModel.find();
  }

}

module.exports = new UserService();
