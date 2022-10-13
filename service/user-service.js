const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt'); // For password hashing
const uuid = require('uuid'); // For random string (activation link)
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
  async registration(email, password, name = undefined) {
    // 1. Check if user allready exists
    const applicant = await UserModel.findOne({ email });
    if (applicant) throw new Error(`Пользователь с адресом ${email} уже существует!`);
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
    if (!user) throw new Error('Данная ссылка не действительна!');
    // 2. Activate user
    user.isActivated = true;
    return user.save();
  }
}

module.exports = new UserService();
