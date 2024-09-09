export class LoginPayloadEvent {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly token: string,
    public readonly userId: string,
  ) {}

  toString() {
    return JSON.stringify({
      email: this.email,
      userId: this.userId,
      token: this.token,
      password: this.password,
    });
  }
}
