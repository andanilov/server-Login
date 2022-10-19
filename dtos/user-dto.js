module.exports = class UserDto {
  email;
  _id;
  isActivated;
  access;
  name;

  constructor({ email, _id, isActivated, access, name }) {
    [
      this.email,
      this._id,
      this.isActivated,
      this.access,
      this.name,
    ] = [email, _id, isActivated, access, name];
  }
}
