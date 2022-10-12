const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: false },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  actiovationLink: { type: String },
  access: { type: Number, default: 0 },
});

module.exports = model('User', UserSchema);
