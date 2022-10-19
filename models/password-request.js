const { Schema, model } = require('mongoose');

const PassRequestShema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  actiovationPassLink: { type: String, required: true },
  status: { type: Boolean, default: false },
  datetime: { type: Number },
  actor: { type: String }
});

module.exports = model('PassRequest', PassRequestShema);
