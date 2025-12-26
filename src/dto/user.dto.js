export class UserDto {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
<<<<<<< HEAD
    this.firstName = user.firstName;
    this.lastName = user.lastName;
=======
    this.name = user.name;
>>>>>>> 6764f0f (correction1)
    this.createdAt = user.createdAt;
  }

  // Cette méthode permet de transformer soit un utilisateur, soit une liste d'utilisateurs
  static transform(data) {
    if (Array.isArray(data)) {
      return data.map((user) => new UserDto(user));
    }
    return new UserDto(data);
  }
}
