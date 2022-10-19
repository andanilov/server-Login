const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
  generatePairTokens(payload) { // payload - data for tokens
    return {
      accessToken: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_ALIVE }),
      refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_ALIVE }),
    }
  }

  async saveRefreshTokenToDB(userId, refreshToken) {
    // 1. Check if refresh token allready exists for the userId
    const tokenData = await tokenModel.findOne({ user: userId });
    // 2. If old refresh token exists to update it
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    // 3. Create refresh token for the user
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async deleteRefreshToken(refreshToken) {
    // Try to delete refresh token if exists
    return await tokenModel.deleteOne({ refreshToken });
  }

  async checkIfRefreshTokenExists(refreshToken) {
    return await tokenModel.findOne({ refreshToken });
  }

  validateAccsessToken = (accessToken) => jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

  validateRefreshToken = (refreshToken) => jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
  async generateAndSavePairTokens(userDto) {
    const tokens = this.generatePairTokens({ ...userDto }); 
    // Save refresh token to DB
    await this.saveRefreshTokenToDB(userDto._id, tokens.refreshToken);
    return tokens;
  }
}

module.exports = new TokenService();
