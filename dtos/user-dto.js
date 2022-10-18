module.exports = class UserDto {
  email;
  id;
  isActivated;
  access;
  name;

  constructor({ email, id, isActivated, access, name }) {
    [
      this.email,
      this.id,
      this.isActivated,
      this.access,
      this.name,
    ] = [email, id, isActivated, access, name];
  }
}
