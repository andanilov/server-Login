module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor({ email, id, isActivated }) {
    [this.email, this.id, this.isActivated] = [email, id, isActivated];
  }
}
